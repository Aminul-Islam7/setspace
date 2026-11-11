import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { fetchAllStudioSlugs, fetchRelatedStudios, fetchStudioBySlug } from '@/lib/studios';
import { notFound, redirect } from 'next/navigation';

import { Home } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RelatedStudios } from '@/components/studios/related-studios';
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

export async function generateStaticParams() {
	const slugs = await fetchAllStudioSlugs();
	return slugs.map(slug => ({ slug }));
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
		<main className="container py-6 sm:py-10 lg:py-12">
			{/* 2-Column Responsive Layout Matching Wireframe */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
				{/* Left Column (Gallery + Details + Reviews) */}
				<div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
					<div className="space-y-2.5 sm:space-y-3">
						{/* Breadcrumb Navigation */}
						<Breadcrumb className="text-xs sm:text-sm">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link href="/" />} className="inline-flex items-center" aria-label="Home">
										<Home className="size-3.5 sm:size-4" />
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link href="/studios" />}>Studios</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link href={`/studios?category=${encodeURIComponent(studio.category)}`} />} className="font-medium text-foreground/80 truncate max-w-50 sm:max-w-none">
										{studio.category}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>

						{/* Image Carousel & Featured Thumbnails */}
						<StudioGallery title={studio.title} image={studio.image} gallery={studio.gallery} category={studio.category} />
					</div>

					{/* Studio Specifications & Booking Action */}
					<StudioDetails studio={studio} />

					{/* Verified Creator Reviews */}
					<StudioReviews studio={studio} />
				</div>

				{/* Right Column (6 Related Studios in Same Category) */}
				<div className="lg:col-span-5 xl:col-span-4">
					<div className="lg:sticky lg:top-24">
						<RelatedStudios studios={relatedStudios} category={studio.category} />
					</div>
				</div>
			</div>
		</main>
	);
}

