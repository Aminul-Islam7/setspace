# Bug Log & Postmortems

Log resolved issues, regressions, and lessons learned.

## 2026-11-09: Unused Import in page.tsx Warning
- **Symptom:** ESLint flagged `@typescript-eslint/no-unused-vars` for `Image` import in `src/app/page.tsx`.
- **Root Cause:** Boilerplate placeholder import remaining after clearing default Next.js template markup.
- **Fix:** Removed unused `Image` import from `src/app/page.tsx`.
- **How to Avoid:** Run `npm run lint` before committing any page changes.
