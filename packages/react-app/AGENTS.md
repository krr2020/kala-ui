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

## Customization contract (item 14 port — IN PROGRESS)

Every composite family is being ported onto the core customization contract:
- `src/config/<family>.ts` holds the per-part base classes (re-exported from `src/config/index.ts`); component `.tsx` files carry JSX/logic only.
- Every component accepts `slotStyles={{ root, <part> }}`, resolved via `useSlotStyles("<family>", slotStyles)` from `@kala-ui/react/kala-provider` — KalaProvider context defaults flow across the package boundary.
- Roots carry `data-kala-component="<kebab-name>"`; families ship `<family>.types.ts` re-exported from their barrel.
- Guards live in `src/__tests__/contract.integration.test.ts` and are fail-closed: the inline-Tailwind scan (any string literal, tokens anchored end-to-end) and 400-line cap cover every components/ family NOT in `PORT_QUEUE`, plus src/config; `PORT_QUEUE` is shrink-only and a family-set test pins components/ to exactly PORTED ∪ PORT_QUEUE.

**Ported:** social-login-button (incl. merged SocialLoginButtons), footer, metric-card, session-card, user-menu-dropdown, app-shell, charts (Chart core + line/area/bar/donut/radial wrappers), dnd (SortableItem).

**PORT_QUEUE (port next, then delete the queue and flip guards to all-families):** header, sidebar, navigation, nav-link, data-table, sparkline-chart, dnd (remaining subcomponents).

## Rules

- Import the core only via `@kala-ui/react/*` subpaths (boundary-enforced); never relative paths into `packages/react`.
- Charts read CSS custom properties (token-driven theming) — token changes ripple into chart defaults; `theme-utils` / `use-theme-aware-chart` are the seam.
- `@kala-ui/react` and `react-hooks` must be built before testing or type-checking this package (dist resolution).
- New composite → stories + colocated tests + `index.ts` barrel + subpath export in `package.json`, mirroring the core package pattern — plus the contract rows above (config table, slotStyles, marker, types file).
