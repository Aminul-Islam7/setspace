import { StudioCardSkeleton } from '@/components/studios/studio-card';

export default function StudioLoading() {
	return (
		<main className="container py-6 sm:py-10 lg:py-12 animate-pulse">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12">
				{/* Left Column (Main Details & Gallery) */}
				<div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
					<div className="space-y-2.5 sm:space-y-3">
						{/* Breadcrumbs Skeleton */}
						<div className="h-4 w-44 rounded bg-muted" />

						{/* Carousel Skeleton */}
						<div className="space-y-3">
							<div className="w-full aspect-video rounded-2xl sm:rounded-3xl bg-muted" />
							{/* Thumbnails Skeleton */}
							<div className="flex gap-2.5 sm:gap-3 p-1.5 -m-1.5 overflow-x-auto scrollbar-none">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="size-16 sm:size-20 rounded-xl bg-muted shrink-0" />
								))}
							</div>
						</div>
					</div>

					{/* Title & Metadata Skeleton */}
					<div className="space-y-3 pt-2">
						<div className="flex gap-2">
							<div className="h-6 w-24 rounded-full bg-muted" />
							<div className="h-6 w-20 rounded-full bg-muted" />
						</div>
						<div className="h-8 sm:h-10 w-4/5 rounded-lg bg-muted" />
					</div>

					{/* Pricing & CTA Card Skeleton */}
					<div className="rounded-2xl sm:rounded-3xl bg-secondary/70 dark:bg-card p-5 sm:p-6">
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="space-y-1.5">
									<div className="h-4 w-16 rounded bg-muted" />
									<div className="h-7 w-20 rounded bg-muted" />
								</div>
							))}
							<div className="space-y-1.5 sm:hidden">
								<div className="h-4 w-16 rounded bg-muted" />
								<div className="h-7 w-20 rounded bg-muted" />
							</div>
							<div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0">
								<div className="h-10 sm:h-11 w-full rounded-xl bg-muted" />
							</div>
						</div>
					</div>

					{/* Host Card Skeleton */}
					<div className="rounded-2xl bg-secondary/70 dark:bg-card/50 p-4 sm:p-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="size-12 rounded-full bg-muted shrink-0" />
							<div className="space-y-1.5">
								<div className="h-4 w-32 rounded bg-muted" />
								<div className="h-3 w-40 rounded bg-muted" />
							</div>
						</div>
					</div>

					{/* Description Skeleton */}
					<div className="space-y-2">
						<div className="h-5 w-32 rounded bg-muted" />
						<div className="h-4 w-full rounded bg-muted" />
						<div className="h-4 w-5/6 rounded bg-muted" />
						<div className="h-4 w-4/6 rounded bg-muted" />
					</div>

					{/* Amenities Skeleton */}
					<div className="space-y-3 pt-2">
						<div className="h-5 w-36 rounded bg-muted" />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-10 rounded-xl bg-muted" />
							))}
						</div>
					</div>

					{/* Reviews Skeleton */}
					<div className="space-y-4 pt-6 border-t border-foreground/5">
						<div className="h-7 w-40 rounded bg-muted" />
						<div className="space-y-3">
							{Array.from({ length: 2 }).map((_, i) => (
								<div key={i} className="h-24 rounded-2xl bg-muted" />
							))}
						</div>
					</div>
				</div>

				{/* Right Column (6 Related Studios in Category) */}
				<aside className="lg:col-span-5 xl:col-span-4 space-y-6">
					<div className="h-6 w-48 rounded bg-muted" />
					<div className="flex flex-col gap-6 sm:gap-7">
						{Array.from({ length: 6 }).map((_, i) => (
							<StudioCardSkeleton key={i} />
						))}
					</div>
				</aside>
			</div>
		</main>
	);
}
