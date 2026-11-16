'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

import type { Studio } from '@/types';
import { createStudioSchema, type CreateStudioFormValues } from '../create/types';
import { StudioBasicDetails } from '../create/studio-basic-details';
import { StudioPricingCapacity } from '../create/studio-pricing-capacity';
import { StudioMediaUpload } from '../create/studio-media-upload';
import { StudioAmenitiesPicker } from '../create/studio-amenities-picker';
import { StudioHostInfo } from '../create/studio-host-info';
import { StudioLivePreview } from '../create/studio-live-preview';

interface EditStudioFormProps {
	studio: Studio;
}

export function EditStudioForm({ studio }: EditStudioFormProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const user = session?.user;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const isOwner = !user?.email || !studio.ownerEmail || user.email.toLowerCase() === studio.ownerEmail.toLowerCase();

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
			title: studio.title,
			category: studio.category,
			location: studio.location,
			description: studio.description,
			hourlyRate: studio.hourlyRate,
			securityDeposit: studio.securityDeposit || 0,
			maxCapacity: studio.maxCapacity,
			image: studio.image,
			gallery: studio.gallery || [],
			amenities: studio.amenities || [],
		},
	});

	const onSubmit = async (values: CreateStudioFormValues) => {
		if (!isOwner) {
			toast.error('You do not have permission to modify this studio workspace.');
			return;
		}

		try {
			setIsSubmitting(true);
			setFormError(null);

			const payload = {
				title: values.title.trim(),
				category: values.category,
				description: values.description.trim(),
				hourlyRate: Number(values.hourlyRate),
				securityDeposit: Number(values.securityDeposit || 0),
				maxCapacity: Number(values.maxCapacity),
				location: values.location.trim(),
				image: values.image.trim(),
				gallery: values.gallery || [],
				amenities: values.amenities,
			};

			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			if (apiUrl) {
				const token = await getTokenFromClient();
				const res = await fetch(`${apiUrl}/api/studios/${studio._id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to update studio listing.');
				}
			}

			toast.success('Studio workspace details updated successfully!');
			router.push('/my-listings');
			router.refresh();
		} catch (error: unknown) {
			console.error('Update studio error:', error);
			const message = error instanceof Error ? error.message : 'An unexpected error occurred while updating studio.';
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
				{/* Non-owner Warning */}
				{!isOwner && (
					<div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-start gap-3">
						<AlertCircle className="size-5 shrink-0 mt-0.5" />
						<div>
							<p className="font-semibold">Unauthorized Workspace Editor</p>
							<p className="text-xs opacity-90 mt-0.5">This workspace is owned by {studio.ownerEmail}. Only the verified owner can submit updates.</p>
						</div>
					</div>
				)}

				{/* Basic Information */}
				<StudioBasicDetails register={register} control={control} errors={errors} />

				{/* Rates & Specs */}
				<StudioPricingCapacity register={register} errors={errors} />

				{/* Media & Showcase */}
				<StudioMediaUpload register={register} control={control} setValue={setValue} setError={setError} clearErrors={clearErrors} errors={errors} />

				{/* Amenities Checklist */}
				<StudioAmenitiesPicker control={control} setValue={setValue} errors={errors} />

				{/* Host Profile & Ownership */}
				<StudioHostInfo user={user || { name: studio.ownerName, email: studio.ownerEmail, image: studio.ownerAvatar }} />
			</div>

			{/* Sticky Live Preview (Desktop) */}
			<div className="lg:col-span-4">
				<div className="lg:sticky lg:top-24">
					<StudioLivePreview
						control={control}
						isSubmitting={isSubmitting || !isOwner}
						formError={formError}
						submitLabel="Save Changes"
						submittingLabel="Saving Changes..."
						user={user || { name: studio.ownerName, email: studio.ownerEmail, image: studio.ownerAvatar }}
					/>
				</div>
			</div>
		</form>
	);
}
