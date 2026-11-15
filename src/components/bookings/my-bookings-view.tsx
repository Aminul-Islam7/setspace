'use client';

import type { ApiResponse, Booking, BookingStatus } from '@/types';
import { Calendar, CheckCircle2, Clock, Compass, ExternalLink, Image as ImageIcon, MapPin, Receipt, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { BookingReceiptDialog } from './booking-receipt-dialog';
import { Button } from '@/components/ui/button';
import { CancelBookingDialog } from './cancel-booking-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isImgbbUrl } from '@/components/studios/create/types';
import { useSession } from '@/lib/auth-client';
import { getTokenFromClient } from '@/lib/getTokenFromClient';

type FilterTab = 'All' | BookingStatus;

function formatBookingDate(dateStr: string): string {
	if (!dateStr) return '';
	try {
		const [year, month, day] = dateStr.split('-').map(Number);
		if (year && month && day) {
			const d = new Date(year, month - 1, day);
			return d.toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		}
		return dateStr;
	} catch {
		return dateStr;
	}
}

function formatTimeSlot(start: string, end: string): string {
	const to12h = (t: string) => {
		const [hStr, mStr] = t.split(':');
		let h = parseInt(hStr, 10);
		const ampm = h >= 12 ? 'PM' : 'AM';
		h = h % 12 || 12;
		return `${h}:${mStr || '00'} ${ampm}`;
	};
	try {
		return `${to12h(start)} – ${to12h(end)}`;
	} catch {
		return `${start} – ${end}`;
	}
}

export function MyBookingsView() {
	const { data: session, isPending: isSessionPending } = useSession();
	const user = session?.user;
	const userEmail = user?.email;

	const [bookings, setBookings] = useState<Booking[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<FilterTab>('All');
	const [reloadKey, setReloadKey] = useState(0);

	// Dialog states
	const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
	const [bookingForReceipt, setBookingForReceipt] = useState<Booking | null>(null);

	useEffect(() => {
		if (!userEmail) return;

		let isMounted = true;
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

		getTokenFromClient()
			.then(token =>
				fetch(`${apiUrl}/api/users/me/bookings?email=${encodeURIComponent(userEmail)}`, {
					headers: {
						'x-user-email': userEmail,
						authorization: `Bearer ${token}`,
					},
					cache: 'no-store',
				})
			)
			.then(res => {
				if (res.ok) {
					return res.json() as Promise<ApiResponse<Booking[]>>;
				}
				// Fallback to bookings list filtering by user email
				return fetch(`${apiUrl}/api/bookings?limit=100`, { cache: 'no-store' })
					.then(fallbackRes => {
						if (!fallbackRes.ok) throw new Error('Failed to load your bookings.');
						return fallbackRes.json();
					})
					.then(json => {
						const list: Booking[] = json.data || [];
						return {
							success: true,
							data: list.filter(b => b.userEmail?.toLowerCase() === userEmail.toLowerCase()),
						} as ApiResponse<Booking[]>;
					});
			})
			.then(json => {
				if (isMounted) {
					setBookings(Array.isArray(json.data) ? json.data : []);
					setError(null);
				}
			})
			.catch(err => {
				if (isMounted) {
					console.error('Error loading my bookings:', err);
					setError(err instanceof Error ? err.message : 'Failed to load your reservations.');
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsFetching(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [userEmail, reloadKey]);

	const handleRetry = () => {
		setIsFetching(true);
		setError(null);
		setReloadKey(k => k + 1);
	};

	const isPageLoading = isSessionPending || (Boolean(userEmail) && isFetching);

	const handleBookingCancelled = (bookingId: string) => {
		setBookings(prev => prev.map(b => (b._id === bookingId ? { ...b, status: 'Cancelled' as BookingStatus } : b)));
	};

	// Filtered Bookings
	const filteredBookings = useMemo(() => {
		if (activeTab === 'All') return bookings;
		return bookings.filter(b => b.status === activeTab);
	}, [bookings, activeTab]);

	if (isPageLoading) {
		return <MyBookingsSkeletonContent />;
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Filter Tabs */}
			<div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-3">
				{(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as FilterTab[]).map(tab => {
					const count = tab === 'All' ? bookings.length : bookings.filter(b => b.status === tab).length;

					const isActive = activeTab === tab;

					return (
						<button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn('rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5', isActive ? 'bg-foreground text-background font-semibold shadow-xs' : 'bg-secondary text-muted-foreground hover:text-foreground')}>
							<span>{tab}</span>
							<span className={cn('px-1.5 py-0.2 rounded-full text-[10px] font-semibold', isActive ? 'bg-background/20 text-background' : 'bg-card text-muted-foreground')}>{count}</span>
						</button>
					);
				})}
			</div>

			{/* Error State */}
			{error && (
				<div className="p-4 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-between">
					<p className="text-sm font-medium">{error}</p>
					<Button variant="outline" size="sm" onClick={handleRetry}>
						Retry
					</Button>
				</div>
			)}

			{/* Bookings List */}
			{filteredBookings.length > 0 ? (
				<div className="space-y-4">
					{filteredBookings.map(booking => {
						const hasValidImage = isImgbbUrl(booking.studioImage);

						return (
							<article key={booking._id} className="rounded-2xl bg-secondary p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
								{/* Left: Cover & Details */}
								<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
									{/* Studio Thumbnail */}
									<div className="relative w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card overflow-hidden shrink-0">
										{hasValidImage ? (
											<Image src={booking.studioImage.trim()} alt={booking.studioTitle} fill unoptimized className="object-cover" />
										) : (
											<div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-2 text-center">
												<ImageIcon className="size-6 mb-1 opacity-50" />
												<span className="text-[10px]">No image</span>
											</div>
										)}
										<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-foreground backdrop-blur-md">{booking.studioCategory}</span>
									</div>

									{/* Info Details */}
									<div className="space-y-1.5 flex-1 min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<h2 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
												<Link href={`/studios/${booking.studioId}`} className="hover:text-primary transition-colors">
													{booking.studioTitle}
												</Link>
											</h2>

											{/* Status Badge */}
											<span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1', booking.status === 'Confirmed' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', booking.status === 'Pending' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400', booking.status === 'Cancelled' && 'bg-destructive/15 text-destructive', booking.status === 'Completed' && 'bg-secondary text-secondary-foreground border border-border/40')}>
												{booking.status === 'Confirmed' && <CheckCircle2 className="size-3" />}
												{booking.status === 'Pending' && <Clock className="size-3" />}
												{booking.status === 'Cancelled' && <XCircle className="size-3" />}
												<span>{booking.status}</span>
											</span>
										</div>

										<div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
											<MapPin className="size-3.5 shrink-0" />
											<span className="truncate">{booking.location}</span>
										</div>

										<div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
											<span className="flex items-center gap-1 text-foreground font-medium">
												<Calendar className="size-3.5 text-primary" />
												<span>{formatBookingDate(booking.bookingDate)}</span>
											</span>

											<span className="flex items-center gap-1 text-muted-foreground">
												<Clock className="size-3.5" />
												<span>
													{formatTimeSlot(booking.startTime, booking.endTime)} ({booking.totalHours} hrs)
												</span>
											</span>

											<span className="font-bold text-foreground">
												${booking.totalPrice}
												<span className="text-xs text-muted-foreground font-normal"> total</span>
											</span>
										</div>
									</div>
								</div>

								{/* Right: Actions */}
								<div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
									{/* Receipt button */}
									<Button variant="outline" size="sm" onClick={() => setBookingForReceipt(booking)} className="font-medium" title="View Invoice Receipt">
										<Receipt className="size-3.5" />
										<span className="hidden sm:inline">Receipt</span>
									</Button>

									{/* Cancel button: Only for Pending reservations */}
									{booking.status === 'Pending' && (
										<Button variant="destructive" size="sm" onClick={() => setBookingToCancel(booking)} className="font-medium" title="Cancel Reservation">
											<XCircle className="size-3.5" />
											<span className="hidden sm:inline">Cancel</span>
										</Button>
									)}

									{/* View Studio Page */}
									<Button variant="secondary" size="sm" render={<Link href={`/studios/${booking.studioId}`} />} className="font-medium" title="View Studio Details">
										<ExternalLink className="size-3.5" />
										<span className="hidden sm:inline">Studio</span>
									</Button>
								</div>
							</article>
						);
					})}
				</div>
			) : (
				/* Empty State */
				<div className="rounded-2xl bg-secondary p-8 sm:p-12 text-center space-y-4 shadow-xs">
					<div className="size-14 sm:size-16 rounded-2xl bg-card flex items-center justify-center text-muted-foreground mx-auto">
						<Calendar className="size-7 sm:size-8 opacity-60" />
					</div>
					<div className="space-y-1 max-w-md mx-auto">
						<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{activeTab === 'All' ? 'No Reservations Booked Yet' : `No ${activeTab} Reservations`}</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">{activeTab === 'All' ? 'Browse our curated collection of photo cycs, soundstages, podcast suites, and music spaces to reserve your shoot hours.' : `You do not have any bookings currently marked as "${activeTab}".`}</p>
					</div>
					<div>
						{activeTab !== 'All' ? (
							<Button variant="outline" onClick={() => setActiveTab('All')}>
								View All Bookings
							</Button>
						) : (
							<Button variant="glass" flat3d render={<Link href="/studios" />}>
								<Compass className="size-4" />
								<span>Explore Workspaces</span>
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Cancellation Dialog */}
			<CancelBookingDialog booking={bookingToCancel} isOpen={Boolean(bookingToCancel)} onClose={() => setBookingToCancel(null)} onCancelled={handleBookingCancelled} />

			{/* Receipt Dialog */}
			<BookingReceiptDialog booking={bookingForReceipt} isOpen={Boolean(bookingForReceipt)} onClose={() => setBookingForReceipt(null)} />
		</div>
	);
}

export function MyBookingsSkeletonContent() {
	return (
		<div className="space-y-6 sm:space-y-8 animate-pulse">
			{/* Filter Tabs Skeleton */}
			<div className="flex gap-2 border-b border-border/40 pb-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-8 w-24 bg-secondary rounded-lg" />
				))}
			</div>

			{/* Booking Card Skeletons */}
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="rounded-2xl bg-secondary p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
							<div className="w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card shrink-0" />
							<div className="space-y-2 flex-1">
								<div className="h-5 w-48 bg-card rounded" />
								<div className="h-3 w-32 bg-card rounded" />
								<div className="h-4 w-60 bg-card rounded" />
							</div>
						</div>
						<div className="flex gap-2 shrink-0">
							<div className="h-8 w-16 bg-card rounded-lg" />
							<div className="h-8 w-16 bg-card rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

