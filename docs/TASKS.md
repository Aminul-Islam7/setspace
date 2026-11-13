# Tasks & Roadmap

Track ongoing, planned, and completed tasks. Check off items as they finish.

## Active & Upcoming
- [ ] Implement Add Studio listing form (`/add-studio`) with multi-step/rich media inputs
- [ ] Implement My Listings page (`/my-listings`) with edit/delete actions
- [ ] Implement My Bookings page (`/my-bookings`) with cancellation and status indicators

## Completed
- [x] Build split-design authentication pages (`/login` & `/register`) with Better Auth, Google OAuth, Email/Password, Zod + RHF validation, and session-reactive Navbar (2026-11-12)
- [x] Configure Base UI / Shadcn form primitives (`components/ui/field.tsx`) (2026-11-12)
- [x] Build studios explore page (`/studios`) with 12-per-page pagination, live search bar, flat3d one-button category & sort switches with active states, and empty state (2026-11-12)
- [x] Add review pagination (initial 3 reviews + "Show more reviews" button loading 3 more while remaining) (2026-11-11)
- [x] Standardize image ratio to `aspect-video` across studio gallery and loading skeletons (2026-11-11)
- [x] Connect live backend for studio details: slug URL routing (`/studios/[slug]`), internal MongoDB `_id` fetching, zero mock data, and 6 related category studios (2026-11-11)
- [x] Build studio details page (`/studios/[id]`) matching wireframe: interactive gallery with thumbnail strip, spec breakdown, booking modal dialog, verified reviews, and 6 related category studios in right column (2026-11-11)
- [x] Restore official Shadcn `Carousel` on `StudioCard` with clean touch-drag swipe and arrow navigation (2026-11-11)
- [x] Streamline workflow & guarantee cards: titles beside step/icon, neutral palette, base description text, zero decorative clutter, and tighter section gap (2026-11-11)
- [x] Redesign featured studio cards: Shadcn image carousel with hover arrows, whole-card click, 3-row details hierarchy, bigger category badge, and matching skeletons (2026-11-11)
- [x] Design featured studios section with 3-col responsive grid, dynamic `/api/studios?top=6` fetch, locked 16:10 flush cover images, overlay pills, and minimal details (2026-11-11)
- [x] Build global responsive footer with brand logo, mission statement, Studio Dispatch newsletter, social icons (new X logo), 6 category links, and legal links (2026-11-11)
- [x] Create homepage categories section with 6 square buttons (6 cols on widescreen, 3 cols / 2 rows on mobile) (2026-11-10)
- [x] Implement responsive sticky navigation header with lowkey active indicators, theme toggle, avatar dropdown, and mobile sheet (2026-11-10)
- [x] Create homepage hero section with 6 dark aesthetic studio slides, left-to-right gradient overlay, and expanding pill dots (2026-11-09)
- [x] Configure Tailwind v4 primary OKLCH color palette and font token mappings (2026-11-09)
