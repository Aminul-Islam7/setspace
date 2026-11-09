# SetSpace Frontend Architecture

## Directory Layout
- `src/app/`: Next.js App Router root layout (`layout.tsx`), routes (`page.tsx`), and global styles (`globals.css`).
- `src/components/`: Reusable application components.
  - `src/components/ui/`: Base UI and Shadcn composable primitives (`base-luma` style).
- `src/lib/`: Shared utilities (`src/lib/utils.ts` exporting `cn`).
- `src/hooks/`: Reusable React client hooks.
- `public/`: Static brand assets, favicons, and media.
- `docs/`: Repository memory, guidelines, architecture, and task logs.

## Next.js 16 App Router Patterns
- **RSC by Default:** Keep components as React Server Components unless interactive state or browser APIs require `'use client'`.
- **Dynamic Contexts & Caching:** `next.config.ts` enforces `cacheComponents`, `partialPrefetching`, and `reactCompiler`. Dynamic parameters (`cookies()`, `headers()`, `params`, `searchParams`) must be read within `<Suspense>` boundaries or cached scopes.
- **Generated Types:** Route parameters and layout props rely on `.next/dev/types` (e.g., `LayoutProps<'/'>`). Never manually write children or params interfaces for page/layout roots.
- **Module Resolution:** Imports map via `@/*` pointing to `./src/*`.

## Form Architecture & Validation
- Use `react-hook-form` paired with `zod` via `@hookform/resolvers/zod`.
- Use composable field primitives (`FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldSeparator`) from Base UI / Shadcn. Avoid manual state boilerplate.
- Backend error integration: Fetch directly to `process.env.NEXT_PUBLIC_API_URL` and map server error responses via `form.setError(fieldName, { type: 'server', message })` into `<FieldError>`.

## Data Flow
- **Reads:** Server components fetch from external API where applicable; client fetches used for real-time/interactive filtering.
- **Writes:** Direct client `fetch` calls to backend endpoints handling user interactions and forms.
