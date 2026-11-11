'use client';

import { StudioCard, StudioCardSkeleton } from '@/components/studios/studio-card';
import { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Studio } from '@/types';

export function FeaturedStudiosSection() {
	const [studios, setStudios] = useState<Studio[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
		const endpoint = apiUrl ? `${apiUrl}/api/studios?top=6` : '/api/studios?top=6';

		let isMounted = true;
		fetch(endpoint)
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch studios');
				return res.json();
			})
			.then(data => {
				if (isMounted) {
					const list = Array.isArray(data) ? data : data.studios || [];
					setStudios(list.slice(0, 6));
				}
			})
			.catch(() => {
				if (isMounted) setStudios([]);
			})
			.finally(() => {
				if (isMounted) setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<section className="container py-8 sm:py-12 lg:py-16" aria-label="Featured Studios">
			{/* Section Header */}
			<div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
				<div className="space-y-1 sm:space-y-1.5">
					<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Popular Studios</h2>
				</div>

				<Button variant="ghost">
					<Link href="/studios" className="sm:self-auto gap-1 text-xs sm:text-sm flex items-center">
						<span>Explore all</span>
						<ArrowRight className="size-3.5" />
					</Link>
				</Button>
			</div>

			{/* Skeleton Grid */}
			{loading && studios.length === 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-14">
					{Array.from({ length: 6 }).map((_, i) => (
						<StudioCardSkeleton key={i} />
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && studios.length === 0 && (
				<div className="rounded-2xl bg-card p-12 text-center text-muted-foreground">
					<p className="text-sm font-medium">No featured studios available at this time.</p>
				</div>
			)}

			{/* Studio Grid */}
			{studios.length > 0 && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-14">
						{studios.map(studio => (
							<StudioCard key={studio._id} studio={studio} />
						))}
					</div>

					{/* Explore All CTA */}
					<div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
						<Button size="lg" variant="secondary" className="w-full sm:w-auto">
							<Link href="/studios" className="flex items-center gap-2">
								<span>Explore all studios</span>
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
				</>
			)}
		</section>
	);
}
