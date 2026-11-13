# Progress Log

Record daily or milestone progress entries. Keep concise and chronological.

## 2026-11-13: Instant Navbar Paint & Seamless Auth Loading Skeleton
- **What Changed:**
  1. Updated [`src/app/layout.tsx`](src/app/layout.tsx):
     - Removed redundant `<Suspense fallback={<div className="h-16 sm:h-20 w-full bg-background/80" />}>` wrapper around `<Navbar />`.
     - Allows Next.js static / PPR prerendering to include the full navbar shell (logo, site title, nav links, theme toggle) directly in the initial HTML for instant 0ms visual paint on page reload, matching GitHub.
  2. Created [`src/components/ui/skeleton.tsx`](src/components/ui/skeleton.tsx):
     - Added official Shadcn skeleton primitive with `@/lib/utils` `cn` import.
  3. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Handled `isPending` state from `useSession()`.
     - Rendered a pixel-perfect `size-9 rounded-full` Skeleton matching the avatar trigger button on desktop and drawer card on mobile while the session is being verified.
     - Completely eliminated the flash of "Sign in" and "Sign up" buttons on page refresh for logged-in users, preventing Cumulative Layout Shift (CLS).
- **Files Touched:**
  - `src/app/layout.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/components/layout/navbar.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build`. Zero browser sessions opened.

## 2026-11-13: Red Hover Styling on Dropdown Sign Out Item
- **What Changed:**
  1. Updated [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx):
     - Removed aggressive override `**:data-[variant=destructive]:text-accent-foreground!` and `**:text-accent-foreground!` from `DropdownMenuContent` which was preventing destructive items from turning red.
     - Added comprehensive red styling on destructive menu items for all active interaction states: `data-[variant=destructive]:hover:text-destructive!`, `data-[variant=destructive]:data-highlighted:text-destructive!`, `data-[variant=destructive]:focus:text-destructive!`, plus red icon tinting `*:[svg]:text-destructive!` and subtle red hover backgrounds (`bg-destructive/10!`, `dark:bg-destructive/20!`).
     - Kept neutral resting color (`text-foreground`) so the item only lights up in warning red upon hovering/keyboard navigation.
  2. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Explicitly bound `hover:text-destructive focus:text-destructive data-highlighted:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20` to the sign out dropdown menu item.
- **Files Touched:**
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/layout/navbar.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (33/33 routes compiled). Zero browser sessions opened.

## 2026-11-13: Restore Direct Translucent Backdrop Blur on Dropdown Menu
- **What Changed:**
  1. Updated [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx):
     - Removed broken pseudo-element backdrop hack (`before:backdrop-blur-2xl before:-z-1`) which was getting clipped by `overflow-y-auto` and causing transparent see-through dropdowns without blur.
     - Applied direct `bg-popover/80 backdrop-blur-2xl backdrop-saturate-150` on `DropdownMenuContent` and `DropdownMenuSubContent`.
     - Restored rich, translucent frosted glass aesthetic matching the navbar and theme tokens.
- **Files Touched:**
  - `src/components/ui/dropdown-menu.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (33/33 routes static & PPR compiled in 3.5s). Zero browser sessions opened.


## 2026-11-13: Restore Circular Profile Pic Trigger in Navbar
- **What Changed:**
  1. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Restored the user avatar trigger button to circular icon format (`variant="ghost" size="icon" shape="full" className="p-0 size-9 overflow-hidden cursor-pointer"`).
     - Removed name text from the trigger while keeping the left-aligned avatar + name + email row inside the dropdown menu intact.
- **Files Touched:**
  - `src/components/layout/navbar.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (33/33 routes static & PPR compiled in 4.6s). Zero browser sessions opened.


## 2026-11-13: Left-Aligned Profile Header with Avatar in Dropdown Menu
- **What Changed:**
  1. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Enhanced the dropdown's user profile item: included the user's avatar (`size-9 shrink-0`), with initials fallback and profile photo support.
     - Structured layout as a clean horizontal row (`flex items-center gap-3 w-full py-1 text-left`).
     - Aligned full name and email strictly to the left (`text-left`) with clean text truncation.
     - Adjusted dropdown content width to `w-60` for comfortable breathing room.
- **Files Touched:**
  - `src/components/layout/navbar.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (33/33 routes static & PPR compiled in 4.2s). Zero browser sessions opened.


## 2026-11-13: Rounded Dropdown Items, First-Name Rounded Trigger, & Clickable Profile Link
- **What Changed:**
  1. Updated [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx):
     - Changed dropdown items radius from `rounded-2xl` to corner-rounded `rounded-lg` (`DropdownMenuItem`, `DropdownMenuSubTrigger`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`).
     - Added `cursor-pointer` to all interactive items on hover.
     - Changed popup container to `rounded-xl`.
  2. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Transformed trigger button into a rounded rectangle (`rounded-lg`, `h-9`, `px-2 sm:px-2.5`) with user avatar (`size-6 sm:size-7`) and truncated first name (`getFirstName`).
     - Converted name+email section into a clickable `<DropdownMenuItem render={<Link href="/profile" ... />}>` that closes the menu on click and navigates to the user's profile.
     - Also made the mobile drawer user card clickable linking to `/profile`.
  3. Created [`src/app/profile/page.tsx`](src/app/profile/page.tsx):
     - Built dedicated account profile view showing user avatar, name, email, verified badge, and quick action cards (`/my-bookings`, `/my-listings`, `/add-studio`).
- **Files Touched:**
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/layout/navbar.tsx`
  - `src/app/profile/page.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (33/33 routes compiled cleanly). Zero browser sessions opened.


## 2026-11-13: Fix DropdownMenu MenuGroupContext Runtime Crash
- **What Changed:**
  1. Updated [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx):
     - Refactored `DropdownMenuLabel` from `MenuPrimitive.GroupLabel` to a standalone styled `<div>` with `data-slot="dropdown-menu-label"`.
     - Completely solved runtime crash `MenuGroupContext is missing` when clicking avatar dropdown with user info header.
  2. Updated [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx):
     - Wrapped authenticated menu navigation items inside `<DropdownMenuGroup>`.
  3. Documented postmortem in [`docs/BUGS.md`](docs/BUGS.md).
- **Files Touched:**
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/layout/navbar.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (32/32 routes compiled cleanly). Zero browser sessions opened.


## 2026-11-13: Replace Auth Toasts with Contextual In-UI Alerts
- **What Changed:**
  1. Updated [`src/components/auth/login-form.tsx`](src/components/auth/login-form.tsx):
     - Removed all `toast` notifications from `sonner`.
     - Added in-UI alert banner for backend errors (`bg-destructive/10 text-destructive`) with `AlertCircle` icon.
     - Added in-UI status banner for info notices (`bg-secondary/80 text-muted-foreground`) with `Info` icon.
     - Preserved user's button styles (`py-5`) and eye toggle positioning.
  2. Updated [`src/components/auth/register-form.tsx`](src/components/auth/register-form.tsx):
     - Removed all `toast` notifications from `sonner`.
     - Added in-UI alert banner for backend errors with `AlertCircle` icon.
     - Added in-UI success banner for account creation redirect with `CheckCircle2` icon.
     - Preserved user's button styles (`py-5`) and eye toggle positioning.
  3. Updated [`src/components/auth/auth-social-buttons.tsx`](src/components/auth/auth-social-buttons.tsx):
     - Removed `toast` import; wired errors through `onError` callback into parent in-UI banner.
     - Preserved user's `shape="full"`, `variant="secondary"`, and `py-5` styling.
- **Files Touched:**
  - `src/components/auth/login-form.tsx`
  - `src/components/auth/register-form.tsx`
  - `src/components/auth/auth-social-buttons.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (32/32 routes static & PPR generated in 3.5s). Zero browser sessions opened.


## 2026-11-13: Fix Password Visibility Eye Toggle Downward Jump
- **What Changed:**
  1. Updated [`src/components/auth/login-form.tsx`](src/components/auth/login-form.tsx) and [`src/components/auth/register-form.tsx`](src/components/auth/register-form.tsx):
     - Replaced `top-1/2 -translate-y-1/2` with `inset-y-0 my-auto active:translate-y-0`.
     - Completely eliminated active transform collision where `Button`'s `active:translate-y-px` was overriding `-translate-y-1/2` and jumping the eye icon down by ~17px.
  2. Documented in [`docs/BUGS.md`](docs/BUGS.md).
- **Files Touched:**
  - `src/components/auth/login-form.tsx`
  - `src/components/auth/register-form.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (32/32 routes static & PPR generated in 3.8s). Zero browser sessions opened.


## 2026-11-13: Upgrade Auth Split Showcase with Icon Feature List & Clearer Messaging
- **What Changed:**
  1. Updated [`src/components/auth/auth-split-layout.tsx`](src/components/auth/auth-split-layout.tsx):
     - Replaced paragraph quote testimonial with tickify-style high-clarity feature section.
     - Added uppercase kicker badge, punchy headline with primary accent highlight, concise subtext, and 3 icon feature bullet points.
     - Styled icon bullets with circular tonal accents (`flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary`).
     - Preserved user's left-side showcase positioning, `rounded-r-4xl` border radius, and form styling.
  2. Updated [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx):
     - Configured sign-in highlights: `WELCOME BACK`, `Every great production starts with the right space.`, and icons (`Calendar`, `ShieldCheck`, `CheckCircle2`).
  3. Updated [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx):
     - Configured sign-up highlights: `JOIN SETSPACE`, `Where vision meets production-ready sets.`, and icons (`Building2`, `ShieldCheck`, `CheckCircle2`).
- **Files Touched:**
  - `src/components/auth/auth-split-layout.tsx`
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/register/page.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (32/32 routes static & PPR generated in 7.0s). Zero browser sessions opened.


