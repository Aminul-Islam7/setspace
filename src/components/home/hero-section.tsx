'use client';

import { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface StudioSlide {
	id: string;
	imageUrl: string;
	alt: string;
}

const HERO_SLIDES: StudioSlide[] = [
	{
		id: 'photo-studio',
		imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop',
		alt: 'Dark aesthetic photo cyclorama studio with professional grid lights',
	},
	{
		id: 'sound-stage',
		imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1600&auto=format&fit=crop',
		alt: 'Dark cinematic soundstage with camera cranes and ceiling riggers',
	},
	{
		id: 'podcast-lounge',
		imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1600&auto=format&fit=crop',
		alt: 'Acoustic dark broadcast podcast studio with broadcast microphones',
	},
	{
		id: 'music-suite',
		imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1600&auto=format&fit=crop',
		alt: 'Dark ambient music production control room with analog mixing console',
	},
	{
		id: 'art-workshop',
		imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop',
		alt: 'Moodily lit industrial artist studio workshop with raw materials',
	},
	{
		id: 'exhibition-hall',
		imageUrl: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?q=80&w=1600&auto=format&fit=crop',
		alt: 'Dark brutalist architectural gallery hall with dramatic spotlighting',
	},
];

export function HeroSection() {
	const [activeSlide, setActiveSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10" aria-label="SetSpace Hero Showcase">
			<div className="dark relative rounded-3xl overflow-hidden bg-neutral-950">
				{/* Background Underlying Images */}
				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					{HERO_SLIDES.map((slide, index) => {
						const isActive = index === activeSlide;
						return (
							<div key={slide.id} className={cn('absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out', isActive ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
								<Image src={slide.imageUrl} alt={slide.alt} fill priority={index === 0} className="object-cover object-center lg:object-right" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px" />
							</div>
						);
					})}
				</div>

				{/* Dark Gradient Overlay */}
				<div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-b from-neutral-950/90 via-neutral-950/80 to-neutral-950/20 lg:bg-linear-to-r lg:from-neutral-950/85 lg:via-neutral-950/80 lg:to-transparent" aria-hidden="true" />

				{/* Foreground Content */}
				<div className="relative z-20 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
					<div className="max-w-2xl space-y-5 sm:space-y-6">
						{/* Title */}
						<h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.2] sm:leading-[1.15]">
							<span className="inline-block">Book Iconic</span> <span className="inline-block text-gradient-primary">Production Spaces</span>
							<br />
							<span className="inline-block">By The Hour.</span>
						</h1>

						{/* Description */}
						<p className="text-base sm:text-lg text-neutral-300 font-body leading-relaxed max-w-xl">Discover and reserve verified creative studios with transparent hourly rates and instant booking.</p>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
							<Button className="w-full sm:w-auto" size="xl" variant="default">
								<Link href="/studios">
									<span>Explore Studios</span>
									<ArrowRight />
								</Link>
							</Button>

							<Button className="w-full sm:w-auto" size="xl" variant="glass">
								<Link href="/add-studio">
									<span>Host Your Space</span>
								</Link>
							</Button>
						</div>
					</div>

					{/* Slider Dots */}
					<div className="pt-6 md:pt-4 flex justify-center">
						<div className="flex items-center gap-2" role="tablist" aria-label="Studio Category Slider Controls">
							{HERO_SLIDES.map((slide, index) => {
								const isActive = index === activeSlide;
								return <button key={slide.id} type="button" onClick={() => setActiveSlide(index)} className={cn('h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400', isActive ? 'w-7 bg-neutral-200/80' : 'w-1.5 bg-neutral-600 hover:bg-neutral-400')} aria-label={`View slide ${index + 1}`} aria-selected={isActive} role="tab" />;
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

