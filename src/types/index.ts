export type StudioCategory =
	| 'Photo Studio'
	| 'Sound Stage'
	| 'Podcast Lounge'
	| 'Music Suite'
	| 'Art Workshop'
	| 'Exhibition Hall';

export interface StudioReview {
	_id?: string;
	userName: string;
	userAvatar?: string;
	rating: number; // 1-5
	comment: string;
	createdAt: string;
}

export interface Studio {
	_id: string;
	title: string;
	slug: string;
	category: StudioCategory;
	description: string;
	hourlyRate: number;
	securityDeposit: number;
	maxCapacity: number;
	location: string;
	image: string; // Primary cover image
	gallery?: string[]; // 2-4 additional photos for carousel
	amenities: string[];
	rating: number; // Average rating (e.g. 4.9)
	reviewCount: number; // Must strictly equal reviews.length
	rankingScore: number; // rating * reviewCount (used for featured sorting)
	reviews: StudioReview[];
	ownerName: string;
	ownerEmail: string;
	ownerAvatar?: string;
	createdAt: string;
	updatedAt?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
	_id: string;
	studioId: string;
	studioTitle: string;
	studioCategory: StudioCategory;
	studioImage: string;
	userEmail: string;
	userName: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:00
	durationHours: number;
	totalPrice: number;
	status: BookingStatus;
	createdAt: string;
}