## 2026-11-12: Build Split-Design Auth Pages with Better Auth, Zod & React Hook Form
- **What Changed:**
  1. Built modular split-design layout [`src/components/auth/auth-split-layout.tsx`](src/components/auth/auth-split-layout.tsx):
     - Form container on mobile/desktop, right-side atmospheric studio photography with vignette overlay, quote endorsement, and verified badges on `lg:` screens.
     - Strictly uses existing Tailwind v4 theme tokens (`bg-card`, `bg-secondary/80`, `text-muted-foreground`, `font-display`).
  2. Implemented Google OAuth button in [`src/components/auth/auth-social-buttons.tsx`](src/components/auth/auth-social-buttons.tsx):
     - Official Shadcn `<Button variant="outline" flat3d>` with `react-icons/fc` Google icon.
     - Calls `authClient.signIn.social({ provider: 'google', callbackURL })`.
  3. Built sign in form in [`src/components/auth/login-form.tsx`](src/components/auth/login-form.tsx):
     - Zod schema (`email`, `password`) + `react-hook-form` via `zodResolver`.
     - Composable Base UI / Shadcn form primitives (`FieldGroup`, `Field`, `FieldLabel`, `Input`, `FieldError`, `FieldSeparator`).
     - Password visibility toggle (`Eye` / `EyeOff`), `sonner` toast feedback, and router redirect.
  4. Built registration form in [`src/components/auth/register-form.tsx`](src/components/auth/register-form.tsx):
     - Zod schema validating Name, Email, optional Photo URL, and strict Password rules (min 6 characters, at least 1 uppercase, at least 1 lowercase).
     - Inline validation messages, toggleable password field, and `authClient.signUp.email()`.
  5. Mounted Better Auth App Router API handler in [`src/app/api/auth/[...all]/route.ts`](src/app/api/auth/[...all]/route.ts).
  6. Created auth routes:
     - [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx)
     - [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx)
     - Redirect aliases [`src/app/(auth)/sign-in/page.tsx`](src/app/(auth)/sign-in/page.tsx) and [`src/app/(auth)/sign-up/page.tsx`](src/app/(auth)/sign-up/page.tsx).
  7. Connected [`src/components/layout/navbar.tsx`](src/components/layout/navbar.tsx) to Better Auth `useSession()`:
     - Real-time reactive session state, dynamic initials/avatar rendering, and `signOut()` handler.
- **Files Touched:**
  - `src/app/api/auth/[...all]/route.ts`
  - `src/lib/auth-client.ts`
  - `src/lib/auth.ts`
  - `src/components/auth/auth-split-layout.tsx`
  - `src/components/auth/auth-social-buttons.tsx`
  - `src/components/auth/login-form.tsx`
  - `src/components/auth/register-form.tsx`
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/register/page.tsx`
  - `src/app/(auth)/sign-in/page.tsx`
  - `src/app/(auth)/sign-up/page.tsx`
  - `src/components/layout/navbar.tsx`
  - `docs/TASKS.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (32/32 routes static, dynamic & PPR compiled cleanly). Zero browser sessions opened.


## 2026-11-12: Fixed Global Platform Range for Hourly Rate Slider ($20 – $1000)
- **What Changed:**
  1. Updated [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx):
     - Replaced dynamic result-dependent bounds with a fixed platform range: `MIN_PRICE = 20`, `MAX_PRICE = 1000`, `PRICE_STEP = 10`.
     - Completely solved shrinking bounds bug where filtered results collapsed the slider track inwards and locked the user out.
     - Preserved full range from budget podcast booths ($20/hr) to commercial soundstages and virtual LED volumes ($1000/hr).
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 7.3s). Zero browser sessions opened.

## 2026-11-12: Permanently Remove Min/Max Labels and Reset Button from Filter Panel
- **What Changed:**
  1. Updated [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx):
     - Removed `Min: $.../hr` and `Max: $.../hr` endpoints sub-text below the hourly rate slider.
     - Removed the "Reset All Filters" button and its dividing border from the bottom of the filter dropdown panel.
     - Removed unused filter calculation variables (`hasActiveFilters`, `isPriceFiltered`).
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 3.8s). Zero browser sessions opened.

## 2026-11-12: Full Two-Way Address Bar Query Synchronization
- **What Changed:**
  1. Updated [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx) to reflect all search, sort, and filter state in the frontend browser address bar:
     - `category`: `category=Photo%20Studio` (omitted when 'All').
     - `search`: `search=query` on search form submission / cleared on reset.
     - `sort`: `sort=price-asc` (omitted when default 'newest').
     - `minPrice` & `maxPrice`: `minPrice=50&maxPrice=250` updated on debounced slider drag.
     - `page`: `page=2` (omitted when page 1).
  2. Implemented seamless two-way URL state sync:
     - Direct URL entry, browser Back/Forward navigation, and page refreshes restore all explorer controls accurately.
     - Used React 19 render-time state adjustment pattern (`if (param !== prevParam)`) to eliminate cascading effect renders and satisfy ESLint rules.
     - Resetting filters removes all queries and returns address bar cleanly to `/studios`.
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 6.6s). Zero browser sessions opened.

## 2026-11-12: Full Backend Query Integration for Studios Explorer
- **What Changed:**
  1. Updated [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx):
     - Transitioned from monolithic initial fetch to live reactive querying: fetches `/api/studios?category=...&search=...&sort=...&minPrice=...&maxPrice=...&page=...&limit=12` directly on every filter, page, category, sort, and price change.
     - Added 300ms debounce on double-ended price slider to avoid sending redundant network requests during dragging.
     - Derived `rateBounds` dynamically from current result set rates in `useMemo`, eliminating cascading renders.
     - Supported both `{ data: Studio[], totalPages, totalCount }` payload structure and raw array fallback.
     - Kept tactile `flat3d`, neutral/secondary buttons, and clean section headings.
  2. Updated [`src/lib/studios.ts`](src/lib/studios.ts) and [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) to support both `{ data: [...] }` and raw array responses.
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `src/lib/studios.ts`
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: 404 Not Found Page Layout Alignment & Spacing Polish
- **What Changed:**
  1. Updated [`src/app/not-found.tsx`](src/app/not-found.tsx):
     - Center-aligned production categories container with `mx-auto max-w-xl` and flex `justify-center`.
     - Standardized vertical spacing across icon, status badge, headings, primary action buttons, and category pill links (`space-y-8 sm:space-y-10`).
     - Converted category buttons to `<Button asChild variant="secondary" flat3d shape="full" size="sm">` wrapping `<Link>`, preventing invalid nested interactive elements.
     - Styled 404 status badge with `bg-secondary/70` adhering to tonal contrast / no-custom-borders rule.
- **Files Touched:**
  - `src/app/not-found.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 2.7s). Zero browser sessions opened.

## 2026-11-12: Fully Rounded Category Badges and Gallery Nav Buttons
- **What Changed:**
  1. Updated [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx):
     - Changed category badge border radius from `rounded-lg` to `rounded-full`.
     - Set `shape="full"` on previous and next gallery chevron `<Button>` components.
  2. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx):
     - Changed category badge border radius from `rounded-lg` to `rounded-full`.
     - Set `shape="full"` on previous and next gallery chevron `<Button>` components.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 2.9s). Zero browser sessions opened.

## 2026-11-12: Fix Studio Gallery Navigation Prev/Next Double Bubbling & Order Bug
- **What Changed:**
  1. Fixed erratic navigation in [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx):
     - Resolved event bubbling: Outer clickable gradient bar and inner `<Button>` were both executing `api?.scrollNext()` / `api?.scrollPrev()`. Added `e.stopPropagation()` in unified `handlePrev` and `handleNext` handlers so navigation executes strictly once per click.
     - Changed `opts={{ loop: true }}` to `opts={{ loop: false }}` with `canScrollPrev` and `canScrollNext` tracking (matching `studio-card.tsx`), guaranteeing strictly sequential linear progression (1 to N, N to 1) without erratic wrap-around skips.
     - Deduplicated `images` array via `Set` to prevent duplicate consecutive slides when backend includes cover image in `gallery`.
     - Cleaned comments to minimal section headings.
  2. Documented full postmortem in [`docs/BUGS.md`](docs/BUGS.md).
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 2.5s). Zero browser sessions opened.

## 2026-11-12: Complete Studios Explorer Filtering Overhaul & Bug Fix
- **What Changed:**
  1. Diagnosed root cause for filters not filtering:
     - Backend API (`../setspace-api/index.js`) leaves `search` and `sort` unimplemented and has a minus sign typo on maxPrice (`$lte: -maxPrice`). Frontend previously waited on backend queries that never executed filtering.
  2. Implemented fast client-side reactive filtering pipeline in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx):
     - `rawStudios`: Fetched on mount.
     - `selectedCategory`: Derived cleanly from `searchParams.get('category')` via `useMemo` (preventing cascading `setState` in `useEffect`).
     - `categoryStudios`: Filters by active category.
     - Dynamic rate bounds (`minAvailableRate`, `maxAvailableRate`): Dynamically computed from available category studio rates.
     - `filteredStudios`: Reactive `useMemo` applying keyword search (`title`, `location`, `description`, `amenities`), double-ended price range, and sort order (`price-asc`, `price-desc`, `rating`, `featured`, `newest`).
     - `paginatedStudios`: 12 per page with pagination controls.
  3. Replaced all native `<button>` tags with Shadcn `<Button>` component primitives (clear search button, submit search button, filter toggle, reset filters).
  4. Verified all filters work synchronously and accurately.
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 routes built cleanly). Zero browser sessions opened.

## 2026-11-12: LCP Preload & Priority Optimization for Above-The-Fold Images
- **What Changed:**
  1. Added `priority?: boolean` prop to [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx). When true, applies `priority={true}` to the first image in the card (`index === 0`), enabling Next.js image preloading and `loading="eager"`.
  2. Passed `priority={index < 3}` in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx) and [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) for all above-the-fold cards, resolving the Next.js LCP warning.
  3. Passed `priority={index === 0}` in [`src/components/studios/related-studios.tsx`](src/components/studios/related-studios.tsx) for the top related studio card.
  4. Verified [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx) already applies `priority={index === 0}` on the main studio viewport image.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `src/components/home/featured-studios-section.tsx`
  - `src/components/studios/related-studios.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Clean Minimal Headings for Comments (Enforce Clean Comments Rule)
- **What Changed:**
  1. Updated and formalized the **Clean Comments Only Rule** in [`AGENTS.md`](AGENTS.md): strictly forbids writing extra prompt details or style references (e.g. `(YouTube Style)`, `(No background, No padding)`). Comments must only function as minimal section headings (e.g. `{/* Search Bar */}`, `{/* Studio Details */}`).
  2. Cleaned all verbose comments across:
     - [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx)
     - [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx)
     - [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx)
     - [`src/app/studios/(explorer)/loading.tsx`](src/app/studios/(explorer)/loading.tsx)
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `src/app/studios/[slug]/page.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `src/app/studios/(explorer)/loading.tsx`
  - `AGENTS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Route-Group Loading Isolation & Pixel-Perfect Skeleton Alignment
