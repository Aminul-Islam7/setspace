# Architecture & Design Decisions

Record of architectural, design, and structural decisions. Add dated entries in reverse-chronological order.

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
