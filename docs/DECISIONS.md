# Architecture & Design Decisions

Record of architectural, design, and structural decisions. Add dated entries in reverse-chronological order.

## 2026-11-15: Direct Instructor-Style JWT Retrieval (`getTokenFromClient` & `getTokenFromServer`)
- **Context:** Course specification and instructor reference require minimal, un-opinionated JWT extraction helpers directly using Better Auth's `authClient.token()` on the client and `auth.api.getToken({ headers: await headers() })` on the server.
- **Alternatives Considered:**
  1. Custom in-memory caching and complex wrappers with clock-skew calculations (Rejected: unnecessary complexity; course standards prioritize direct, readable code).
  2. Direct minimal helper functions matching instructor reference:
     - [`src/lib/getTokenFromClient.ts`](src/lib/getTokenFromClient.ts):
       ```typescript
       import { authClient } from "./auth-client";
       export const getTokenFromClient = async () => {
         const { data } = await authClient.token();
         return data?.token;
       };
       ```
     - [`src/lib/getTokenFromServer.ts`](src/lib/getTokenFromServer.ts):
       ```typescript
       import { headers } from "next/headers";
       import { auth } from "./auth";
       export const getTokenFromServer = async () => {
         const jwtToken = await auth.api.getToken({ headers: await headers() });
         return jwtToken?.token;
       };
       ```
     - Component fetch calls pass `authorization: `Bearer ${token}`` directly.
- **Outcome:** Adopted Option 2 across all private API endpoints. Zero boilerplate, zero caching overhead, perfectly aligns with course curriculum.


## 2026-11-15: Modular JWT Retrieval (Client & Server) with Bearer Authorization Injection
- **Context:** User integrated Better Auth `jwt` plugin (`session.cookieCache.strategy = 'jwt'`). Private backend endpoints require JWT verification via `Authorization: Bearer <token>`.
- **Alternatives Considered:**
  1. Ad-hoc `fetch('/api/auth/token')` inline in every single component. (Rejected: duplication, no caching, causes burst traffic).
  2. Monolithic auth token utility combining server and client helpers. (Rejected: `src/lib/auth.ts` imports native `mongodb` driver, which breaks Turbopack client bundling if imported by Client Components).
  3. Strict client/server separation with bounded client-side TTL caching:
     - [`src/lib/auth-token-client.ts`](src/lib/auth-token-client.ts): Uses client fetch to `/api/auth/token`. Caches token in memory with 10-minute TTL and 30-second expiry clock skew. Exposes `clearClientJwtToken()`, `getClientAuthHeaders(customHeaders)`, and `clientAuthFetch(url, init)`.
     - [`src/lib/auth-token-server.ts`](src/lib/auth-token-server.ts): Uses `auth.api.getToken({ headers: await headers() })` directly on Node/RSC runtime. Exposes `getServerAuthHeaders(customHeaders)` and `serverAuthFetch(url, init)`.
     - [`src/lib/auth-token.ts`](src/lib/auth-token.ts): Client-safe barrel export.
- **Outcome:** Adopted Option 3. Attached `getClientAuthHeaders()` into all private endpoints (`POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings`, `PATCH /api/bookings/:id`, `GET /api/users/me/studios`, and `GET /api/users/me/bookings`). Wired `clearClientJwtToken()` to `signOut()` across Navbar and Profile page.


## 2026-11-15: Architecture of My Listings & My Bookings Management Views
- **Context:** Need dedicated, production-grade management experiences for space hosts (`/my-listings`) and creators (`/my-bookings`) aligned with existing design system (Syne headings, borderless dark mode, solid semantic neutral tokens, corner-rounded `rounded-lg`/`rounded-2xl`, responsive mobile bottom sheets).
- **Alternatives Considered:**
  1. Dense text-only raw database table with browser confirm alerts.
  2. Responsive hybrid card/table layout with KPI metrics row, accessible confirmation dialogs, and instant tab/search filters:
     - `/my-listings`: 4-card host metrics row (Total Workspaces, Avg Hourly Rate, Total Capacity, Host Rating). Real-time client filter. Accessible `DeleteStudioDialog` calling `DELETE /api/studios/:id`.
     - `/my-bookings`: 4-card creator metrics row (Total Bookings, Confirmed, Pending, Total Spent). Status tabs with live counts (All, Pending, Confirmed, Completed, Cancelled). Semantic color badges. Accessible `CancelBookingDialog` and branded `BookingReceiptDialog` with itemized invoice and print action.
     - Asynchronous non-cascading fetch pattern (`fetch().then().catch().finally()`) avoiding React 19 Compiler cascading render warnings.
