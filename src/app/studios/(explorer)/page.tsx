import type { Metadata } from 'next';
import { StudiosExplorer } from '@/components/studios/studios-explorer';
import StudiosLoading from './loading';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Explore Workspaces | SetSpace',
	description: 'Discover and book verified photo lofts, cinema soundstages, and audio production suites.',
};

export default function StudiosPage() {
	return (
		<main className="w-full">
			<Suspense fallback={<StudiosLoading />}>
				<StudiosExplorer />
			</Suspense>
		</main>
	);
}
