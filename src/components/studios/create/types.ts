import { z } from 'zod';
import type { StudioCategory } from '@/types';
import { STUDIO_CATEGORIES } from '@/lib/studio-constants';

export function isImgbbUrl(url?: string | null): boolean {
	if (!url || typeof url !== 'string') return false;
	try {
		const parsed = new URL(url.trim());
		return parsed.protocol === 'https:' && (parsed.hostname === 'i.ibb.co' || parsed.hostname === 'i.ibb.co.com');
	} catch {
		return false;
	}
}

export const createStudioSchema = z.object({
	title: z.string().trim().min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters'),
	category: z.enum(STUDIO_CATEGORIES as [StudioCategory, ...StudioCategory[]], {
		message: 'Please select a studio category',
	}),
	location: z.string().trim().min(5, 'Please provide a valid location or address (e.g. 124 Studio Row, Brooklyn, NY)'),
	description: z.string().trim().min(20, 'Description must be at least 20 characters long describing the space and equipment'),
	hourlyRate: z.number().min(10, 'Hourly rate must be at least $10/hr').max(10000, 'Hourly rate cannot exceed $10,000/hr'),
	securityDeposit: z.number().min(0, 'Security deposit must be 0 or greater'),
	maxCapacity: z.number().int().min(1, 'Capacity must be at least 1 creator/crew member').max(1000, 'Capacity cannot exceed 1000'),
	image: z
		.string()
		.trim()
		.min(1, 'Primary cover photo URL is required')
		.refine(
			(val) => isImgbbUrl(val),
			{ message: 'Only i.ibb.co image links are supported (e.g. https://i.ibb.co/...)' }
		),
	gallery: z.array(
		z.string().refine(
			(val) => isImgbbUrl(val),
			{ message: 'Only i.ibb.co image links are supported' }
		)
	),
	amenities: z.array(z.string()).min(1, 'Please select at least 1 production amenity'),
});

export type CreateStudioFormValues = z.infer<typeof createStudioSchema>;
