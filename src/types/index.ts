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
	rating: number;
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
	image: string;
	gallery?: string[];
	amenities: string[];
	rating: number;
	reviewCount: number;
	rankingScore: number;
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
	date: string;
	startTime: string;
	durationHours: number;
	totalPrice: number;
	status: BookingStatus;
	createdAt: string;
}
