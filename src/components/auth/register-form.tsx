'use client';

import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { useRouter, useSearchParams } from 'next/navigation';

import { AuthSocialButtons } from '@/components/auth/auth-social-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters'),
	email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
	image: z.string().trim().url('Enter a valid image URL').optional().or(z.literal('')),
	password: z.string().min(6, 'Password must be at least 6 characters long').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			image: '',
			password: '',
		},
	});

	const onSubmit = async (values: RegisterFormValues) => {
		try {
			setIsSubmitting(true);
			setFormError(null);
			setFormSuccess(null);

			const res = await authClient.signUp.email({
				name: values.name,
				email: values.email,
				password: values.password,
				image: values.image || undefined,
			});

			if (res.error) {
				setFormError(res.error.message || 'Failed to create account.');
				setIsSubmitting(false);
				return;
			}

			setFormSuccess('Account created successfully! Redirecting...');
			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error('Sign up error:', error);
			setFormError('An unexpected error occurred. Please try again.');
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Social Login */}
			<AuthSocialButtons callbackURL={callbackUrl} onError={setFormError} />

			{/* Separator */}
			<FieldSeparator>or register with email</FieldSeparator>

			{/* Error Messages */}
			{formError && (
				<div role="alert" className="flex items-start gap-2.5 rounded-lg bg-destructive/10 px-3.5 py-2.5 mt-4 text-sm font-medium text-destructive">
					<AlertCircle className="size-4 shrink-0 mt-0.5" />
					<span>{formError}</span>
				</div>
			)}

			{formSuccess && (
				<div role="status" className="flex items-start gap-2.5 rounded-lg bg-primary/10 px-3.5 py-2.5 text-sm font-medium text-primary">
					<CheckCircle2 className="size-4 shrink-0 mt-0.5" />
					<span>{formSuccess}</span>
				</div>
			)}

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
				<FieldGroup>
					{/* Name Field */}
					<Field>
						<FieldLabel htmlFor="name">Full Name</FieldLabel>
						<Input id="name" type="text" autoComplete="name" placeholder="Jane Doe" disabled={isSubmitting} aria-invalid={!!errors.name} {...register('name')} />
						{errors.name && <FieldError>{errors.name.message}</FieldError>}
					</Field>

					{/* Email Field */}
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input id="email" type="email" autoComplete="email" placeholder="creator@setspace.io" disabled={isSubmitting} aria-invalid={!!errors.email} {...register('email')} />
						{errors.email && <FieldError>{errors.email.message}</FieldError>}
					</Field>

					{/* Photo URL Field */}
					<Field>
						<FieldLabel htmlFor="image">Profile Photo URL (Optional)</FieldLabel>
						<Input id="image" type="url" autoComplete="photo" placeholder="https://example.com/avatar.jpg" disabled={isSubmitting} aria-invalid={!!errors.image} {...register('image')} />
						{errors.image && <FieldError>{errors.image.message}</FieldError>}
					</Field>

					{/* Password Field */}
					<Field>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<div className="relative">
							<Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" disabled={isSubmitting} aria-invalid={!!errors.password} className="pr-10" {...register('password')} />
							<Button type="button" variant="ghost" size="icon-xs" onClick={() => setShowPassword(prev => !prev)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 inset-y-0 my-auto active:translate-y-0 text-muted-foreground hover:text-foreground">
								{showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
							</Button>
						</div>
						{errors.password ? <FieldError>{errors.password.message}</FieldError> : <FieldDescription>Min 6 characters, with at least 1 uppercase and 1 lowercase letter.</FieldDescription>}
					</Field>
				</FieldGroup>

				{/* Submit Button */}
				<Button type="submit" variant="default" flat3d disabled={isSubmitting} className="w-full mt-2 py-5">
					{isSubmitting ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							<span>Creating account...</span>
						</>
					) : (
						'Create Account'
					)}
				</Button>
			</form>

			{/* Switch to Login */}
			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
					Sign in
				</Link>
			</p>
		</div>
	);
}