- **Outcome:** Adopted Option 2 across `src/app/my-listings/`, `src/app/my-bookings/`, `src/components/listings/`, and `src/components/bookings/`. Guarantees WCAG accessibility, zero UI drift, and pixel-perfect skeleton transitions.

## 2026-11-15: Try-Catch ImgBB Hostname Validation & Next.js Image Crash Prevention
- **Context:** `next.config.ts` enforces `remotePatterns: [{ protocol: 'https', hostname: 'i.ibb.co' }]`. Typing or pasting any URL with a different host (e.g., Unsplash, Cloudinary, Imgur, or malformed text) triggered fatal Next.js `<Image>` runtime crashes in Live Search Preview and Media Showcase, bringing down the whole component tree.
- **Alternatives Considered:**
  1. Add wildcard `remotePatterns` in `next.config.ts`. (Rejected: platform currently only supports imgbb uploads).
  2. Multi-tier defensive validation with try-catch and inline field errors:
     - Implemented `isImgbbUrl` helper using `try...catch` with `new URL(url).hostname === 'i.ibb.co'`.
     - In `StudioMediaUpload`: reactive `useMemo` validation on `coverImage` connected to RHF `setError` / `clearErrors`. Shows inline `<FieldError>` immediately upon typing/pasting invalid or non-ImgBB links, and suppresses preview `<Image>` rendering until valid.
     - In `StudioLivePreview`: sanitizes `image` and `gallery` through `try...catch`. Replaces invalid/non-ImgBB cover with safe empty string, preventing `StudioCard` crash and displaying an in-UI error alert.
     - In `StudioCard`: defensively verifies image URLs through `try...catch` before sending to Next.js `<Image>`.
     - In Zod schema (`types.ts`): enforces `.refine(isImgbbUrl)` for form submission.
- **Outcome:** Adopted Option 2. Guarantees zero crashes on non-ImgBB or invalid link input while providing instant, helpful feedback via `<FieldError>` to the user.

## 2026-11-15: Semantic OKLCH Theming, Borderless Dark Mode, and Linear Syntax Refactoring
- **Context:** Form fields had muddy, unreadable contrast in light mode due to transparent borders and faint opacity overlays. Arbitrary opacity modifiers (`/70`, `/60`, `/50`, etc.) and deprecated `bg-gradient-to-*` syntax were scattered across components. In addition, cards and sections were cluttered with excessive border boxes.
- **Alternatives Considered:**
  1. Patch individual input components locally with one-off Tailwind classes.
  2. System-wide overhaul following `tailwind-design-system` skill:
     - Standardized `:root` and `.dark` with solid, high-contrast OKLCH neutral tokens (`--background`, `--foreground`, `--card`, `--secondary`, `--muted`, `--accent`, `--border`).
     - Upgraded `Input`, `Textarea`, and `SelectTrigger` to solid backgrounds with sharp borders in light mode (`border-border/60`) and borderless, elevated surfaces in dark mode (`dark:border-0 dark:bg-card`).
     - Enforced borderless dark mode across cards, sections, badges, and modals, relying strictly on tonal elevation shifts (`bg-background` -> `bg-card` -> `bg-secondary` -> `bg-muted`).
     - Replaced all legacy `bg-gradient-to-*` with modern Tailwind v4 `bg-linear-to-*`.
     - Eliminated arbitrary opacity modifiers on surface backgrounds across all components.
- **Outcome:** Adopted Option 2 across `globals.css`, UI primitives, studio creation modules, and layout components. Guarantees WCAG-compliant form readability, modern CSS-first theme architecture, and clean, uncluttered visuals in both light and dark modes.

