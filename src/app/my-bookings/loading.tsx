import { MyBookingsSkeletonContent } from '@/components/bookings/my-bookings-view';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';

export default function MyBookingsLoading() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header Skeleton */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle="Bookings" />
				<div className="h-8 sm:h-9 w-48 bg-secondary rounded-lg animate-pulse" />
			</div>

			{/* Content Skeleton */}
			<MyBookingsSkeletonContent />
		</main>
	);
}
