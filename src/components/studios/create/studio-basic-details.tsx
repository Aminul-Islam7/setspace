'use client';

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { CreateStudioFormValues } from './types';
import { Input } from '@/components/ui/input';
import { STUDIO_CATEGORIES } from '@/lib/studio-constants';
import { Textarea } from '@/components/ui/textarea';

interface StudioBasicDetailsProps {
	register: UseFormRegister<CreateStudioFormValues>;
	control: Control<CreateStudioFormValues>;
	errors: FieldErrors<CreateStudioFormValues>;
}

const CATEGORY_ITEMS = STUDIO_CATEGORIES.map(cat => ({ label: cat, value: cat }));

export function StudioBasicDetails({ register, control, errors }: StudioBasicDetailsProps) {
	return (
		<div className="rounded-2xl bg-secondary p-5 sm:p-7 space-y-6 shadow-xs">
			<div className="space-y-1">
				<h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Basic Information</h2>
				<p className="text-sm text-muted-foreground">General identity, creative category, and physical address of your space.</p>
			</div>

			<FieldGroup className="gap-5">
				{/* Studio Title */}
				<Field>
					<FieldLabel htmlFor="title">Studio Title *</FieldLabel>
					<Input id="title" placeholder="e.g. EchoChamber Minimalist Creator Pod" aria-invalid={!!errors.title} {...register('title')} />
					{errors.title && <FieldError>{errors.title.message}</FieldError>}
				</Field>

				{/* Category & Location Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					{/* Category Select */}
					<Field>
						<FieldLabel htmlFor="category">Category *</FieldLabel>
						<Controller
							name="category"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={val => {
										if (val) field.onChange(val);
									}}
									items={CATEGORY_ITEMS}
								>
									<SelectTrigger id="category" className="w-full">
										<SelectValue placeholder="Choose category..." />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{STUDIO_CATEGORIES.map(cat => (
												<SelectItem key={cat} value={cat}>
													{cat}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.category && <FieldError>{errors.category.message}</FieldError>}
					</Field>

					{/* Location Address */}
					<Field>
						<FieldLabel htmlFor="location">Location / Address *</FieldLabel>
						<Input id="location" placeholder="e.g. 482 Broadway, Soho, New York, NY" aria-invalid={!!errors.location} {...register('location')} />
						{errors.location && <FieldError>{errors.location.message}</FieldError>}
					</Field>
				</div>

				{/* Detailed Description */}
				<Field>
					<FieldLabel htmlFor="description">Workspace Description *</FieldLabel>
					<Textarea id="description" rows={4} placeholder="Describe the aesthetic, ceiling heights, acoustic damping, natural lighting orientation, power specs, freight elevator access, and ideal productions..." aria-invalid={!!errors.description} {...register('description')} />
					{errors.description && <FieldError>{errors.description.message}</FieldError>}
				</Field>
			</FieldGroup>
		</div>
	);
}

