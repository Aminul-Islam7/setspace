'use client';

import { AlertCircle, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { Control, useWatch } from 'react-hook-form';
import { StudioCard } from '@/components/studios/studio-card';
import { Button } from '@/components/ui/button';
import { isImgbbUrl, type CreateStudioFormValues } from './types';
import type { Studio, StudioCategory } from '@/types';
import { useMemo } from 'react';

interface StudioLivePreviewProps {
	control: Control<CreateStudioFormValues>;
	isSubmitting: boolean;
	formError: string | null;
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
}

export function StudioLivePreview({ control, isSubmitting, formError, user }: StudioLivePreviewProps) {
	const values = useWatch({ control });

	const coverError = useMemo(() => {
		const raw = values.image?.trim();
		if (!raw) return null;
		if (!isImgbbUrl(raw)) {
			return 'Cover photo must be an i.ibb.co link (only imgbb uploads supported).';
		}
		return null;
	}, [values.image]);

	const previewStudio: Studio = useMemo(() => {
		let safeCover = '';
		try {
			if (values.image && isImgbbUrl(values.image)) {
				safeCover = values.image.trim();
			}
		} catch {
			safeCover = '';
		}

		let safeGallery: string[] = [];
		try {
			safeGallery = (values.gallery || []).filter(item => Boolean(item && isImgbbUrl(item)));
		} catch {
			safeGallery = [];
		}

		return {
			_id: 'preview-studio',
			title: values.title?.trim() || 'Your Creative Studio Title',
			slug: 'preview',
			category: (values.category as StudioCategory) || 'Photo Studio',
			description: values.description?.trim() || '',
			hourlyRate: values.hourlyRate || 0,
			securityDeposit: values.securityDeposit || 0,
			maxCapacity: values.maxCapacity || 1,
			location: values.location?.trim() || 'SoHo, New York, NY',
			image: safeCover,
			gallery: safeGallery,
			amenities: values.amenities || [],
			rating: 5.0,
			reviewCount: 0,
			rankingScore: 100,
			reviews: [],
			ownerName: user?.name || 'Verified Host',
			ownerEmail: user?.email || '',
			ownerAvatar: user?.image || undefined,
			createdAt: new Date().toISOString(),
		};
	}, [values, user]);

	return (
		<aside className="space-y-5">
			{/* Preview Card Container */}
			<div className="rounded-2xl bg-secondary p-5 sm:p-6 space-y-5 shadow-xs">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Eye className="size-4 text-muted-foreground" />
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Search Preview</span>
					</div>
				</div>

				{/* Reusable StudioCard Preview */}
				<div className="rounded-2xl bg-card p-3 shadow-xs pointer-events-none select-none">
					<StudioCard studio={previewStudio} interactive={false} />
				</div>

				{/* Invalid Cover Error Notice */}
				{coverError && (
					<div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2 leading-relaxed">
						<AlertCircle className="size-4 shrink-0 mt-0.5" />
						<span>{coverError}</span>
					</div>
				)}

				{/* Form Submission Error Alert */}
				{formError && (
					<div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2 leading-relaxed">
						<AlertCircle className="size-4 shrink-0 mt-0.5" />
						<span>{formError}</span>
					</div>
				)}

				{/* Publish Button */}
				<Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full font-semibold cursor-pointer">
					{isSubmitting ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							<span>Publishing Studio...</span>
						</>
					) : (
						<>
							<span>Publish Studio Listing</span>
							<ChevronRight className="size-4" />
						</>
					)}
				</Button>
			</div>
		</aside>
	);
}