## 2026-11-14: Zero-Fallback Live Studio Availability & Strict Next-Day Booking Window
- **Context:** User commanded removing all mock data seeds, local storage fallback previews, and simulated offline success states. Availability must strictly be live or an explicit error, with zero in-between. Additionally, reservations must only be available from the next day forward (current day and past dates cannot show available slots).
- **Alternatives Considered:**
  1. Retain local preview seeds when offline or when backend endpoint is not yet created.
  2. Pure live or error architecture:
     - Availability grid queries `${apiUrl}/api/studios/${id}/availability?date=${date}`.
     - While loading, displays a dedicated schedule loader.
     - On failure or missing service, shows an explicit error alert ("Live availability unavailable") and disables reservation submission.
     - Strictly enforces `bookingDate >= minBookingDate` (tomorrow). When current date or past date is selected, blocks slot rendering and shows guidance notice.
     - Submissions fail with explicit error toasts on server error without recording fake local bookings.
- **Outcome:** Adopted Option 2 across [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx). Eliminates phantom data desynchronization and guarantees bookings are scheduled with required advance notice.

## 2026-11-14: Modular Studio Creation Architecture at `/studios/create` with Live Interactive Preview
- **Context:** Required a dedicated, production-grade page for creators and space hosts to list workspaces at `/studios/create`, matching the aesthetic vibe of existing pages (Syne typography, neutral secondary card surfaces, zero custom borders, corner-rounded `rounded-lg` elements) with high modularity, minimal ad-hoc styling, and clean responsive UX across mobile and desktop.
- **Alternatives Considered:**
  1. Monolithic 800-line single-component form with inlined controls and unpreviewed submission.
  2. Multi-step wizard modal hiding earlier fields behind next/previous stepper buttons.
  3. Modular 2-column architecture (`CreateStudioForm`):
     - Left column (`lg:col-span-8`): Dedicated section cards with `bg-secondary/70 rounded-2xl` surfaces for Basic Details, Pricing & Specs, Media & Gallery Manager, Production Amenities Picker, and Read-Only Host Profile.
     - Right column (`lg:col-span-4`): Sticky real-time `StudioLivePreview` updating live with user inputs (cover, category pill, rate badge, specs, tags, host guarantees) alongside primary submission trigger.
     - Official Base UI primitives: Added `Textarea` and `Select` with corner-rounded `rounded-lg` standards.
     - Next.js 16 Proxy redirection: Automatically rewrites and redirects legacy `/add-studio` and `/studios/add` to `/studios/create`.
- **Outcome:** Adopted Option 3 across [`src/app/studios/create/page.tsx`](src/app/studios/create/page.tsx), [`src/app/studios/create/loading.tsx`](src/app/studios/create/loading.tsx), and [`src/components/studios/create/`](src/components/studios/create/). Provides instant visual confirmation of search card appearance, clean validation with Zod + RHF, and eliminates layout shift via matching skeleton.

## 2026-11-14: Mobile Bottom-Sheet Modal Architecture & 3-Click Direct Slot Selection
- **Context:** User requested modern mobile bottom-sheet interaction for all modal dialogs (sliding up from and into the bottom with drag handle), fixing Windows Chromium scrollbars rendering outside dialog rounded corners, matching exact legend chip colors with slot buttons (no line-through), and replacing start/end time `<select>` dropdowns with direct 3-click slot selection (Click 1: start, Click 2: end, Click 3: reset to new start).
- **Alternatives Considered:**
  1. Separate custom `BottomSheet` component requiring consumers to branch code between mobile and desktop dialogs.
  2. Responsive unified `DialogContent` in `src/components/ui/dialog.tsx`: Renders as sliding bottom sheet with top drag handle on `< sm`, and centered modal on `sm:`. Enforces `overflow-hidden` on outer popup and handles vertical scrolling in an inner wrapper (`flex-1 overflow-y-auto overflow-x-hidden p-6`). Direct 3-click slot state machine with real-time overlap validation in `src/components/studios/studio-booking-dialog.tsx`.
- **Outcome:** Adopted Option 2. Automatically enhances every dialog across the application without breaking API compatibility. Direct slot selection streamlines booking flow, visual chips match 100%, and scrollbar clipping is eliminated.

