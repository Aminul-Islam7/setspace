'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { Loader2, MessageSquarePlus, Star } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { useSession } from '@/lib/auth-client';
import type { Booking, StudioReview } from '@/types';

interface PostReviewDialogProps {
	booking: Booking | null;
	isOpen: boolean;
	onClose: () => void;
	onReviewed: (studioId: string, review: StudioReview) => void;
}

export function PostReviewDialog({ booking, isOpen, onClose, onReviewed }: PostReviewDialogProps) {
	const { data: session } = useSession();
	const user = session?.user;

	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [comment, setComment] = useState('');
	const [userName, setUserName] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!booking) return null;

	const displayName = userName.trim() || user?.name || booking.userName || 'Verified Creator';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!comment.trim() || comment.trim().length < 10) {
			toast.error('Please write a review comment with at least 10 characters.');
			return;
		}

		try {
			setIsSubmitting(true);
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			const newReview: StudioReview = {
				userName: displayName,
				userEmail: user?.email || booking.userEmail,
				userAvatar: user?.image || undefined,
				rating,
				comment: comment.trim(),
				createdAt: new Date().toISOString(),
			};

			if (apiUrl) {
				const token = await getTokenFromClient();
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
				};
				if (token) {
					headers['authorization'] = `Bearer ${token}`;
				}

				const res = await fetch(`${apiUrl}/api/studios/${booking.studioId}/reviews`, {
					method: 'POST',
					headers,
					body: JSON.stringify(newReview),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to submit review.');
				}
			}

			toast.success('Thank you! Your verified review has been posted.');
			onReviewed(booking.studioId, newReview);
			setComment('');
			setRating(5);
			onClose();
		} catch (error: unknown) {
			console.error('Submit review error:', error);
			const message = error instanceof Error ? error.message : 'Failed to submit review.';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const currentRating = hoverRating !== null ? hoverRating : rating;

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && !isSubmitting && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="space-y-2">
					<div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
						<MessageSquarePlus className="size-5" />
					</div>
					<DialogTitle className="font-display text-lg sm:text-xl font-bold text-foreground">
						Rate & Review Workspace
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground leading-relaxed">
						Share feedback on your completed shoot reservation at <strong className="text-foreground">{booking.studioTitle}</strong>.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-1">
					{/* Star Rating Picker */}
					<div className="space-y-2">
						<Label className="text-xs font-semibold text-foreground">
							Overall Score ({currentRating} of 5 Stars)
						</Label>
						<div className="flex items-center gap-1.5 p-3 rounded-xl bg-secondary dark:bg-card">
							{[1, 2, 3, 4, 5].map(star => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(null)}
									className="p-1 text-amber-500 hover:scale-110 transition-transform focus:outline-none"
									aria-label={`Rate ${star} stars`}
								>
									<FaStar
										className={`size-6 ${
											star <= currentRating
												? 'text-amber-500'
												: 'text-muted-foreground/30'
										}`}
									/>
								</button>
							))}
							<span className="text-xs font-medium text-muted-foreground pl-3">
								{currentRating === 5 && 'Outstanding studio setup'}
								{currentRating === 4 && 'Great shoot experience'}
								{currentRating === 3 && 'Met standard requirements'}
								{currentRating === 2 && 'Needs improvement'}
								{currentRating === 1 && 'Unsatisfactory'}
							</span>
						</div>
					</div>

					{/* Reviewer Handle / Name */}
					<div className="space-y-1.5">
						<Label htmlFor="post-review-name" className="text-xs font-semibold text-foreground">
							Your Production Handle / Name
						</Label>
						<Input
							id="post-review-name"
							placeholder={displayName}
							value={userName}
							onChange={e => setUserName(e.target.value)}
							className="h-10 text-sm"
						/>
					</div>

					{/* Review Comment */}
					<div className="space-y-1.5">
						<Label htmlFor="post-review-comment" className="text-xs font-semibold text-foreground">
							On-Set Experience Feedback
						</Label>
						<textarea
							id="post-review-comment"
							rows={4}
							placeholder="Describe lighting grid, power distribution, sound isolation, load-in convenience, host hospitality..."
							value={comment}
							onChange={e => setComment(e.target.value)}
							required
							className="w-full rounded-xl bg-secondary dark:bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-border/40 resize-none"
						/>
						<p className="text-[11px] text-muted-foreground">Minimum 10 characters.</p>
					</div>

					<DialogFooter className="flex-col-reverse sm:flex-row gap-2.5 pt-2">
						<DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} className="w-full sm:w-auto" />}>
							Cancel
						</DialogClose>
						<Button
							type="submit"
							variant="default"
							flat3d
							disabled={isSubmitting || comment.trim().length < 10}
							className="w-full sm:w-auto font-semibold"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									<span>Posting Review...</span>
								</>
							) : (
								<>
									<Star className="size-4 fill-current" />
									<span>Submit Review</span>
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
