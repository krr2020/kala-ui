# Kala UI

A React component library and design system built with Radix UI primitives
and Tailwind CSS. Token-driven theming, accessible by default, React 19 and
React Server Components ready.

> **Status — `0.1.0-beta.3`.** Install with the `@beta` dist-tag. The library
> is pre-1.0: breaking changes may land in any beta/minor release; see
> [docs/MIGRATION-0.1.md](./docs/MIGRATION-0.1.md) for the 0.0.x → 0.1.0 guide.

## Packages

Web packages split along architectural lines — `react-app` → `react` →
`react-hooks`, never the other way around; the native package stands apart:

| Package | What's in it |
| --- | --- |
| **[@kala-ui/react](./packages/react)** | ~90 standard UI components: primitives, form controls, overlays and menus — buttons, dialogs, inputs, tables, calendars. The design-system vocabulary. |
| **[@kala-ui/react-app](./packages/react-app)** | 15 app-level composites built on the core primitives: `AppShell`, `Header`, `Sidebar`, `DataTable`, ApexCharts `charts`, drag-and-drop, dashboard and auth widgets. |
| **[@kala-ui/react-hooks](./packages/react-hooks)** | 38 utility hooks: state, debounce/timing, DOM observers, browser APIs, SSR helpers. |
| **[@kala-ui/react-native](./packages/react-native)** | React Native + Expo arm: Unistyles themes transcribed from the web token source of truth, with the component vocabulary rebuilt natively. |

## Installation

Requires **React 19.2+**. Every component module ships a `"use client"` banner,
so both client and server components import cleanly in the App Router.

```bash
# Core UI components
pnpm add @kala-ui/react@beta

# App-level composites (pulls in the core)
pnpm add @kala-ui/react-app@beta

# Hooks alone (optional — @kala-ui/react depends on them already)
pnpm add @kala-ui/react-hooks@beta
```

## Quick start

**1. Import the styles once** — the compiled stylesheet ships every utility
and helper class the library uses, so your app does not need Tailwind:

```css
@import "@kala-ui/react/styles";
@import "@kala-ui/react-app/styles"; /* only if you use the app package */
```

**2. Use components** — every component has a subpath export plus the barrel:

```tsx
import { Button } from "@kala-ui/react/button";
import { Input } from "@kala-ui/react/input";
import { AppShell } from "@kala-ui/react-app/app-shell";
import { DataTable } from "@kala-ui/react-app/data-table";

function App() {
  return (
    <AppShell>
      <AppShell.Main>
        <Button>Click me</Button>
        <Input placeholder="Enter text" />
      </AppShell.Main>
    </AppShell>
  );
}
```

## Theming

Four built-in themes (`light`, `dark`, `high-contrast-light`,
`high-contrast-dark`), class-based dark mode, and a `ThemeProvider` that also
accepts custom themes via registration. Every component, chart, and scrim
reads CSS custom properties — override tokens on `:root`/`.dark` and the
whole library follows:

```css
@import "@kala-ui/react/styles";

:root {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: white;
}
```

Full token reference, host recipes, and the compile-it-yourself Tailwind v4
mode: **[THEMING.md](./THEMING.md)**.

## Documentation

📚 **[Storybook documentation](https://krr2020.com/kala-ui)** — interactive
examples, props, and usage guides for every component (core + app).

## Development

```bash
pnpm install          # install (shared dep versions come from the pnpm catalog)
pnpm build            # build all packages (hooks+core first when testing react-app)
pnpm type-check       # tsc --noEmit across packages
pnpm lint             # biome + package-boundary guard
pnpm test             # 3,680 unit tests (vitest + testing-library + axe)
pnpm storybook        # composed Storybook (core + app stories)
pnpm test-storybook   # 710-story smoke + visual regression suite
pnpm build:apps       # Next.js consumer gate (apps/playground)
```

Releases run through changesets — see [docs/RELEASING.md](./docs/RELEASING.md).

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
