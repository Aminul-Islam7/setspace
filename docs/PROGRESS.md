# Progress Log

Record daily or milestone progress entries. Keep concise and chronological.

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
