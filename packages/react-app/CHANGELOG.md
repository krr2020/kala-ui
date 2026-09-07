# @kala-ui/react-app

## 0.1.0-beta.3

### Minor Changes

- NavLink: optional anchor mode. Passing `href` renders a real `<a>` (default button behavior unchanged otherwise) so top-level navigation targets keep native middle-click/clone-tab semantics. In anchor mode: `active` sets `aria-current="page"`; button-only props (`type`, `disabled`) are never spread onto the anchor (`disabled` degrades to `aria-disabled` + pointer-events styling); a plain left-click is preventDefaulted for client-side routing while modifier/middle clicks stay native. Nested-collapse (chevron toggle) remains button-mode-only.

## 0.1.0-beta.2

### Patch Changes

- Updated dependencies
  - @kala-ui/react@0.1.0-beta.2

## 0.1.0-beta.1

### Minor Changes

- b5cd997: Add stable `data-kala-component` identification attributes to every component root.
  
  Every component (and each compound part, e.g. `dialog-content`, `card-header`, `data-table-toolbar`) now renders `data-kala-component="<kebab-name>"` on its root element. This is a guaranteed-stable public API for DevTools debugging, e2e selectors, and targeted consumer CSS overrides.
  
  - No styling or behavior changes — the attribute is identification only.
  - The ad-hoc `data-comp` markers previously used by a few components were migrated to `data-kala-component` (update any selectors that queried `[data-comp='...']`).
  - shadcn-compatible `data-slot` attributes are unchanged.

### Patch Changes

- Updated dependencies [b5cd997]
  - @kala-ui/react@0.1.0-beta.1

## 0.1.0-beta.0

### Added

- New package splitting Kala UI along architectural lines: standard UI primitives live in `@kala-ui/react`; this package holds the app-level composites.
- **Application chrome**: `AppShell`, `Header`, `Sidebar`, `Footer`, `Navigation`, `NavLink` (+ `isActivePath` helper).
- **Data composites**: `DataTable` (sorting, filtering, pagination, selection, bulk actions, server-side mode), `Dnd` sortable lists/boards (dnd-kit).
- **Charts**: theme-aware ApexCharts wrappers — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialBarChart`, `SparklineChart`.
- **Widgets**: `MetricCard`, `SessionCard`, `UserMenuDropdown`, `SocialLoginButton`, `SocialLoginButtons`.
- Utilities-only stylesheet (`@kala-ui/react-app/styles`) — theme, tokens, preflight and helpers ship once via `@kala-ui/react/styles`.
- React Server Component support: every component module is emitted with a `"use client"` banner; `dist/lib` stays server-safe.
