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
		<main className="container flex min-h-[calc(100vh-10rem)] items-center justify-center pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
			<div className="w-full max-w-2xl mx-auto text-center space-y-8 sm:space-y-10">
				{/* Icon & Status */}
				<div className="flex flex-col items-center gap-3 sm:gap-4">
					<div className="flex size-20 sm:size-24 items-center justify-center text-primary">
						<Clapperboard className="size-16 sm:size-20" />
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-3.5 py-1 text-xs sm:text-sm font-semibold text-muted-foreground">404 &bull; STUDIO NOT FOUND</span>
				</div>

				{/* Headings */}
				<div className="space-y-2.5 sm:space-y-3">
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
				<div className="mx-auto max-w-xl space-y-3 pt-2 sm:pt-4">
					<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jump to a Production Category</p>
					<div className="flex flex-wrap items-center justify-center gap-2">
						{POPULAR_CATEGORIES.map(category => (
							<Button key={category} asChild variant="secondary" flat3d size="sm">
								<Link href={`/studios?category=${encodeURIComponent(category)}`}>{category}</Link>
							</Button>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}

