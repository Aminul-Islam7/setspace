'use client';

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StudioGalleryProps {
	title: string;
	image: string;
	gallery?: string[];
	category: string;
}

export function StudioGallery({ title, image, gallery = [], category }: StudioGalleryProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const images = useMemo(() => Array.from(new Set([image, ...gallery].filter(Boolean))), [image, gallery]);

	useEffect(() => {
		if (!api) return;

		const updateSelection = () => {
			setCurrentIndex(api.selectedScrollSnap());
			setCanScrollPrev(api.canScrollPrev());
			setCanScrollNext(api.canScrollNext());
		};

		updateSelection();
		api.on('select', updateSelection);
		api.on('reInit', updateSelection);

		return () => {
			api.off('select', updateSelection);
			api.off('reInit', updateSelection);
		};
	}, [api]);

	const handlePrev = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
			if (e.detail > 0) {
				(e.currentTarget as HTMLElement).blur();
			}
		}
		api?.scrollPrev();
	};

	const handleNext = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
			if (e.detail > 0) {
				(e.currentTarget as HTMLElement).blur();
			}
		}
		api?.scrollNext();
	};

	const handleThumbnailClick = (index: number) => {
		api?.scrollTo(index);
	};

	return (
		<div className="flex flex-col gap-3 sm:gap-4">
			{/* Main Carousel Viewport */}
			<div className="relative w-full aspect-video overflow-hidden rounded-2xl sm:rounded-3xl bg-muted group">
				<Carousel setApi={setApi} opts={{ loop: false }} className="w-full h-full">
					<CarouselContent className="h-full ml-0">
						{images.map((src, index) => (
							<CarouselItem key={index} className="relative w-full h-full pl-0 aspect-video">
								<Image src={src} alt={`${title} - photo ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation Arrows */}
					{images.length > 1 && (
						<>
							{/* Previous Image */}
							{canScrollPrev && (
								<div
									onClick={handlePrev}
									className="group/nav-prev absolute inset-y-0 left-0 z-20 flex w-16 sm:w-20 md:w-24 items-center justify-start pl-3 sm:pl-4 bg-gradient-to-r from-neutral-950/85 via-neutral-950/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
								>
									<Button
										type="button"
										variant="glass"
										flat3d
										shape="full"
										size="icon"
										aria-label="Previous image"
										onClick={handlePrev}
										className="relative z-10 sm:size-10 shadow-sm !bg-white/20 !text-white transform-gpu transition-transform duration-200 group-hover/nav-prev:scale-105 group-hover/nav-prev:!bg-white/30 group-active/nav-prev:scale-95"
									>
										<ChevronLeft className="size-5" />
									</Button>
								</div>
							)}

							{/* Next Image */}
							{canScrollNext && (
								<div
									onClick={handleNext}
									className="group/nav-next absolute inset-y-0 right-0 z-20 flex w-16 sm:w-20 md:w-24 items-center justify-end pr-3 sm:pr-4 bg-gradient-to-l from-neutral-950/85 via-neutral-950/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
								>
									<Button
										type="button"
										variant="glass"
										flat3d
										shape="full"
										size="icon"
										aria-label="Next image"
										onClick={handleNext}
										className="relative z-10 sm:size-10 shadow-sm !bg-white/20 !text-white transform-gpu transition-transform duration-200 group-hover/nav-next:scale-105 group-hover/nav-next:!bg-white/30 group-active/nav-next:scale-95"
									>
										<ChevronRight className="size-5" />
									</Button>
								</div>
							)}
						</>
					)}
				</Carousel>

				{/* Category Pill */}
				<div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-30 pointer-events-none">
					<span className="rounded-full bg-background/85 px-3 py-1 text-xs sm:text-sm font-semibold text-foreground backdrop-blur-md shadow-xs">{category}</span>
				</div>

				{/* Counter Pill */}
				{images.length > 1 && (
					<div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-30 pointer-events-none">
						<span className="rounded-lg bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
							{currentIndex + 1} / {images.length}
						</span>
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto p-1.5 -m-1.5 scrollbar-none" role="tablist" aria-label="Studio image thumbnails">
					{images.map((src, index) => {
						const isActive = index === currentIndex;
						return (
							<button key={index} type="button" role="tab" aria-selected={isActive} aria-label={`Show image ${index + 1}`} onClick={() => handleThumbnailClick(index)} className={cn('relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-xl bg-muted transition-all focus:outline-none', isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100' : 'opacity-70 hover:opacity-100')}>
								<Image src={src} alt={`${title} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
