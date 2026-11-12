import { StudioCardSkeleton } from '@/components/studios/studio-card';

export default function StudioLoading() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-10 lg:pb-12 animate-pulse">
			{/* Studio Details Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
				{/* Main Content */}
				<div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
					<div className="space-y-3.5 sm:space-y-5">
						{/* Breadcrumbs */}
						<div className="flex items-center gap-2 h-5">
							<div className="size-4 rounded bg-muted" />
							<div className="h-3.5 w-2 rounded-xs bg-muted" />
							<div className="h-4 w-14 rounded bg-muted" />
							<div className="h-3.5 w-2 rounded-xs bg-muted" />
							<div className="h-4 w-24 rounded bg-muted" />
						</div>

						{/* Gallery */}
						<div className="space-y-3 sm:space-y-4">
							<div className="w-full aspect-video rounded-2xl bg-muted" />
							{/* Thumbnails */}
							<div className="flex gap-2.5 sm:gap-3 p-1.5 -m-1.5 overflow-x-auto scrollbar-none">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="size-16 sm:size-20 rounded-xl bg-muted shrink-0" />
								))}
							</div>
						</div>
					</div>

					{/* Title & Header */}
					<div className="space-y-3">
						<div className="h-8 sm:h-10 lg:h-11 w-3/4 rounded-lg bg-muted" />
						<div className="flex items-center gap-2 h-5">
							<div className="h-4 w-12 rounded bg-muted" />
							<div className="size-1 rounded-full bg-muted" />
							<div className="h-4 w-28 rounded bg-muted" />
						</div>
					</div>

					{/* Pricing & Booking */}
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

					{/* Description */}
					<div className="space-y-2.5">
						<div className="h-6 w-20 rounded bg-muted" />
						<div className="space-y-2">
							<div className="h-4 w-full rounded bg-muted" />
							<div className="h-4 w-5/6 rounded bg-muted" />
							<div className="h-4 w-4/6 rounded bg-muted" />
						</div>
					</div>

					{/* Amenities */}
					<div className="space-y-3 pt-2">
						<div className="h-6 w-28 rounded bg-muted" />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="flex items-center gap-2 h-5">
									<div className="size-4 rounded bg-muted shrink-0" />
									<div className="h-4 w-32 rounded bg-muted" />
								</div>
							))}
						</div>
					</div>

					{/* Reviews */}
					<div className="space-y-4 pt-6 border-t border-border/40">
						<div className="h-7 w-40 rounded bg-muted" />
						<div className="space-y-3">
							{Array.from({ length: 2 }).map((_, i) => (
								<div key={i} className="h-24 rounded-2xl bg-muted" />
							))}
						</div>
					</div>
				</div>

				{/* Related Studios */}
				<div className="lg:col-span-5 xl:col-span-4">
					<div className="lg:sticky lg:top-24 space-y-4">
						<div className="space-y-1.5">
							<div className="h-7 w-48 rounded bg-muted" />
							<div className="h-4 w-64 rounded bg-muted" />
						</div>
						<div className="flex flex-col gap-6 sm:gap-8 pt-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<StudioCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
