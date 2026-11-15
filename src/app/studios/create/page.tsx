import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { CreateStudioForm } from '@/components/studios/create/create-studio-form';
import CreateStudioLoading from './loading';

export const metadata: Metadata = {
	title: 'Host a Creative Space | SetSpace',
	description: 'List your photo loft, cinema soundstage, audio suite, or production workshop on SetSpace.',
};

export default function CreateStudioPage() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle="Host Studio" />
				<div className="space-y-1">
					<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
						List Your Production Space
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
						Publish your workspace to filmmakers, photographers, podcasters, and musicians across the SetSpace creator network.
					</p>
				</div>
			</div>

			{/* Form Container */}
			<Suspense fallback={<CreateStudioLoading />}>
				<CreateStudioForm />
			</Suspense>
		</main>
	);
}
