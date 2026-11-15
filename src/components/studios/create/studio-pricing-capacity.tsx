'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CreateStudioFormValues } from './types';

interface StudioPricingCapacityProps {
	register: UseFormRegister<CreateStudioFormValues>;
	errors: FieldErrors<CreateStudioFormValues>;
}

export function StudioPricingCapacity({ register, errors }: StudioPricingCapacityProps) {
	return (
		<div className="rounded-2xl bg-secondary p-5 sm:p-7 space-y-6 shadow-xs">
			<div className="space-y-1">
				<h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">Rates & Studio Specs</h2>
				<p className="text-sm text-muted-foreground">Set your hourly pricing, refundable deposit requirement, and maximum room headcount.</p>
			</div>

			<FieldGroup className="gap-5">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					{/* Hourly Rate */}
					<Field>
						<FieldLabel htmlFor="hourlyRate">Hourly Rate ($ USD) *</FieldLabel>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">$</span>
							<Input
								id="hourlyRate"
								type="number"
								min={10}
								max={10000}
								step={5}
								placeholder="120"
								className="pl-7"
								aria-invalid={!!errors.hourlyRate}
								{...register('hourlyRate', { valueAsNumber: true })}
							/>
						</div>
						{errors.hourlyRate && <FieldError>{errors.hourlyRate.message}</FieldError>}
					</Field>

					{/* Security Deposit */}
					<Field>
						<FieldLabel htmlFor="securityDeposit">Security Deposit ($ USD)</FieldLabel>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">$</span>
							<Input
								id="securityDeposit"
								type="number"
								min={0}
								max={5000}
								step={25}
								placeholder="250"
								className="pl-7"
								aria-invalid={!!errors.securityDeposit}
								{...register('securityDeposit', { valueAsNumber: true })}
							/>
						</div>
						{errors.securityDeposit && <FieldError>{errors.securityDeposit.message}</FieldError>}
					</Field>

					{/* Max Capacity */}
					<Field>
						<FieldLabel htmlFor="maxCapacity">Max Capacity (People) *</FieldLabel>
						<Input
							id="maxCapacity"
							type="number"
							min={1}
							max={500}
							step={1}
							placeholder="15"
							aria-invalid={!!errors.maxCapacity}
							{...register('maxCapacity', { valueAsNumber: true })}
						/>
						{errors.maxCapacity && <FieldError>{errors.maxCapacity.message}</FieldError>}
					</Field>
				</div>
			</FieldGroup>
		</div>
	);
}