## 2026-11-13: Icon-Driven Auth Showcase Highlights Replacing Paragraph Testimonials
- **Context:** Wordy quotes took too much visual weight and felt passive. Following modern creator/ticketing reference designs (e.g. tickify), the split-screen auth showcase needed shorter, punchier text with primary color headline accents and clear icon bullet points.
- **Alternatives Considered:**
  1. Long editorial blockquote with author avatar and citation.
  2. Kicker badge (`WELCOME BACK` / `JOIN SETSPACE`), high-contrast display headline with primary highlight, 1-line subtext, and 3 icon feature points in circular badges (`bg-primary/15 text-primary`).
- **Outcome:** Adopted Option 2 across [`src/components/auth/auth-split-layout.tsx`](src/components/auth/auth-split-layout.tsx), [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx), and [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx). Preserved user's left-side showcase positioning, `rounded-r-4xl` surface, and form structure.


## 2026-11-12: Split-Design Authentication Architecture with Better Auth, Zod & React Hook Form
- **Context:** User requested split-design authentication pages (form on one side, design on other half) supporting strictly email-password and Google OAuth, using Tailwind v4 token variables, modular reusable components, latest Zod + RHF techniques, and session reactivity across the app.
- **Alternatives Considered:**
  1. Centered floating modal or isolated card without split artwork.
  2. Responsive split layout (`AuthSplitLayout`): Left form container on mobile/desktop, right-side atmospheric studio showcase with editorial quote and feature pills on `lg:` screens.
- **Outcome:** Adopted Option 2 across [`src/components/auth/auth-split-layout.tsx`](src/components/auth/auth-split-layout.tsx), [`src/components/auth/login-form.tsx`](src/components/auth/login-form.tsx), [`src/components/auth/register-form.tsx`](src/components/auth/register-form.tsx), and [`src/components/auth/auth-social-buttons.tsx`](src/components/auth/auth-social-buttons.tsx). Better Auth handler mounted at `src/app/api/auth/[...all]/route.ts`. Strict password requirements (min 6 chars, uppercase, lowercase) enforced via Zod schema. `Navbar` directly hooked up to `useSession()` and `signOut()` for real-time authentication persistence and avatar rendering. Added route redirects for `/sign-in` and `/sign-up`.


## 2026-11-12: Corner-Rounded Only UI, Neutral Flat3D Pills, Dynamic Slider Bounds & Unified Focus Ring
- **Context:** User requested no fully rounded (`rounded-full`) shapes anywhere in the app (strictly corner-rounded `rounded-lg` / `rounded-md`), keeping `flat3d` tactile styling for all category and sort pills, neutral/secondary coloring for the hourly rate slider, dynamic slider bounds based strictly on the currently fetched studios only, flex-row alignment of Sort By and Price Slider in the filter drawer, and fixing the searchbar focus state to match the app-wide primary ring (`--ring`).
- **Alternatives Considered:**
  1. Full-pill `rounded-full` styling, static $0-$350 price bounds, stacked slider row, and dark border focus.
  2. Corner-rounded (`rounded-lg`) throughout, neutral tactile `flat3d` pill switches (`bg-foreground text-background` active, `bg-secondary` inactive), dynamic `minAvailableRate` and `maxAvailableRate` computed from `studios.map(s => s.hourlyRate)` for slider bounds, side-by-side flex-row layout for Sort By and Slider, and app-consistent `focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30`.
- **Outcome:** Adopted Option 2 across [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx), [`src/components/ui/slider.tsx`](src/components/ui/slider.tsx), [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx), and [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx). Ensures strict visual consistency and corner-rounded design language across the explore experience.

## 2026-11-12: Server-Side Page/Limit Fetching, YouTube Search & Collapsible Filters
- **Context:** Fetching entire list of studios client-side defeated pagination purpose. Realtime search caused excessive render cycles, and always-visible filter pills occupied too much vertical space with high-contrast primary colors.
- **Alternatives Considered:**
  1. Realtime keystroke filtering over full dataset with static filter rows.
  2. Server-side paginated queries (`page=${page}&limit=12`) combined with `category`, `search`, `minprice`, `maxprice`, and `sort`. YouTube-style pill search bar with explicit search trigger button, neutral YouTube-style pill filter buttons (no primary color), double-ended Shadcn `<Slider>` for price bounds, and an inline collapsible filter toggle button showing current active filters (`[V] Photo Studio / Top Rated`).
