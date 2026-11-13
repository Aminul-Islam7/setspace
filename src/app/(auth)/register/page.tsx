import { Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Create an Account | SetSpace',
	description: 'Join the SetSpace community to reserve creative spaces or host your studio.',
};

export default function RegisterPage() {
	return (
		<AuthSplitLayout
			title="Create an Account"
			subtitle="Join thousands of filmmakers, photographers, and audio engineers on SetSpace."
			highlight={{
				badge: 'JOIN SETSPACE',
				headline: (
					<>
						Where vision meets <span className="">production-ready sets.</span>
					</>
				),
				description: 'Create an account to explore vetted cyc walls, cinema soundstages, and audio suites.',
				features: [
					{ icon: Building2, text: 'Vetted photo cycs, soundstages, and podcast lounges' },
					{ icon: ShieldCheck, text: 'Transparent hourly rates with deposit protection' },
					{ icon: CheckCircle2, text: 'Instant availability check and fast booking confirmation' },
				],
			}}
		>
			<Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-secondary/50" />}>
				<RegisterForm />
			</Suspense>
		</AuthSplitLayout>
	);
}

