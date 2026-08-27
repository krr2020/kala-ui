# @kala-ui/react-app

App-level composite components for [Kala UI](https://github.com/krr2020/kala-ui) — opinionated, multi-component application patterns built on the `@kala-ui/react` primitives.

## What's inside

- **Application chrome** — `AppShell`, `Header`, `Sidebar`, `Footer`, `Navigation`, `NavLink`
- **Data-heavy composites** — `DataTable` (sorting / filtering / pagination / selection / server-side), `Dnd` (dnd-kit sortable lists and boards)
- **Charts** — `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialBarChart`, `SparklineChart` (ApexCharts wrappers, theme-aware)
- **Dashboard & domain widgets** — `MetricCard`, `SessionCard`, `UserMenuDropdown`, `SocialLoginButton(s)`

## Installation

```bash
pnpm add @kala-ui/react-app @kala-ui/react
```

Import the core stylesheet first, then this package's utilities:

```css
@import "@kala-ui/react/styles";
@import "@kala-ui/react-app/styles";
```

## Usage

```tsx
import { Button, ThemeProvider } from "@kala-ui/react";
import { AppShell, DataTable } from "@kala-ui/react-app";
```

See the repository README and [THEMING.md](https://github.com/krr2020/kala-ui/blob/main/THEMING.md) for theming, dark mode and framework integration.

## License

MIT