- **Outcome:** Adopted Option 2 in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx). Drastically reduces payload over the wire, hides detailed filters behind a compact summary toggle by default, and adds double-ended price filtering.

## 2026-11-12: Reduce Top Padding Below Navbar Across All Pages
- **Context:** Because sticky navbar shares the exact same background and tonal surface as the page canvas, excessive top padding (`py-6` to `py-12`) between navbar and initial body content created unnecessary dead vertical space.
- **Alternatives Considered:**
  1. Retain legacy `py-8` to `py-12` margins.
  2. Tighten top padding universally to `pt-3 sm:pt-4 lg:pt-6` while preserving comfortable bottom scroll margin (`pb-8` to `pb-12`).
- **Outcome:** Adopted Option 2 across [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx), [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx), [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx), [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx), [`src/components/home/hero-section.tsx`](src/components/home/hero-section.tsx), and [`src/app/not-found.tsx`](src/app/not-found.tsx). Eliminates empty vertical space while keeping clean section breathing room.

## 2026-11-12: Flat Neutral Pagination Controls (No Primary Color, Chevron-Only Nav)
- **Context:** Pagination previously used primary amber background for active pages, tactile `flat3d` gradients, and explicit "Previous"/"Next" text labels.
- **Alternatives Considered:**
  1. Primary active button with text labels and 3D bevel.
  2. Minimalist, flat, neutral pagination: active button uses `secondary` variant, inactive uses `ghost`, buttons are standard flat (no `flat3d`), and previous/next navigation buttons display chevrons only (`size="icon"`).
- **Outcome:** Adopted Option 2 in [`src/components/ui/pagination.tsx`](src/components/ui/pagination.tsx). Eliminates primary color dominance, strips redundant text labels, and provides compact, elegant chevron-only paging.

## 2026-11-12: Studios Explore Page Architecture with URL-Synchronized Filtering & Flat3D Controls
- **Context:** User requested a dedicated explore page (`/studios`) featuring 12 studios per page pagination, real-time search, one-button switches with `flat3d` and active states for all category and sort options, and zero layout drift.
- **Alternatives Considered:**
  1. Server-side query parameter refetch on every keystroke/pill click.
  2. Single client fetch of active listings with client-side reactive filtering/sorting, URL query synchronization for category persistence (`?category=...`), and official Shadcn `Pagination` controls (`12` per page).
- **Outcome:** Adopted Option 2 in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx) wrapped in `<Suspense>` in [`src/app/studios/page.tsx`](src/app/studios/page.tsx) and backed by [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx). Category selection derives from `useSearchParams()` with `router.replace(..., { scroll: false })`, eliminating `useEffect` setState cascading renders. Sort switches (`featured`, `rating`, `newest`, `price-asc`, `price-desc`) and categories render as tactile `<Button shape="full" flat3d size="sm" variant={isActive ? "default" : "secondary"}>` pills.

## 2026-11-12: Harmonize Global Footer Background & Unified Surface Elevation Hierarchy
- **Context:** Initial footer used `bg-muted` (`oklch(0.268)` in dark mode), creating an abrupt, harsh gray block at page bottom. Switching to pure `bg-background` removed all separation ("zero contrast"), leaving the footer ungrounded.
- **Alternatives Considered:**
  1. Pure `bg-background` with zero boundary (floating footer, zero grounding).
  2. Heavy contrasting block (`bg-muted`, jarring 5x lightness jump).
  3. Modern industry standard (Vercel, Linear, Stripe): subtle top border boundary (`border-t border-border/40`) paired with a soft tonal surface (`bg-secondary/35 dark:bg-card/25`), elevated newsletter card (`bg-card`), and recessed input (`bg-background dark:bg-background/60`).
