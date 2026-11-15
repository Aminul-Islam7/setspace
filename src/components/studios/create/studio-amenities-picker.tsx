'use client';

import { useState } from 'react';
import { Control, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Plus, Sparkles, X } from 'lucide-react';
import { PRODUCTION_AMENITIES } from '@/lib/studio-constants';
import { cn } from '@/lib/utils';
import type { CreateStudioFormValues } from './types';

interface StudioAmenitiesPickerProps {
	control: Control<CreateStudioFormValues>;
	setValue: UseFormSetValue<CreateStudioFormValues>;
	errors: FieldErrors<CreateStudioFormValues>;
}

export function StudioAmenitiesPicker({ control, setValue, errors }: StudioAmenitiesPickerProps) {
	const selectedAmenities = useWatch({ control, name: 'amenities' }) || [];
	const [customAmenityInput, setCustomAmenityInput] = useState('');

	const toggleAmenity = (label: string) => {
		const exists = selectedAmenities.includes(label);
		const updated = exists ? selectedAmenities.filter((a) => a !== label) : [...selectedAmenities, label];
		setValue('amenities', updated, { shouldValidate: true, shouldDirty: true });
	};

	const handleAddCustomAmenity = () => {
		const trimmed = customAmenityInput.trim();
		if (!trimmed) return;
		if (!selectedAmenities.includes(trimmed)) {
			setValue('amenities', [...selectedAmenities, trimmed], { shouldValidate: true, shouldDirty: true });
		}
		setCustomAmenityInput('');
	};

	return (
		<div className="rounded-2xl bg-secondary p-5 sm:p-7 space-y-6 shadow-xs">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div className="space-y-1">
					<h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Production Amenities</h2>
					<p className="text-sm text-muted-foreground">Select gear, acoustic specs, and workspace amenities included in the hourly rate.</p>
				</div>
				<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-card text-foreground w-fit">
					{selectedAmenities.length} selected
				</span>
			</div>

			<FieldGroup className="gap-5">
				<Field>
					<FieldLabel>Select Included Equipment & Perks *</FieldLabel>

					{/* Standard Amenities Grid */}
					<div className="flex flex-wrap gap-2 pt-1">
						{PRODUCTION_AMENITIES.map((amenity) => {
							const isSelected = selectedAmenities.includes(amenity.label);
							return (
								<button
									key={amenity.id}
									type="button"
									onClick={() => toggleAmenity(amenity.label)}
									className={cn(
										'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none',
										isSelected
											? 'bg-primary text-primary-foreground font-semibold shadow-xs'
											: 'bg-card hover:bg-muted text-foreground border border-border/50 dark:border-0'
									)}
								>
									{isSelected ? <Check className="size-3.5" /> : null}
									<span>{amenity.label}</span>
								</button>
							);
						})}
					</div>

					{/* Custom Amenities List (if any added outside standard list) */}
					{selectedAmenities.some((a) => !PRODUCTION_AMENITIES.some((pa) => pa.label === a)) && (
						<div className="pt-3 space-y-1.5">
							<span className="text-xs font-semibold text-muted-foreground">Custom Equipment:</span>
							<div className="flex flex-wrap gap-2">
								{selectedAmenities
									.filter((a) => !PRODUCTION_AMENITIES.some((pa) => pa.label === a))
									.map((custom) => (
										<span
											key={custom}
											className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold bg-foreground text-background"
										>
											<Sparkles className="size-3" />
											<span>{custom}</span>
											<button
												type="button"
												onClick={() => toggleAmenity(custom)}
												aria-label={`Remove ${custom}`}
												className="ml-1 hover:opacity-75 cursor-pointer"
											>
												<X className="size-3" />
											</button>
										</span>
									))}
							</div>
						</div>
					)}

					{/* Add Custom Amenity Input */}
					<div className="flex flex-col sm:flex-row gap-2.5 items-center pt-2">
						<Input
							value={customAmenityInput}
							onChange={(e) => setCustomAmenityInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleAddCustomAmenity();
								}
							}}
							placeholder="Add custom gear (e.g. ARRI SkyPanel S60-C, 7.1.4 Atmos)..."
							className="text-xs sm:text-sm"
						/>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={handleAddCustomAmenity}
							disabled={!customAmenityInput.trim()}
							className="w-full sm:w-auto shrink-0 cursor-pointer"
						>
							<Plus className="size-4" />
							<span>Add Custom</span>
						</Button>
					</div>

					{errors.amenities && <FieldError>{errors.amenities.message}</FieldError>}
					<FieldDescription>Highlight verified specs creators look for when booking.</FieldDescription>
				</Field>
			</FieldGroup>
		</div>
	);
}