- **What Changed:**
  1. Resolved cross-route loading flicker bug where reloading `/studios/[slug]` rendered the Studio Explorer skeleton:
     - Relocated explorer page and loading to route group: `src/app/studios/(explorer)/page.tsx` and `src/app/studios/(explorer)/loading.tsx`.
     - Route group keeps the clean `/studios` URL while preventing the parent Suspense boundary from wrapping `/studios/[slug]`.
  2. Fixed pixel alignment across all skeletons:
     - [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx): Aligned breadcrumb items (`StudioBreadcrumb`), removed phantom host card and phantom badges, matched description and amenities grid lines, and aligned right-column sticky related studios.
     - [`src/app/studios/(explorer)/loading.tsx`](src/app/studios/(explorer)/loading.tsx): Aligned breadcrumbs, search input, and filter toggle dimensions.
  3. Formulated and recorded strict new rules in [`AGENTS.md`](AGENTS.md) and [`docs/BUGS.md`](docs/BUGS.md):
     - **Pixel-Perfect Skeleton Alignment Rule**: Skeletons must exactly copy real layout geometry without phantom elements or layout shifts.
     - **Route-Scoped Loading Rule**: Never place parent `loading.tsx` above dynamic sub-routes; use route groups to scope loading boundaries.
- **Files Touched:**
  - `src/app/studios/(explorer)/page.tsx`
  - `src/app/studios/(explorer)/loading.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `AGENTS.md`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Complete Search Bar Shadcn Button Replacement
- **What Changed:**
  1. Replaced the two remaining raw `<button>` elements inside the searchbar in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx) with official Shadcn `<Button>`:
     - Clear search: `<Button type="button" variant="ghost" size="icon-xs" onClick={handleClearSearch} ...>`
     - Submit search: `<Button type="submit" variant="ghost" shape="none" ...>`
  2. Confirmed zero raw `<button>` elements remain in `studios-explorer.tsx`.
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 2.6s). Zero browser sessions opened.

## 2026-11-12: Unified StudioBreadcrumb Component & BreadcrumbList Styling Fix
- **What Changed:**
  1. Created reusable [`src/components/studios/studio-breadcrumb.tsx`](src/components/studios/studio-breadcrumb.tsx) component.
  2. Applied typography classes (`text-xs sm:text-sm`) directly to `<BreadcrumbList className="...">` because class names directly on root `<Breadcrumb>` (`<nav>`) have zero cascade effect on Base UI list typography.
  3. Replaced breadcrumbs in both [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx) and [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx) with `<StudioBreadcrumb>`:
     - Includes `<Home className="size-3.5 sm:size-4" />` with `aria-label="Home"`.
     - Consistent chevron separators and truncated category formatting.
     - Supports `categoryAsLink` for detail pages and active `<BreadcrumbPage>` for explorer.
- **Files Touched:**
  - `src/components/studios/studio-breadcrumb.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `src/app/studios/[slug]/page.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly via terminal per guidelines: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Complete Shadcn Button Adoption (Search Bar & Gallery Controls)
- **What Changed:**
  1. Replaced all raw `<button>` elements in searchbar with official Shadcn `<Button>`:
     - Search submit button: `<Button type="submit" variant="ghost" shape="none" ...>`.
     - Clear search button: `<Button type="button" variant="ghost" size="icon-xs" ...>`.
  2. Upgraded carousel gallery controls in [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx) and [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx) to official Shadcn `<Button variant="glass" flat3d ...>` primitives.
  3. Replaced remaining `rounded-full` instances in studio gallery with corner-rounded `rounded-lg`.
  4. Restored filter reset action inside collapsible filter drawer when active filters exist.
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `src/components/studios/studio-card.tsx`
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly via terminal per guidelines: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Corner-Rounded Only UI, Neutral Flat3D Pills, Dynamic Slider Bounds & Focus State Fix
- **What Changed:**
  1. Removed all `rounded-full` classes from the explore experience:
     - Searchbar container and skeletons changed to `rounded-lg`.
     - Filter summary toggle and pill buttons changed to default corner radius (`rounded-lg`).
     - Slider track and thumb changed to corner-rounded (`rounded-md`).
     - Studio card category badge and carousel navigation buttons updated to `rounded-lg`.
  2. Maintained tactile `flat3d` styling across all category and sort pills while retaining YouTube neutral color palette (`bg-foreground text-background` active, `bg-secondary` inactive).
  3. Styled hourly rate slider with neutral colors (`bg-foreground/80 dark:bg-foreground/70` indicator, `bg-card` corner-rounded thumb with border ring).
  4. Made slider min and max points dynamically calculate strictly from the minimum and maximum hourly rates among the currently fetched studios only (`minAvailableRate` and `maxAvailableRate`).
  5. Placed Sort By pills and Hourly Rate Slider side-by-side in a responsive flex-row (`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6`).
  6. Fixed searchbar focus state to use the app-wide consistent focus ring (`focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30`), eliminating the weird dark border.
  7. Updated documentation in [`docs/DECISIONS.md`](docs/DECISIONS.md) and [`docs/PROGRESS.md`](docs/PROGRESS.md).
- **Files Touched:**
  - `src/components/ui/slider.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `src/components/studios/studio-card.tsx`
  - `src/app/studios/loading.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly via terminal per guidelines: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated in 3.0s). Zero browser sessions opened.

## 2026-11-12: Server-Side Page/Limit Queries, YouTube Search & Collapsible Filters
- **What Changed:**
  1. Replaced 100-studio bulk fetch with backend paginated queries: `page=${currentPage}&limit=12` combined with `category`, `search`, `minprice`, `maxprice`, and `sort`.
  2. Implemented YouTube-style search bar:
     - Form submission on Enter / button click (removed realtime typing query triggers).
     - Connected search button on the right with `Search` icon.
     - Inline clear `X` button when search text exists.
  3. Added inline summary toggle button after search bar showing active filters: `[Filter Icon] [Category] / [Sort By]`.
  4. Made filter panel hidden by default; revealed on clicking summary toggle button.
  5. Implemented double-ended price slider using official Shadcn [`<Slider>`](src/components/ui/slider.tsx) bound to `minprice` and `maxprice` queries.
  6. Updated filter and sort pills to neutral/secondary YouTube styling (`bg-foreground text-background` active, `bg-secondary` inactive, zero primary amber).
  7. Updated skeleton loading state in [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx).
  8. Documented decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Files Touched:**
  - `src/components/ui/slider.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `src/app/studios/loading.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly via terminal per guidelines: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated). Zero browser sessions opened.

## 2026-11-12: Reduce Top Padding Below Navbar Across All Pages
- **What Changed:**
  1. Reduced top padding under sticky navbar to tighten layout and save vertical screen space:
     - [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx): `pt-3 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12` (down from `py-8 sm:py-10 lg:py-12`).
     - [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx): `pt-3 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12`.
     - [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx): `pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-10 lg:pb-12` (down from `py-6 sm:py-10 lg:py-12`).
     - [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx): `pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-10 lg:pb-12`.
     - [`src/components/home/hero-section.tsx`](src/components/home/hero-section.tsx): `pt-1 sm:pt-2 pb-2 sm:pb-4`.
     - [`src/app/not-found.tsx`](src/app/not-found.tsx): `pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20`.
  2. Documented architectural decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Files Touched:**
  - `src/components/studios/studios-explorer.tsx`
  - `src/app/studios/loading.tsx`
  - `src/app/studios/[slug]/page.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `src/components/home/hero-section.tsx`
  - `src/app/not-found.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors) and `npm run lint` (0 errors).

## 2026-11-12: Flat Neutral Pagination Controls & Chevron-Only Buttons
- **What Changed:**
  1. Updated [`src/components/ui/pagination.tsx`](src/components/ui/pagination.tsx):
     - Removed primary color from active page: active button now uses `variant="secondary"`, inactive uses `variant="ghost"`.
     - Removed `flat3d` gradient styling from pagination; buttons are completely flat.
     - Stripped "Previous" and "Next" text labels from `PaginationPrevious` and `PaginationNext`, rendering icon-only buttons (`size="icon"`) with `ChevronLeftIcon` and `ChevronRightIcon`.
  2. Cleaned unused variable in [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx).
  3. Codified strict guardrails in [`AGENTS.md`](AGENTS.md): never overwrite user edits (always read file first), and strictly avoid browser/Playwright tools for visual verification unless commanded by user.
  4. Documented architectural decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Files Touched:**
  - `AGENTS.md`
  - `src/components/ui/pagination.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly via terminal per guidelines: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (28/28 pages static & PPR generated).