- **Outcome:** Adopted Option 3 in [`src/components/layout/footer.tsx`](src/components/layout/footer.tsx). Provides clean visual grounding without harshness in both dark and light modes.

## 2026-11-11: Enforce Minimum 70% Opacity on Secondary Surface Backgrounds
- **Context:** Low-opacity card backgrounds (`bg-secondary/20`, `bg-secondary/30`, `bg-secondary/40`, `bg-secondary/60`) produced insufficient contrast over pure white light-theme backgrounds, degrading readability and visual hierarchy.
- **Alternatives Considered:**
  1. Ad-hoc custom border lines.
  2. Increase tonal surface contrast by strictly enforcing a minimum 70% opacity (`bg-secondary/70`) across all card and panel surfaces.
- **Outcome:** Adopted Option 2 across all components. Replaced every instance of `bg-secondary/<70%` with `bg-secondary/70` across the codebase.

## 2026-11-11: Inline Booking CTA with Studio Key Stats
- **Context:** User requested removing the "Booking: Instant" stat and moving the "Book Now" CTA button into that 4th slot inline with the stats to save vertical space.
- **Alternatives Considered:**
  1. Full-width button stacked below the stats row with divider border.
  2. Single compact row: Hourly Rate, Security Deposit, Capacity, and Book Now CTA button in a 4-column responsive grid (`grid-cols-2 sm:grid-cols-4 items-center`).
- **Outcome:** Adopted Option 2 in [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx). Eliminated the divider line and extra padding block, saving significant vertical screen space. Synced skeleton in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).

## 2026-11-11: Standardize Aspect-Video (16:9) Across Entire Application
- **Context:** User requested replacing all `16/10` aspect ratio classes with standard `aspect-video` (16:9) across gallery carousels and skeletons.
- **Alternatives Considered:**
  1. Mixed aspect ratios (`aspect-[16/10]` for gallery, `aspect-video` for cards).
  2. Universal standard `aspect-video` across all cards, carousels, and loading states.
- **Outcome:** Adopted Option 2 across [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx) and [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).

## 2026-11-11: Slug URL Routing with Internal MongoDB ID Fetching & Zero Mock Data
- **Context:** User requested completely removing mock studio data, strictly fetching live database records from `NEXT_PUBLIC_API_URL` (`http://localhost:5000`), displaying human-readable `slug` in the browser address bar (`/studios/[slug]`), and querying single studios by MongoDB `_id` internally to avoid BSON hex parsing errors in `../setspace-api`.
- **Alternatives Considered:**
  1. Passing slug directly to `/api/studios/:id` (fails with 500 error because backend strictly executes `new ObjectId(id)`).
  2. Resolving studio ID from slug lookup via `/api/studios`, then fetching full studio document by `_id` from `/api/studios/:id`. If raw 24-hex ID is visited in address bar, redirect to `/studios/[slug]`.
- **Outcome:** Adopted Option 2 in [`src/lib/studios.ts`](src/lib/studios.ts) and [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx). Completely deleted `src/lib/mock-studios.ts`. 100% live database communication with 60s ISR caching.

## 2026-11-11: Studio Details 2-Column Wireframe Architecture with Related Category Feed
- **Context:** User provided a wireframe layout for the studio details page (`/studios/[id]`) specifying a left main column (hero image carousel with next/prev arrows, row of clickable featured + gallery thumbnails with active border, detailed specifications, "Book now" CTA, and verified reviews) alongside a right sidebar showing 6 related studios in the same category.
- **Alternatives Considered:**
  1. Full-width stacked layout.
  2. 2-column layout matching wireframe: left column (`lg:col-span-7 xl:col-span-8`) for primary workspace media, specs, booking, and reviews; right column (`lg:col-span-5 xl:col-span-4`) with sticky vertical stack of 6 `StudioCard`s in the matching category.
- **Outcome:** Implemented Option 2. Engineered [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx), [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx), [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx), [`src/components/studios/studio-reviews.tsx`](src/components/studios/studio-reviews.tsx), and [`src/components/studios/related-studios.tsx`](src/components/studios/related-studios.tsx). Next.js 16 caching configured via `fetch` revalidate (60s) with local curated fallback, and pixel-perfect skeleton in `loading.tsx`.

