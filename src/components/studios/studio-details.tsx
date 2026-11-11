import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Check, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa6';
import type { Studio } from '@/types';
import { StudioBookingDialog } from '@/components/studios/studio-booking-dialog';

export interface StudioDetailsProps {
	studio: Studio;
}

export function StudioDetails({ studio }: StudioDetailsProps) {
	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Title & Location Header */}
			<div className="space-y-3">
				<h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">{studio.title}</h1>
				<div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
					<div className="flex items-center gap-1 font-semibold text-foreground">
						<FaStar className="size-3.5 text-amber-500" />
						<span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
						{studio.reviewCount !== undefined && studio.reviewCount > 0 && <span className="text-muted-foreground font-normal">({studio.reviewCount} reviews)</span>}
					</div>

					<span className="text-muted-foreground/50">•</span>

					<div className="flex items-center gap-1 text-muted-foreground">
						<MapPin className="size-3.5 text-muted-foreground/70" />
						<span>{studio.location}</span>
					</div>
				</div>
			</div>

			{/* Pricing & CTA Card */}
			<div className="rounded-2xl sm:rounded-3xl bg-secondary/70 dark:bg-card p-5 sm:p-6">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
					{/* Hourly Rate */}
					<div className="space-y-0.5">
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							{/* <DollarSign className="size-3.5" /> */}
							<span>Hourly Rate</span>
						</span>
						<div className="text-xl sm:text-2xl font-bold text-foreground">
							${studio.hourlyRate}
							<span className="text-xs sm:text-sm font-normal text-muted-foreground">/hr</span>
						</div>
					</div>

					{/* Security Deposit */}
					<div className="space-y-0.5">
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							{/* <ShieldCheck className="size-3.5" /> */}
							<span>Security Deposit</span>
						</span>
						<div className="text-xl sm:text-2xl font-bold text-foreground">${studio.securityDeposit || 0}</div>
					</div>

					{/* Max Capacity */}
					<div className="space-y-0.5">
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							{/* <Users className="size-3.5" /> */}
							<span>Capacity</span>
						</span>
						<div className="text-xl sm:text-2xl font-bold text-foreground flex gap-2 items-center">
							{studio.maxCapacity}
							<span className="text-xs sm:text-sm font-normal text-muted-foreground"> guests</span>
						</div>
					</div>

					{/* Instant Booking (Mobile only to fill 2x2 grid) */}
					<div className="space-y-0.5 sm:hidden">
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							<span>Booking</span>
						</span>
						<div className="text-xl font-bold text-foreground">Instant</div>
					</div>

					{/* Inline Book Now CTA */}
					<div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0">
						<StudioBookingDialog
							studio={studio}
							trigger={
								<Button flat3d size="lg" className="w-full font-semibold">
									<Calendar />
									Book Now
								</Button>
							}
						/>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="space-y-2.5">
				<h3 className="font-display text-lg sm:text-xl font-bold text-foreground">Details</h3>
				<p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed whitespace-pre-line">{studio.description}</p>
			</div>

			{/* Amenities Checklist */}
			{studio.amenities && studio.amenities.length > 0 && (
				<div className="space-y-3 pt-2">
					<h3 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
						<span>Amenities</span>
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{studio.amenities.map(amenity => (
							<div key={amenity} className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
								<Check className="size-4 text-primary shrink-0" />
								<span>{amenity}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Host Card */}
			<div className="rounded-2xl bg-secondary/70 dark:bg-card/50 p-4 sm:p-5 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 min-w-0">
					<Avatar size="default" className="size-11 sm:size-12 shrink-0">
						<AvatarImage src={studio.ownerAvatar} alt={studio.ownerName} />
						<AvatarFallback className="text-xs font-bold">{(studio.ownerName || 'Host').slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className="space-y-0.5 min-w-0">
						<p className="text-sm sm:text-base text-foreground truncate">
							Hosted by <span className="font-bold">{studio.ownerName}</span>
						</p>
						<p className="text-xs text-muted-foreground truncate flex items-center gap-1">
							{/* <Mail className="size-3 shrink-0" /> */}
							<span>{studio.ownerEmail}</span>
						</p>
					</div>
				</div>

				<span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-400/15 dark:bg-primary-700/15 text-primary shrink-0">Verified Host</span>
			</div>
		</div>
	);
}