## 2026-11-12: Build Studios Explore Page (/studios) with Flat3D Filters & 12-Per-Page Pagination
- **What Changed:**
  1. Built [`src/components/ui/pagination.tsx`](src/components/ui/pagination.tsx): official accessible Shadcn / Base UI pagination primitives (`Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`) with `flat3d` button support.
  2. Built [`src/components/studios/studios-explorer.tsx`](src/components/studios/studios-explorer.tsx):
     - Interactive search bar with instant keyword filtering across title, city, category, description, and equipment.
     - One-button category switches (`All Spaces` + 6 categories) using `<Button shape="full" flat3d size="sm">` with primary active states, synchronized bidirectionally with URL search params (`/studios?category=...`).
     - One-button sort switches (`Featured`, `Top Rated`, `Newest`, `Price: Low to High`, `Price: High to Low`) with tactile `flat3d` active highlight.
     - 12 studios per page pagination with previous/next bounds and smooth scroll-to-top.
     - Aesthetic empty state with "Reset Filters" action when queries match 0 listings.
  3. Created [`src/app/studios/page.tsx`](src/app/studios/page.tsx) with metadata and `<Suspense>` wrapper.
  4. Created [`src/app/studios/loading.tsx`](src/app/studios/loading.tsx) with matching 12-item skeleton layout.
  5. Updated [`docs/TASKS.md`](docs/TASKS.md) and [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Files Touched:**
  - `src/components/ui/pagination.tsx`
  - `src/components/studios/studios-explorer.tsx`
  - `src/app/studios/page.tsx`
  - `src/app/studios/loading.tsx`
  - `docs/TASKS.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), `npm run build` (28/28 pages compiled cleanly), and tested live in Playwright across sorting, filtering, searching, and pagination in both dark and light modes.

## 2026-11-12: Harmonize Global Footer Background & Elevate Surface Hierarchy
- **What Changed:**
  1. Updated [`src/components/layout/footer.tsx`](src/components/layout/footer.tsx):
     - Delineated footer using modern standard: subtle top boundary (`border-t border-border/40`) and soft tonal foundation (`bg-secondary/35 dark:bg-card/25`).
     - Elevated newsletter card to `bg-card text-card-foreground shadow-xs`, sitting crisply above the footer base.
     - Recessed newsletter input to `bg-background dark:bg-background/60`.
     - Applied `flat3d` button variant to newsletter Subscribe CTA.
     - Styled social link circles with `bg-secondary/70 dark:bg-card hover:bg-secondary dark:hover:bg-card/80`.
     - Added official Base UI `<Separator className="opacity-40" />` above the bottom legal row.
  2. Documented architectural design decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Files Touched:**
  - `src/components/layout/footer.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and visual validation across dark & light themes in browser.

## 2026-11-11: Fix 308 CORS Redirect on API Fetch and Restore Resilient generateStaticParams
- **What Changed:**
  1. Updated [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) and [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx): stripped trailing slashes from `process.env.NEXT_PUBLIC_API_URL` (`replace(/\/+$/, '')`).
     - Root cause of 308: Vercel environment variable `NEXT_PUBLIC_API_URL` had trailing slash (`https://setspace-api-v1.vercel.app/`), resulting in `//api/studios?top=6`. Vercel Edge normalized `//` to `/` with HTTP 308 redirect, but edge redirects lack CORS headers, causing browser to fail with CORS error.
  2. Restored `generateStaticParams()` in [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx) with seed slug fallback:
     - Fetches live studio slugs from remote API for full static prerendering (`○`).
     - Includes seed fallback so builds never crash if API is unreachable.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `src/components/studios/studio-booking-dialog.tsx`
  - `src/app/studios/[slug]/page.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` with remote API (27/27 pages generated).

## 2026-11-11: Fix Vercel Cloud Build Failure by Removing Unreachable generateStaticParams
- **What Changed:**
  1. Updated [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx): removed `generateStaticParams()`.
  2. Fixed Vercel deployment crash where empty `slugs` array returned during build-time without local backend caused `Error: When using Cache Components, all 'generateStaticParams' functions must return at least one result`.
  3. Preserved Next.js 16 Partial Prerendering (PPR `◐`) for `/studios/[slug]`, allowing static shell prerendering with on-demand streaming.
  4. Documented root cause and solution in [`docs/BUGS.md`](docs/BUGS.md).
- **Files Touched:**
  - `src/app/studios/[slug]/page.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `$env:NEXT_PUBLIC_API_URL="http://localhost:9999"; npm run build` (build success with 0 errors).

## 2026-11-11: Add Custom Cinematic 404 Not Found Page
- **What Changed:**
  1. Created [`src/app/not-found.tsx`](src/app/not-found.tsx):
     - Thematic film & production set styling ("404 &bull; Scene Missing", "Cut! This Set Doesn't Exist").
     - Clapperboard icon badge with pulsing primary indicator.
     - Shadcn [`Button`](src/components/ui/button.tsx) primary actions: "Back to Homepage" (`variant="default"`, `flat3d`) and "Browse All Studios" (`variant="outline"`, `flat3d`).
     - Quick production category finder linking directly to all 6 studio categories.
     - Fully responsive, strictly zero custom borders (`bg-secondary/70`, `bg-card`).
- **Files Touched:**
  - `src/app/not-found.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add Glass Button & Gradient Bar Setup to StudioCard
- **What Changed:**
  1. Updated [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx):
     - Added full-height clickable neutral gradient bars (`w-12 sm:w-16`) on both edges (`from-neutral-950/85 via-neutral-950/45 to-transparent`).
     - Replaced raw button with Shadcn [`buttonVariants`](src/components/ui/button.tsx) (`variant="glass"`, `flat3d`, `shape="full"`, `size="icon-sm"`, `!bg-white/20 !text-white`).
     - Added pointer blur (`e.detail > 0 && e.currentTarget.blur()`) and `focus-visible:opacity-100` to prevent mouse focus stickiness.
     - Set `z-30` on category badge above gradient bars.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Upgrade Gallery Gradients to Neutral Variables and Eliminate Arrow Pop-In Glitch
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx):
     - Replaced hardcoded black gradients with theme neutral variables: `from-neutral-950/85 via-neutral-950/45 to-transparent` (left) and `from-neutral-950/85 via-neutral-950/45 to-transparent` (right) for a deeper, stronger cinematic vignette.
     - Fixed pop-in / behind-the-gradient glitch:
       - Root cause: `variant="glass"` defaults to `bg-foreground/5` (dark charcoal in light mode), causing the arrow button to start dark and blend into the dark gradient before transitioning to white, appearing as if trapped behind the gradient.
       - Fix: Locked the arrow surface to `!bg-white/20 !text-white` with `transform-gpu` and `relative z-10`, ensuring the button is rendered in the foreground with frosted glass contrast from frame 0 in perfect sync with the gradient.
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Clear Mouse Focus Stickiness on Gallery Navigation Bars
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx):
     - Replaced `focus:opacity-100` with `focus-visible:opacity-100` on both previous/next gradient bar buttons so mouse clicks do not leave the bar permanently visible when mouse leaves gallery.
     - Added pointer blur (`if (e.detail > 0) e.currentTarget.blur()`) on click to drop focus on mouse clicks while preserving keyboard focus for Tab/Enter users.
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors) and `npm run lint` (0 errors).

## 2026-11-11: Add Clickable Dark Gradient Bars Behind Gallery Nav Arrows
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx):
     - Added full-height clickable gradient bars (`w-16 sm:w-20 md:w-24`) along both left (`bg-gradient-to-r from-black/60 via-black/25 to-transparent`) and right (`bg-gradient-to-l from-black/60 via-black/25 to-transparent`) edges.
     - Entire gradient area is clickable for quick and easy slide navigation.
     - Styled interior controls with Shadcn [`buttonVariants`](src/components/ui/button.tsx) (`variant="glass"`, `flat3d`, `shape="full"`, `size="icon"`, `text-white`), maintaining high contrast over any background image without jump.
     - Bumped category and counter badge layers to `z-30` so they stay sharp above the gradient.
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors) and `npm run lint` (0 errors).

## 2026-11-11: Fix Active Click Jump on Gallery Navigation Arrows
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx): changed vertical centering from `top-1/2 -translate-y-1/2` to `inset-y-0 my-auto` and added `active:translate-y-0`.
  2. Fixed Tailwind transform collision where `Button`'s `active:translate-y-px` was overriding `-translate-y-1/2`, causing a 20px downward jump when pressed.
  3. Documented in [`docs/BUGS.md`](docs/BUGS.md).
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors) and `npm run lint` (0 errors).

## 2026-11-11: Tighten Breadcrumb-to-Gallery Spacing
- **What Changed:**
  1. Updated [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx): grouped `<Breadcrumb />` and `<StudioGallery />` in a dedicated `space-y-2.5 sm:space-y-3` container (down from previous `space-y-6 sm:space-y-8` inherited from column parent).
  2. Mirrored in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).
- **Files Touched:**
  - `src/app/studios/[slug]/page.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors) and `npm run lint` (0 errors).

## 2026-11-11: Upgrade Gallery Navigation Arrows to Shadcn Glass Button with Flat-3D
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx): replaced raw HTML `<button>` elements with official Shadcn [`Button`](src/components/ui/button.tsx).
  2. Applied `variant="glass"`, `flat3d={true}`, `shape="full"`, and `size="icon"` to both previous and next gallery carousel controls.
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add Lowkey Clickable Breadcrumbs to Studio Details Page
- **What Changed:**
  1. Added official Shadcn `Breadcrumb` component primitives (`src/components/ui/breadcrumb.tsx`).
  2. Integrated lowkey, clickable breadcrumb navigation directly above `<StudioGallery />` in [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx):
     - `Home` icon linking to `/`
     - Separator
     - `Studios` linking to `/studios`
     - Separator
     - `[Category]` linking to `/studios?category=${category}`
  3. Added matching skeleton placeholder in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).
- **Files Touched:**
  - `src/components/ui/breadcrumb.tsx`
  - `src/app/studios/[slug]/page.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (all 27/27 static/PPR pages built cleanly).

## 2026-11-11: Upgrade Surface Contrast to Minimum 70% Secondary Opacity
- **What Changed:**
  1. Audited the entire application for low-opacity `bg-secondary` surfaces (`/20`, `/30`, `/40`, `/60`).
  2. Upgraded all instances to `bg-secondary/70`:
     - [`src/components/home/how-it-works-section.tsx`](src/components/home/how-it-works-section.tsx)
     - [`src/components/home/host-guarantee-section.tsx`](src/components/home/host-guarantee-section.tsx)
     - [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx)
     - [`src/components/studios/studio-reviews.tsx`](src/components/studios/studio-reviews.tsx)
     - [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx)
     - [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx)
  3. Restored solid tonal separation and high legibility over pure white backgrounds without adding custom borders.
- **Files Touched:**
  - `src/components/home/how-it-works-section.tsx`
  - `src/components/home/host-guarantee-section.tsx`
  - `src/components/studios/studio-details.tsx`
  - `src/components/studios/studio-reviews.tsx`
  - `src/components/studios/studio-booking-dialog.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add Mobile-Only Instant Booking Stat to Balance 2x2 Grid
- **What Changed:**
  1. Updated [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx): added `Booking: Instant` stat with `sm:hidden`.
  2. Completes the mobile 2x2 stats grid on small viewports (`Hourly Rate`, `Deposit`, `Capacity`, `Booking`) above the full-width Book Now button, while remaining completely hidden on `sm:` and up where the button is inline.
  3. Mirrored in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).
- **Files Touched:**
  - `src/components/studios/studio-details.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add Reviews Count Progress Indicator
