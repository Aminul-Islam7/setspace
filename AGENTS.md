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

## Code Style & UI Primitives

- Match surrounding code: tabs (4-space width), single quotes, semicolons, trailing commas.
- Keep Tailwind clean; reuse styles rather than hardcoding ad-hoc utility classes.
- **Strict Shadcn-First Policy:** Always use official Shadcn / Base UI components (Button, Carousel, Dialog, Field, Input, etc.). Never write custom ad-hoc sliders or UI primitives when an official Shadcn component exists. Add via `npx shadcn add <component>`.
- Use built-in variants only (`variant="default"`, `variant="secondary"`, etc.). Never write custom pseudo-variants or add new variants unless user commands.
- **No Custom Borders Rule:** Never use custom borders anywhere unless absolutely necessary. Rely on background-foreground contrast, surface elevation, and tonal contrast for visual separation.
- **Clean Comments Only Rule:** Never parrot user instructions or justify prompt requirements in code comments (e.g. `{/* Studio Details Section (No background, No padding) */}`). Write only minimal headings of the code block (what it is or does, as short and concise as possible: e.g. `{/* Studio Details */}`, `{/* Title */}`). Zero extra commentary.

## Verification & Workflow Guardrails

- **DO NOT TOUCH BACKEND:** Never create or edit files in `../setspace-api`. Frontend only. Assume missing endpoints exist.
- **DO NOT COMMIT & PUSH:** Do not commit or push unless explicitly commanded by user.
- **DO NOT TOUCH:** Keep `<!-- BEGIN:nextjs-agent-rules -->` block intact. Never edit `.next/` or `next-env.d.ts`.
- **Verification:** Rely on `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Avoid unnecessary browser screenshots.
- **Docs Maintenance:** Check diffs first (user writes code too).

