'use client';

import { useState } from 'react';
import { AlertCircle, Calendar, Clock, Loader2, XCircle } from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import type { Booking } from '@/types';

interface CancelBookingDialogProps {
	booking: Booking | null;
	isOpen: boolean;
	onClose: () => void;
	onCancelled: (bookingId: string) => void;
}

export function CancelBookingDialog({ booking, isOpen, onClose, onCancelled }: CancelBookingDialogProps) {
	const [isCancelling, setIsCancelling] = useState(false);

	if (!booking) return null;

	const handleCancel = async () => {
		try {
			setIsCancelling(true);
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			if (apiUrl) {
				const token = await getTokenFromClient();
				const headers = {
					'Content-Type': 'application/json',
					authorization: `Bearer ${token}`,
				};

				// Call status update endpoint
				const res = await fetch(`${apiUrl}/api/bookings/${booking._id}`, {
					method: 'PATCH',
					headers,
					body: JSON.stringify({ status: 'Cancelled' }),
				});

				if (!res.ok) {
					// Fallback to explicit status route
					const fallbackRes = await fetch(`${apiUrl}/api/bookings/${booking._id}/status`, {
						method: 'PATCH',
						headers,
						body: JSON.stringify({ status: 'Cancelled' }),
					});

					if (!fallbackRes.ok) {
						const errData = await fallbackRes.json().catch(() => ({}));
						throw new Error(errData.message || 'Failed to cancel reservation.');
					}
				}
			}

			toast.success('Your reservation has been cancelled.');
			onCancelled(booking._id);
			onClose();
		} catch (error: unknown) {
			console.error('Cancel booking error:', error);
			const message = error instanceof Error ? error.message : 'Failed to cancel reservation.';
			toast.error(message);
		} finally {
			setIsCancelling(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && !isCancelling && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-2">
					<div className="size-11 rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
						<XCircle className="size-5" />
					</div>
					<DialogTitle className="font-display text-lg sm:text-xl font-bold text-foreground">
						Cancel Reservation
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground leading-relaxed">
						Are you sure you want to cancel your shoot booking at <strong className="text-foreground">{booking.studioTitle}</strong>?
					</DialogDescription>
				</DialogHeader>

				{/* Reservation Snapshot */}
				<div className="rounded-xl bg-card p-3.5 space-y-2 text-xs">
					<div className="flex items-center justify-between text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Calendar className="size-3.5 text-primary" />
							<span>Shoot Date:</span>
						</span>
						<span className="font-semibold text-foreground">{booking.bookingDate}</span>
					</div>

					<div className="flex items-center justify-between text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Clock className="size-3.5 text-primary" />
							<span>Reserved Hours:</span>
						</span>
						<span className="font-semibold text-foreground">
							{booking.startTime} – {booking.endTime} ({booking.totalHours} hrs)
						</span>
					</div>

					<div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/40">
						<span>Total Refundable Amount:</span>
						<span className="font-bold text-foreground text-sm">${booking.totalPrice}</span>
					</div>
				</div>

				<div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
					<AlertCircle className="size-4 shrink-0 mt-0.5" />
					<span>Cancelling this reservation will immediately release these production hours back to other creators.</span>
				</div>

				<DialogFooter className="flex-col-reverse sm:flex-row gap-2.5 pt-2">
					<DialogClose render={<Button type="button" variant="outline" disabled={isCancelling} className="w-full sm:w-auto" />}>
						Keep Reservation
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						disabled={isCancelling}
						onClick={handleCancel}
						className="w-full sm:w-auto font-medium"
					>
						{isCancelling ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Cancelling...</span>
							</>
						) : (
							<>
								<XCircle className="size-4" />
								<span>Confirm Cancellation</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
