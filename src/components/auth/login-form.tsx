'use client';

import { AlertCircle, Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
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

const loginSchema = z.object({
	email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/';

	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [formInfo, setFormInfo] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		try {
			setIsSubmitting(true);
			setFormError(null);
			setFormInfo(null);

			const res = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (res.error) {
				setFormError(res.error.message || 'Invalid email or password.');
				setIsSubmitting(false);
				return;
			}

			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error('Sign in error:', error);
			setFormError('An unexpected error occurred. Please try again.');
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Social Login */}
			<AuthSocialButtons callbackURL={callbackUrl} onError={setFormError} />

			{/* Separator */}
			<FieldSeparator>or continue with email</FieldSeparator>

			{/* Error Messages */}
			{formError && (
				<div role="alert" className="flex items-start gap-2.5 rounded-lg bg-destructive/10 px-3.5 py-2.5 mt-4 text-sm font-medium text-destructive">
					<AlertCircle className="size-4 shrink-0 mt-0.5" />
					<span>{formError}</span>
				</div>
			)}

			{formInfo && (
				<div role="status" className="flex items-start gap-2.5 rounded-lg bg-secondary/80 px-3.5 py-2.5 text-xs text-muted-foreground">
					<Info className="size-4 shrink-0 mt-0.5 text-foreground" />
					<span>{formInfo}</span>
				</div>
			)}

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
				<FieldGroup>
					{/* Email Field */}
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input id="email" type="email" autoComplete="email" placeholder="creator@setspace.io" disabled={isSubmitting} aria-invalid={!!errors.email} {...register('email')} />
						{errors.email && <FieldError>{errors.email.message}</FieldError>}
					</Field>

					{/* Password Field */}
					<Field>
						<div className="flex items-center justify-between">
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<button type="button" onClick={() => setFormInfo('Password reset instructions will be provided by your administrator.')} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
								Forgot password?
							</button>
						</div>
						<div className="relative">
							<Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" disabled={isSubmitting} aria-invalid={!!errors.password} className="pr-10" {...register('password')} />
							<Button type="button" variant="ghost" size="icon-xs" onClick={() => setShowPassword(prev => !prev)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 inset-y-0 my-auto active:translate-y-0 text-muted-foreground hover:text-foreground">
								{showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
							</Button>
						</div>
						{errors.password && <FieldError>{errors.password.message}</FieldError>}
					</Field>
				</FieldGroup>

				{/* Submit Button */}
				<Button type="submit" variant="default" flat3d disabled={isSubmitting} className="w-full mt-2 py-5">
					{isSubmitting ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							<span>Signing in...</span>
						</>
					) : (
						'Sign In'
					)}
				</Button>
			</form>

			{/* Switch to Register */}
			<p className="text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{' '}
				<Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
					Create account
				</Link>
			</p>
		</div>
	);
}

