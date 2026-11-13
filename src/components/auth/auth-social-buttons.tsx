'use client';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

interface AuthSocialButtonsProps {
	callbackURL?: string;
	onError?: (message: string) => void;
}

export function AuthSocialButtons({ callbackURL = '/', onError }: AuthSocialButtonsProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		try {
			setIsLoading(true);
			await authClient.signIn.social({
				provider: 'google',
				callbackURL,
			});
		} catch (error) {
			console.error('Google sign-in error:', error);
			onError?.('Failed to initialize Google login. Please try again.');
			setIsLoading(false);
		}
	};

	return (
		<Button type="button" variant="secondary" flat3d shape="full" disabled={isLoading} onClick={handleGoogleLogin} className="w-full gap-2.5 py-5">
			<FcGoogle className="size-5 shrink-0" />
			<span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
		</Button>
	);
}
