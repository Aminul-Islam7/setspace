import { CreateStudioForm } from '@/components/studios/create/create-studio-form';
import CreateStudioLoading from './loading';
import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Host a Creative Space | SetSpace',
	description: 'List your photo loft, cinema soundstage, audio suite, or production workshop on SetSpace.',
};

export default function CreateStudioPage() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle="New" />
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">List Your Production Space</h1>
			</div>

			{/* Form Container */}
			<Suspense fallback={<CreateStudioLoading />}>
				<CreateStudioForm />
			</Suspense>
		</main>
	);
}

