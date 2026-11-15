'use client';

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CreateStudioFormValues } from './types';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface StudioMediaUploadProps {
	register: UseFormRegister<CreateStudioFormValues>;
	control: Control<CreateStudioFormValues>;
	setValue: UseFormSetValue<CreateStudioFormValues>;
	errors: FieldErrors<CreateStudioFormValues>;
}

export function StudioMediaUpload({ register, control, setValue, errors }: StudioMediaUploadProps) {
	const coverImage = useWatch({ control, name: 'image' });
	const gallery = useWatch({ control, name: 'gallery' }) || [];

	const [galleryInput, setGalleryInput] = useState('');
	const [galleryInputError, setGalleryInputError] = useState<string | null>(null);

	const handleAddGalleryPhoto = () => {
		setGalleryInputError(null);
		const trimmed = galleryInput.trim();

		if (!trimmed) {
			setGalleryInputError('Please enter an image URL.');
			return;
		}

		try {
			new URL(trimmed);
		} catch {
			setGalleryInputError('Please enter a valid URL (e.g. https://...).');
			return;
		}

		if (gallery.includes(trimmed)) {
			setGalleryInputError('This photo is already added to the gallery.');
			return;
		}

		if (gallery.length >= 6) {
			setGalleryInputError('Maximum of 6 gallery photos reached.');
			return;
		}

		const updated = [...gallery, trimmed];
		setValue('gallery', updated, { shouldValidate: true, shouldDirty: true });
		setGalleryInput('');
	};

	const handleRemoveGalleryPhoto = (indexToRemove: number) => {
		const updated = gallery.filter((_, i) => i !== indexToRemove);
		setValue('gallery', updated, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<div className="rounded-2xl bg-secondary p-5 sm:p-7 space-y-6 shadow-xs">
			<div className="space-y-1">
				<h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Media & Visual Showcase</h2>
				<p className="text-sm text-muted-foreground">High-resolution imagery of your studio interior, cyc wall, equipment, and production angles.</p>
			</div>

			<FieldGroup className="gap-6">
				{/* Primary Cover Image */}
				<Field>
					<FieldLabel htmlFor="image">Primary Cover Photo URL *</FieldLabel>
					<div className="flex flex-col sm:flex-row gap-4 items-start">
						<div className="flex-1 w-full space-y-2">
							<Input id="image" type="url" placeholder="https://i.ibb.co/..." aria-invalid={!!errors.image} {...register('image')} />
							{errors.image && <FieldError>{errors.image.message}</FieldError>}
						</div>

						{/* Live Cover Preview */}
						<div className="relative w-full sm:w-40 aspect-video rounded-xl bg-card overflow-hidden shrink-0 flex items-center justify-center">
							{coverImage ? (
								<Image
									src={coverImage}
									alt="Cover Preview"
									fill
									unoptimized
									className="object-cover"
									onError={e => {
										// Fallback if image URL is broken
										(e.target as HTMLElement).style.display = 'none';
									}}
								/>
							) : (
								<div className="flex flex-col items-center justify-center text-muted-foreground p-2 text-center">
									<ImageIcon className="size-6 mb-1 opacity-60" />
									<span className="text-[11px] leading-tight">Cover Preview</span>
								</div>
							)}
						</div>
					</div>
				</Field>

				{/* Gallery Images (Optional, 2-4 recommended) */}
				<div className="space-y-3 pt-2">
					<FieldLabel>Additional Gallery Photos ({gallery.length}/6)</FieldLabel>

					{/* Add Gallery Input Row */}
					<div className="flex flex-col sm:flex-row gap-2.5 items-start">
						<div className="flex-1 w-full space-y-1">
							<Input
								value={galleryInput}
								onChange={e => {
									setGalleryInput(e.target.value);
									if (galleryInputError) setGalleryInputError(null);
								}}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddGalleryPhoto();
									}
								}}
								placeholder="Paste additional photo URL and click Add Photo..."
								disabled={gallery.length >= 6}
							/>
							{galleryInputError && <p className="text-xs text-destructive">{galleryInputError}</p>}
						</div>
						<Button type="button" variant="secondary" onClick={handleAddGalleryPhoto} disabled={gallery.length >= 6 || !galleryInput.trim()} className="w-full sm:w-auto shrink-0 cursor-pointer">
							<Plus className="size-4" />
							<span>Add Photo</span>
						</Button>
					</div>

					{/* Gallery Thumbnails Grid */}
					{gallery.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
							{gallery.map((url, index) => (
								<div key={index} className="group relative aspect-video rounded-xl overflow-hidden bg-card">
									<Image src={url} alt={`Gallery ${index + 1}`} fill unoptimized className="object-cover" />
									<div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
										<Button type="button" variant="destructive" size="icon-sm" onClick={() => handleRemoveGalleryPhoto(index)} aria-label={`Remove photo ${index + 1}`} className="size-7 rounded-lg cursor-pointer">
											<Trash2 className="size-3.5" />
										</Button>
									</div>
									<span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded-md bg-foreground text-[10px] font-semibold text-background pointer-events-none">#{index + 1}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</FieldGroup>
		</div>
	);
}

