import { Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Sign In | SetSpace',
	description: 'Sign in to your SetSpace account to book workspaces and manage listings.',
};

export default function LoginPage() {
	return (
		<AuthSplitLayout
			title="Welcome Back"
			subtitle="Sign in to access your bookings, favorites, and studio listings."
			highlight={{
				badge: 'WELCOME BACK',
				headline: (
					<>
						Every great production starts with <span className="">the right space.</span>
					</>
				),
				description: 'Sign in to keep your bookings close, discover new creative sets, and manage your production schedule.',
				features: [
					{ icon: Calendar, text: 'Every workspace booking, in one place' },
					{ icon: ShieldCheck, text: 'Your payments and deposits stay secure' },
					{ icon: CheckCircle2, text: 'Direct host check-in without the fuss' },
				],
			}}
		>
			<Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-secondary/50" />}>
				<LoginForm />
			</Suspense>
		</AuthSplitLayout>
	);
}

