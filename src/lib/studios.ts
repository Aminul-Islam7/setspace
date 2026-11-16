import type { PaginatedResponse, Studio } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchStudioById(id: string): Promise<Studio | null> {
	try {
		const res = await fetch(`${API_URL}/api/studios/${id}`, {
			cache: 'no-store',
		});
		if (!res.ok) return null;
		const studio: Studio = await res.json();
		return studio;
	} catch (error) {
		console.error(`Failed to fetch studio by id ${id}:`, error);
		return null;
	}
}

export async function fetchStudioBySlug(slug: string): Promise<Studio | null> {
	// If 24-character hex MongoDB ID was passed, fetch directly
	if (/^[0-9a-fA-F]{24}$/.test(slug)) {
		return fetchStudioById(slug);
	}

	try {
		// 1. Targeted lookup by slug via search param (instant match in MongoDB, no-store for immediate visibility)
		const searchRes = await fetch(`${API_URL}/api/studios?search=${encodeURIComponent(slug)}&limit=10`, {
			cache: 'no-store',
		});

		if (searchRes.ok) {
			const json: PaginatedResponse<Studio> = await searchRes.json();
			const matched = json.data.find(s => s.slug === slug);
			if (matched) {
				return await fetchStudioById(matched._id);
			}
		}

		// 2. Fallback: lookup across full studios list without stale cache
		const listRes = await fetch(`${API_URL}/api/studios?limit=100`, {
			cache: 'no-store',
		});

		if (listRes.ok) {
			const json: PaginatedResponse<Studio> = await listRes.json();
			const matched = json.data.find(s => s.slug === slug);
			if (matched) {
				return await fetchStudioById(matched._id);
			}
		}

		return null;
	} catch (error) {
		console.error(`Failed to resolve studio for slug ${slug}:`, error);
		return null;
	}
}

export async function fetchRelatedStudios(category: string, currentId: string): Promise<Studio[]> {
	try {
		const res = await fetch(`${API_URL}/api/studios?category=${encodeURIComponent(category)}&limit=10`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return [];

		const json: PaginatedResponse<Studio> = await res.json();
		return json.data.filter(s => s._id !== currentId).slice(0, 6);
	} catch (error) {
		console.error(`Failed to fetch related studios for category ${category}:`, error);
		return [];
	}
}

export async function fetchAllStudioSlugs(): Promise<string[]> {
	try {
		const res = await fetch(`${API_URL}/api/studios?limit=100`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return [];

		const json: PaginatedResponse<Studio> = await res.json();
		return json.data.map(s => s.slug).filter(Boolean);
	} catch {
		return [];
	}
}

