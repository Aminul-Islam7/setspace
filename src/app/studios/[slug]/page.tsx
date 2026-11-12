import { fetchAllStudioSlugs, fetchRelatedStudios, fetchStudioBySlug } from '@/lib/studios';
import { notFound, redirect } from 'next/navigation';

import type { Metadata } from 'next';
import { RelatedStudios } from '@/components/studios/related-studios';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { StudioDetails } from '@/components/studios/studio-details';
import { StudioGallery } from '@/components/studios/studio-gallery';
import { StudioReviews } from '@/components/studios/studio-reviews';

export async function generateMetadata(props: PageProps<'/studios/[slug]'>): Promise<Metadata> {
	const { slug } = await props.params;
	const studio = await fetchStudioBySlug(slug);

	if (!studio) {
		return {
			title: 'Studio Not Found | SetSpace',
		};
	}

	return {
		title: `${studio.title} | SetSpace`,
		description: studio.description,
		openGraph: {
			title: `${studio.title} - ${studio.category} on SetSpace`,
			description: studio.description,
			images: studio.image ? [{ url: studio.image }] : [],
		},
	};
}

const FALLBACK_SLUGS = ['echochamber-minimalist-creator-pod-3n5q8x', 'foley-score-post-production-adr-stage-6g8d1r', 'the-daylight-loft-two-wall-cyc-8f3k9a'];

export async function generateStaticParams() {
	const slugs = await fetchAllStudioSlugs();
	const list = slugs.length > 0 ? slugs : FALLBACK_SLUGS;
	return list.map(slug => ({ slug }));
}

export default async function StudioPage(props: PageProps<'/studios/[slug]'>) {
	const { slug } = await props.params;
	const studio = await fetchStudioBySlug(slug);

	if (!studio) {
		notFound();
	}

	// If navigated via raw Mongo ID and studio has a slug, redirect so address bar displays slug
	if (/^[0-9a-fA-F]{24}$/.test(slug) && studio.slug && studio.slug !== slug) {
		redirect(`/studios/${studio.slug}`);
	}

	// Fetch 6 related studios in same category internally
	const relatedStudios = await fetchRelatedStudios(studio.category, studio._id);

	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-10 lg:pb-12">
			{/* Studio Details Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
				{/* Main Content */}
				<div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
					<div className="space-y-3.5 sm:space-y-5">
						{/* Breadcrumbs */}
						<StudioBreadcrumb category={studio.category} categoryAsLink />

						{/* Gallery */}
						<StudioGallery title={studio.title} image={studio.image} gallery={studio.gallery} category={studio.category} />
					</div>

					{/* Studio Details */}
					<StudioDetails studio={studio} />

					{/* Reviews */}
					<StudioReviews studio={studio} />
				</div>

				{/* Related Studios */}
				<div className="lg:col-span-5 xl:col-span-4">
					<div className="lg:sticky lg:top-24">
						<RelatedStudios studios={relatedStudios} category={studio.category} />
					</div>
				</div>
			</div>
		</main>
	);
}
