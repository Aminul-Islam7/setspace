import { Skeleton } from '@/components/ui/skeleton';

export default function CreateStudioLoading() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Header Skeleton */}
			<div className="space-y-3 sm:space-y-4">
				<Skeleton className="h-4 w-36 rounded-md" />
				<div className="space-y-1.5">
					<Skeleton className="h-8 sm:h-9 w-64 sm:w-80 rounded-lg" />
					<Skeleton className="h-4 w-full max-w-xl rounded-md" />
				</div>
			</div>

			{/* Form & Live Preview Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
				{/* Left Form Panels Skeleton */}
				<div className="lg:col-span-8 space-y-6 sm:space-y-8">
					{/* Card 1: Basic Information */}
					<div className="rounded-2xl bg-secondary/70 p-5 sm:p-7 space-y-6">
						<div className="space-y-1.5">
							<Skeleton className="h-6 w-44 rounded-md" />
							<Skeleton className="h-4 w-72 rounded-md" />
						</div>
						<div className="space-y-5">
							<div className="space-y-2">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div className="space-y-2">
									<Skeleton className="h-4 w-24 rounded-md" />
									<Skeleton className="h-9 w-full rounded-lg" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-32 rounded-md" />
									<Skeleton className="h-9 w-full rounded-lg" />
								</div>
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-24 w-full rounded-lg" />
							</div>
						</div>
					</div>

					{/* Card 2: Rates & Specs */}
					<div className="rounded-2xl bg-secondary/70 p-5 sm:p-7 space-y-6">
						<div className="space-y-1.5">
							<Skeleton className="h-6 w-48 rounded-md" />
							<Skeleton className="h-4 w-80 rounded-md" />
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
							<div className="space-y-2">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-32 rounded-md" />
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
						</div>
					</div>

					{/* Card 3: Media */}
					<div className="rounded-2xl bg-secondary/70 p-5 sm:p-7 space-y-6">
						<div className="space-y-1.5">
							<Skeleton className="h-6 w-52 rounded-md" />
							<Skeleton className="h-4 w-84 rounded-md" />
						</div>
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row gap-4 items-start">
								<div className="flex-1 w-full space-y-2">
									<Skeleton className="h-4 w-36 rounded-md" />
									<Skeleton className="h-9 w-full rounded-lg" />
								</div>
								<Skeleton className="w-full sm:w-40 aspect-video rounded-xl" />
							</div>
						</div>
					</div>

					{/* Card 4: Amenities */}
					<div className="rounded-2xl bg-secondary/70 p-5 sm:p-7 space-y-6">
						<div className="space-y-1.5">
							<Skeleton className="h-6 w-44 rounded-md" />
							<Skeleton className="h-4 w-72 rounded-md" />
						</div>
						<div className="flex flex-wrap gap-2 pt-1">
							{Array.from({ length: 12 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-28 rounded-lg" />
							))}
						</div>
					</div>

					{/* Card 5: Host Info */}
					<div className="rounded-2xl bg-secondary/70 p-5 sm:p-7 space-y-6">
						<div className="space-y-1.5">
							<Skeleton className="h-6 w-56 rounded-md" />
							<Skeleton className="h-4 w-80 rounded-md" />
						</div>
						<Skeleton className="h-16 w-full rounded-xl" />
					</div>
				</div>

				{/* Right Sticky Preview Skeleton */}
				<div className="lg:col-span-4">
					<div className="lg:sticky lg:top-24">
						<div className="rounded-2xl bg-secondary/70 p-5 sm:p-6 space-y-5">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-32 rounded-md" />
								<Skeleton className="h-4 w-16 rounded-md" />
							</div>
							<div className="rounded-2xl bg-background/90 p-3 space-y-3">
								<Skeleton className="w-full aspect-video rounded-2xl" />
								<div className="space-y-2 px-1">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<Skeleton className="size-6 rounded-full" />
											<Skeleton className="h-3.5 w-24 rounded-md" />
										</div>
										<Skeleton className="h-3.5 w-12 rounded-md" />
									</div>
									<Skeleton className="h-5 w-48 rounded-md" />
									<div className="flex justify-between pt-1">
										<Skeleton className="h-4 w-16 rounded-md" />
										<Skeleton className="h-3.5 w-24 rounded-md" />
									</div>
								</div>
							</div>
							<Skeleton className="h-11 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
