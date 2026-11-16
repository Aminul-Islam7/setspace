'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import type { Booking, Studio, StudioReview } from '@/types';

export interface StudioReviewsProps {
	studio: Studio;
}

export function StudioReviews({ studio }: StudioReviewsProps) {
	const { data: session } = useSession();
	const user = session?.user;

	const [reviewsList, setReviewsList] = useState<StudioReview[]>(studio.reviews || []);
	const [visibleCount, setVisibleCount] = useState(3);
	const [showForm, setShowForm] = useState(false);
	const [userName, setUserName] = useState('');
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Booker eligibility state
	const [hasCompletedBooking, setHasCompletedBooking] = useState(false);

	// Check if user has already reviewed this studio
	const userEmail = user?.email;
	const currentUserName = user?.name;

	const hasAlreadyReviewed = Boolean(
		userEmail &&
			reviewsList.some(
				r =>
					(r.userEmail && r.userEmail.toLowerCase() === userEmail.toLowerCase()) ||
					(r.userName && currentUserName && r.userName.toLowerCase() === currentUserName.toLowerCase())
			)
	);

	// Verify if the logged-in user has a completed booking for this studio
	useEffect(() => {
		if (!userEmail) return;

		let isMounted = true;
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

		getTokenFromClient()
			.then(token =>
				fetch(`${apiUrl}/api/users/me/bookings?email=${encodeURIComponent(userEmail)}`, {
					headers: {
						'x-user-email': userEmail,
						...(token ? { authorization: `Bearer ${token}` } : {}),
					},
					cache: 'no-store',
				})
			)
			.then(res => (res.ok ? res.json() : { data: [] }))
			.then(json => {
				if (!isMounted) return;
				const userBookings: Booking[] = json.data || [];
				const completed = userBookings.some(
					b => b.studioId === studio._id && b.status === 'Completed'
				);
				setHasCompletedBooking(completed);
			})
			.catch(() => {
				if (isMounted) setHasCompletedBooking(false);
			});

		return () => {
			isMounted = false;
		};
	}, [userEmail, studio._id]);

	const avgRating =
		reviewsList.length > 0
			? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
			: studio.rating.toFixed(1);

	const visibleReviews = reviewsList.slice(0, visibleCount);
	const hasMoreReviews = visibleCount < reviewsList.length;
	const currentRating = hoverRating !== null ? hoverRating : rating;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!comment.trim() || comment.trim().length < 10) {
			toast.error('Please write a review comment with at least 10 characters.');
			return;
		}

		setIsSubmitting(true);

		const newReview: StudioReview = {
			userName: (userName.trim() || user?.name || 'Verified Creator'),
			userEmail: user?.email,
			userAvatar: user?.image || undefined,
			rating,
			comment: comment.trim(),
			createdAt: new Date().toISOString(),
		};

		const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

		try {
			if (apiUrl) {
				const token = await getTokenFromClient();
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
				};
				if (token) headers['authorization'] = `Bearer ${token}`;

				const res = await fetch(`${apiUrl}/api/studios/${studio._id}/reviews`, {
					method: 'POST',
					headers,
					body: JSON.stringify(newReview),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to submit review');
				}
			}

			setReviewsList(prev => [newReview, ...prev]);
			toast.success('Thank you! Your verified review has been posted.');
			setUserName('');
			setComment('');
			setShowForm(false);
		} catch (error: unknown) {
			console.error('Submit review error:', error);
			const message = error instanceof Error ? error.message : 'Failed to submit review.';
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="space-y-6 pt-4" aria-label="Creator Reviews">
			{/* Reviews Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-foreground/5">
				<div className="flex items-center gap-3">
					<h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
						Reviews ({reviewsList.length})
					</h3>
					<div className="flex items-center gap-1 text-foreground font-semibold text-lg sm:text-xl">
						<FaStar className="size-4 text-amber-500" />
						<span>{avgRating}</span>
					</div>
				</div>

				{/* Review Action State */}
				<div>
					{hasAlreadyReviewed ? (
						<span className="text-xs text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border/40 font-medium">
							<CheckCircle2 className="size-3.5 text-emerald-500" />
							<span>You reviewed this workspace</span>
						</span>
					) : hasCompletedBooking ? (
						<Button
							variant={showForm ? 'ghost' : 'default'}
							size="sm"
							flat3d
							onClick={() => setShowForm(prev => !prev)}
							className="self-start sm:self-auto gap-2 font-medium"
						>
							<MessageSquarePlus className="size-4" />
							<span>{showForm ? 'Close Form' : 'Write a Review'}</span>
						</Button>
					) : null}
				</div>
			</div>

			{/* Review Form (Only for eligible completed bookers who have not reviewed) */}
			{showForm && hasCompletedBooking && !hasAlreadyReviewed && (
				<form onSubmit={handleSubmit} className="rounded-2xl bg-secondary dark:bg-card p-5 sm:p-6 space-y-4">
					<div className="space-y-1">
						<h4 className="font-display text-base font-semibold text-foreground">
							Share Your On-Set Experience
						</h4>
						<p className="text-xs text-muted-foreground">
							Your verified review helps fellow creators evaluate acoustics, lighting, and workspace amenities.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="review-name" className="text-xs font-semibold text-foreground">
								Your Name / Production Handle
							</Label>
							<Input
								id="review-name"
								placeholder={user?.name || 'e.g. Jordan Lee'}
								value={userName}
								onChange={e => setUserName(e.target.value)}
								className="h-10 text-sm"
							/>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground">
								Rating ({currentRating} of 5 Stars)
							</Label>
							<div className="flex items-center gap-1.5 h-10">
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
											className={`size-5 ${
												star <= currentRating
													? 'text-amber-500'
													: 'text-muted-foreground/30'
											}`}
										/>
									</button>
								))}
								<span className="text-xs font-medium text-muted-foreground pl-2">
									{currentRating} of 5
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="review-comment" className="text-xs font-semibold text-foreground">
							Detailed Review
						</Label>
						<textarea
							id="review-comment"
							rows={3}
							placeholder="Describe acoustics, lighting grid, load-in convenience, host responsiveness..."
							value={comment}
							onChange={e => setComment(e.target.value)}
							required
							className="w-full rounded-lg bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary border border-border/40 resize-none"
						/>
						<p className="text-[11px] text-muted-foreground">Minimum 10 characters.</p>
					</div>

					<div className="flex justify-end gap-2 pt-1">
						<Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
							Cancel
						</Button>
						<Button flat3d type="submit" disabled={isSubmitting || comment.trim().length < 10} size="sm">
							{isSubmitting ? 'Posting...' : 'Submit Review'}
						</Button>
					</div>
				</form>
			)}

			{/* Review List */}
			{reviewsList.length > 0 ? (
				<div className="space-y-4">
					{visibleReviews.map((review, idx) => (
						<article key={review._id || idx} className="rounded-2xl bg-secondary dark:bg-card p-4 sm:p-5 space-y-2.5">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2.5">
									<Avatar size="sm" className="size-7 shrink-0">
										<AvatarImage src={review.userAvatar} alt={review.userName} />
										<AvatarFallback className="text-[10px]">{(review.userName || 'CR').slice(0, 2).toUpperCase()}</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-semibold text-foreground leading-tight">{review.userName}</p>
										<p className="text-[11px] text-muted-foreground">
											{review.createdAt
												? new Date(review.createdAt).toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric',
													})
												: 'Recent review'}
										</p>
									</div>
								</div>

								{/* Star Rating */}
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-0.5">
										{Array.from({ length: 5 }).map((_, i) => (
											<FaStar
												key={i}
												className={`size-3.5 ${
													i < (review.rating || 5)
														? 'text-amber-500'
														: 'text-muted-foreground/30'
												}`}
											/>
										))}
									</div>
									<span className="font-semibold text-xs sm:text-sm text-foreground">{review.rating}</span>
								</div>
							</div>

							<p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
						</article>
					))}

					{/* Showing Count Indicator */}
					<p className="text-xs text-muted-foreground pt-1">
						Showing {visibleReviews.length} of {reviewsList.length} reviews
					</p>

					{/* Show More Reviews Button */}
					{hasMoreReviews && (
						<div className="flex justify-center pt-2">
							<Button variant="secondary" onClick={() => setVisibleCount(prev => prev + 3)} className="w-full sm:w-auto">
								Show more reviews
							</Button>
						</div>
					)}
				</div>
			) : (
				<div className="rounded-2xl bg-secondary dark:bg-card p-8 text-center text-muted-foreground">
					<p className="text-sm font-medium">No reviews yet for this workspace. Be the first to share your on-set experience!</p>
				</div>
			)}
		</section>
	);
}