- **What Changed:**
  1. Updated [`src/components/studios/studio-reviews.tsx`](src/components/studios/studio-reviews.tsx): added left-aligned small muted text indicator (`Showing X of Y reviews`) placed directly below the review cards and above the "Show more reviews" button.
- **Files Touched:**
  - `src/components/studios/studio-reviews.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors, 0 warnings), and `npm run build` (production build pass).

## 2026-11-11: Integrate Inline Book Now CTA into Stats Row
- **What Changed:**
  1. Updated [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx): removed "Booking: Instant" stat.
  2. Moved "Book Now" CTA button inline into the 4th column (`col-span-2 sm:col-span-1`).
  3. Removed the horizontal divider border and extra vertical padding block, condensing the stats and booking action into a single unified row.
  4. Synced [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx) skeleton geometry.
- **Files Touched:**
  - `src/components/studios/studio-details.tsx`
  - `src/components/studios/studio-booking-dialog.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors, 0 warnings), and `npm run build` (production build pass).

## 2026-11-11: Add Incremental Review Pagination to StudioReviews
- **What Changed:**
  1. Updated [`src/components/studios/studio-reviews.tsx`](src/components/studios/studio-reviews.tsx) without overwriting user changes or commented blocks.
  2. Implemented `visibleCount` state initialized to 3.
  3. Rendered `reviews.slice(0, visibleCount)` reviews.
  4. Added a centered "Show more reviews" button below the reviews list that increments by 3 (`prev + 3`) and stays visible as long as `visibleCount < reviews.length`.
  5. Cleaned up unused imports across `studio-reviews.tsx` and `studio-details.tsx`.
- **Files Touched:**
  - `src/components/studios/studio-reviews.tsx`
  - `src/components/studios/studio-details.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors, 0 warnings), and `npm run build` (production build pass).

## 2026-11-11: Fix Gallery Thumbnails Ring Outline Clipping
- **What Changed:**
  1. Updated [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx): applied `p-1.5 -m-1.5` to the thumbnail scroll container and removed `scale-95` on the active state.
  2. Fixed clipping of the active orange focus ring (`ring-2 ring-primary ring-offset-2`) against the `overflow-x-auto` viewport boundary.
  3. Mirrored padding in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx).
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Standardize Aspect-Video Across Gallery and Skeletons
- **What Changed:**
  1. Replaced `aspect-[16/10]` in [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx) with `aspect-video`.
  2. Replaced `aspect-[16/10]` in [`src/app/studios/[slug]/loading.tsx`](src/app/studios/[slug]/loading.tsx) with `aspect-video`.
  3. Updated [`docs/PROJECT.md`](docs/PROJECT.md) specification to `aspect-video`.
- **Files Touched:**
  - `src/components/studios/studio-gallery.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `docs/PROJECT.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Purge Mock Studios & Connect Live Backend via Slug Address Bar Routing
- **What Changed:**
  1. Deleted `src/lib/mock-studios.ts` completely. Zero mock data remaining.
  2. Created [`src/lib/studios.ts`](src/lib/studios.ts):
     - `fetchStudioBySlug(slug)`: resolves MongoDB `_id` from live `/api/studios` feed, then queries `/api/studios/:id` internally.
     - `fetchRelatedStudios(category, currentId)`: queries live `/api/studios?category=...` and returns up to 6 matching category workspaces.
     - `fetchAllStudioSlugs()`: queries all live slugs for `generateStaticParams`.
  3. Renamed route from `src/app/studios/[id]` to `src/app/studios/[slug]`:
     - Browser address bar shows the clean studio slug (e.g. `/studios/echochamber-minimalist-creator-pod-3n5q8x`).
     - Automatic redirect from raw 24-character hex ID to slug if hit directly.
  4. Fixed whitespace bug in `.env` (`NEXT_PUBLIC_API_URL=http://localhost:5000`).
- **Files Touched:**
  - `src/lib/studios.ts`
  - `src/lib/mock-studios.ts` (deleted)
  - `src/app/studios/[slug]/page.tsx`
  - `src/app/studios/[slug]/loading.tsx`
  - `.env`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass: all 20 live database studios compiled successfully).

## 2026-11-11: Build Studio Details Page (/studios/[id]) with Wireframe Parity
- **What Changed:**
  1. Built interactive [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx): main carousel with hover navigation arrows and clickable thumbnail strip with active border indicator.
  2. Built [`src/components/studios/studio-details.tsx`](src/components/studios/studio-details.tsx): comprehensive spec cards (hourly rate, security deposit, capacity, instant booking), host verification card, space description, and full amenity checklist pills.
  3. Built [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx): accessible modal dialog with date/time pickers, dynamic total price calculation, and reservation submission (`POST /api/bookings`) with Sonner toast feedback.
  4. Built [`src/components/studios/studio-reviews.tsx`](src/components/studios/studio-reviews.tsx): star rating summary, verified review cards, and interactive review creation form.
  5. Built [`src/components/studios/related-studios.tsx`](src/components/studios/related-studios.tsx): right-column feed rendering 6 `StudioCard`s in the same category.
  6. Added [`src/app/studios/[id]/loading.tsx`](src/app/studios/[id]/loading.tsx): branded skeleton with pixel-perfect geometry matching the wireframe.
  7. Built [`src/app/studios/[id]/page.tsx`](src/app/studios/[id]/page.tsx): Next.js 16 Partial Prerendering and dynamic route handler with `generateStaticParams` and metadata.
  8. Configured `images.unsplash.com` in `next.config.ts`.
  9. Wrapped `<Navbar />` in `<Suspense>` in `src/app/layout.tsx` to satisfy Next.js 16 dynamic client hook requirements during prerender.
- **Files Touched:**
  - `src/lib/mock-studios.ts`
  - `src/components/studios/studio-gallery.tsx`
  - `src/components/studios/studio-details.tsx`
  - `src/components/studios/studio-booking-dialog.tsx`
  - `src/components/studios/studio-reviews.tsx`
  - `src/components/studios/related-studios.tsx`
  - `src/app/studios/[id]/loading.tsx`
  - `src/app/studios/[id]/page.tsx`
  - `src/app/layout.tsx`
  - `next.config.ts`
  - `docs/BUGS.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build with 49 static/partial prerendered routes).

## 2026-11-11: Revert StudioCard to Official Shadcn Carousel
- **What Changed:**
  1. Reverted [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx) to official Shadcn `Carousel`, `CarouselContent`, and `CarouselItem`.
  2. Restored real-time touch-swipe drag on mobile, pointer dragging on desktop, and smooth sliding inertia.
  3. Structured cleanly to keep code approachable and readable for evaluation.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add GPU-Accelerated Sliding Track to StudioCard
- **What Changed:**
  1. Updated [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx) with a CSS sliding track: `flex transition-transform duration-300 ease-out` mapped to `translateX(-${currentIndex * 100}%)`.
  2. Restored smooth physical horizontal sliding animation without Embla or external libraries.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Replace Embla Carousel in StudioCard with Lightweight useState
- **What Changed:**
  1. Refactored [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx) to drop `Carousel`, `CarouselApi`, `CarouselContent`, `CarouselItem`, and `useEffect`.
  2. Implemented lightweight `useState(0)` managing active gallery index.
  3. Bound prev/next arrows to `handlePrev` / `handleNext` with bounds validation (`Math.max` / `Math.min`) and `stopPropagation()`.
  4. Eliminated multi-engine DOM bloat and potential click conflict on card navigation.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Streamline Workflow & Guarantee Cards & Reduce Inter-Section Gap
- **What Changed:**
  1. Purged decorative elements: stripped right-corner icons, diagram arrows, bottom badges, and metrics from cards.
  2. Aligned titles beside the main step number / icon (`flex items-center gap-3`).
  3. Scaled up titles to `text-lg sm:text-xl font-semibold` and descriptions to `text-base text-muted-foreground`.
  4. Switched icons to neutral palette (`text-muted-foreground`).
  5. Reduced vertical gap between the two sections (`pb-4 sm:pb-6` on `HowItWorksSection`, `pt-4 sm:pt-6` on `HostGuaranteeSection`).
- **Files Touched:**
  - `src/components/home/how-it-works-section.tsx`
  - `src/components/home/host-guarantee-section.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Refactor to Separate Diagram-Style Workflow and Host Guarantee Sections
- **What Changed:**
  1. Replaced merged component with two dedicated modular sections:
     - [`src/components/home/how-it-works-section.tsx`](src/components/home/how-it-works-section.tsx): 4-card diagrammatic workflow grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with numeric step pills, sequential progression arrows, natural typography, and diagram tags.
     - [`src/components/home/host-guarantee-section.tsx`](src/components/home/host-guarantee-section.tsx): 4-card diagrammatic assurance grid with metrics (`$1M Coverage`, `100% Verified`, `Secure Facilities`, `Live Standby`), feature icons, and status badges.
  2. Removed artificial uppercase, excessive tracking, and custom typography overrides; adopted standard natural text styles and Shadcn contrast guidelines.
  3. Integrated both sections into [`src/app/page.tsx`](src/app/page.tsx) with clean spacing and smooth scroll anchors (`#how-it-works`, `#host-guarantee`).
- **Files Touched:**
  - `src/components/home/how-it-works-section.tsx`
  - `src/components/home/host-guarantee-section.tsx`
  - `src/app/page.tsx`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Implement Homepage Booking Workflow & Platform Guarantee Sections
- **What Changed:**
  1. Created [`src/components/home/workflow-guarantee-section.tsx`](src/components/home/workflow-guarantee-section.tsx) delivering both required sections:
     - Section 1 (How Booking Works): 4-step workflow (`01. Discover Spaces` -> `02. Select Shoot Hours` -> `03. Book Instantly` -> `04. Create & Produce`) with dedicated `#how-it-works` scroll anchor.
     - Section 2 (Host Guarantee & Creator Support): 4 assurance pillars (Liability Protection, Verified Profiles, Equipment Safety, 24/7 Host Support) with dedicated `#host-guarantee` scroll anchor.
  2. Implemented side-by-side merged layout on widescreen (`grid-cols-1 lg:grid-cols-2`) and natural vertical stack on mobile/tablet.
  3. Integrated into [`src/app/page.tsx`](src/app/page.tsx).
  4. Styled with `bg-secondary/40 dark:bg-card` rounded-3xl panels, primary amber icons, and zero custom borders.
