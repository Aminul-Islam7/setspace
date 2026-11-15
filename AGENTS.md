<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SetSpace Agent Guidelines

## Docs Index & Living Documentation Principle

No document is fixed or static (including AGENTS.md and PROJECT.md). Design decisions, backend APIs, schemas, and requirements evolve continuously. When user makes changes or requests updates, update all relevant docs.

- **Before coding:** Always read and align with relevant docs for that area. Check `docs/BUGS.md` for known pitfalls.
- **After coding:** In the same change, update all affected docs (`docs/TASKS.md`, `docs/DECISIONS.md`, `docs/BUGS.md`, `docs/PROGRESS.md`).
- [docs/PROJECT.md](docs/PROJECT.md) — Scope, endpoints, data models, routes, grading rules.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Layout, Next 16 RSC patterns, form architecture.
- [docs/DESIGN.md](docs/DESIGN.md) — Primary #FA6E16 palette, typography tokens, UI rules.
- [docs/TASKS.md](docs/TASKS.md) — Active backlog; mark tasks done when complete.
- [docs/DECISIONS.md](docs/DECISIONS.md) — Dated architectural and design decisions.
- [docs/BUGS.md](docs/BUGS.md) — Past bugs, root causes, prevention.
- [docs/PROGRESS.md](docs/PROGRESS.md) — Chronological change logs, files touched, next steps.

## Tech Stack & Commands

- **Stack:** Next.js 16 (App Router, Turbopack, React Compiler), React 19, TypeScript 5, Tailwind CSS v4, Base UI (`@base-ui/react`), Shadcn (`base-luma`), npm.
- `npm run dev` — Dev server on `:3000`. Writes `.next/dev/types` and updates Next.js block in this file.
- `npm run build` | `npm start` — Production build & serve.
- `npm run lint` — ESLint flat config.
- `npx tsc --noEmit` — Typecheck (run after dev/build generates route types).
- No test runner configured. Recommended single test: `npx vitest run <file>`.

## Next.js 16 Specifics

- `cacheComponents`, `partialPrefetching`, and `reactCompiler` enabled in `next.config.ts`.
- Dynamic calls (`cookies()`, `headers()`, `params`, `searchParams`) must be inside `<Suspense>` or cached scopes.
- Route props are generated globals (e.g. `LayoutProps<'/'>`). Never manually write route parameter types.
- App code lives in `src/`. Path alias `@/*` maps to `./src/*`.

## Forms & Validation Standards

