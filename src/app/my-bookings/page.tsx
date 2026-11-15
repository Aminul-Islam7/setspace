import type { Metadata } from 'next';
import { Suspense } from 'react';
import MyBookingsLoading from './loading';
import { MyBookingsView } from '@/components/bookings/my-bookings-view';
import { StudioBreadcrumb } from '@/components/studios/studio-breadcrumb';

export const metadata: Metadata = {
	title: 'My Bookings | SetSpace',
	description: 'Manage and review your studio reservations, session times, and shoot schedules on SetSpace.',
};

export default function MyBookingsPage() {
	return (
		<main className="container pt-3 sm:pt-4 lg:pt-6 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
			{/* Breadcrumb & Section Header */}
			<div className="space-y-3 sm:space-y-4">
				<StudioBreadcrumb currentTitle="Bookings" />
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My Bookings</h1>
			</div>

			{/* Main Content */}
			<Suspense fallback={<MyBookingsLoading />}>
				<MyBookingsView />
			</Suspense>
		</main>
	);
}

