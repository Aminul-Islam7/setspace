'use client';

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import type { Studio } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface StudioCardProps {
	studio: Studio;
	className?: string;
}

export function StudioCard({ studio, className }: StudioCardProps) {
	const router = useRouter();
	const [api, setApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const hasGallery = Boolean(studio.gallery && studio.gallery.length > 0);
	const images = [studio.image, ...(studio.gallery || [])].filter(Boolean);

	useEffect(() => {
		if (!api) return;

		const updateSelection = () => {
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

	const handleCardClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest('button') || target.closest('a')) {
			return;
		}
		router.push(`/studios/${studio.slug || studio._id}`);
	};

	return (
		<article onClick={handleCardClick} className={cn('group relative flex flex-col space-y-3 cursor-pointer', className)}>
			{/* Media Carousel */}
			<div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-muted">
				<Carousel setApi={setApi} opts={{ loop: false }} className="w-full h-full">
					<CarouselContent className="h-full ml-0">
						{images.map((src, index) => (
							<CarouselItem key={index} className="relative w-full h-full pl-0 aspect-video">
								<Image
									src={src}
									alt={studio.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover"
								/>
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation Arrows */}
					{hasGallery && images.length > 1 && (
						<>
							{canScrollPrev && (
								<button
									type="button"
									aria-label="Previous image"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										api?.scrollPrev();
									}}
									className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-background/95 hover:bg-background text-foreground shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
								>
									<ChevronLeft className="size-4" />
								</button>
							)}

							{canScrollNext && (
								<button
									type="button"
									aria-label="Next image"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										api?.scrollNext();
									}}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-background/95 hover:bg-background text-foreground shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
								>
									<ChevronRight className="size-4" />
								</button>
							)}
						</>
					)}
				</Carousel>

				{/* Category Badge */}
				<div className="absolute top-3 left-3 z-10 pointer-events-none">
					<span className="rounded-full bg-background/85 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-foreground backdrop-blur-md shadow-xs">{studio.category}</span>
				</div>
			</div>

			{/* Studio Details */}
			<div className="flex flex-col space-y-2">
				{/* Host & Rating */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0">
						<Avatar size="sm" className="size-6 shrink-0">
							<AvatarImage src={studio.ownerAvatar} alt={studio.ownerName || 'Host'} />
							<AvatarFallback className="text-[10px]">{(studio.ownerName || 'H').slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span className="text-xs sm:text-sm font-medium text-foreground truncate">{studio.ownerName || 'Host'}</span>
					</div>

					<div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-foreground shrink-0">
						<FaStar />
						<span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
						{studio.reviewCount !== undefined && studio.reviewCount > 0 && <span className="text-muted-foreground font-normal">({studio.reviewCount})</span>}
					</div>
				</div>

				{/* Title */}
				<h3 className="font-body text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
					<Link href={`/studios/${studio.slug || studio._id}`}>{studio.title}</Link>
				</h3>

				{/* Rate & Location */}
				<div className="flex items-center justify-between gap-4 pt-0.5">
					<div className="text-base sm:text-lg font-bold text-foreground shrink-0">
						${studio.hourlyRate}
						<span className="text-xs sm:text-sm text-muted-foreground font-normal">/hr</span>
					</div>

					<div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground font-body min-w-0 truncate">
						<MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
						<span className="truncate">{studio.location}</span>
					</div>
				</div>
			</div>
		</article>
	);
}

export function StudioCardSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn('flex flex-col space-y-3 animate-pulse', className)}>
			{/* Image */}
			<div className="w-full aspect-video rounded-2xl bg-muted" />

			{/* Details */}
			<div className="flex flex-col space-y-2">
				{/* Host & Rating */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<div className="size-6 rounded-full bg-muted" />
						<div className="h-4 w-24 rounded-md bg-muted" />
					</div>
					<div className="h-4 w-12 rounded-md bg-muted" />
				</div>

				{/* Title */}
				<div className="space-y-1.5 py-0.5">
					<div className="h-4 sm:h-5 w-full rounded-md bg-muted" />
					<div className="h-4 sm:h-5 w-2/3 rounded-md bg-muted" />
				</div>

				{/* Rate & Location */}
				<div className="flex items-center justify-between gap-2 pt-0.5">
					<div className="h-5 w-16 rounded-md bg-muted" />
					<div className="h-4 w-28 rounded-md bg-muted" />
				</div>
			</div>
		</div>
	);
}
