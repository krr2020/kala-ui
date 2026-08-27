# Kala UI

A modern React component library and design system built with Radix UI primitives and Tailwind CSS.

## Packages

This monorepo contains three packages split along architectural lines
(`react-app` → `react` → `react-hooks`, never the other way around):

- **[@kala-ui/react](./packages/react)** — ~90 standard UI components: primitives, form controls, overlays and menus. Buttons, dialogs, inputs, tables, calendars — the design-system vocabulary.
- **[@kala-ui/react-app](./packages/react-app)** — 15 app-level composites built on the core primitives: `AppShell`, `Header`, `Sidebar`, `DataTable`, ApexCharts `charts`, `Dnd`, dashboard and auth widgets.
- **[@kala-ui/react-hooks](./packages/react-hooks)** — 18+ essential React hooks.

## Installation

```bash
# Core UI components only
pnpm add @kala-ui/react

# App-level composites (depends on core)
pnpm add @kala-ui/react-app
```

## Quick Start

### 1. Install the package(s)

```bash
npm install @kala-ui/react
npm install @kala-ui/react-app   # optional: app-level components
```

### 2. Import global styles

```tsx
// In your main entry point (App.tsx, main.tsx, or index.tsx)
import '@kala-ui/react/styles';
import '@kala-ui/react-app/styles'; // only if you use @kala-ui/react-app
```

### 3. Use components

```tsx
import { Button } from '@kala-ui/react/button';
import { Input } from '@kala-ui/react/input';
import { AppShell } from '@kala-ui/react-app/app-shell';
import { DataTable } from '@kala-ui/react-app/data-table';

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

Kala UI includes a built-in theming system with 6 themes: Light, Neutral, Accent, Dark, High Contrast Light, and High Contrast Dark.

For detailed theming documentation, see [THEMING.md](./THEMING.md).

### Basic usage

```tsx
import '@kala-ui/react/styles';

function App() {
  return (
    <div className="dark"> {/* or 'neutral', 'accent', 'high-contrast-light', etc. */}
      {/* Your app content */}
    </div>
  );
}
```

### Theming

Every component, chart, and scrim reads from CSS custom properties — override
them and the whole library follows. See **[THEMING.md](./THEMING.md)** for the
full token reference, the `ThemeProvider`, and host recipes.

```css
@import "@kala-ui/react/styles";

:root {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: white;
}
```

## Documentation

📚 **[View Storybook Documentation](https://krr2020.com/kala-ui)**

Interactive component documentation with live examples, props, and usage guides.

## Development

```bash
# Build all packages
pnpm build

# Type check all packages
pnpm type-check

# Run linting (includes package-boundary guard)
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test

# Run Storybook
pnpm storybook
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

MIT
