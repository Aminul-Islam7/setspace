import { EditStudioForm } from '@/components/studios/edit/edit-studio-form';
import EditStudioLoading from './loading';
import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { fetchStudioById } from '@/lib/studios';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata(props: PageProps<'/studios/edit/[id]'>): Promise<Metadata> {
	const { id } = await props.params;
	const studio = await fetchStudioById(id);

	return {
		title: studio ? `Edit ${studio.title} | SetSpace` : 'Edit Studio | SetSpace',
		description: studio?.description || 'Update your production studio listing details on SetSpace.',
	};
}

export default async function EditStudioPage(props: PageProps<'/studios/edit/[id]'>) {
	const { id } = await props.params;
	const studio = await fetchStudioById(id);

	if (!studio) {
		notFound();
	}

	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle={`Edit: ${studio.title}`} />
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Edit Production Workspace</h1>
			</div>

			{/* Form Container */}
			<Suspense fallback={<EditStudioLoading />}>
				<EditStudioForm studio={studio} />
			</Suspense>
		</main>
	);
}
