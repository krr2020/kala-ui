# AGENTS.md — @kala-ui/react-app

App-level composites built on `@kala-ui/react` primitives: application chrome, data display, charts, drag-and-drop, and dashboard/auth widgets.

## Commands

```bash
pnpm --filter @kala-ui/react build && pnpm --filter @kala-ui/react-hooks build   # REQUIRED first — imports resolve from dist
pnpm --filter @kala-ui/react-app test
pnpm --filter @kala-ui/react-app test:coverage
```

## Structure

- `src/components/`:
  - Chrome: `app-shell/` (AppShell + subcomponents), `header/`, `sidebar/`, `footer/`, `navigation/`, `nav-link/` (NavLink; pure helper `src/lib/active-path` exported as `@kala-ui/react-app/lib/active-path`).
  - Data: `data-table/` — DataTable + toolbar, column-filters, column-header-filter, pagination-nav, `useTableState`, chips, skeletons. Server-side patterns: `SERVER_SIDE_GUIDE.md`.
  - Charts (ApexCharts wrappers): `charts/` (chart, area-chart, bar-chart, line-chart, donut-chart, radial-bar-chart, chart-skeleton, theme-utils, `use-theme-aware-chart`), `sparkline-chart/`.
  - Widgets: `metric-card/`, `session-card/`, `social-login-button(s)`, `user-menu-dropdown/`, `dnd/` (@dnd-kit sortable).
- Most composites have a parallel `<name>-skeleton` for loading states — when adding one, add both test files.
- `src/__tests__/a11y.test.tsx` — cross-component accessibility suite (AppShell, Header, Sidebar, DataTable, charts, cards, DnD); changing any composite's DOM/roles can break it.

## Rules

- Import the core only via `@kala-ui/react/*` subpaths (boundary-enforced); never relative paths into `packages/react`.
- Charts read CSS custom properties (token-driven theming) — token changes ripple into chart defaults; `theme-utils` / `use-theme-aware-chart` are the seam.
- `@kala-ui/react` and `react-hooks` must be built before testing or type-checking this package (dist resolution).
- New composite → stories + colocated tests + `index.ts` barrel + subpath export in `package.json`, mirroring the core package pattern.
