<p align="center">
  <img src="src/app/icon.svg" alt="SetSpace Logo" width="72" height="72" />
</p>

# SetSpace

Discover premier creative workspaces. Book soundstages, photo cycs, and podcast suites by the hour.

SetSpace is a high-performance, peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians to discover, reserve, and host production spaces. Space hosts list creative lofts and audio suites with custom equipment and production amenities, while creators discover spaces, check real-time slot availability, and book verified sessions with transparent hourly pricing and zero hidden fees.

*A full-stack portfolio exploration demonstrating modern Next.js 16 App Router architecture, Partial Prerendering (PPR), asymmetric Ed25519 JWKS authorization, and token-driven design.*

---

## Live Links

- **Web App**: [setspace-studios.vercel.app](https://setspace-studios.vercel.app/)
- **Backend API**: [setspace-api-v1.vercel.app](https://setspace-api-v1.vercel.app/)
- **Repository**: [github.com/Aminul-Islam7/setspace](https://github.com/Aminul-Islam7/setspace)

---

## Examiner Test Credentials

Examiners can log in immediately using the pre-seeded credentials below, sign in using Google OAuth, or register a new test account:

| Field | Credentials |
| :--- | :--- |
| **Email** | `examiner@setspace.io` |
| **Password** | `password123` |
| **Role** | Verified Creator & Space Host |

> [!NOTE]
> You can also create an account with any email or sign in with Google OAuth directly on the [Sign In page](https://setspace-studios.vercel.app/login).

---

## Features

- **Studio Marketplace & Multi-Criteria Discovery**: Multi-category studio exploration (`Photo Studio`, `Sound Stage`, `Podcast Lounge`, `Music Suite`, `Art Workshop`, `Exhibition Hall`) with 12-per-page pagination, instant live keyword search, dynamic price sorting, and rating filters.
- **Interactive Specs & Media Carousels**: Dynamic studio detail routes (`/studios/[slug]`) featuring interactive media carousels with thumbnail strips, comprehensive spec breakdowns (capacity, hourly rates, security deposits, amenities), and dynamic host CTA ("Edit Studio" for hosts, "Book Now" for creators).
- **Collision-Proof Slot Availability & Instant Booking**: Accessible booking modal with live date-picker and backend schedule collision detection (`/api/bookings/availability`) preventing double bookings on identical time slots.
- **Host Workspace & Reservation Request Management**: Dedicated `/my-listings` dashboard with dual-view switcher allowing studio hosts to manage their active listings and handle incoming client requests with real-time status transitions (`Pending` &rarr; `Confirmed` / `Cancelled`, and `Confirmed` &rarr; `Completed`).
- **Creator Reservations & Verified Review Policy**: Dedicated `/my-bookings` portal with status filtering tabs, cancellation modals, and printable invoice receipts. Enforces verified review policy: only creators with completed bookings can post reviews (strict one-review-per-creator governor).
- **Studio Hosting & Live-Preview Editor**: Studio listing creation (`/studios/create`) and editing (`/studios/edit/[id]`) with live search card preview, cover and gallery photo managers, production amenities picker, and owner verification.
- **Secured Better Auth & Asymmetric JWT Authorization**: Production-grade authentication with email/password and Google OAuth, utilizing Ed25519 asymmetric JWKS token verification between Next.js frontend and Express/MongoDB backend.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Partial Prerendering `PPR`)
- **Library**: React 19 (React Compiler enabled)
- **Runtime & Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4, Base UI (`@base-ui/react`), Shadcn Primitives (`base-luma`)
- **Authentication**: Better Auth (Email/Password, Google OAuth, Ed25519 JWT Plugin)
- **Database**: MongoDB (Atlas)
- **Backend API**: Node.js, Express, `jose` (JWKS verification)
- **Validation & Forms**: React Hook Form, Zod, `@hookform/resolvers/zod`
- **Icons & Feedback**: Lucide React, Sonner (Toasts)
- **Typography**: Syne (Display) & Plus Jakarta Sans (Body)

---

## Local Setup

### Prerequisites

Node.js 18.18+ and npm (or pnpm / yarn).

```bash
# Clone repository
git clone https://github.com/Aminul-Islam7/setspace.git
cd setspace

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (.env)

Create a `.env` file in the root directory:

```env
# Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret_key

# Google OAuth Credentials
BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Build for Production

```bash
npm run build
npm run start
```
