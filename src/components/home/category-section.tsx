import { AudioWaveform, Camera, Clapperboard, Landmark, Mic, Palette, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { StudioCategory } from '@/types';

interface CategoryItem {
	name: StudioCategory;
	icon: LucideIcon;
	slug: string;
}

const CATEGORIES: CategoryItem[] = [
	{
		name: 'Photo Studio',
		icon: Camera,
		slug: 'photo-studio',
	},
	{
		name: 'Sound Stage',
		icon: Clapperboard,
		slug: 'sound-stage',
	},
	{
		name: 'Podcast Lounge',
		icon: Mic,
		slug: 'podcast-lounge',
	},
	{
		name: 'Music Suite',
		icon: AudioWaveform,
		slug: 'music-suite',
	},
	{
		name: 'Art Workshop',
		icon: Palette,
		slug: 'art-workshop',
	},
	{
		name: 'Exhibition Hall',
		icon: Landmark,
		slug: 'exhibition-hall',
	},
];

export function CategorySection() {
	return (
		<section className="container py-1 md:py-2" aria-label="Studio Categories">
			<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-2.5 lg:gap-3.5">
				{CATEGORIES.map(category => (
					<Button key={category.name} flat3d variant="secondary" className="group h-auto w-full flex-col items-center justify-center gap-3 sm:gap-3.5 md:gap-4 p-2 sm:p-3.5 xs:p-4 md:p-5 rounded-xl sm:rounded-2xl whitespace-normal transition-colors">
						<Link href={`/studios?category=${encodeURIComponent(category.name)}`} aria-label={`Browse ${category.name} listings`}>
							<category.icon className="size-6 sm:size-7 md:size-10 text-foreground/60 transition-colors group-hover:text-foreground/80" />
							<span className="text-[11px] sm:text-xs lg:text-base font-medium text-foreground/60 tracking-tight text-center leading-tight line-clamp-2 group-hover:text-foreground/80 transition-colors">{category.name}</span>
						</Link>
					</Button>
				))}
			</div>
		</section>
	);
}