## 2026-11-11: Restore Official Shadcn Embla Carousel on StudioCard
- **Context:** User requested reverting to official Shadcn `Carousel` on `StudioCard` to restore native mobile touch-swipe drag, inertia, and click disambiguation.
- **Alternatives Considered:**
  1. Hand-rolled touch swipe listener.
  2. Official Shadcn `Carousel` component backed by Embla.
- **Outcome:** Reverted to Option 2 in [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx). Kept code clean, readable, and simple without convoluted patterns.

## 2026-11-11: Hardware-Accelerated CSS Sliding Track for StudioCard
- **Context:** Removing Embla previously reverted image changes to an instant swap. User needed the smooth physical horizontal sliding transition preserved without bringing back Embla's complex API subscriptions and listener overhead.
- **Alternatives Considered:**
  1. Re-import Embla Carousel and its hook listeners.
  2. CSS `transform: translateX(-${currentIndex * 100}%)` with `transition-transform duration-300 ease-out`.
- **Outcome:** Implemented Option 2 in [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx). Provides fluid 60fps GPU-accelerated horizontal slide between gallery images while keeping zero carousel library dependencies.

## 2026-11-11: Replace Embla Engine with Simple React State in StudioCard
- **Context:** `StudioCard` previously mounted an Embla carousel instance (`@/components/ui/carousel`) and carousel API event subscriptions for each individual card on the grid. This introduced unnecessary bundle overhead, multiple engine instances, and potential touch/click collisions.
- **Alternatives Considered:**
  1. Retain Shadcn/Embla carousel inside cards.
  2. Pure React `useState(0)` managing active gallery index with boundary bounds check (`Math.min` / `Math.max`).
- **Outcome:** Replaced Embla with `useState(0)` in [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx). Stripped all Embla imports, API listeners, and `useEffect` hooks. Reduced DOM elements and eliminated per-card carousel engine overhead.

## 2026-11-11: Minimalist Streamlined Card Structure for Workflow & Guarantee Sections
- **Context:** User requested removing extra decorative items (corner icons, arrows, tags, badges), placing titles inline beside the main step number or icon, increasing title scale, setting description to base font size, using neutral icon colors, and tightening the vertical gap between the two sections.
- **Alternatives Considered:**
  1. Retain secondary diagram tags and badges.
  2. Pure minimal card: header row with step number/neutral icon + title, base body text description below, and zero decorative noise.
- **Outcome:** Adopted Option 2 across [`src/components/home/how-it-works-section.tsx`](src/components/home/how-it-works-section.tsx) and [`src/components/home/host-guarantee-section.tsx`](src/components/home/host-guarantee-section.tsx). Tightened spacing (`pb-4 sm:pb-6` on first section, `pt-4 sm:pt-6` on second).

## 2026-11-11: Separate Diagrammatic Card Grids for Workflow and Host Guarantee
- **Context:** User requested breaking the merged workflow/guarantee row into distinct, dedicated sections with diagram-like step cards, natural typography (no artificial uppercase, heavy tracking, or custom line-heights), and subtle diagram tags.
- **Alternatives Considered:**
  1. Single large merged panel.
  2. Two distinct standalone sections each with a responsive 4-column diagram card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
- **Outcome:** Split into [`src/components/home/how-it-works-section.tsx`](src/components/home/how-it-works-section.tsx) and [`src/components/home/host-guarantee-section.tsx`](src/components/home/host-guarantee-section.tsx). Clean typography, diagrammatic step progression arrows, metric pills, soft badge tags, and zero custom borders.

## 2026-11-11: Merged Side-by-Side Row Layout for Workflow & Platform Guarantee
- **Context:** User requested Section 1 (How Booking Works - 4 steps) and Section 2 (Host Guarantee & Creator Support - 4 assurances) on the homepage with an option to merge into a single row on big screens while keeping UI minimal.
- **Alternatives Considered:**
  1. Two separate full-width stacked sections, adding vertical page scroll.
  2. Single responsive section with side-by-side 2-column grid (`lg:grid-cols-2`) on widescreen and vertical stack on mobile/tablet.
