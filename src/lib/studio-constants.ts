import type { StudioCategory } from '@/types';

export const STUDIO_CATEGORIES: StudioCategory[] = [
	'Photo Studio',
	'Sound Stage',
	'Podcast Lounge',
	'Music Suite',
	'Art Workshop',
	'Exhibition Hall',
];

export interface AmenityOption {
	id: string;
	label: string;
}

export const PRODUCTION_AMENITIES: AmenityOption[] = [
	{ id: 'cyclorama-wall', label: 'Cyclorama Wall' },
	{ id: 'sound-isolation', label: 'Sound Isolation' },
	{ id: 'lighting-grid', label: 'Overhead Lighting Grid' },
	{ id: 'high-speed-wifi', label: 'Gigabit Fiber Wi-Fi' },
	{ id: 'dressing-room', label: 'Dressing & Makeup Station' },
	{ id: 'green-screen', label: 'Seamless Green Screen' },
	{ id: 'podcast-mics', label: 'Broadcast Microphones' },
	{ id: 'studio-monitors', label: 'Reference Studio Monitors' },
	{ id: 'air-conditioning', label: 'Silent Studio A/C' },
	{ id: 'freight-elevator', label: 'Freight Elevator Loading' },
	{ id: '4k-monitors', label: '4K Client Reference Display' },
	{ id: 'parking-onsite', label: 'On-Site Private Parking' },
	{ id: 'kitchenette', label: 'Kitchenette & Creator Lounge' },
	{ id: 'blackout-blinds', label: 'Total Blackout Blinds' },
	{ id: 'backdrop-system', label: 'Seamless Paper Backdrop Roller' },
	{ id: 'grip-package', label: 'Complete C-Stand & Grip Kit' },
];
