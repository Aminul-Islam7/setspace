# Bug Log & Postmortems

Log resolved issues, regressions, and lessons learned.

## 2026-11-11: Vercel 308 Permanent Redirect CORS Failure on Trailing Slash API URL
- **Symptom:** Browser failed with `net::ERR_FAILED 308 (Permanent Redirect)` and CORS error: `Access to fetch at 'https://setspace-api-v1.vercel.app//api/studios?top=6' from origin 'https://setspace-studios.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Root Cause:** In Vercel Environment Variables, `NEXT_PUBLIC_API_URL` was configured with a trailing slash (`https://setspace-api-v1.vercel.app/`). Concatenating `${apiUrl}/api/...` created a double-slash URL (`//api/studios?top=6`). Vercel's edge proxy intercepted the double slash before hitting the backend server and issued an HTTP 308 redirect to clean the path to `/api/studios?top=6`. Because the edge redirect response omitted CORS headers, the browser blocked the cross-origin redirect.
- **Fix:** Sanitized all instances of `process.env.NEXT_PUBLIC_API_URL` using `.replace(/\/+$/, '')` across [`src/components/home/featured-studios-section.tsx`](src/components/home/featured-studios-section.tsx) and [`src/components/studios/studio-booking-dialog.tsx`](src/components/studios/studio-booking-dialog.tsx).
- **How to Avoid:** Always sanitize base API URL environment variables by stripping trailing slashes with `.replace(/\/+$/, '')` before appending endpoint paths.

