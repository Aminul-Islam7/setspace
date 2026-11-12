import type { Studio } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchStudioById(id: string): Promise<Studio | null> {
	try {
		const res = await fetch(`${API_URL}/api/studios/${id}`, {
			next: { revalidate: 60, tags: [`studio-${id}`] },
		});
		if (!res.ok) return null;
		return await res.json();
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
		// Look up studio ID by matching slug from studio list
		const res = await fetch(`${API_URL}/api/studios?limit=100`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return null;

		const json = await res.json();
		const list: Studio[] = Array.isArray(json) ? json : json.data || [];
		const matched = list.find(s => s.slug === slug);
		if (!matched) return null;

		// Fetch full studio details internally by ID
		return await fetchStudioById(matched._id);
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

		const json = await res.json();
		const list: Studio[] = Array.isArray(json) ? json : json.data || [];
		return list.filter(s => s._id !== currentId).slice(0, 6);
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

		const json = await res.json();
		const list: Studio[] = Array.isArray(json) ? json : json.data || [];
		return list.map(s => s.slug).filter(Boolean);
	} catch {
		return [];
	}
}

