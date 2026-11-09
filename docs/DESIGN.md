# SetSpace Design System

## Brand Identity & Theme Tokens
SetSpace uses a warm, energetic creative-space theme with high contrast and modern typography.

### Color Palette (Primary: `#FA6E16`)
- `50`: `oklch(99.03% 0.0058 59.65)` (Warm light tint / primary-foreground)
- `100`: `oklch(92.49% 0.0445 54.01)`
- `200`: `oklch(86.45% 0.0838 53.4)`
- `300`: `oklch(80.65% 0.1231 51.12)`
- `400`: `oklch(75.27% 0.1615 48.11)`
- `500`: `oklch(69.94% 0.1914 45.54)` — **Primary Brand (`#FA6E16`)**
- `600`: `oklch(59.82% 0.1563 46.11)`
- `700`: `oklch(49.78% 0.1203 47.15)`
- `800`: `oklch(39.77% 0.0847 47.79)`
- `900`: `oklch(29.56% 0.0475 47.69)`
- `950`: `oklch(19.53% 0.0077 48.31)`

### Typography
- **Display & Headings (`h1`-`h4`):** `Syne` (`--font-display`), fallback `Montserrat` (`--font-heading`).
- **Body & Controls:** `Plus Jakarta Sans` (`--font-body`), fallback `Inter` (`--font-sans`).
- Applied automatically in `globals.css`:
  - `html` -> `@apply font-body;`
  - `h1, h2, h3, h4` -> `@apply font-display;`

### UI Primitives & Styling Rules
- **Strict Shadcn-First Architecture:** Always use official Shadcn / Base UI components (Button, Carousel, Dialog, Field, Input, etc.). Never write custom ad-hoc sliders, carousels, or basic primitives from scratch when an official Shadcn component exists. Add via `npx shadcn add <component>`.
- **No Custom Borders Standard:** Do not use custom borders anywhere unless absolutely necessary. Rely on background-foreground contrast, surface color shifts, and tonal contrast for visual separation and hierarchy rather than adding borders.
- **No Custom Designs for Basic Components:** Never use custom designs, inline overrides, ad-hoc borders, or glows on basic components (e.g., buttons, badges, inputs). Use component-provided variants only (`variant="default"`, `variant="secondary"`, `variant="outline"`, etc.).
- **Button Component Specifications:**
  - **Default Shape:** Slightly rounded (`rounded-lg`) by default. Full rounded (`shape="full"` / `rounded-full`) available when requested.
  - **Sizes:** Standard (`xs`, `sm`, `default`, `lg`) plus large hero sizes (`xl` at `h-12`, `2xl` at `h-14`).
  - **Glass / Translucent Variant (`variant="glass"`):** Frosted glass styling with `backdrop-blur-md`, subtle contrast fill (`bg-foreground/5 dark:bg-white/15`), and hover states. Works in both light and dark modes.
- **Variant Creation Rule:** If a new component variant is needed, do not inline custom styles. Only create a new variant in the component's CVA definition when explicitly instructed by the user.
- **Lowkey & Clean Aesthetics:** Keep UI clean and unbloated. Remove gratuitous glows, artificial borders, and heavy drop shadows. Slider dots must be lowkey, borderless, glowless, and perfect circles (expanding in width with neutral color only when active; no background or borders on dot containers).
- **Radius System:** Base `--radius: 0.625rem` with fractional steps `--radius-sm` through `--radius-4xl`.
- **Reusable Styles:** Proactively extract and plan shared styling utilities; avoid hardcoded, single-use utility clutter. Keep Tailwind classes clean and readable.