## 2026-11-11: Vercel Cloud Build Failure: Empty generateStaticParams with Cache Components
- **Symptom:** Vercel deployment build failed with error: `Error: When using Cache Components, all 'generateStaticParams' functions must return at least one result. This is to ensure that we can perform build-time validation that there is no other dynamic accesses that would cause a runtime error. Learn more: https://nextjs.org/docs/messages/empty-generate-static-params at generateStaticParams (src/app/studios/[slug]/page.tsx:34:8)`.
- **Root Cause:** In the cloud CI environment (Vercel), `process.env.NEXT_PUBLIC_API_URL` either pointed to `localhost:5000` (developer's local machine) or was unreachable during the build phase. When `fetchAllStudioSlugs()` failed network fetch, it returned an empty array `[]`. Next.js 16 with `cacheComponents: true` strictly prohibits empty arrays from `generateStaticParams()`.
- **Fix:** Removed `generateStaticParams()` from [`src/app/studios/[slug]/page.tsx`](src/app/studios/[slug]/page.tsx). Next.js 16 automatically treats `/studios/[slug]` as a Partial Prerendering (PPR) dynamic route (`◐`), generating static shells and streaming real studio data on-demand without requiring pre-build API availability.
- **How to Avoid:** Do not export `generateStaticParams()` on routes that depend on external, non-build-time mock APIs. Rely on Next.js 16 PPR on-demand streaming instead.

## 2026-11-11: Next.js 16 Build Worker Heap Exhaustion / Exit Code 3221226505
- **Symptom:** Running `npm run build` failed with `FATAL ERROR: Committing semi space failed. Allocation failed - JavaScript heap out of memory` during TypeScript checking or `⨯ Next.js build worker exited with code: 3221226505 and signal: null` during `Collecting page data using 8 workers`.
- **Root Cause:** Stale cache artifacts and route types accumulated in `.next/` across route additions (`not-found.tsx`) and dynamic parameter modifications. When Next.js spawned parallel page collection workers on Windows, the stale cache caused worker V8 heap memory to overflow (`STATUS_STACK_BUFFER_OVERRUN` / `0xC0000409`).
- **Fix:** Cleared the `.next` directory completely via `Remove-Item -Recurse -Force .next`. Rebuilding from scratch resolved cleanly (27/27 static & PPR routes compiled).
- **How to Avoid:** When adding root route handlers (like `not-found.tsx`), changing route segments, or seeing worker code `3221226505`, delete `.next` to flush stale compiler cache before running `next build`.

## 2026-11-11: Gallery Navigation Arrows Jumping Down on Active Click
- **Symptom:** In `StudioGallery`, clicking the gallery next/previous arrow buttons caused the button to jump downwards significantly (~20px) while pressed (`:active`).
- **Root Cause:** The buttons were centered vertically via `top-1/2 -translate-y-1/2`. The Shadcn `Button` component in `src/components/ui/button.tsx` includes `active:not-aria-[haspopup]:translate-y-px`. When clicked, Tailwind's `active:translate-y-px` overwritten `--tw-translate-y: 1px`, wiping out `-translate-y-1/2` (-50% of button height) and shifting the button down by ~21px.
- **Fix:** Switched vertical centering from `top-1/2 -translate-y-1/2` to `inset-y-0 my-auto` and added `active:translate-y-0` in [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx). This centers the button purely via box model margins without transform translations and neutralizes the active displacement.
- **How to Avoid:** Never use `top-1/2 -translate-y-1/2` on elements that use classes with `active:translate-y-*` or other transform-based micro-interactions. Use `inset-y-0 my-auto` for absolute vertical centering instead.

## 2026-11-11: Gallery Thumbnails Ring Outline Clipped by overflow-x-auto
- **Symptom:** In `StudioGallery`, the active thumbnail's rounded orange focus ring (`ring-2 ring-primary ring-offset-2`) had its top, left, and bottom edges clipped flat against the scroll container boundary.
- **Root Cause:** The thumbnail strip container had `overflow-x-auto` with zero top and zero horizontal padding (`pb-1` only). The 4px spread of `ring-2 ring-offset-2` extended past the button edge and collided directly with the container's overflow clipping rect.
- **Fix:** Added `p-1.5 -m-1.5` to the scroll strip container in [`src/components/studios/studio-gallery.tsx`](src/components/studios/studio-gallery.tsx) and removed `scale-95`. This provides 6px of breathing room around all outer edges, ensuring the 4px ring is completely visible and fully rounded without clipping.
- **How to Avoid:** Whenever applying exterior focus/active rings (`ring-offset-*`) inside an `overflow: auto` or `overflow: hidden` container, always provide matching padding (e.g. `p-1.5` paired with negative margin `-m-1.5`) so rings are not clipped by the overflow boundary.

## 2026-11-11: Next.js 16 Partial Prerendering Blocking on usePathname() Outside Suspense
- **Symptom:** Next.js build error during page prerender: `Error: Route "/studios/[id]": Next.js encountered URL data usePathname() in a Client Component outside of <Suspense>`.
- **Root Cause:** Next.js 16 with `cacheComponents` and `partialPrefetching` flags dynamic URL data in Client Components rendered in the root layout before static HTML prerender finishes.
- **Fix:** In `src/app/layout.tsx`, wrapped `<Navbar />` inside `<Suspense fallback={<div className="h-16 sm:h-20 w-full bg-background/80" />}>`.
- **How to Avoid:** Any layout-level Client Component reading `usePathname()`, `useSearchParams()`, or headers must be enclosed in `<Suspense>`.

## 2026-11-11: Theme Toggle Moon Black & Light Mode Reload State Glitch
- **Symptom 1 (Black Moon):** In dark mode, the switch thumb appeared completely black and invisible inside the dark track.
  - **Root Cause:** In `src/components/theme-toggle.module.css`, `.switch__icon-part--1` (the white moon light body) was set to `var(--color-background, var(--background))`. In `.dark`, `--background` is dark charcoal (`oklch(0.147...)`). The outer ring (`part--3`) had a dark inset shadow, the cutout (`part--2`) was dark, and the moon body itself (`part--1`) was black. 100% of the moon was painted black.
  - **Fix:** Restored `.switch__icon-part--1` to bright white (`#ffffff`). Set `.switch__icon`, `.switch__icon-part--2`, and `.switch__icon-part--3` to `var(--color-neutral-800, var(--card))` to match the dark track, cleanly carving out the white crescent moon.
- **Symptom 2 (Starting as Moon on Light Mode Reload):** On page refresh with light mode enabled, the switch briefly started in dark mode (moon) and animated back to sun.
  - **Root Cause:** SSR defaulted unmounted `isDark` state to `true` (server-rendered `<input checked>`). On hydration, React switched to light mode (`false`), triggering a 0.4s sliding animation across the track.
  - **Fix:** In `src/components/theme-toggle.tsx`, subscribed to `document.documentElement.classList.contains('dark')` synchronously via `useSyncExternalStore` so the exact client DOM class (`light` vs `dark`) set by `next-themes` is read on the first client paint. Suppressed CSS transitions prior to hydration via `.switch:not(.switch--ready) { transition: none !important; }`.

## 2026-11-11: Theme Toggle SSR Desync Causing Reload Slide on Light Theme
- **Symptom:** On page reload in light mode, the toggle icon initialized on the right side and slid to the left (moon-to-sun).
- **Root Cause:** Toggle CSS states previously relied on `.switch__input:checked`. On the server, `isDark` defaulted to `true`, rendering `<input checked>` in the server HTML. During initial paint before React hydration, the browser parsed `checked`, positioning the icon at `translateX(1.5em)`. When React hydrated with `light`, it removed `checked`, triggering an animated slide back to `0px`.
- **Fix:** Refactored dark mode CSS rules in `src/components/theme-toggle.module.css` from `.switch__input:checked` to `.dark .switch__input` and `.dark .switch__icon`. Since `next-themes` applies `class="dark"` or `class="light"` to `<html>` via `<head>` script before the body paints:
  - On light mode refresh: `<html>` lacks `.dark`, so the toggle renders on the left with sun from frame 0 (0 animation).
  - On dark mode refresh: `<html>` has `.dark`, so the toggle renders on the right with moon from frame 0 (0 animation).
  - On toggle click: `setTheme` modifies `.dark` on `<html>`, triggering the smooth 0.4s morphing animation.
- **How to Avoid:** Never bind theme toggle SSR visual layout to `<input:checked>` pseudo-class when theme is stored in `localStorage`; bind visual layout to the `<html>` theme class injected by the inline head script.

## 2026-11-11: next-themes disableTransitionOnChange vs Toggle Animations
- **Symptom:** When `disableTransitionOnChange` is enabled on `ThemeProvider`, theme toggle switch animation was previously muted.
- **Root Cause:** Next-themes injects a `<style>` containing `*,*::before,*::after { transition: none !important; }` (universal selector specificity `(0, 0, 0)`).
- **Fix:** Enabled `disableTransitionOnChange` on `ThemeProvider` in `src/app/layout.tsx` so the rest of the page updates colors instantly without layout flash. In `src/components/theme-toggle.module.css`, applied `.switch.switch--ready, .switch.switch--ready * { transition-property: background-color, transform, box-shadow !important; transition-duration: var(--switch-dur) !important; transition-timing-function: var(--switch-timing) !important; }`. Higher class specificity `(0, 2, 0)` overrides `next-themes`'s universal selector rule for the switch while preserving instant transitions everywhere else.
- **How to Avoid:** Overcome global transition mutes on specific components by providing explicit `transition-property: ... !important;` under higher-specificity class selectors.

## 2026-11-11: Theme Toggle SSR State Flashing Light Sun on Dark Theme Reload
- **Symptom:** On page refresh in dark mode, the switch starts as a sun icon (light mode) and pops to the moon after hydration.
- **Root Cause:** `ThemeToggle` checked state evaluated `const isDark = mounted && resolvedTheme === 'dark'`. Since `mounted` is `false` during SSR and first paint, `isDark` defaulted to `false` (unchecked = sun).
- **Fix:** Initialized `const isDark = mounted ? resolvedTheme === 'dark' : true;` in `src/components/theme-toggle.tsx`, ensuring dark mode is assumed initially to match the app's `defaultTheme="dark"`.
- **How to Avoid:** Match initial unmounted boolean state to the application's default theme rather than defaulting to false.

## 2026-11-10: Next.js 16 Dynamic Prerender Error on new Date()
- **Symptom:** Next.js build error: "Route '/': Next.js encountered the unstable value `new Date()` in a Client Component. This value would be evaluated during the prerender, instead of recomputed on each visit."
- **Root Cause:** Next.js 16 blocks evaluating dynamic time calls (`new Date()`, `Date.now()`) inside Client Component prerenders to guarantee deterministic HTML snapshots.
- **Fix:** Replaced dynamic `new Date().getFullYear()` in `src/components/layout/navbar.tsx` with static copyright year constant (`2026`).
- **How to Avoid:** Never read current time directly in Client Component render body; defer to `useEffect`, timing APIs, or use static values.

## 2026-11-10: Base UI SheetClose nativeButton Accessibility Warning
- **Symptom:** Console error: "Base UI: A component that acts as a button expected a native <button> because the `nativeButton` prop is true. Rendering a non-<button> removes native button semantics...".
- **Root Cause:** In Shadcn/Base UI, `SheetPrimitive.Close` inherits `nativeButton=true` by default. Passing `<Link>` into `render` renders an anchor without disabling `nativeButton`.
- **Fix:** In `src/components/ui/sheet.tsx`, defaulted `nativeButton={nativeButton ?? (props.render ? false : undefined)}`.
- **How to Avoid:** Apply `nativeButton={false}` whenever delegating Base UI button/close triggers to anchor tags.

## 2026-11-09: Synchronous setState in useEffect for Mounted Theme Check
- **Symptom:** ESLint flagged `react-hooks/set-state-in-effect` error on `setMounted(true)` inside `useEffect`.
- **Root Cause:** Calling `setState` inside synchronous effect body triggers cascading renders in React 19.
- **Fix:** Switched to standard React `useSyncExternalStore` (`() => true`, `() => false`) for hydration detection.
- **How to Avoid:** Use `useSyncExternalStore` for client-only mounting instead of `useEffect` + `setState`.

## 2026-11-09: Base UI Button nativeButton Accessibility Warning with Link
- **Symptom:** Console error: "Base UI: A component that acts as a button expected a native <button> because the `nativeButton` prop is true. Rendering a non-<button> removes native button semantics...".
- **Root Cause:** Base UI `ButtonPrimitive` defaults `nativeButton=true`. Passing `render={<Link ... />}` renders an `<a>` element, triggering Base UI's semantic check.
- **Fix:** In `src/components/ui/button.tsx`, defaulted `nativeButton={nativeButton ?? (props.render ? false : undefined)}`.
- **How to Avoid:** Whenever passing a polymorphic non-button component into `render`, ensure `nativeButton={false}` is assigned.

## 2026-11-09: Synchronous setState in useEffect (Carousel & React 19)
- **Symptom:** ESLint flagged `react-hooks/set-state-in-effect` error: "Calling setState synchronously within an effect can trigger cascading renders".
- **Root Cause:** Calling `onSelect(api)` directly in synchronous body of `useEffect` on component mount/init.
- **Fix:** In `carousel.tsx`, deferred initial sync with `setTimeout(..., 0)`. In `hero-section.tsx`, initialized index via `useState(0)` and synced via event listeners (`api.on('select')`, `api.on('reInit')`).
- **How to Avoid:** Never call state setters synchronously inside `useEffect` root body; use initial state or event subscriptions.

## 2026-11-09: Unused Import in page.tsx Warning
- **Symptom:** ESLint flagged `@typescript-eslint/no-unused-vars` for `Image` import in `src/app/page.tsx`.
- **Root Cause:** Boilerplate placeholder import remaining after clearing default Next.js template markup.
- **Fix:** Removed unused `Image` import from `src/app/page.tsx`.
- **How to Avoid:** Run `npm run lint` before committing any page changes.