- **Outcome:** Adopted Option 2. Wrapped both sections into [`src/components/home/workflow-guarantee-section.tsx`](src/components/home/workflow-guarantee-section.tsx) with anchors `#how-it-works` and `#host-guarantee`. Uses `bg-secondary/40 dark:bg-card` rounded-3xl panels, primary-accented Lucide icons, and zero custom borders.

## 2026-11-10: Flat-3D Button Variant & Neutral Gradient Specification
- **Context:** User requested a flat-3d button option inspired by YouTube Shorts action buttons featuring a neutral gradient background and crisp border.
- **Alternatives Considered:**
  1. Ad-hoc custom gradient classes on individual buttons.
  2. First-class CVA variant (`variant="flat-3d"`) and boolean prop modifier (`flat3d`) in `src/components/ui/button.tsx`.
- **Outcome:** Added `variant="flat-3d"` (and alias `flat3d`) plus a `flat3d: { true: "..." }` modifier to `buttonVariants`. Uses neutral top-to-bottom vertical gradient (`bg-linear-to-b`) with top highlight, bottom dark tone, and a crisp 1px border (`border-black/10 dark:border-white/15`) for tactile elevation across light and dark modes.

## 2026-11-09: Glass Button Variant & Default Slightly-Rounded Shape
- **Context:** Hero CTA buttons required a frosted glass aesthetic matching creative agency reference designs, slightly rounded corners by default, and larger button scale (`xl`).
- **Alternatives Considered:**
  1. Inline one-off tailwind classes on individual buttons.
  2. Formalizing `glass`/`translucent` variants, `shape` prop (`default: rounded-lg`, `full: rounded-full`), and `xl`/`2xl` sizes in `button.tsx`.
- **Outcome:** Added `variant="glass"`, `shape="default"|"full"`, and `size="xl"|"2xl"` directly to `buttonVariants`. Applied `size="xl"` and `variant="glass"` to hero buttons.

## 2026-11-09: No Custom Borders & Contrast-First UI Philosophy
- **Context:** Heavy border lines clutter modern dark aesthetic layouts.
- **Alternatives Considered:**
  1. Adding `border border-border/40` or subtle borders to cards and sections.
  2. Relying on background-foreground tonal contrast, elevation, and surface shifts.
- **Outcome:** Banned custom borders across the UI unless strictly necessary. Visual separation must rely on background-to-foreground contrast.

## 2026-11-09: Strict Shadcn Component & Variant Standards
- **Context:** Ensuring visual consistency and preventing UI bloat, inline design sprawl, custom borders, and ad-hoc button glows.
- **Alternatives Considered:**
  1. Hand-rolled custom utility classes on `<Link>` / `<button>`.
  2. Strict usage of official Shadcn Base UI components with standard built-in variants only.
- **Outcome:** Strictly use Shadcn components (e.g. `Button`) and standard variants (`default`, `secondary`, etc.). No inline fake variants or custom glows/borders. New variants created only upon explicit user command.

## 2026-11-09: Living Documentation & Total Flexibility Standard
- **Context:** Project scope, backend contracts, design decisions, and assignment features evolve dynamically as development proceeds.
- **Alternatives Considered:**
  1. Fixed immutable project specification.
  2. Living flexible documentation where all documents (including AGENTS.md and PROJECT.md) update continuously alongside code and user directions.
- **Outcome:** Adopted Living Documentation. No doc is fixed. All requirements, endpoints, schemas, and design guidelines are kept flexible and updated across all relevant docs whenever user changes or instructs changes.

## 2026-11-09: Adopt Primary OKLCH Color Scale (#FA6E16)
- **Context:** Application needed an updated vibrant primary brand color (#FA6E16) across Tailwind v4 and Shadcn tokens.
- **Alternatives Considered:**
  1. Hex-based CSS variables (`#FA6E16`).
  2. OKLCH full gamut scale with inline Tailwind v4 `@theme`.
- **Outcome:** Selected OKLCH 50–950 palette mapped to CSS variables and `@theme inline`. Enables perceptually uniform shades, dark mode matching, and native Tailwind utility support.
