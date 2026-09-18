# AGENTS.md — @kala-ui/playground

Next.js App Router consumer gate: imports `@kala-ui/react`, `react-app`, and `react-hooks` exactly like a real application and server-renders components. Not a package — a build-time integration test.

## Commands

```bash
pnpm --filter @kala-ui/react build && pnpm --filter @kala-ui/react-hooks build && pnpm --filter @kala-ui/react-app build  # REQUIRED first
pnpm --filter @kala-ui/playground dev     # next dev
pnpm --filter @kala-ui/playground build   # the actual gate — run from root as pnpm build:apps
```

## Rules

- Workspace deps resolve from built `dist/` — always rebuild the packages before dev/build here, or you're testing stale output.
- `app/globals.css` is a reference consumer of the theming system; keep its `@import "@kala-ui/react/styles"` chain intact.
- Never imported by any package (boundary-enforced). New library surface should be exercised here before release.
