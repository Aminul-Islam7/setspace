# SetSpace Frontend Project

## 1. Project Overview & Context

SetSpace is a high-performance, peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians to discover, reserve, and host production spaces.
The platform connects space hosts (photo cyc lofts, cinema soundstages, video podcast suites, Dolby Atmos studios, art ateliers, and exhibition halls) with creators via transparent hourly rates, real-time availability checks, and secure booking management.

This project is built to satisfy **Programming Hero Assignment 8** evaluation requirements while strictly meeting production-grade portfolio standards (clean token-driven UI, zero mock/lorem text, modern primitives, and rock-solid type safety).

---

## 2. Core Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React Server & Client Components)
- **Runtime & Language:** React 19, TypeScript 5 (Strict Mode enabled)
- **Styling & Design System:** Tailwind CSS v4, Base UI (`@base-ui/react`), Shadcn primitives (`base-luma`), Lucide React icons
- **Form Management & Validation:** `react-hook-form`, `zod`, `@hookform/resolvers/zod`
- **Feedback & Modals:** Sonner (`toast`) for important action feedback which are not relevant to show in the main bodies, custom accessible modal dialogs (no native browser `alert()` or `confirm()`)
- **Visual Vibe & Theme:** "Cinematic Amber & Studio Zinc"
    - Display Font: `Syne` (bold, geometric, editorial)
    - Body Font: `Plus Jakarta Sans` (high legibility)
    - Dark Mode Default
    - Full system light/dark theme toggle support
- **Package Manager:** npm

---

## 3. Backend Boundary & API Contract

The backend API (`../setspace-api`) is strictly external and user-managed. The frontend communicates with it via `process.env.NEXT_PUBLIC_API_URL`.

### Standardized Endpoints:

- `GET /api/studios` — Browse/filter listings (query params: `?category=...&search=...&sort=featured|newest|rankingScore&limit=6`)
- `GET /api/studios/:id` — Single studio details (by `_id` or `slug`)
- `POST /api/studios` — Create studio listing (Protected; receives payload minus metadata)
- `PATCH /api/studios/:id` — Update listing (Protected; owner match)
- `DELETE /api/studios/:id` — Delete listing (Protected; owner match)
- `POST /api/studios/:id/reviews` — Add rating & review comment
- `POST /api/bookings` — Create reservation (checks double-booking collision, saves with status `"Pending"`)
- `GET /api/users/me/studios` — Fetch listings owned by logged-in user (`ownerEmail` match)
- `GET /api/users/me/bookings` — Fetch reservations made by logged-in user (`userEmail` match)
- `PATCH /api/bookings/:id/status` — State transition (e.g., `"Cancelled"`)

---

## 4. Standardized Data Models (`src/types/index.ts`)

### Studio Categories (Fixed Enum):

`"Photo Studio" | "Sound Stage" | "Podcast Lounge" | "Music Suite" | "Art Workshop" | "Exhibition Hall"`

### Studio Interface:

```typescript
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
```

### Booking Interface:

```typescript
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
	bookingDate: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	totalHours: number;
	totalPrice: number; // (hourlyRate * totalHours) + securityDeposit
	status: BookingStatus;
	createdAt: string;
}
```

---

## 5. Route Architecture & UI Requirements

### 1. Global Navigation & Layout

- **Sticky Frosted Header:**
    - Left: SetSpace brand logo with Aperture/Spotlight icon
    - Center: `Home` (`/`), `Explore Studios` (`/studios`), `How It Works`, `About Us`
    - Right (Unauthenticated): `Login` and `Register` action buttons
    - Right (Authenticated): User profile avatar with dropdown containing:
      `Dashboard`, `Add New Studio` (`/add-studio`), `My Studio Listings` (`/my-listings`), `My Bookings` (`/my-bookings`), `Logout`
    - Active route indicators on navigation links
    - Theme toggle switch (Light / Dark mode)
- **Footer:** SetSpace logo, mission statement, copyright & terms, category quick links, newsletter form, and modern social icons using the **new X logo** (never the deprecated Twitter bird).

### 2. Homepage (`/`)

