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
- **Type Integrity & Zero Fallbacks:** All network calls must strictly type their payloads and responses against `@/types` (`Booking`, `CreateBookingPayload`, `PaginatedResponse<T>`, `StudioAvailabilityResponse`, etc.). Ad-hoc property fallbacks (e.g. `s.date || s.bookingDate` or `res.data || res.studios || []`) are strictly banned. Fail explicitly on contract mismatches so bugs can be anticipated and fixed immediately at the root cause.

## Modal Dialog & Bottom Sheet Architecture
- **Responsive Presentation:** Standardized in `src/components/ui/dialog.tsx` (`DialogContent`).
  - **Mobile (`< sm`):** Sliding bottom sheet docked to `inset-x-0 bottom-0` with `rounded-t-3xl rounded-b-none`, max height `92vh`, top drag handle indicator (`h-1.5 w-12 rounded-full bg-muted-foreground/20`), and slide animations (`slide-in-from-bottom` / `slide-out-to-bottom`).
  - **Desktop (`sm:`):** Centered dialog (`sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl`) with zoom transition.
- **Scrollbar Containment:** Outer popup strictly enforces `overflow-hidden`. Inner wrapper (`flex-1 overflow-y-auto overflow-x-hidden p-6`) manages vertical scrolling, preventing Windows Chromium rectangular scrollbar leak outside rounded borders.