- **Files Touched:**
  - `src/components/home/workflow-guarantee-section.tsx`
  - `src/app/page.tsx`
  - `docs/TASKS.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Full Codebase Audit & Purge of Explanatory Code Comments
- **What Changed:**
  1. Audited all TypeScript and TSX files across `src/`.
  2. Purged all prompt-instruction parroting, requirement justifications, and verbose comments across `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/components/home/hero-section.tsx`, `src/components/studios/studio-card.tsx`, and `src/types/index.ts`.
  3. Reduced every remaining comment across the application to minimal 1-to-3 word structural headings only.
- **Files Touched:**
  - `src/components/layout/navbar.tsx`
  - `src/components/layout/footer.tsx`
  - `src/components/home/hero-section.tsx`
  - `src/components/studios/studio-card.tsx`
  - `src/types/index.ts`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Enforce Clean Comments Rule & Strip Parroted Instruction Comments
- **What Changed:**
  1. Updated `AGENTS.md` Code Style & UI Primitives: codified strict **Clean Comments Only Rule** forbidding user instruction parroting, requirement justifications, or verbose commentary. Code comments must strictly be concise section headings stating only what the block is or does.
  2. Cleaned [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx): replaced verbose instruction comments with concise structural headings (`{/* Media Carousel */}`, `{/* Navigation Arrows */}`, `{/* Category Badge */}`, `{/* Studio Details */}`, `{/* Host & Rating */}`, `{/* Title */}`, `{/* Rate & Location */}`).
  3. Cleaned [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) headings.
- **Files Touched:**
  - `AGENTS.md`
  - `src/components/studios/studio-card.tsx`
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Extract Reusable StudioCard and StudioCardSkeleton Component
- **What Changed:**
  1. Created [`src/components/studios/studio-card.tsx`](src/components/studios/studio-card.tsx) exporting `StudioCard` and `StudioCardSkeleton`.
  2. Encapsulated carousel navigation, conditional gallery checks, hover arrows, 3-row layout, and click routing logic for cross-page reuse (e.g. `/studios`, related studios, profile).
  3. Refactored [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) to consume `StudioCard` and `StudioCardSkeleton`.
- **Files Touched:**
  - `src/components/studios/studio-card.tsx`
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Increase Vertical Spacing Between Featured Studio Cards
- **What Changed:** In `src/components/home/featured-studios-section.tsx`:
  1. Grid Row Spacing: Separated horizontal and vertical gap tokens. Updated from uniform `gap-6 sm:gap-7` to `gap-x-6 sm:gap-x-7 gap-y-10 sm:gap-y-12`.
  2. Skeleton Parity: Applied matching `gap-y-10 sm:gap-y-12` to skeleton grid.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Add Explore All Studios CTA After Featured Grid
- **What Changed:** In `src/components/home/featured-studios-section.tsx`:
  1. Added centered bottom CTA button after the 6-studio grid: `<Button flat3d size="lg" variant="secondary">` linking to `/studios`.
  2. Spacing: `mt-8 sm:mt-10 md:mt-12 flex justify-center`.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Flip Row 3 Order (Rate Left, Location Right) and Enlarge Rate Typography
- **What Changed:** In `src/components/home/featured-studios-section.tsx`:
  1. Position Flip: Moved hourly rate to left side and location to right side.
  2. Rate Typography: Enlarged rate to `text-base sm:text-lg font-bold text-foreground` with `text-xs sm:text-sm` for `/hr`.
  3. Skeleton Alignment: Mirrored the flipped layout in the loading skeleton (`h-5 w-16` on left, `h-4 w-28` on right).
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Fix Featured Studio Carousel Navigation & Polish Arrow Affordance
- **What Changed:** Fixed carousel next/prev navigation in `src/components/home/featured-studios-section.tsx`:
  1. Arrow Click Propagation Fix: Removed `onClickCapture` suppression and stretched link `after:` overlay collision. Extracted `FeaturedStudioCard` with direct `api.scrollNext()` and `api.scrollPrev()` calls on the Shadcn Embla carousel instance.
  2. Conditional Gallery Arrows: Arrows only render when at least one gallery image exists (`studio.gallery?.length > 0 && images.length > 1`).
  3. Visual Affordance: Scaled arrow buttons to `size-8` (32px) and increased background visibility (`bg-background/95 hover:bg-background text-foreground shadow-md backdrop-blur-md`).
  4. Card Click Routing: Clean `handleCardClick` on `<article>` routes to studio page while ignoring button/anchor clicks.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (production build pass).

## 2026-11-11: Redesign Featured Studio Cards (Carousel, Whole-Card Click, 3-Row Details, Skeletons)
- **What Changed:** Complete architectural overhaul of studio cards in `src/components/home/featured-studios-section.tsx`:
  1. Image & Details Separation: Image container is fully isolated with `rounded-2xl aspect-[16/10] overflow-hidden`. Details section has zero background and zero padding.
  2. Shadcn Image Carousel: Embedded official `@/components/ui/carousel` with left and right navigation arrows (`CarouselPrevious`, `CarouselNext`). Initial state displays only right arrow (`disabled:hidden`). Hover reveal (`group-hover:opacity-100`). Arrow clicks stop propagation to avoid triggering card navigation.
  3. Bigger Category Badge: Enlarged glass badge placed top-left of image (`px-3.5 py-1.5 text-xs sm:text-sm font-semibold`).
  4. Whole-Card Clickability: Removed dedicated "View Details" button. Card title houses stretched link (`after:absolute after:inset-0 after:z-10`) making entire card surface clickable.
  5. 3-Row Information Hierarchy:
     - Row 1: Owner avatar (`Avatar`, `AvatarImage`, `AvatarFallback`) + owner name (left), rating with review count (right).
     - Row 2: Title (`font-body font-bold text-base sm:text-lg text-foreground line-clamp-2 leading-snug`).
     - Row 3: Location pin + city (left), hourly rate with unit (right).
  6. Pixel-Perfect Skeletons: Updated loading skeleton states to replicate the 3-row layout and aspect-ratio geometry with exact pixel fidelity.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `docs/PROGRESS.md`
  - `docs/TASKS.md`
- **Verification Done:** Verified strictly with terminal tools per `AGENTS.md`: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), `npm run build` (0 errors, production build pass).

## 2026-11-11: Build Featured Studios Homepage Grid Section
- **What Changed:** Created `src/components/home/featured-studios-section.tsx` and mounted on `src/app/page.tsx`:
  1. Responsive Layout: Strict `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` layout with minimal spacing (`gap-6 sm:gap-7`).
  2. Data Fetching: Live client fetch from `${apiUrl}/api/studios?top=6` with fallback to 6 curated production studios across all official categories to guarantee deterministic static build and offline resilience.
  3. Image Treatment: Locked `aspect-[16/10]` image container completely flush to the card top/left/right boundaries with **zero outer/inner padding**, smooth 1.05x hover zoom, and overlaid glass pills for category and rating.
  4. Minimal Details: Focused essential hierarchy — title, hourly rate (`$XX/hr`), location pin, max capacity, and `Button` with `flat3d` variant linking to studio details.
  5. Clean Design: Zero extra borders or artificial padding; relies on tonal surface contrast and subtle elevation.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `src/app/page.tsx`
  - `docs/TASKS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly with terminal tools per `AGENTS.md`: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (successful production build).

## 2026-11-11: Align Input Component Radius with Site Standard (rounded-lg)
- **What Changed:** Changed default radius in `src/components/ui/input.tsx` from `rounded-3xl` to `rounded-lg`. Aligns the newsletter input and all future form inputs with the site's standard `rounded-lg` button and control geometry.
- **Files Touched:**
  - `src/components/ui/input.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via `npx tsc --noEmit` and `npm run lint` (0 errors).

## 2026-11-11: Remove Fallback Studios, Hover Lift & Fix Neutral Palette Mismatch
- **What Changed:**
  1. Removed `FALLBACK_STUDIOS` array and all fallback mechanisms completely from `src/components/home/featured-studios-section.tsx`. Live fetch to `/api/studios?top=6` with clean loading skeleton and empty state handling.
  2. Removed card hover lift-up transition (`hover:-translate-y-1` and `transition-transform duration-300`). Cards remain flat and static.
  3. Fixed neutral color clash in `src/app/globals.css`: replaced cool-slate `--secondary` (hue 286.033) with matching warm studio zinc (hue 43.1). Card background (`--card`) and secondary button (`--secondary`) now share the exact same warm hue family across both light and dark modes.
- **Files Touched:**
  - `src/components/home/featured-studios-section.tsx`
  - `src/app/globals.css`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly with terminal tools per `AGENTS.md`: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), and `npm run build` (successful production build).

## 2026-11-11: Replace Custom Footer SVGs with Standard React Icons
- **What Changed:** Installed `react-icons` and replaced custom inline SVG definitions in `src/components/layout/footer.tsx` with standard icons from `react-icons/fa6` (`FaXTwitter`, `FaInstagram`, `FaYoutube`, `FaGithub`, `FaLinkedinIn`).
- **Files Touched:**
  - `package.json`
  - `src/components/layout/footer.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified strictly with terminal tools per `AGENTS.md`: `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass with 0 errors.

## 2026-11-11: Build Global Responsive Footer Component
- **What Changed:** Built complete production-ready global footer in `src/components/layout/footer.tsx` and mounted in `src/app/layout.tsx`:
  1. Brand Showcase: SetSpace logo with hover effect, realistic mission copy, and modern social links using custom SVGs (including the new X logo, Instagram, YouTube, GitHub, and LinkedIn).
  2. Studio Dispatch Newsletter: Integrated with Shadcn `Input` + `Button` and Sonner toast; validates email, clears input, and reveals an in-place VIP confirmation state.
  3. Navigation & Categorization: 4 clean columns linking to all 6 official studio categories (`Photo Studio`, `Sound Stage`, `Podcast Lounge`, `Music Suite`, `Art Workshop`, `Exhibition Hall`), platform features, company links, and Creator Safety trust indicators.
  4. Bottom Bar: Copyright 2026 and legal links (Privacy, Terms, Cookies, Security).
  5. Added `<Toaster />` from `src/components/ui/sonner.tsx` into `RootLayout`.
- **Files Touched:**
  - `src/components/layout/footer.tsx`
  - `src/app/layout.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/sonner.tsx`
  - `docs/TASKS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via Playwright in both Dark and Light modes: tested newsletter submission with valid/invalid inputs; verified layout rendering and responsive container constraints; `tsc` and `eslint` pass cleanly with 0 errors.

