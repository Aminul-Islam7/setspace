# Bug Log & Postmortems

Log resolved issues, regressions, and lessons learned.

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
