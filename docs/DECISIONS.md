# Architecture & Design Decisions

Record of architectural, design, and structural decisions. Add dated entries in reverse-chronological order.

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
