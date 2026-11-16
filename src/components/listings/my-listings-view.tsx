'use client';

import type { ApiResponse, Booking, BookingStatus, Studio } from '@/types';
import {
	Building2,
	Calendar,
	CalendarCheck2,
	Check,
	CheckCheck,
	CheckCircle2,
	Clock,
	ExternalLink,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Pencil,
	Plus,
	Receipt,
	Search,
	Trash2,
	Users,
	X,
	XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { BookingReceiptDialog } from '@/components/bookings/booking-receipt-dialog';
import { Button } from '@/components/ui/button';
import { DeleteStudioDialog } from './delete-studio-dialog';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { isImgbbUrl } from '@/components/studios/create/types';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';

type ActiveView = 'studios' | 'requests';
type RequestFilterTab = 'All' | BookingStatus;

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

export function MyListingsView() {
	const { data: session, isPending: isSessionPending } = useSession();
	const user = session?.user;
	const userEmail = user?.email;

	const [activeView, setActiveView] = useState<ActiveView>('studios');
	const [activeRequestTab, setActiveRequestTab] = useState<RequestFilterTab>('All');

	// Studio listings state
	const [studios, setStudios] = useState<Studio[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);

	// Incoming bookings state
	const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
	const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
	const [bookingForReceipt, setBookingForReceipt] = useState<Booking | null>(null);

	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		if (!userEmail) return;

		let isMounted = true;
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

		getTokenFromClient().then(token => {
			const authHeaders = {
				'x-user-email': userEmail,
				...(token ? { authorization: `Bearer ${token}` } : {}),
			};

			// 1. Fetch hosted studio listings
			fetch(`${apiUrl}/api/users/me/studios?email=${encodeURIComponent(userEmail)}`, {
				headers: authHeaders,
				cache: 'no-store',
			})
				.then(res => {
					if (res.ok) return res.json() as Promise<ApiResponse<Studio[]>>;
					return fetch(`${apiUrl}/api/studios?limit=100`, { cache: 'no-store' })
						.then(fallbackRes => {
							if (!fallbackRes.ok) throw new Error('Failed to load listings');
							return fallbackRes.json();
						})
						.then(json => {
							const list: Studio[] = json.data || [];
							return {
								success: true,
								data: list.filter(s => s.ownerEmail?.toLowerCase() === userEmail.toLowerCase()),
							} as ApiResponse<Studio[]>;
						});
				})
				.then(json => {
					if (isMounted) {
						setStudios(Array.isArray(json.data) ? json.data : []);
					}
				})
				.catch(err => {
					if (isMounted) {
						console.error('Error loading studios:', err);
						setError(err instanceof Error ? err.message : 'Failed to load studios.');
					}
				});

			// 2. Fetch incoming booking requests for hosted studios
			fetch(`${apiUrl}/api/users/me/bookings?role=host`, {
				headers: authHeaders,
				cache: 'no-store',
			})
				.then(res => {
					if (res.ok) return res.json() as Promise<ApiResponse<Booking[]>>;
					// Fallback: fetch all bookings and filter where current user is host
					return fetch(`${apiUrl}/api/bookings?limit=100`, { cache: 'no-store' })
						.then(fallbackRes => {
							if (!fallbackRes.ok) throw new Error('Failed to load bookings');
							return fallbackRes.json();
						})
						.then(json => {
							const list: Booking[] = json.data || [];
							return {
								success: true,
								data: list.filter(b => b.ownerEmail?.toLowerCase() === userEmail.toLowerCase()),
							} as ApiResponse<Booking[]>;
						});
				})
				.then(json => {
					if (isMounted) {
						setIncomingBookings(Array.isArray(json.data) ? json.data : []);
					}
				})
				.catch(err => {
					if (isMounted) {
						console.error('Error loading incoming bookings:', err);
					}
				})
				.finally(() => {
					if (isMounted) {
						setIsFetching(false);
					}
				});
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

	const handleStudioDeleted = (deletedId: string) => {
		setStudios(prev => prev.filter(s => s._id !== deletedId));
	};

	// Update booking status by host
	const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
		try {
			setUpdatingBookingId(bookingId);
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			if (apiUrl) {
				const token = await getTokenFromClient();
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
				};
				if (token) headers['authorization'] = `Bearer ${token}`;

				const res = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
					method: 'PATCH',
					headers,
					body: JSON.stringify({ status: newStatus }),
				});

				if (!res.ok) {
					const errData = await res.json().catch(() => ({}));
					throw new Error(errData.message || 'Failed to update reservation status.');
				}
			}

			// Optimistic update
			setIncomingBookings(prev => prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b)));

			if (newStatus === 'Confirmed') {
				toast.success('Shoot reservation confirmed and accepted!');
			} else if (newStatus === 'Completed') {
				toast.success('Reservation marked as completed! Client can now post a verified review.');
			} else if (newStatus === 'Cancelled') {
				toast.success('Reservation request declined.');
			}
		} catch (error: unknown) {
			console.error('Error updating booking status:', error);
			const message = error instanceof Error ? error.message : 'Failed to update reservation status.';
			toast.error(message);
		} finally {
			setUpdatingBookingId(null);
		}
	};

	// Filtered Studios
	const filteredStudios = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return studios;
		return studios.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.location.toLowerCase().includes(q));
	}, [studios, searchQuery]);

	// Filtered Incoming Bookings
	const filteredRequests = useMemo(() => {
		if (activeRequestTab === 'All') return incomingBookings;
		return incomingBookings.filter(b => b.status === activeRequestTab);
	}, [incomingBookings, activeRequestTab]);

	const pendingCount = useMemo(() => {
		return incomingBookings.filter(b => b.status === 'Pending').length;
	}, [incomingBookings]);

	if (isPageLoading) {
		return <MyListingsSkeletonContent />;
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* View Switcher: Workspaces vs Client Booking Requests */}
			<div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-3">
				<button
					type="button"
					onClick={() => setActiveView('studios')}
					className={cn(
						'rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5',
						activeView === 'studios' ? 'bg-foreground text-background font-semibold shadow-xs' : 'bg-secondary text-muted-foreground hover:text-foreground'
					)}
				>
					<Building2 className="size-3.5 sm:size-4" />
					<span>My Workspaces</span>
					<span className={cn('px-1.5 py-0.2 rounded-full text-[10px] font-semibold', activeView === 'studios' ? 'bg-background/20 text-background' : 'bg-card text-muted-foreground')}>
						{studios.length}
					</span>
				</button>

				<button
					type="button"
					onClick={() => setActiveView('requests')}
					className={cn(
						'rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 relative',
						activeView === 'requests' ? 'bg-foreground text-background font-semibold shadow-xs' : 'bg-secondary text-muted-foreground hover:text-foreground'
					)}
				>
					<CalendarCheck2 className="size-3.5 sm:size-4" />
					<span>Client Requests</span>
					<span className={cn('px-1.5 py-0.2 rounded-full text-[10px] font-semibold', activeView === 'requests' ? 'bg-background/20 text-background' : 'bg-card text-muted-foreground')}>
						{incomingBookings.length}
					</span>
					{pendingCount > 0 && (
						<span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-amber-950">
							{pendingCount} new
						</span>
					)}
				</button>
			</div>

			{/* ===================== VIEW 1: STUDIO WORKSPACES ===================== */}
			{activeView === 'studios' && (
				<div className="space-y-6">
					{/* Search & Actions Bar */}
					<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter your listings by title, category, or city..." className="pl-10" />
						</div>

						<Button variant="default" render={<Link href="/studios/create" />} className="shrink-0 font-medium">
							<Plus className="size-4" />
							<span>Add New Studio</span>
						</Button>
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

					{/* Listings List */}
					{filteredStudios.length > 0 ? (
						<div className="space-y-4">
							{filteredStudios.map(studio => {
								const hasValidImage = isImgbbUrl(studio.image);

								return (
									<article key={studio._id} className="rounded-2xl bg-secondary p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
										{/* Left: Thumbnail & Details */}
										<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
											{/* Studio Thumbnail */}
											<div className="relative w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card overflow-hidden shrink-0">
												{hasValidImage ? (
													<Image src={studio.image.trim()} alt={studio.title} fill unoptimized className="object-cover" />
												) : (
													<div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-2 text-center">
														<ImageIcon className="size-6 mb-1 opacity-50" />
														<span className="text-[10px]">No image</span>
													</div>
												)}
												<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-foreground backdrop-blur-md">{studio.category}</span>
											</div>

											{/* Text Details */}
											<div className="space-y-1.5 flex-1 min-w-0">
												<h2 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
													<Link href={`/studios/${studio.slug || studio._id}`} className="hover:text-primary transition-colors">
														{studio.title}
													</Link>
												</h2>

												<div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
													<MapPin className="size-3.5 shrink-0" />
													<span className="truncate">{studio.location}</span>
												</div>

												<div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
													<span className="font-semibold text-foreground">
														${studio.hourlyRate}
														<span className="font-normal text-muted-foreground">/hr</span>
													</span>
													<span className="text-muted-foreground">Deposit: ${studio.securityDeposit || 0}</span>
													<span className="flex items-center gap-1 text-muted-foreground">
														<Users className="size-3.5" />
														<span>{studio.maxCapacity} crew</span>
													</span>
													<span className="flex items-center gap-1 font-medium text-foreground">
														<FaStar className="size-3 text-amber-500" />
														<span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
														<span className="text-muted-foreground font-normal">({studio.reviewCount || 0})</span>
													</span>
												</div>
											</div>
										</div>

										{/* Right: Actions */}
										<div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
											<Button variant="outline" size="sm" render={<Link href={`/studios/${studio.slug || studio._id}`} />} className="font-medium" title="View Studio">
												<ExternalLink className="size-3.5" />
												<span className="hidden sm:inline">View</span>
											</Button>

											<Button variant="secondary" size="sm" render={<Link href={`/studios/edit/${studio._id}`} />} className="font-medium" title="Update Studio">
												<Pencil className="size-3.5" />
												<span className="hidden sm:inline">Edit</span>
											</Button>

											<Button variant="destructive" size="sm" onClick={() => setStudioToDelete(studio)} className="font-medium" title="Delete Studio">
												<Trash2 className="size-3.5" />
												<span className="hidden sm:inline">Delete</span>
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
								<Building2 className="size-7 sm:size-8 opacity-60" />
							</div>
							<div className="space-y-1 max-w-md mx-auto">
								<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{searchQuery ? 'No matching listings found' : 'No Studio Workspaces Listed Yet'}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{searchQuery ? 'Try clearing your search query or check for typos.' : 'Host your photo studio, film soundstage, podcast room, or music suite and start booking creator shoots.'}</p>
							</div>
							<div>
								{searchQuery ? (
									<Button variant="outline" onClick={() => setSearchQuery('')}>
										Clear Search
									</Button>
								) : (
									<Button variant="glass" flat3d render={<Link href="/studios/create" />}>
										<Plus className="size-4" />
										<span>List Your First Studio</span>
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* ===================== VIEW 2: CLIENT BOOKING REQUESTS ===================== */}
			{activeView === 'requests' && (
				<div className="space-y-6">
					{/* Status Filter Tabs */}
					<div className="flex flex-wrap items-center gap-2">
						{(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as RequestFilterTab[]).map(tab => {
							const count = tab === 'All' ? incomingBookings.length : incomingBookings.filter(b => b.status === tab).length;
							const isActive = activeRequestTab === tab;

							return (
								<button
									key={tab}
									type="button"
									onClick={() => setActiveRequestTab(tab)}
									className={cn(
										'rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5',
										isActive ? 'bg-foreground text-background font-semibold shadow-xs' : 'bg-secondary text-muted-foreground hover:text-foreground'
									)}
								>
									<span>{tab}</span>
									<span className={cn('px-1.5 py-0.2 rounded-full text-[10px] font-semibold', isActive ? 'bg-background/20 text-background' : 'bg-card text-muted-foreground')}>
										{count}
									</span>
								</button>
							);
						})}
					</div>

					{/* Requests List */}
					{filteredRequests.length > 0 ? (
						<div className="space-y-4">
							{filteredRequests.map(booking => {
								const isUpdating = updatingBookingId === booking._id;

								return (
									<article key={booking._id} className="rounded-2xl bg-secondary p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
										{/* Left: Thumbnail & Client Shoot Specs */}
										<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
											<div className="relative w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card overflow-hidden shrink-0">
												{isImgbbUrl(booking.studioImage) ? (
													<Image src={booking.studioImage.trim()} alt={booking.studioTitle} fill unoptimized className="object-cover" />
												) : (
													<div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-2 text-center">
														<ImageIcon className="size-6 mb-1 opacity-50" />
														<span className="text-[10px]">No image</span>
													</div>
												)}
												<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-foreground backdrop-blur-md">
													{booking.studioCategory}
												</span>
											</div>

											{/* Text Specs */}
											<div className="space-y-1.5 flex-1 min-w-0">
												<div className="flex flex-wrap items-center gap-2">
													<h2 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
														<Link href={`/studios/${booking.studioId}`} className="hover:text-primary transition-colors">
															{booking.studioTitle}
														</Link>
													</h2>

													{/* Status Badge */}
													<span
														className={cn(
															'px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1',
															booking.status === 'Confirmed' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
															booking.status === 'Pending' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
															booking.status === 'Cancelled' && 'bg-destructive/15 text-destructive',
															booking.status === 'Completed' && 'bg-secondary text-secondary-foreground border border-border/40'
														)}
													>
														{booking.status === 'Confirmed' && <CheckCircle2 className="size-3" />}
														{booking.status === 'Pending' && <Clock className="size-3" />}
														{booking.status === 'Cancelled' && <XCircle className="size-3" />}
														{booking.status === 'Completed' && <CheckCheck className="size-3" />}
														<span>{booking.status}</span>
													</span>
												</div>

												{/* Client Booker Identity */}
												<div className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground font-medium">
													<Users className="size-3.5 text-primary shrink-0" />
													<span className="truncate">Client: {booking.userName}</span>
													<span className="text-muted-foreground font-normal">({booking.userEmail})</span>
												</div>

												{/* Date, Time & Payout */}
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
														<span className="text-xs text-muted-foreground font-normal"> payout</span>
													</span>
												</div>
											</div>
										</div>

										{/* Right: Host Actions */}
										<div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
											{/* Actions when PENDING */}
											{booking.status === 'Pending' && (
												<>
													<Button
														variant="default"
														size="sm"
														flat3d
														disabled={isUpdating}
														onClick={() => handleUpdateBookingStatus(booking._id, 'Confirmed')}
														className="font-medium gap-1.5"
														title="Accept & Confirm Reservation"
													>
														{isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
														<span>Accept</span>
													</Button>

													<Button
														variant="destructive"
														size="sm"
														disabled={isUpdating}
														onClick={() => handleUpdateBookingStatus(booking._id, 'Cancelled')}
														className="font-medium gap-1.5"
														title="Decline Reservation"
													>
														<X className="size-3.5" />
														<span>Decline</span>
													</Button>
												</>
											)}

											{/* Actions when CONFIRMED */}
											{booking.status === 'Confirmed' && (
												<>
													<Button
														variant="default"
														size="sm"
														flat3d
														disabled={isUpdating}
														onClick={() => handleUpdateBookingStatus(booking._id, 'Completed')}
														className="font-medium gap-1.5"
														title="Mark Shoot as Completed"
													>
														{isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
														<span>Complete Shoot</span>
													</Button>

													<Button
														variant="outline"
														size="sm"
														disabled={isUpdating}
														onClick={() => handleUpdateBookingStatus(booking._id, 'Cancelled')}
														className="font-medium gap-1.5 text-destructive hover:text-destructive"
														title="Cancel Reservation"
													>
														<XCircle className="size-3.5" />
														<span>Cancel</span>
													</Button>
												</>
											)}

											{/* Invoice Receipt */}
											<Button
												variant="outline"
												size="sm"
												onClick={() => setBookingForReceipt(booking)}
												className="font-medium"
												title="View Invoice Receipt"
											>
												<Receipt className="size-3.5" />
												<span className="hidden sm:inline">Receipt</span>
											</Button>

											{/* View Studio */}
											<Button
												variant="secondary"
												size="sm"
												render={<Link href={`/studios/${booking.studioId}`} />}
												className="font-medium"
												title="View Studio Details"
											>
												<ExternalLink className="size-3.5" />
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
								<CalendarCheck2 className="size-7 sm:size-8 opacity-60" />
							</div>
							<div className="space-y-1 max-w-md mx-auto">
								<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
									{activeRequestTab === 'All' ? 'No Client Booking Requests' : `No ${activeRequestTab} Requests`}
								</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{activeRequestTab === 'All'
										? 'When creators book shoot hours on your studio workspaces, their requests will appear here for you to accept, decline, or complete.'
										: `You currently do not have any client requests with status "${activeRequestTab}".`}
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Delete Studio Confirmation Modal */}
			<DeleteStudioDialog studio={studioToDelete} isOpen={Boolean(studioToDelete)} onClose={() => setStudioToDelete(null)} onDeleted={handleStudioDeleted} />

			{/* Booking Receipt Dialog */}
			<BookingReceiptDialog booking={bookingForReceipt} isOpen={Boolean(bookingForReceipt)} onClose={() => setBookingForReceipt(null)} />
		</div>
	);
}

export function MyListingsSkeletonContent() {
	return (
		<div className="space-y-6 sm:space-y-8 animate-pulse">
			{/* View Tabs Skeleton */}
			<div className="flex gap-2 border-b border-border/40 pb-3">
				<div className="h-8 w-36 bg-secondary rounded-lg" />
				<div className="h-8 w-44 bg-secondary rounded-lg" />
			</div>

			{/* Search & Action Skeleton */}
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
				<div className="h-10 max-w-md w-full bg-secondary rounded-lg" />
				<div className="h-10 w-36 bg-secondary rounded-lg" />
			</div>

			{/* Listing Row Skeletons */}
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="rounded-2xl bg-secondary p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between">
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
							<div className="w-full sm:w-44 md:w-48 aspect-video rounded-xl bg-card" />
							<div className="space-y-2 flex-1 w-full">
								<div className="h-5 w-3/4 bg-card rounded-md" />
								<div className="h-4 w-1/2 bg-card rounded-md" />
								<div className="h-4 w-2/3 bg-card rounded-md" />
							</div>
						</div>
						<div className="flex gap-2">
							<div className="h-8 w-16 bg-card rounded-lg" />
							<div className="h-8 w-16 bg-card rounded-lg" />
							<div className="h-8 w-16 bg-card rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
