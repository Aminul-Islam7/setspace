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
- **Base UI & Shadcn:** `base-luma` style with `@base-ui/react` primitives.
- **Radius System:** Base `--radius: 0.625rem` with fractional steps `--radius-sm` through `--radius-4xl`.
- **Reusable Styles:** Proactively extract and plan shared styling utilities; avoid hardcoded, single-use utility clutter. Keep Tailwind classes clean and readable.
