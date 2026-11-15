'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { toast } from 'sonner';

import { createStudioSchema, type CreateStudioFormValues } from './types';
import { StudioBasicDetails } from './studio-basic-details';
import { StudioPricingCapacity } from './studio-pricing-capacity';
import { StudioMediaUpload } from './studio-media-upload';
import { StudioAmenitiesPicker } from './studio-amenities-picker';
import { StudioHostInfo } from './studio-host-info';
import { StudioLivePreview } from './studio-live-preview';

function generateUniqueSlug(title: string): string {
	const cleanBase = title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
	const uniqueCode = Math.random().toString(36).substring(2, 8);
	return `${cleanBase || 'creative-studio'}-${uniqueCode}`;
}

export function CreateStudioForm() {
	const router = useRouter();
	const { data: session } = useSession();
	const user = session?.user;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<CreateStudioFormValues>({
		resolver: zodResolver(createStudioSchema),
		defaultValues: {
			title: '',
			category: 'Photo Studio',
			location: '',
			description: '',
			hourlyRate: 120,
			securityDeposit: 200,
			maxCapacity: 12,
			image: '',
			gallery: [],
			amenities: ['Gigabit Fiber Wi-Fi', 'Overhead Lighting Grid'],
		},
	});

	const onSubmit = async (values: CreateStudioFormValues) => {
		try {
			setIsSubmitting(true);
			setFormError(null);

			const generatedSlug = generateUniqueSlug(values.title);

			const payload = {
				title: values.title.trim(),
				slug: generatedSlug,
				category: values.category,
				description: values.description.trim(),
				hourlyRate: Number(values.hourlyRate),
				securityDeposit: Number(values.securityDeposit || 0),
				maxCapacity: Number(values.maxCapacity),
				location: values.location.trim(),
				image: values.image.trim(),
				gallery: values.gallery || [],
				amenities: values.amenities,
				ownerName: user?.name || 'Creator',
				ownerEmail: user?.email || '',
				ownerAvatar: user?.image || undefined,
				rating: 5.0,
				reviewCount: 0,
				rankingScore: 0,
				reviews: [],
				createdAt: new Date().toISOString(),
			};

			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			if (apiUrl) {
				const token = await getTokenFromClient();
				const res = await fetch(`${apiUrl}/api/studios`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to publish studio listing.');
				}
			}

			toast.success('Studio listing published successfully!');
			router.push(`/studios/${generatedSlug}`);
			router.refresh();
		} catch (error: unknown) {
			console.error('Create studio error:', error);
			const message = error instanceof Error ? error.message : 'An unexpected error occurred while creating studio.';
			setFormError(message);
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
			{/* Main Form Fields */}
			<div className="lg:col-span-8 space-y-6 sm:space-y-8">
				{/* Basic Information */}
				<StudioBasicDetails register={register} control={control} errors={errors} />

				{/* Rates & Specs */}
				<StudioPricingCapacity register={register} errors={errors} />

				{/* Media & Showcase */}
				<StudioMediaUpload register={register} control={control} setValue={setValue} setError={setError} clearErrors={clearErrors} errors={errors} />

				{/* Amenities Checklist */}
				<StudioAmenitiesPicker control={control} setValue={setValue} errors={errors} />

				{/* Host Profile & Ownership */}
				<StudioHostInfo user={user} />
			</div>

			{/* Sticky Live Preview (Desktop) */}
			<div className="lg:col-span-4">
				<div className="lg:sticky lg:top-24">
					<StudioLivePreview control={control} isSubmitting={isSubmitting} formError={formError} user={user} />
				</div>
			</div>
		</form>
	);
}

