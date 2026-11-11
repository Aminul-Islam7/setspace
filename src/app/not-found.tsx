import { Clapperboard, Compass, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { StudioCategory } from '@/types';

export const metadata: Metadata = {
	title: '404 - Scene Missing | SetSpace',
	description: 'The studio, soundstage, or scene you are looking for does not exist or has wrapped production.',
};

const POPULAR_CATEGORIES: StudioCategory[] = ['Photo Studio', 'Sound Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop', 'Exhibition Hall'];

export default function NotFound() {
	return (
		<main className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12 sm:py-16 lg:py-20">
			<div className="w-full max-w-2xl text-center space-y-8">
				{/* Icon & Status */}
				<div className="flex flex-col items-center gap-4">
					<div className="flex size-20 sm:size-24 items-center justify-center rounded-3x text-primary shadow-xs">
						<Clapperboard className="size-14 sm:size-20" />
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-semibold text-muted-foreground">404 &bull; STUDIO NOT FOUND</span>
				</div>

				{/* Headings */}
				<div className="space-y-3">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display">Cut! This Set Doesn&apos;t Exist</h1>
					<p className="mx-auto max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed font-body">The studio you&apos;re looking for may have wrapped production, moved to a different soundstage, or the URL was entered incorrectly.</p>
				</div>

				{/* Primary Actions */}
				<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
					<Button asChild variant="default" size="lg">
						<Link href="/">
							<Home className="size-4" />
							<span>Back to Homepage</span>
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/studios">
							<Compass className="size-4" />
							<span>Browse All Studios</span>
						</Link>
					</Button>
				</div>

				{/* Production Categories */}
				<div className="rounded-2xl sm:rounded-3xl bg-secondary/70 dark:bg-card p-5 sm:p-6 space-y-3 text-left">
					<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jump to a Production Category</div>
					<div className="flex flex-wrap gap-2">
						{POPULAR_CATEGORIES.map(category => (
							<Link key={category} href={`/studios?category=${encodeURIComponent(category)}`} className="rounded-full bg-background/80 hover:bg-background text-foreground/90 hover:text-foreground px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs">
								{category}
							</Link>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}