## 2026-11-11: Decouple Switch Track Background Speed from Morph Duration
- **What Changed:** Decoupled track transition speed from the icon morph speed in `src/components/theme-toggle.module.css`. Configured `--switch-track-dur: 0.2s` and `--switch-dur: 0.8s`. Overrode universal switch selector with high-specificity `.switch.switch--ready .switch__input { transition-duration: var(--switch-track-dur) !important; }`, allowing instant/snappy 0.2s track background color response while preserving user's 0.8s slow, luxurious icon morphing animation. Preserved all custom CSS tweaks made by user.
- **Files Touched:**
  - `src/components/theme-toggle.module.css`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via Playwright: `.switch__input` computed transition is `0.2s`, `.switch__icon` computed transition is `0.8s`; `tsc` and `eslint` pass cleanly with 0 errors.

## 2026-11-11: Eliminate Theme Toggle Refresh Slide via HTML Class Driven CSS
- **What Changed:** Replaced `.switch__input:checked` rules in `src/components/theme-toggle.module.css` with `.dark .switch__input` and `.dark .switch__icon`. Since `next-themes` sets `<html class="dark">` or `<html class="light">` in `<head>` before the body paints:
  - Refresh in light mode: renders immediately on the left with sun icon (0 animation, 0 sliding).
  - Refresh in dark mode: renders immediately on the right with white crescent moon (0 animation, 0 sliding).
  - Click to toggle in either mode: triggers the 0.4s cubic-bezier morphing animation.
- **Files Touched:**
  - `src/components/theme-toggle.module.css`
  - `src/components/theme-toggle.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified live in Playwright: light refresh starts at `transform: none` on frame 0; dark refresh starts at `matrix(1, 0, 0, 1, 21, 0)` on frame 0; clicking toggles smoothly interpolate across 27 frames; `tsc` and `eslint` clean.

## 2026-11-11: Enable disableTransitionOnChange with Toggle Morph Animation
- **What Changed:** Re-enabled `disableTransitionOnChange` on `<ThemeProvider>` in `src/app/layout.tsx`. Kept the 0.4s morphing toggle animation fully functional by giving `.switch.switch--ready` explicit `transition-property: background-color, transform, box-shadow !important;` in `src/components/theme-toggle.module.css`. Higher CSS class specificity `(0, 2, 0)` overrides `next-themes`'s injected universal selector `*, *::before, *::after` `(0, 0, 0)`, allowing whole-site instant theme switching while the switch morphs smoothly.
- **Files Touched:**
  - `src/app/layout.tsx`
  - `src/components/theme-toggle.module.css`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified via Playwright frame sampling across 420ms: 26 animation frames smoothly interpolated from 21px down to 0px while `disableTransitionOnChange` is active; `npx tsc --noEmit` and `npm run lint` pass cleanly.

## 2026-11-11: Fix Toggle Black Moon & Light Mode Reload State
- **What Changed:**
  1. Fixed black moon: In `src/components/theme-toggle.module.css`, `.switch__icon-part--1` (moon light core) was mistakenly inheriting dark `--background`. Set to bright `#ffffff` while setting the mask rim (`part--3`), cutout (`part--2`), and thumb background to dark track color (`var(--color-neutral-800, var(--card))`), creating a sharp, glowing white crescent moon.
  2. Fixed reload initial state on light theme: In `src/components/theme-toggle.tsx`, subscribed to `document.documentElement.classList.contains('dark')` synchronously via `useSyncExternalStore` so the switch reads the exact class from `next-themes` on initial frame. Added `.switch:not(.switch--ready) { transition: none !important; }` to eliminate reload slide animation.
- **Files Touched:**
  - `src/components/theme-toggle.module.css`
  - `src/components/theme-toggle.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified live in Playwright browser: light mode reload starts as sun with 0 transition; switching to dark mode smoothly slides and morphs into a bright white crescent moon; `npx tsc --noEmit` and `npm run lint` passed with 0 errors.

## 2026-11-11: Remove Toggle Borders & Use Tailwind CSS Color Variables
- **What Changed:**
  1. Removed all borders from `src/components/theme-toggle.module.css`: set `border: 0 !important;` across switch root, input track, and thumb icons; removed dark mode track `border-color`.
  2. Replaced hardcoded `oklch(...)` and hex colors with Tailwind CSS color variables:
     - Light track: `var(--color-neutral-300, var(--input))` with contrast inset shadow.
     - Dark track: `var(--color-neutral-800, var(--card))` with dark inset shadow.
     - Thumb: `var(--color-background, var(--background))` in light mode, `var(--color-neutral-100, var(--foreground))` in dark mode.
     - Sun core & rays: `var(--color-primary-500, var(--primary))`.
     - Moon crater & cutout: `var(--color-neutral-900, var(--background))`.
  3. Cleaned `glass` and `flat-3d` button variants in `src/components/ui/button.tsx`: replaced `border border-black/10` and `dark:border-white/15` with `border border-transparent`, eliminating the dark perimeter line artifact around "Host Your Space".
- **Files Touched:**
  - `src/components/theme-toggle.module.css`
  - `src/components/ui/button.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit`, `npm run lint`, and `next build` (0 errors, 0 warnings).
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).
- **What Changed:** Extracted all 200+ lines of switch morphing animation styles out of `src/app/globals.css` into isolated CSS module `src/components/theme-toggle.module.css`, imported directly into `src/components/theme-toggle.tsx`. Keeps `globals.css` clean and unbloated.
- **Files Touched:**
  - `src/app/globals.css`
  - `src/components/theme-toggle.module.css`
  - `src/components/theme-toggle.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit`, `npm run lint`, and production `next build`.
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-11: Theme Toggle Animation Restoration & Reload State Fix
- **What Changed:** Diagnosed and resolved issues with the morphing theme switch:
  1. Restored animation: Removed `disableTransitionOnChange` from `<ThemeProvider>` in `src/app/layout.tsx` which was injecting `* { transition: none !important; }` on every theme change. Fixed invalid CSS transition syntax in `src/app/globals.css`.
  2. Fixed reload initial state: Changed `isDark` initial state in `src/components/theme-toggle.tsx` to default to `true` (dark mode), preventing the switch from starting with a sun icon on reload.
  3. Redesigned colors: Changed dark mode track from blinding light gray to sleek dark zinc (`oklch(0.22 0.008 45)`) and sun rays to primary amber gold (`var(--primary-500)`), ensuring high contrast across both modes.
  4. Added `nativeButton` to mobile `SheetTrigger` in `src/components/layout/navbar.tsx`.
- **Files Touched:**
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `src/components/theme-toggle.tsx`
  - `src/components/layout/navbar.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified live with Playwright browser: 0 errors, smooth 0.4s cubic-bezier transform animation (`0px -> 4px -> 21px`), dark mode starts as moon on reload without flashing sun. Typecheck and lint pass with 0 errors.

## 2026-11-11: Fix Glass Button Dark Border Artifact
- **What Changed:** Diagnosed and fixed dark border halo on "Host Your Space" (`variant="glass"`). Root cause: Base UI button base styles had `border border-transparent bg-clip-padding`, which clipped the translucent white fill inside the padding box, leaving a 1px transparent trench that exposed the dark backdrop beneath as a dark ring. Resolved by:
  1. Adding `bg-clip-border` to `glass`/`translucent` variants so background extends to outer boundary.
  2. Replacing transparent border with subtle complementary frosted rim (`border border-black/10 dark:border-white/15 dark:hover:border-white/25`) matching modern glassmorphism.
  3. Fixed unitless `-0.5` shadow syntax in `@utility flat-3d` in `src/app/globals.css`.
  4. Removed unused `Button` import from `src/app/page.tsx`.
- **Files Touched:**
  - `src/components/ui/button.tsx`
  - `src/app/globals.css`
  - `src/app/page.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint` (0 errors, 0 warnings).
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-10: Flat-3D Button Hover State & Inset Specular Depth
- **What Changed:** Enhanced `variant="flat-3d"` and `flat3d` modifier in `src/components/ui/button.tsx` so the flat-3D tactile feel persists through hover color shifts. Paired vertical neutral gradient stops (`hover:from-... hover:to-...`) with specular top rim highlight and bottom edge shadow via inset box shadows (`shadow-[inset_0_1px_0_0_...,inset_0_-1px_0_0_...]`) that scale up on hover. Prevents background hover transitions from flattening 3D volume.
- **Files Touched:**
  - `src/components/ui/button.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-10: Strip Custom Duration Classes & Enforce Default Transitions
- **What Changed:** Audited codebase and removed unnecessary custom duration classes (e.g. `duration-300`, `duration-200`) across custom interactive elements, sticking to Tailwind default transition behaviors (`transition-all`, `transition-colors`). Documented transition default rule in `docs/DESIGN.md`.
- **Files Touched:**
  - `src/components/home/hero-section.tsx`
  - `docs/DESIGN.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-10: Standardize Layout Sections to Tailwind Container Utility
- **What Changed:** Replaced all ad-hoc `max-w-7xl mx-auto px-4 ...` and `max-w-4xl mx-auto` wrappers across all layout components with standard `@utility container` configured in `src/app/globals.css`.
  1. Added `@utility container { margin-inline: auto; padding-inline: 1rem; ... }` to `globals.css`.
  2. Updated `src/components/layout/navbar.tsx` header wrapper to `container`.
  3. Updated `src/components/home/hero-section.tsx` section wrapper to `container`.
  4. Updated `src/components/home/category-section.tsx` section wrapper to `container` and stripped nested `max-w-4xl`, restoring clean `grid grid-cols-3 md:grid-cols-6`.
  5. Documented Container Standard in `docs/DESIGN.md`.
