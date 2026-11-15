'use client';

import { Printer, Receipt, ShieldCheck } from 'lucide-react';
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
import type { Booking } from '@/types';

interface BookingReceiptDialogProps {
	booking: Booking | null;
	isOpen: boolean;
	onClose: () => void;
}

export function BookingReceiptDialog({ booking, isOpen, onClose }: BookingReceiptDialogProps) {
	if (!booking) return null;

	const handlePrint = () => {
		window.print();
	};

	const receiptId = `SS-${booking._id ? booking._id.slice(-6).toUpperCase() : 'REC'}`;

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="space-y-1.5 text-left border-b border-border/40 pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
								<Receipt className="size-4" />
							</div>
							<span className="font-display font-bold text-sm tracking-tight text-foreground">
								SETSPACE INVOICE
							</span>
						</div>
						<span className="text-xs font-mono font-semibold text-primary px-2.5 py-1 rounded-md bg-primary/10">
							#{receiptId}
						</span>
					</div>
					<DialogTitle className="font-display text-xl sm:text-2xl font-bold text-foreground pt-1">
						Booking Receipt
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Official payment record for workspace reservation on SetSpace.
					</DialogDescription>
				</DialogHeader>

				{/* Invoice Content Body */}
				<div className="space-y-4 py-2 text-xs sm:text-sm">
					{/* Creator & Studio Info */}
					<div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-card">
						<div className="space-y-1">
							<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
								Reserved By
							</p>
							<p className="font-bold text-foreground truncate">{booking.userName}</p>
							<p className="text-xs text-muted-foreground truncate">{booking.userEmail}</p>
						</div>

						<div className="space-y-1">
							<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
								Workspace
							</p>
							<p className="font-bold text-foreground truncate">{booking.studioTitle}</p>
							<p className="text-xs text-muted-foreground truncate">{booking.location}</p>
						</div>
					</div>

					{/* Schedule Details */}
					<div className="p-3.5 rounded-xl bg-card space-y-2">
						<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Shoot Schedule
						</p>
						<div className="grid grid-cols-3 gap-2 text-xs">
							<div>
								<span className="text-muted-foreground block text-[11px]">Shoot Date</span>
								<span className="font-semibold text-foreground">{booking.bookingDate}</span>
							</div>
							<div>
								<span className="text-muted-foreground block text-[11px]">Time Window</span>
								<span className="font-semibold text-foreground">
									{booking.startTime} – {booking.endTime}
								</span>
							</div>
							<div>
								<span className="text-muted-foreground block text-[11px]">Total Hours</span>
								<span className="font-semibold text-foreground">{booking.totalHours} hrs</span>
							</div>
						</div>
					</div>

					{/* Itemized Financial Breakdown */}
					<div className="rounded-xl bg-card p-3.5 space-y-2.5">
						<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Itemized Charges
						</p>
						<div className="space-y-2 text-xs divide-y divide-border/30">
							<div className="flex justify-between items-center pt-1">
								<span className="text-muted-foreground">
									Studio Rental (${booking.hourlyRate} x {booking.totalHours} hrs)
								</span>
								<span className="font-semibold text-foreground">
									${booking.hourlyRate * booking.totalHours}
								</span>
							</div>
							<div className="flex justify-between items-center pt-2">
								<span className="text-muted-foreground flex items-center gap-1">
									<ShieldCheck className="size-3 text-emerald-500" />
									<span>Refundable Security Deposit</span>
								</span>
								<span className="font-semibold text-foreground">${booking.securityDeposit}</span>
							</div>
							<div className="flex justify-between items-center pt-2.5 text-sm font-bold">
								<span className="text-foreground">Total Paid / Authorized</span>
								<span className="text-primary text-base font-display">${booking.totalPrice}</span>
							</div>
						</div>
					</div>

					{/* Status Footer Pill */}
					<div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
						<span>Booking Status:</span>
						<span className="font-semibold uppercase text-foreground">{booking.status}</span>
					</div>
				</div>

				<DialogFooter className="flex-col-reverse sm:flex-row gap-2.5 border-t border-border/40 pt-4">
					<DialogClose render={<Button type="button" variant="outline" className="w-full sm:w-auto" />}>
						Close
					</DialogClose>
					<Button
						type="button"
						variant="secondary"
						onClick={handlePrint}
						className="w-full sm:w-auto font-medium"
					>
						<Printer className="size-4" />
						<span>Print Receipt</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
