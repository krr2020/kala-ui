# @kala-ui/react-app

## 0.1.0-beta.0

### Added

- New package splitting Kala UI along architectural lines: standard UI primitives live in `@kala-ui/react`; this package holds the app-level composites.
- **Application chrome**: `AppShell`, `Header`, `Sidebar`, `Footer`, `Navigation`, `NavLink` (+ `isActivePath` helper).
- **Data composites**: `DataTable` (sorting, filtering, pagination, selection, bulk actions, server-side mode), `Dnd` sortable lists/boards (dnd-kit).
- **Charts**: theme-aware ApexCharts wrappers — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialBarChart`, `SparklineChart`.
- **Widgets**: `MetricCard`, `SessionCard`, `UserMenuDropdown`, `SocialLoginButton`, `SocialLoginButtons`.
- Utilities-only stylesheet (`@kala-ui/react-app/styles`) — theme, tokens, preflight and helpers ship once via `@kala-ui/react/styles`.
- React Server Component support: every component module is emitted with a `"use client"` banner; `dist/lib` stays server-safe.
