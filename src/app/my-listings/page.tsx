import type { Metadata } from 'next';
import MyListingsLoading from './loading';
import { MyListingsView } from '@/components/listings/my-listings-view';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'My Studio Listings | SetSpace',
	description: 'Manage and monitor your workspace listings, hourly rates, and production specs on SetSpace.',
};

export default function MyListingsPage() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle="My" />
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My Studio Listings</h1>
			</div>

			{/* Main Content */}
			<Suspense fallback={<MyListingsLoading />}>
				<MyListingsView />
			</Suspense>
		</main>
	);
}

