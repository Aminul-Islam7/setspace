# Architecture & Design Decisions

Record of architectural, design, and structural decisions. Add dated entries in reverse-chronological order.

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