- Use `react-hook-form` + `@hookform/resolvers/zod` + `zod`.
- Use composable `field.tsx` primitives (`FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, `FieldError`). No manual touched loops.
- Client fetch directly to `process.env.NEXT_PUBLIC_API_URL`. Map backend errors via `form.setError(name, { type: 'server', message })` to `<FieldError>`.
- **Strict Interface Typing Rule:** Never write un-typed inline payload objects or arbitrary ad-hoc properties when making network calls or handling application data models. Always import and adhere strictly to official data contracts defined in `@/types` (`Booking`, `Studio`, `CreateBookingPayload`, `PaginatedResponse`, `StudioAvailabilityResponse`, etc.). Every fetch response must be strictly typed to its corresponding interface so both frontend and backend remain strictly synchronized.

## Code Style & UI Primitives

- Match surrounding code: tabs (4-space width), single quotes, semicolons, trailing commas.
- Keep Tailwind clean; reuse styles rather than hardcoding ad-hoc utility classes.
- **Strict Shadcn-First Policy:** Always use official Shadcn / Base UI components (Button, Carousel, Dialog, Field, Input, etc.). Never write custom ad-hoc sliders or UI primitives when an official Shadcn component exists. Add via `npx shadcn add <component>`.
- Use built-in variants only (`variant="default"`, `variant="secondary"`, etc.). Never write custom pseudo-variants or add new variants unless user commands.
- **Primary & Neutral Colors Only Rule:** Strictly use semantic primary and neutral color tokens defined in the theme. Never hardcode arbitrary `white`, `black`, `#fff`, or `#000` unless strictly unavoidable (such as video media overlays).
- **Zero Arbitrary Opacity Modifiers Rule:** Never sprinkle ad-hoc opacity modifiers (e.g. `/70`, `/60`, `/50`, `/40`, `/30`, `/20`) onto background surfaces. Define and use dedicated, solid semantic tokens (`--background`, `--card`, `--secondary`, `--muted`, `--accent`) so surfaces remain cohesive, readable, and solid across themes.
- **Borderless Dark Mode & Sparing Light Mode Borders Standard:** Never overuse borders. In dark mode, rely entirely on tonal contrast and surface elevation shifts (`bg-background` -> `bg-card` -> `bg-secondary` -> `bg-muted`) without borders. In light mode, apply subtle borders (`border-border/50 dark:border-0`) sparingly and only when strictly required for contrast against light backgrounds.
- **Modern Tailwind v4 Linear Syntax:** Strictly use modern Tailwind v4 linear utility classes (`bg-linear-to-r`, `bg-linear-to-l`, `bg-linear-to-b`, `text-linear-primary`). Never use deprecated v3 gradient syntax like `bg-gradient-to-*`.
- **High-Contrast Form Fields Standard:** Input fields, textareas, and select triggers must guarantee strong visual contrast in both light and dark themes with clear text (`text-foreground`), high-contrast placeholders (`placeholder:text-muted-foreground`), and legible disabled states.
- **Zero Fallbacks & Anti-Overfallbacking Rule:** Never implement defensive fallback mechanisms, mock data fallbacks, silent degradations, or guessing property aliases (such as `s.date || s.bookingDate` or `data.data || data.studios || []`) anywhere in this application. Overfallbacking masks underlying bugs, creates phantom state, and hinders error anticipation. When an API contract, network request, or state condition fails, fail explicitly with clear errors so issues can be anticipated and fixed directly at the root cause.
- **Pixel-Perfect Skeleton Alignment Rule:** Skeletons must always be pixel-perfect copies of the rendered component layouts. Every layout change (paddings, gaps, grid columns, heights, and card shapes) must immediately be mirrored in the corresponding skeleton. Skeletons must never contain phantom elements (elements that do not exist in the actual view) or mismatched aspect ratios to prevent layout shifts.
- **Route-Scoped Loading Rule:** Never place a generic `loading.tsx` in a parent directory that has dynamic sibling sub-routes (e.g. `app/studios/loading.tsx` leaking into `app/studios/[slug]/`). Use route groups like `app/studios/(explorer)/loading.tsx` to isolate loading states strictly to their specific page.
- **Responsive Bottom Sheet & Scrollbar Containment Rule:** All modal dialogs on mobile screens (`< sm`) must render as sliding bottom sheets (`fixed inset-x-0 bottom-0 rounded-t-3xl rounded-b-none`, sliding up from and into the bottom) with a top drag handle indicator. On desktop (`sm:`), dialogs render as centered modals (`sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl`). The dialog popup container must strictly enforce `overflow-hidden` to prevent Windows Chromium rectangular scrollbars from bleeding outside rounded corners. Scrollable dialog content must live in an inner `flex-1 overflow-y-auto overflow-x-hidden p-6` viewport.
- **Clean Comments Only Rule:** Never parrot user instructions, styling references, or prompt details in code comments (e.g. `{/* YouTube Style Search Bar */}` or `{/* Studio Details Section (No background, No padding) */}`). Comments must strictly work as minimal section headings describing what the code is or what it does, as short and concise as possible (e.g. `{/* Search Bar */}`, `{/* Studio Details */}`). Zero extra or verbose commentary.

## Verification & Workflow Guardrails

- **DO NOT TOUCH BACKEND:** Never create or edit files in `../setspace-api`. Frontend only. Assume missing endpoints exist.
- **DO NOT COMMIT & PUSH:** Do not commit or push unless explicitly commanded by user.
- **NEVER OVERWRITE USER WORK:** User writes and modifies code directly. Always read the file before editing. Never clobber or revert user modifications.
- **NO BROWSER / PLAYWRIGHT VERIFICATION:** Do NOT open Playwright, Chrome DevTools, or headless browser for visual checks or screenshots unless the user explicitly asks for it. Rely strictly on terminal verification: `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- **DO NOT TOUCH:** Keep `<!-- BEGIN:nextjs-agent-rules -->` block intact. Never edit `.next/` or `next-env.d.ts`.
- **Docs Maintenance:** Check diffs first (user writes code too).


