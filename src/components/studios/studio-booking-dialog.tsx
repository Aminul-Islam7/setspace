'use client';

import { AlertCircle, Calendar, Check, Clock, Loader2, Lock, ShieldCheck, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BookedSlot, CreateBookingPayload, Studio, StudioAvailabilityResponse } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';

export interface StudioBookingDialogProps {
	studio: Studio;
	trigger?: React.ReactNode;
}

const OPERATING_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

function timeToMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + (m || 0);
}

function formatTime12h(time24: string): string {
	const [h, m] = time24.split(':').map(Number);
	const period = h >= 12 ? 'PM' : 'AM';
	const hour12 = h % 12 || 12;
	return `${hour12}:${(m || 0).toString().padStart(2, '0')} ${period}`;
}

function getNextHour(hour: string): string {
	const idx = OPERATING_HOURS.indexOf(hour);
	if (idx !== -1 && idx + 1 < OPERATING_HOURS.length) {
		return OPERATING_HOURS[idx + 1];
	}
	const [h, m] = hour.split(':').map(Number);
	const nextH = Math.min(22, h + 1);
	return `${nextH.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')}`;
}

export function StudioBookingDialog({ studio, trigger }: StudioBookingDialogProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session } = useSession();
	const user = session?.user;

	const [isOpen, setIsOpen] = useState(false);

	// Next-day-only constraint: current day and past dates cannot be booked
	const minBookingDate = useMemo(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split('T')[0];
	}, []);

	const [bookingDate, setBookingDate] = useState(minBookingDate);
	const [startTime, setStartTime] = useState<string | null>(null);
	const [endTime, setEndTime] = useState<string | null>(null);
	const [selectionStep, setSelectionStep] = useState<0 | 1 | 2>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Live availability state — strictly live or error, zero mock fallbacks
	const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [slotError, setSlotError] = useState<string | null>(null);

	const isDateTooEarly = bookingDate < minBookingDate;

	// Live fetch studio availability for the chosen date
	useEffect(() => {
		if (!isOpen || !studio?._id || bookingDate < minBookingDate) return;

		let cancelled = false;

		const fetchLiveAvailability = async () => {
			setIsLoadingSlots(true);
			setSlotError(null);

			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			if (!apiUrl) {
				if (!cancelled) {
					setSlotError('API URL is not configured.');
					setBookedSlots([]);
					setIsLoadingSlots(false);
				}
				return;
			}

			try {
				const res = await fetch(`${apiUrl}/api/bookings/availability?studioId=${encodeURIComponent(studio._id)}&date=${encodeURIComponent(bookingDate)}`);
				if (!res.ok) {
					const errData = await res.json().catch(() => ({}));
					throw new Error(errData.message || `Failed to fetch live availability (${res.status})`);
				}
				const json: StudioAvailabilityResponse = await res.json();
				if (!json.success || !Array.isArray(json.data)) {
					throw new Error(json.message || 'Invalid availability response format.');
				}
				if (!cancelled) {
					setBookedSlots(json.data);
				}
			} catch (err: unknown) {
				if (!cancelled) {
					const msg = err instanceof Error ? err.message : 'Error connecting to live availability service.';
					setSlotError(msg);
					setBookedSlots([]);
				}
			} finally {
				if (!cancelled) {
					setIsLoadingSlots(false);
				}
			}
		};

		fetchLiveAvailability();

		return () => {
			cancelled = true;
		};
	}, [isOpen, bookingDate, studio?._id, minBookingDate]);

	// Intercept unauthenticated trigger clicks
	const handleOpenChange = (open: boolean) => {
		if (open && !user) {
			const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : `/studios/${studio.slug}`);
			const callbackUrl = encodeURIComponent(currentPath);
			router.push(`/login?callbackUrl=${callbackUrl}`);
			return;
		}
		setIsOpen(open);
	};

	// Slots booked on currently selected date
	const slotsForSelectedDate = useMemo(() => {
		if (bookingDate < minBookingDate) return [];
		return bookedSlots.filter(s => s.bookingDate === bookingDate);
	}, [bookedSlots, bookingDate, minBookingDate]);

	// Check if an hour range is booked
	const isHourBooked = (hourStr: string) => {
		const hourStart = timeToMinutes(hourStr);
		const hourEnd = hourStart + 60;

		return slotsForSelectedDate.some(slot => {
			const slotStart = timeToMinutes(slot.startTime);
			const slotEnd = timeToMinutes(slot.endTime);
			return hourStart < slotEnd && hourEnd > slotStart;
		});
	};

	// Check if any slot within proposed window is already booked
	const rangeHasBookedSlot = (start: string, end: string) => {
		const startM = timeToMinutes(start);
		const endM = timeToMinutes(end);
		return slotsForSelectedDate.some(slot => {
			const slotStart = timeToMinutes(slot.startTime);
			const slotEnd = timeToMinutes(slot.endTime);
			return startM < slotEnd && endM > slotStart;
		});
	};

	// Direct slot click handler: 1st click = start, 2nd click = end, 3rd click = reset to new start
	const handleSlotClick = (hour: string) => {
		// Closing time (22:00 / 10 PM) cannot be a start time
		if (hour === '22:00' && (selectionStep === 0 || selectionStep === 2 || !startTime)) {
			toast.info('10:00 PM is studio closing time. Please choose an earlier start time.');
			return;
		}

		if (isHourBooked(hour)) return;

		// 0 slots or 3rd click: start fresh selection
		if (selectionStep === 0 || selectionStep === 2 || !startTime) {
			setStartTime(hour);
			setEndTime(getNextHour(hour));
			setSelectionStep(1);
			return;
		}

		// selectionStep === 1: 2nd click registers end time
		const clickedMinutes = timeToMinutes(hour);
		const startMinutes = timeToMinutes(startTime);

		if (clickedMinutes < startMinutes) {
			// Clicked earlier slot: switch start time
			setStartTime(hour);
			setEndTime(getNextHour(hour));
			setSelectionStep(1);
			return;
		}

		if (clickedMinutes === startMinutes) {
			// Clicked same slot: confirms 1-hour session
			setEndTime(getNextHour(hour));
			setSelectionStep(2);
			return;
		}

		// Clicked later slot: the clicked hour IS the end time
		const proposedEnd = hour;
		if (rangeHasBookedSlot(startTime, proposedEnd)) {
			toast.error('Selection overlaps an existing booking. Started new selection.');
			setStartTime(hour);
			setEndTime(getNextHour(hour));
			setSelectionStep(1);
			return;
		}

		setEndTime(proposedEnd);
		setSelectionStep(2);
	};

	// Check if current user selection overlaps with any booked slot
	const conflictingSlot = useMemo(() => {
		if (!startTime || !endTime || selectionStep === 0) return null;
		const selectedStart = timeToMinutes(startTime);
		const selectedEnd = timeToMinutes(endTime);

		if (selectedEnd <= selectedStart) return null;

		return slotsForSelectedDate.find(slot => {
			const slotStart = timeToMinutes(slot.startTime);
			const slotEnd = timeToMinutes(slot.endTime);
			return selectedStart < slotEnd && selectedEnd > slotStart;
		});
	}, [startTime, endTime, selectionStep, slotsForSelectedDate]);

	const hasOverlap = Boolean(conflictingSlot);

	// Calculate total hours
	const calculateHours = () => {
		if (!startTime || !endTime || selectionStep === 0) return 0;
		const diffMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
		if (diffMinutes <= 0) return 0;
		return Math.max(1, Math.round(diffMinutes / 60));
	};

	const totalHours = calculateHours();
	const hourlyTotal = studio.hourlyRate * totalHours;
	const deposit = totalHours > 0 ? studio.securityDeposit || 0 : 0;
	const grandTotal = hourlyTotal + deposit;

	// Submit reservation
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isDateTooEarly) {
			toast.error('Bookings must be scheduled at least 1 day in advance.');
			return;
		}

		if (!startTime || !endTime || totalHours <= 0 || selectionStep === 0) {
			toast.error('Please select an available time slot.');
			return;
		}

		if (hasOverlap && conflictingSlot) {
			toast.error(`Selected time overlaps with an existing booking (${formatTime12h(conflictingSlot.startTime)} - ${formatTime12h(conflictingSlot.endTime)}).`);
			return;
		}

		if (slotError) {
			toast.error('Cannot proceed while live availability service is unavailable.');
			return;
		}

		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		if (!apiUrl) {
			toast.error('API URL is not configured.');
			return;
		}

		setIsSubmitting(true);

		const payload: CreateBookingPayload = {
			studioId: studio._id,
			studioTitle: studio.title,
			studioCategory: studio.category,
			studioImage: studio.image,
			location: studio.location,
			hourlyRate: studio.hourlyRate,
			securityDeposit: deposit,
			ownerEmail: studio.ownerEmail,
			userName: user?.name || 'Creator',
			userEmail: user?.email || '',
			bookingDate,
			startTime,
			endTime,
			totalHours,
			totalPrice: grandTotal,
			status: 'Pending',
		};

		try {
			const res = await fetch(`${apiUrl}/api/bookings`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to submit reservation.');
			}

			toast.success('Reservation submitted successfully! Your booking is pending host confirmation.');
			setIsOpen(false);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Failed to submit reservation.';
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					(trigger ? (
						trigger
					) : (
						<Button flat3d size="xl" className="w-full font-semibold">
							<span>Book Now</span>
						</Button>
					)) as React.ReactElement
				}
			/>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="text-left space-y-1">
					<DialogTitle className="font-display text-xl sm:text-2xl font-bold text-foreground">Reserve Workspace</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						{studio.title} • ${studio.hourlyRate}/hr
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 pt-1">
					{/* Authenticated User Badge */}
					<div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 dark:bg-muted/40">
						<Avatar className="size-9 shrink-0">
							{user?.image ? <AvatarImage src={user.image} alt={user.name || 'User'} /> : null}
							<AvatarFallback className="text-xs font-semibold">{user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="size-4" />}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="text-[11px] font-medium text-muted-foreground">Booking as</p>
							<p className="text-sm font-semibold text-foreground truncate">
								{user?.name || 'Creator'} <span className="font-normal text-muted-foreground text-xs">({user?.email})</span>
							</p>
						</div>
					</div>

					{/* Date Selection */}
					<div className="space-y-1.5">
						<Label htmlFor="booking-date" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
							<Calendar className="size-3.5 text-muted-foreground" />
							<span>Shoot Date</span>
						</Label>
						<Input
							id="booking-date"
							type="date"
							min={minBookingDate}
							value={bookingDate}
							onChange={e => {
								setBookingDate(e.target.value);
								setStartTime(null);
								setEndTime(null);
								setSelectionStep(0);
								setSlotError(null);
							}}
							required
							className="h-10 text-sm"
						/>
						{isDateTooEarly && (
							<p className="text-[11px] text-destructive font-medium">Bookings must be scheduled at least 1 day in advance.</p>
						)}
					</div>

					{/* Availability Slots Grid */}
					<div className="space-y-2.5 rounded-xl bg-secondary/40 p-3.5">
						<div className="flex flex-wrap items-center justify-between gap-2 text-xs">
							<span className="font-semibold text-foreground flex items-center gap-1.5">
								<Clock className="size-3.5 text-muted-foreground" />
								<span>Availability on {bookingDate}</span>
							</span>
							{!isDateTooEarly && !slotError && (
								<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
									<span className="flex items-center gap-1.5">
										<span className="size-2.5 rounded-xs bg-card ring-1 ring-border/60" />
										<span>Free</span>
									</span>
									<span className="flex items-center gap-1.5">
										<span className="size-2.5 rounded-xs bg-destructive/20 ring-1 ring-destructive/30" />
										<span>Booked</span>
									</span>
									<span className="flex items-center gap-1.5">
										<span className="size-2.5 rounded-xs bg-primary ring-1 ring-primary" />
										<span>Selected</span>
									</span>
								</div>
							)}
						</div>

						{isDateTooEarly ? (
							<div role="alert" className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2 font-medium">
								<AlertCircle className="size-4 shrink-0" />
								<span>Bookings are only available from tomorrow onwards. Current date or past dates cannot be reserved.</span>
							</div>
						) : slotError ? (
							<div role="alert" className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs space-y-1">
								<div className="flex items-center gap-2 font-semibold">
									<AlertCircle className="size-4 shrink-0" />
									<span>Live availability unavailable</span>
								</div>
								<p className="opacity-90">{slotError}</p>
							</div>
						) : isLoadingSlots ? (
							<div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
								<Loader2 className="size-5 animate-spin text-primary" />
								<span>Loading live studio schedule...</span>
							</div>
						) : (
							<>
								{/* Hourly Grid Preview */}
								<div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5 pt-1">
									{OPERATING_HOURS.map(hour => {
										const booked = isHourBooked(hour);
										const hourNum = timeToMinutes(hour);
										const startNum = startTime ? timeToMinutes(startTime) : null;
										const endNum = endTime ? timeToMinutes(endTime) : null;

										const isStart = !booked && startNum !== null && hourNum === startNum;
										const isEnd = !booked && endNum !== null && hourNum === endNum;
										const isInBetween = !booked && startNum !== null && endNum !== null && hourNum > startNum && hourNum < endNum;
										const isSelected = isStart || isEnd || isInBetween;

										let label = 'Free';
										if (booked) {
											label = 'Booked';
										} else if (isStart) {
											label = 'Start';
										} else if (isEnd) {
											label = 'End';
										} else if (isInBetween) {
											label = 'Selected';
										} else if (hour === '22:00' && selectionStep === 0) {
											label = 'Close';
										}

										return (
											<button
												key={hour}
												type="button"
												disabled={booked}
												onClick={() => handleSlotClick(hour)}
												className={cn(
													'flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-150',
													booked
														? 'bg-destructive/15 text-destructive/80 ring-1 ring-destructive/25 cursor-not-allowed opacity-90'
														: isSelected
															? 'bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary cursor-pointer'
															: 'bg-card text-foreground ring-1 ring-border/50 hover:bg-muted/70 cursor-pointer'
												)}
												title={
													booked
														? `${formatTime12h(hour)} is already reserved`
														: isSelected
															? `${formatTime12h(hour)} is selected`
															: `Click to select ${formatTime12h(hour)}`
												}
											>
												<span>{formatTime12h(hour).replace(':00', '')}</span>
												<span className="text-[9px] opacity-80 font-normal">{label}</span>
											</button>
										);
									})}
								</div>

								{/* Slot Interaction Instruction */}
								<div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-0.5">
									<span>
										{selectionStep === 0
											? 'Click any available slot to select start time.'
											: selectionStep === 1
												? `Start time (${startTime ? formatTime12h(startTime) : ''}) selected. Now select end slot.`
												: 'Click any slot to reset and choose new start time.'}
									</span>
									{selectionStep > 0 && (
										<button
											type="button"
											onClick={() => {
												setStartTime(null);
												setEndTime(null);
												setSelectionStep(0);
												toast.info('Selection cleared. Click a slot to pick start time.');
											}}
											className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer shrink-0"
										>
											Reset
										</button>
									)}
								</div>
							</>
						)}
					</div>

					{/* Time Window Summary */}
					<div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/50 dark:bg-muted/40">
						<div className="space-y-0.5 min-w-0">
							<p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
								<span>Selected Window</span>
								{selectionStep === 1 && (
									<span className="text-primary font-semibold">(Pick end slot)</span>
								)}
							</p>
							{startTime && endTime && selectionStep > 0 ? (
								<p className="text-sm font-bold text-foreground flex items-center gap-1.5">
									<Clock className="size-4 text-primary shrink-0" />
									<span className="truncate">
										{formatTime12h(startTime)} – {formatTime12h(endTime)}
									</span>
								</p>
							) : (
								<p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
									<Clock className="size-4 text-muted-foreground/60 shrink-0" />
									<span>No slots selected</span>
								</p>
							)}
						</div>
						<div className="text-right space-y-1 shrink-0 pl-3">
							<p className="text-[11px] font-medium text-muted-foreground">Duration</p>
							<span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
								{totalHours} hr{totalHours !== 1 ? 's' : ''}
							</span>
						</div>
					</div>

					{/* Conflict Warning Alert */}
					{hasOverlap && conflictingSlot && (
						<div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
							<Lock className="size-4 shrink-0" />
							<span>
								Selected window overlaps with a booked session ({formatTime12h(conflictingSlot.startTime)} – {formatTime12h(conflictingSlot.endTime)}). Please choose another time.
							</span>
						</div>
					)}

					{/* Invalid Time Warning */}
					{selectionStep > 0 && totalHours <= 0 && (
						<div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
							<AlertCircle className="size-4 shrink-0" />
							<span>End time must be at least 1 hour after start time.</span>
						</div>
					)}

					{/* Price Breakdown */}
					<div className="rounded-xl bg-secondary/70 dark:bg-muted/40 p-3.5 space-y-2 text-xs">
						<div className="flex justify-between text-muted-foreground">
							<span>
								${studio.hourlyRate} × {totalHours} hour{totalHours !== 1 ? 's' : ''}
							</span>
							<span className="font-medium text-foreground">${hourlyTotal}</span>
						</div>
						{deposit > 0 && (
							<div className="flex justify-between text-muted-foreground">
								<span className="flex items-center gap-1">
									<ShieldCheck className="size-3 text-muted-foreground" />
									<span>Refundable Security Deposit</span>
								</span>
								<span className="font-medium text-foreground">${deposit}</span>
							</div>
						)}
						<div className="pt-2 border-t border-foreground/5 flex justify-between text-sm font-bold text-foreground">
							<span>Total Estimated Due</span>
							<span className="text-primary">${grandTotal}</span>
						</div>
					</div>

					<DialogFooter className="gap-2 pt-1 sm:gap-0">
						<DialogClose
							render={
								<Button variant="ghost" size="default" type="button">
									Cancel
								</Button>
							}
						/>
						<Button
							flat3d
							type="submit"
							disabled={isSubmitting || hasOverlap || totalHours <= 0 || selectionStep === 0 || isDateTooEarly || isLoadingSlots || Boolean(slotError)}
							size="default"
							className="font-semibold gap-1.5"
						>
							<Check className="size-4" />
							<span>{isSubmitting ? 'Confirming...' : 'Request Booking'}</span>
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

