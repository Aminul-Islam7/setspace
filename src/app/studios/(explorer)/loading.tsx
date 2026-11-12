import { StudioCardSkeleton } from '@/components/studios/studio-card';

export default function StudiosLoading() {
	return (
		<div className="container pt-3 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12 space-y-6 sm:space-y-8 animate-pulse">
			{/* Breadcrumbs */}
			<div className="flex items-center gap-2 h-5">
				<div className="size-4 rounded bg-muted" />
				<div className="h-3.5 w-2 rounded-xs bg-muted" />
				<div className="h-4 w-16 rounded bg-muted" />
			</div>

			{/* Search & Filter Controls */}
			<div className="space-y-3">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
					<div className="h-10 sm:h-11 flex-1 rounded-lg bg-secondary/80 border border-border/40" />
					<div className="h-10 sm:h-11 w-44 sm:w-56 rounded-lg bg-secondary border border-border/40" />
				</div>
			</div>

			{/* Studio Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12">
				{Array.from({ length: 12 }).map((_, i) => (
					<StudioCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}
