import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Studio } from '@/types';
import { StudioCard } from '@/components/studios/studio-card';

export interface RelatedStudiosProps {
	studios: Studio[];
	category: string;
}

export function RelatedStudios({ studios, category }: RelatedStudiosProps) {
	if (!studios || studios.length === 0) {
		return null;
	}

	return (
		<aside className="space-y-6" aria-label="Similar Studios in Same Category">
			{/* Aside Header */}
			<div className="flex items-center justify-between gap-2 pb-2 border-b border-foreground/8">
				<div>
					<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">More {category}s</h3>
				</div>

				<Link href={`/studios?category=${encodeURIComponent(category)}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
					<span>View all</span>
					<ArrowRight className="size-3" />
				</Link>
			</div>

			{/* Vertical Stack of 6 Cards */}
			<div className="flex flex-col gap-6 sm:gap-7">
				{studios.slice(0, 6).map((studio, index) => (
					<StudioCard key={studio._id} studio={studio} priority={index === 0} />
				))}
			</div>
		</aside>
	);
}