- **Hero Slider / Interactive Banner:** High-resolution studio visuals, punchy headline, subtext, pagination indicators, and dual CTAs: `"Explore Studios"` (`/studios`) and `"Host Your Space"` (`/add-studio`).
- **Category Browser:** 6 uniform cards linking to `/studios?category={category}` with pre-selection.
- **Featured Studios Grid:** Dynamic fetch from API (`.limit(6)` sorted by `rankingScore: -1`). Cards must have uniform height/width, locked `16:10` image aspect ratio, category pill, rating badge, price pill (`$XX / hr`), location, and `"View Details"` CTA.
- **Extra Section 1 (Workflow):** 4-step booking workflow (`1. Discover Spaces` -> `2. Select Shoot Hours` -> `3. Book Instantly` -> `4. Create & Produce`).
- **Extra Section 2 (Host Guarantee):** Platform trust assurances (liability coverage, verified creator profiles, equipment security, 24/7 support).

### 3. Authentication Routes (`/login` & `/register`)

- **Login (`/login`):** Email, password, forgot password link, login button, link to register, Google Social Login button. Success redirects to requested route or `/`.
- **Register (`/register`):** Name, email, photo URL, password, register button, link to login, Google Social Login button.
    - **Strict Password Validation:** Must contain at least 1 uppercase letter, at least 1 lowercase letter, and minimum length of 6 characters. Show clear inline error feedback.
    - No email verification or OTP blocking to keep grading friction-free.
- **Auth Persistence:** Logged-in session must persist cleanly across page reloads on any private route without flashing or bouncing to login.

### 4. Explore Studios (`/studios`)

- Full responsive grid of workspaces.
- Real-time search by title/location and category filter tabs.
- Clean empty states when filters yield 0 results with a `"Clear Filters"` CTA.

### 5. Studio Details (`/studios/[id]`)

- Multi-image gallery carousel.
- Detailed specs: max capacity, hourly rate, security deposit, host badge with contact, and full amenity checklist pills.
- Verified Reviews section (showing rating breakdown and user comments).
- Sticky booking sidebar/widget launching the **"Book Workspace Now"** modal.
    - Modal inputs: Date picker, start time, end time, calculated price breakdown.
    - Submits to `POST /api/bookings` with Sonner toast feedback.

### 6. Private Routes & Management

- **Add Studio (`/add-studio`):**
    - Form fields: Title, Category (Select), Hourly Rate ($), Security Deposit ($), Max Capacity, Location Address, Image URL (or upload), Amenities (checkboxes/tags), Detailed Description, and Read-Only Host Name & Host Email.
    - On submit: calls `POST /api/studios`, triggers success toast, redirects to `/my-listings`.
- **My Studio Listings (`/my-listings`):**
    - Table/Card view of listings matching logged-in `ownerEmail`.
    - Actions: Edit button (navigates to `/studios/edit/[id]`) and Delete button.
    - Delete must open an accessible confirmation modal before triggering API deletion and updating the list.
- **Update Studio (`/studios/edit/[id]`):**
    - Pre-filled form with current studio data; read-only host fields.
    - Submits via `PATCH /api/studios/:id`, shows success toast, redirects to `/my-listings`.
- **My Bookings (`/my-bookings`):**
    - Displays user reservations with colored status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
    - Pending reservations display an active `"Cancel Booking"` button with confirmation.
    - _(Optional Bonus)_: Downloadable PDF invoice receipt for bookings.

---

## 6. Strict Development & Grading Rules

1. **No Lorem Ipsum:** All text, studio descriptions, specs, and reviews must use realistic, immersive creative production copy.
2. **No Default Browser Alerts:** Never use `window.alert()` or `window.confirm()`. All feedback must use Sonner toasts and accessible custom dialog modals.
3. **Skeleton Loading States:** Branded skeleton cards and spinners during route transitions and API fetches.
4. **Custom 404 Page (`not-found.tsx`):** Branded creative studio graphic with a direct `"Return to Home"` button.
5. **No Broken Route Reloads:** Single-page navigation must never throw 404 or hydration mismatch errors on hard reload.
6. **Commit Frequency:** Maintain regular, meaningful, atomic Git commits (minimum 15 notable client-side commits required for grading).