- **Files Touched:**
  - `src/app/globals.css`
  - `src/components/layout/navbar.tsx`
  - `src/components/home/hero-section.tsx`
  - `src/components/home/category-section.tsx`
  - `docs/DESIGN.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit`, `npm run lint`, and production `next build`.
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-10: Homepage Categories Grid Section Refinement
- **What Changed:** Refined `src/components/home/category-section.tsx` per user feedback:
  1. Removed hover scale transforms (`scale-[1.03]` and `group-hover:scale-110`), using quiet `transition-colors duration-200` background shifts.
  2. Increased separation between icon and title (`gap-3.5 sm:gap-4 md:gap-4.5`).
  3. Reduced widescreen button footprint by constraining grid width (`max-w-4xl mx-auto`), scaling down icon sizes (`size-6 sm:size-7 md:size-8`), reducing internal button padding (`p-2 sm:p-2.5 md:p-3`), and shrinking section padding (`py-2 sm:py-3 md:py-4`).
  4. Switched icons to neutral muted color (`text-muted-foreground` transitioning to `group-hover:text-foreground`).
- **Files Touched:**
  - `src/components/home/category-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement featured studios grid (`limit(6)` sorted by `rankingScore: -1`).

## 2026-11-10: Global Sticky Navbar Implementation
- **What Changed:** Installed Shadcn `Avatar`, `DropdownMenu`, and `Sheet` components. Built `src/components/layout/navbar.tsx` and mounted it into `RootLayout` (`src/app/layout.tsx`). Features sticky layout, translucent body-matched background (`bg-background/80 backdrop-blur-md`), zero custom borders, brand icon and typography, lowkey active route indicators (`/`, `/studios`, `/#how-it-works`, `/#about-us`), mutually exclusive auth buttons vs. avatar dropdown (`My Bookings`, `My Studios Listings`, `Host My Studio`, `Sign out`), theme toggle, and mobile responsive navigation drawer via Shadcn `Sheet`.
- **Files Touched:**
  - `src/components/ui/avatar.tsx`
  - `src/components/ui/dropdown-menu.tsx`
  - `src/components/ui/sheet.tsx`
  - `src/components/layout/navbar.tsx`
  - `src/app/layout.tsx`
  - `docs/TASKS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement studio category filter tabs or featured studio grid on homepage.

## 2026-11-09: Direct Child Link Pattern for Button Component
- **What Changed:** Enhanced `src/components/ui/button.tsx` to support `<Link>` directly as a child (e.g. `<Button><Link ...>...</Link></Button>`) by automatically detecting React elements with `href` or `asChild` and delegating to Base UI render polymorphism with `nativeButton={false}`. Replaced `render` prop in `hero-section.tsx` with direct `<Link>` children. Synced dots aria-label with user's simplified `StudioSlide` type.
- **Files Touched:**
  - `src/components/ui/button.tsx`
  - `src/components/home/hero-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search, theme toggle, and authentication dropdown.

## 2026-11-09: Mobile Headline Typography & Orphan Word Prevention
- **What Changed:** Fixed wide display font (`Syne`) wrapping on mobile viewports. Scaled mobile font size down to `text-2xl min-[400px]:text-3xl` (scaling to `sm:text-4xl md:text-5xl lg:text-6xl`) and wrapped phrases in `inline-block` (`Book Iconic`, `Production Spaces`, `By The Hour.`) to guarantee phrases stay together and prevent single-word lines. Adjusted mobile horizontal padding to `p-6`.
- **Files Touched:**
  - `src/components/home/hero-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search, theme toggle, and authentication dropdown.

## 2026-11-09: Glass Button Variant, Shape Modifiers, and Hero Sizing
- **What Changed:** Updated `src/components/ui/button.tsx` with:
  1. Default slightly rounded corners (`rounded-lg`) via new `shape` variant (`default: rounded-lg`, `full: rounded-full`).
  2. Larger button scale options (`size="xl"` at `h-12`, `size="2xl"` at `h-14`).
  3. New `glass`/`translucent` variant featuring frosted `backdrop-blur-md` and contrast background matching light and dark modes.
  Applied `size="xl"` to both hero CTAs and `variant="glass"` to "Host Your Space". Updated `docs/DESIGN.md` and `docs/DECISIONS.md`.
- **Files Touched:**
  - `src/components/ui/button.tsx`
  - `src/components/home/hero-section.tsx`
  - `docs/DESIGN.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search, theme toggle, and authentication dropdown.

## 2026-11-09: Install and Configure next-themes Provider & Toggle
- **What Changed:** Installed `next-themes`. Created `src/components/theme-provider.tsx` wrapping root layout with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`, and `disableTransitionOnChange`. Created `src/components/theme-toggle.tsx` using `useSyncExternalStore` and Shadcn `Button` (`variant="ghost"`, `size="icon-sm"`). Logged postmortem in `docs/BUGS.md`.
- **Files Touched:**
  - `package.json`
  - `src/components/theme-provider.tsx`
  - `src/components/theme-toggle.tsx`
  - `src/app/layout.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search, theme toggle, and authentication dropdown.

## 2026-11-09: Resolve Base UI nativeButton Console Error & Enable Dark Mode
- **What Changed:** Fixed Base UI accessibility console warning by automatically setting `nativeButton={false}` when `props.render` is passed to `Button` (e.g. `<Link>`). Added `dark` class to `<html>` in `layout.tsx` (activating dark theme tokens and `dark:bg-transparent` on `Button variant="outline"`). Logged postmortem in `docs/BUGS.md`.
- **Files Touched:**
  - `src/components/ui/button.tsx`
  - `src/app/layout.tsx`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search and authentication dropdown.

## 2026-11-09: Document No-Custom-Borders Policy & Investigate Outline Button
- **What Changed:** Documented strict rule to ban custom borders across the codebase unless strictly necessary; enforce background-to-foreground contrast for visual hierarchy across `AGENTS.md`, `docs/DESIGN.md`, `docs/DECISIONS.md`, and `docs/PROGRESS.md`. Analyzed `Button variant="outline"` behavior inside the dark hero section and diagnosed build/typecheck memory issues.
- **Files Touched:**
  - `AGENTS.md`
  - `docs/DESIGN.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search and authentication dropdown.

## 2026-11-09: Hero Layout Simplification & Custom Primary Gradient
- **What Changed:** Replaced carousel sliding with simple, smooth cross-fade dissolve transition (`transition-opacity duration-1000`). Removed fixed min-height for pure responsiveness. Applied even padding (`p-8 sm:p-12 lg:p-16`) and embedded slider dots inside hero content flow. Streamlined description to be punchy and concise. Added line break after "Production Spaces". Defined `@utility text-gradient-primary` in `globals.css` using the primary OKLCH palette (`--primary-500` through `--primary-200`) and applied to title.
- **Files Touched:**
  - `src/app/globals.css`
  - `src/components/home/hero-section.tsx`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint` (0 errors, 0 warnings).
- **Next Step:** Implement global navigation header with studio search and authentication dropdown.

## 2026-11-09: Adopt Shadcn Carousel & Refine Hero Dots
- **What Changed:** Installed official Shadcn `Carousel` (`src/components/ui/carousel.tsx`, backed by `embla-carousel-react`). Migrated hero background image carousel to official Shadcn `Carousel` component. Stripped hover pause behavior (continuous 5s interval). Removed dots background pill; reduced dot size to micro-scale (`h-1`); set inactive dots to perfect circles (`w-1 h-1 bg-neutral-600`); highlighted active dot with neutral white (`w-7 h-1 bg-neutral-100`). Reduced gap between action buttons and dots. Reinforced strict Shadcn-First policy across `AGENTS.md` and `docs/DESIGN.md`.
- **Files Touched:**
  - `src/components/ui/carousel.tsx`
  - `src/components/home/hero-section.tsx`
  - `AGENTS.md`
  - `docs/DESIGN.md`
  - `docs/BUGS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint` (0 errors, 0 warnings).
- **Next Step:** Implement global navigation header with studio search and authentication dropdown.

## 2026-11-09: Hero Refactor & Strict Shadcn Component Adoption
- **What Changed:** Installed official Shadcn `Button` component (`src/components/ui/button.tsx`). Refactored Hero Section: removed top badge above title, removed bottom widgets below action buttons, replaced custom link buttons with standard Shadcn `Button` variants (`default`, `secondary`), stripped custom borders and glows, refined slider dots to lowkey borderless/glowless circles with active expansion. Recorded strict component variant rules across `AGENTS.md`, `docs/DESIGN.md`, `docs/DECISIONS.md`, and `docs/PROGRESS.md`.
- **Files Touched:**
  - `src/components/home/hero-section.tsx`
  - `src/components/ui/button.tsx`
  - `AGENTS.md`
  - `docs/DESIGN.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint`.
- **Next Step:** Implement global navigation header with studio search and authentication dropdown.

## 2026-11-09: Homepage Hero Section Implementation
- **What Changed:** Built container-wrapped hero section with 6 dark aesthetic studio slides (Photo Studio, Sound Stage, Podcast Lounge, Music Suite, Art Workshop, Exhibition Hall). Added dark-to-transparent gradient, converting headline, dual CTAs, live specs preview, and bottom-middle expanding pill dot pagination without arrow controls. Configured Unsplash remote image patterns in `next.config.ts`.
- **Files Touched:**
  - `src/components/home/hero-section.tsx`
  - `src/app/page.tsx`
  - `next.config.ts`
  - `docs/TASKS.md`
  - `docs/PROGRESS.md`
- **Verification Done:** Verified clean with `npx tsc --noEmit` and `npm run lint` (0 errors, 0 warnings).
- **Next Step:** Build global navigation header with studio search and authentication dropdown.

## 2026-11-09: Synchronized Project Spec & Living Docs Policy
- **What Changed:** Memorized updated `PROJECT.md` requirements (models, endpoints, routes, Sonner, modal, grading criteria). Recorded living documentation policy across `AGENTS.md`, `DECISIONS.md`, and `PROGRESS.md`.
- **Files Touched:**
  - `docs/PROJECT.md`
  - `docs/DECISIONS.md`
  - `docs/PROGRESS.md`
  - `AGENTS.md`
- **Verification Done:** Verified documentation integrity, linter, and typechecker.
- **Next Step:** Implement global navigation header and initial studio type definitions.

## 2026-11-09: Repository Memory System & Theme Integration
- **What Changed:** Created repository documentation system under `docs/` and synced Tailwind v4 `@theme inline` with SetSpace #FA6E16 primary color palette.
- **Files Touched:**
  - `src/app/globals.css`
  - `AGENTS.md`
  - `docs/*`
- **Verification Done:** Ran `npm run lint` and `npx tsc --noEmit` cleanly.
- **Next Step:** Implement shared header component and studio space search layout.
