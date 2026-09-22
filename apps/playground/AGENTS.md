# AGENTS.md — @kala-ui/playground

Next.js App Router consumer gate: imports `@kala-ui/react` and `react-app` exactly like a real application and server-renders components. This is a build-time integration test, not a package — it exists to catch RSC/server-render and packaging regressions before release.

## Commands

```bash
pnpm --filter @kala-ui/react build && pnpm --filter @kala-ui/react-hooks build && pnpm --filter @kala-ui/react-app build   # REQUIRED first
pnpm --filter @kala-ui/playground dev     # next dev
pnpm --filter @kala-ui/playground build   # the actual gate — root: pnpm build:apps
```

## Structure

- `app/layout.tsx` — root layout; imports the stylesheets (`@kala-ui/react/styles`, `@kala-ui/react-app/styles`).
- `app/page.tsx` — one large consumer aggregation (imports nearly every component); the RSC surface-under-test.
- `app/server/` — server-component render checks.
- `app/globals.css` — reference consumer of the theming system; keep its `@import` chain intact.
- `next.config.ts`, `tsconfig.json` — minimal consumer config, deliberately close to a real app.

## Rules

- Workspace deps resolve from built `dist/` — always rebuild the packages before dev/build here, or you're testing stale output.
- Never imported by any package (boundary-enforced).
- New library surface (component, subpath export, style change) should be exercised here before release; `pnpm build:apps` failing means a packaging/RSC regression.
