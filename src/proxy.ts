import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_ROUTES = [
	'/profile',
	'/my-bookings',
	'/my-listings',
	'/add-studio',
	'/studios/add',
	'/studios/create',
	'/booking',
	'/bookings',
];

const AUTH_ROUTES = ['/login', '/register', '/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	// Check if user has an active session cookie
	const sessionToken = getSessionCookie(request) || request.cookies.get('better-auth.session_token')?.value || request.cookies.get('__Secure-better-auth.session_token')?.value;

	const isAuthenticated = Boolean(sessionToken);

	// Redirect legacy /sign-in and /sign-up routes to /login and /register preserving search params
	if (!isAuthenticated) {
		if (pathname === '/sign-in') {
			return NextResponse.redirect(new URL(`/login${search}`, request.url));
		}
		if (pathname === '/sign-up') {
			return NextResponse.redirect(new URL(`/register${search}`, request.url));
		}
	}

	// Redirect legacy studio creation paths to /studios/create
	if (pathname === '/add-studio' || pathname === '/studios/add') {
		return NextResponse.redirect(new URL(`/studios/create${search}`, request.url));
	}

	// Unauthenticated users visiting protected routes -> Redirect to sign in with callbackUrl
	const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
	if (isProtectedRoute && !isAuthenticated) {
		const callbackUrl = encodeURIComponent(`${pathname}${search}`);
		const redirectUrl = new URL(`/login?callbackUrl=${callbackUrl}`, request.url);
		return NextResponse.redirect(redirectUrl);
	}

	// Authenticated users visiting auth routes -> Redirect to callbackUrl or home
	const isAuthRoute = AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
	if (isAuthRoute && isAuthenticated) {
		const callbackUrlParam = request.nextUrl.searchParams.get('callbackUrl');
		let target = '/';

		if (callbackUrlParam && callbackUrlParam.startsWith('/') && !callbackUrlParam.startsWith('//') && !AUTH_ROUTES.some(r => callbackUrlParam.startsWith(r))) {
			target = callbackUrlParam;
		}

		return NextResponse.redirect(new URL(target, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/profile/:path*', '/my-bookings/:path*', '/my-listings/:path*', '/add-studio/:path*', '/studios/add/:path*', '/studios/create/:path*', '/booking/:path*', '/bookings/:path*', '/login', '/register', '/sign-in', '/sign-up'],
};

