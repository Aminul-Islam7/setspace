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
	userEmail?: string;
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
	location: string;
	hourlyRate: number;
	securityDeposit: number;
	userId?: string;
	userName: string;
	userEmail: string;
	ownerEmail: string;
	bookingDate: string;
	startTime: string;
	endTime: string;
	totalHours: number;
	totalPrice: number;
	status: BookingStatus;
	createdAt?: string;
	updatedAt?: string;
}

export type CreateBookingPayload = Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>;

export interface BookedSlot {
	bookingDate: string;
	startTime: string;
	endTime: string;
}

export interface StudioAvailabilityResponse {
	success: boolean;
	data: BookedSlot[];
	message?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	totalCount: number;
	totalPages: number;
	message?: string;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
}
