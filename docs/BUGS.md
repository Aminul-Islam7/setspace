# Bug Log & Postmortems

Log resolved issues, regressions, and lessons learned.

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
