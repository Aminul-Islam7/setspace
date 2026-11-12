'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa6';
import type { Studio } from '@/types';
import { useState } from 'react';

export interface StudioReviewsProps {
	studio: Studio;
}

export function StudioReviews({ studio }: StudioReviewsProps) {
	const reviews = studio.reviews || [];
	const [visibleCount, setVisibleCount] = useState(3);
	// const [showForm, setShowForm] = useState(false);
	// const [userName, setUserName] = useState('');
	// const [rating, setRating] = useState(5);
	// const [comment, setComment] = useState('');
	// const [isSubmitting, setIsSubmitting] = useState(false);

	const avgRating = studio.rating.toFixed(1);
	const visibleReviews = reviews.slice(0, visibleCount);
	const hasMoreReviews = visibleCount < reviews.length;

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!userName.trim() || !comment.trim()) {
	// 		toast.error('Please provide your name and a brief review comment.');
	// 		return;
	// 	}

	// 	setIsSubmitting(true);

	// 	const newReview: StudioReview = {
	// 		userName: userName.trim(),
	// 		rating,
	// 		comment: comment.trim(),
	// 		createdAt: new Date().toISOString(),
	// 	};

	// 	const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

	// 	try {
	// 		if (apiUrl) {
	// 			const res = await fetch(`${apiUrl}/api/studios/${studio._id}/reviews`, {
	// 				method: 'POST',
	// 				headers: { 'Content-Type': 'application/json' },
	// 				body: JSON.stringify(newReview),
	// 			});
	// 			if (!res.ok) {
	// 				throw new Error('Failed to submit review');
	// 			}
	// 		}
	// 		setReviews(prev => [newReview, ...prev]);
	// 		toast.success('Thank you! Your verified review has been posted.');
	// 		setUserName('');
	// 		setComment('');
	// 		// setShowForm(false);
	// 	} catch {
	// 		// Optimistic add in offline/preview mode
	// 		setReviews(prev => [newReview, ...prev]);
	// 		toast.success('Review added successfully!');
	// 		setUserName('');
	// 		setComment('');
	// 		// setShowForm(false);
	// 	} finally {
	// 		setIsSubmitting(false);
	// 	}
	// };

	return (
		<section className="space-y-6 pt-4" aria-label="Creator Reviews">
			{/* Reviews Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-foreground/5">
				<h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Reviews ({reviews.length})</h3>
				<div className="flex items-center gap-1 text-foreground font-semibold text-xl sm:text-2xl">
					<FaStar />
					<span>{avgRating}</span>
				</div>

				{/* <Button
					variant={showForm ? 'ghost' : 'secondary'}
					size="sm"
					onClick={() => setShowForm(prev => !prev)}
					className="self-start sm:self-auto gap-2"
				>
					<MessageSquarePlus className="size-4" />
					<span>{showForm ? 'Close Form' : 'Write a Review'}</span>
				</Button> */}
			</div>

			{/* Review Form */}
			{/* {showForm && (
				<form onSubmit={handleSubmit} className="rounded-2xl bg-secondary/70 dark:bg-card p-5 sm:p-6 space-y-4">
					<h4 className="font-display text-base font-semibold text-foreground">
						Share Your On-Set Experience
					</h4>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="review-name" className="text-xs font-semibold text-foreground">
								Your Name / Production Handle
							</Label>
							<Input
								id="review-name"
								placeholder="e.g. Jordan Lee"
								value={userName}
								onChange={e => setUserName(e.target.value)}
								required
								className="h-10 text-sm"
							/>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground">
								Rating (1-5 Stars)
							</Label>
							<div className="flex items-center gap-1.5 h-10">
								{[1, 2, 3, 4, 5].map(star => (
									<button
										key={star}
										type="button"
										onClick={() => setRating(star)}
										className="p-1 text-amber-500 hover:scale-110 transition-transform focus:outline-none"
										aria-label={`Rate ${star} stars`}
									>
										{star <= rating ? <FaStar className="size-5" /> : <FaRegStar className="size-5" />}
									</button>
								))}
								<span className="text-xs font-medium text-muted-foreground pl-2">
									{rating} of 5
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
							placeholder="Describe acoustics, lighting, load-in convenience, host responsiveness..."
							value={comment}
							onChange={e => setComment(e.target.value)}
							required
							className="w-full rounded-lg bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary border-0"
						/>
					</div>

					<div className="flex justify-end gap-2 pt-1">
						<Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
							Cancel
						</Button>
						<Button flat3d type="submit" disabled={isSubmitting} size="sm">
							{isSubmitting ? 'Posting...' : 'Submit Review'}
						</Button>
					</div>
				</form>
			)} */}

			{/* Review List */}
			{reviews.length > 0 ? (
				<div className="space-y-4">
					{visibleReviews.map((review, idx) => (
						<article key={review._id || idx} className="rounded-2xl bg-secondary/70 dark:bg-card/60 p-4 sm:p-5 space-y-2.5">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2.5">
									<Avatar size="sm" className="size-7 shrink-0">
										<AvatarImage src={review.userAvatar} alt={review.userName} />
										<AvatarFallback className="text-[10px]">{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
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
								<div className="flex gap-2">
									<div className="flex items-center ">
										{Array.from({ length: 5 }).map((_, i) => (
											<FaStar key={i} className={`size-3.5 ${i < (review.rating || 5) ? 'text-foreground' : 'text-muted-foreground/30'}`} />
										))}
									</div>
									<span className="font-semibold">{review.rating}</span>
								</div>
							</div>

							<p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
						</article>
					))}

					{/* Showing Count Indicator */}
					<p className="text-xs text-muted-foreground pt-1">
						Showing {visibleReviews.length} of {reviews.length} reviews
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
				<div className="rounded-2xl bg-secondary/70 dark:bg-card/40 p-8 text-center text-muted-foreground">
					<p className="text-sm font-medium">No reviews yet for this workspace. Be the first to share your on-set experience!</p>
				</div>
			)}
		</section>
	);
}

