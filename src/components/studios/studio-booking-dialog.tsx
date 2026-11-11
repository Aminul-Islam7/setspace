'use client';

import { Calendar, Clock, ShieldCheck } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Studio } from '@/types';
import { toast } from 'sonner';
import { useState } from 'react';

export interface StudioBookingDialogProps {
	studio: Studio;
	trigger?: React.ReactNode;
}

export function StudioBookingDialog({ studio, trigger }: StudioBookingDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [bookingDate, setBookingDate] = useState(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split('T')[0];
	});
	const [startTime, setStartTime] = useState('10:00');
	const [endTime, setEndTime] = useState('14:00');
	const [userName, setUserName] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Calculate total hours
	const calculateHours = () => {
		const [startH, startM] = startTime.split(':').map(Number);
		const [endH, endM] = endTime.split(':').map(Number);
		const diffMinutes = endH * 60 + endM - (startH * 60 + startM);
		if (diffMinutes <= 0) return 0;
		return Math.max(1, Math.round(diffMinutes / 60));
	};

	const totalHours = calculateHours();
	const hourlyTotal = studio.hourlyRate * totalHours;
	const deposit = studio.securityDeposit || 0;
	const grandTotal = hourlyTotal + deposit;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (totalHours <= 0) {
			toast.error('End time must be after start time.');
			return;
		}

		if (!userName.trim() || !userEmail.trim()) {
			toast.error('Please provide your name and email address.');
			return;
		}

		setIsSubmitting(true);

		const payload = {
			studioId: studio._id,
			studioTitle: studio.title,
			studioCategory: studio.category,
			studioImage: studio.image,
			location: studio.location,
			hourlyRate: studio.hourlyRate,
			securityDeposit: deposit,
			ownerEmail: studio.ownerEmail,
			userName: userName.trim(),
			userEmail: userEmail.trim(),
			bookingDate,
			startTime,
			endTime,
			totalHours,
			totalPrice: grandTotal,
			status: 'Pending',
		};

		const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

		try {
			if (apiUrl) {
				const res = await fetch(`${apiUrl}/api/bookings`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to submit reservation.');
				}
			}
			toast.success('Reservation submitted successfully! Your booking is pending host confirmation.');
			setIsOpen(false);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Reservation submitted in offline preview mode.';
			toast.info(msg);
			setIsOpen(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const todayString = new Date().toISOString().split('T')[0];

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
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

			<DialogContent className="sm:max-w-md p-6">
				<DialogHeader className="text-left space-y-1">
					<DialogTitle className="font-display text-xl sm:text-2xl font-bold text-foreground">Reserve Workspace</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						{studio.title} • ${studio.hourlyRate}/hr
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					{/* Date Field */}
					<div className="space-y-1.5">
						<Label htmlFor="booking-date" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
							<Calendar className="size-3.5 text-muted-foreground" />
							<span>Shoot Date</span>
						</Label>
						<Input id="booking-date" type="date" min={todayString} value={bookingDate} onChange={e => setBookingDate(e.target.value)} required className="h-10 text-sm" />
					</div>

					{/* Time Slot Row */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="start-time" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
								<Clock className="size-3.5 text-muted-foreground" />
								<span>Call Time (Start)</span>
							</Label>
							<Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="h-10 text-sm" />
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="end-time" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
								<Clock className="size-3.5 text-muted-foreground" />
								<span>Wrap Time (End)</span>
							</Label>
							<Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="h-10 text-sm" />
						</div>
					</div>

					{/* Contact Details */}
					<div className="space-y-3 pt-1">
						<div className="space-y-1.5">
							<Label htmlFor="creator-name" className="text-xs font-semibold text-foreground">
								Creator / Production Name
							</Label>
							<Input id="creator-name" placeholder="e.g. Alex Morgan" value={userName} onChange={e => setUserName(e.target.value)} required className="h-10 text-sm" />
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="creator-email" className="text-xs font-semibold text-foreground">
								Contact Email Address
							</Label>
							<Input id="creator-email" type="email" placeholder="creator@production.com" value={userEmail} onChange={e => setUserEmail(e.target.value)} required className="h-10 text-sm" />
						</div>
					</div>

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

					<DialogFooter className="gap-2 pt-2 sm:gap-0">
						<DialogClose
							render={
								<Button variant="ghost" size="default" type="button">
									Cancel
								</Button>
							}
						/>
						<Button flat3d type="submit" disabled={isSubmitting} size="default" className="font-semibold">
							{isSubmitting ? 'Confirming...' : 'Request Instant Booking'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

