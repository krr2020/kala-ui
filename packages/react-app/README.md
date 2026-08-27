# @kala-ui/react-app

App-level composite components for [Kala UI](https://github.com/krr2020/kala-ui) — opinionated, multi-component application patterns built on the `@kala-ui/react` primitives.

## What's inside

- **Application chrome** — `AppShell`, `Header`, `Sidebar`, `Footer`, `Navigation`, `NavLink` (plus the `isActivePath` routing helper from `@kala-ui/react-app/lib/active-path`)
- **Data-heavy composites** — `DataTable` (sorting / filtering / pagination / selection / server-side), `Dnd` (dnd-kit sortable lists and boards)
- **Charts** — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialBarChart`, `SparklineChart` (ApexCharts wrappers, theme-aware, lazy-loaded)
- **Dashboard & domain widgets** — `MetricCard`, `SessionCard`, `UserMenuDropdown`, `SocialLoginButton(s)`

## Installation

```bash
pnpm add @kala-ui/react-app@beta @kala-ui/react@beta
```

Requires React 19.2+. Import the core stylesheet first, then this package's utilities (theme, tokens, preflight and `kala-*` helpers ship once via the core):

```css
@import "@kala-ui/react/styles";
@import "@kala-ui/react-app/styles";
```

## Usage

```tsx
import { Button, ThemeProvider } from "@kala-ui/react";
import { AppShell, DataTable } from "@kala-ui/react-app";
```

Every component has a subpath export (`@kala-ui/react-app/<component>`) plus
the barrel. All component modules ship a `"use client"` banner, so they import
cleanly into React Server Component apps — charts lazy-load ApexCharts on the
client only.

See the repository README and [THEMING.md](https://github.com/krr2020/kala-ui/blob/main/THEMING.md) for theming, dark mode and framework integration.

## License

MIT
