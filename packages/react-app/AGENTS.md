# AGENTS.md — @kala-ui/react-app

App-level composites built on `@kala-ui/react` primitives: `AppShell`, `Header`, `Sidebar`, `Footer`, `DataTable`, ApexCharts `charts`, drag-and-drop, dashboard/auth widgets.

## Commands

```bash
pnpm --filter @kala-ui/react build && pnpm --filter @kala-ui/react-hooks build  # REQUIRED first — imports resolve from dist
pnpm --filter @kala-ui/react-app test
pnpm --filter @kala-ui/react-app test:coverage
```

## Structure

- `src/components/<name>/` — component + colocated tests, same pattern as the core package. Most composites have a parallel `<name>-skeleton` for loading states — add both test files when adding one.
- `src/lib/` — pure helpers (e.g. `active-path`).
- `src/__tests__/a11y.test.tsx` — cross-component accessibility suite; changing any composite's DOM/roles can break it.
- `src/components/data-table/SERVER_SIDE_GUIDE.md` — server-side data-table patterns.

## Rules

- Import the core via `@kala-ui/react/*` subpaths only (boundary-enforced); never relative paths into `packages/react`.
- Charts are theme-aware ApexCharts wrappers (`charts/`, `theme-utils`, `use-theme-aware-chart`); they read CSS custom properties — token changes affect them.
- Build `@kala-ui/react` and `@kala-ui/react-hooks` before testing or type-checking this package.
