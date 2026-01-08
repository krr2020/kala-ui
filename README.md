# Kala UI

A modern React component library and design system built with Radix UI primitives and Tailwind CSS.

## Packages

This monorepo contains:

- **[@kala-ui/design-tokens](./packages/design-tokens)** - Design system tokens (colors, spacing, typography, shadows, breakpoints, transitions)
- **[@kala-ui/react](./packages/react)** - 65+ accessible React UI components
- **[@kala-ui/react-hooks](./packages/react-hooks)** - 18+ essential React hooks

## Installation

```bash
# Install all packages
pnpm install

# Install specific package
pnpm add @kala-ui/react
```

## Quick Start

### 1. Install the package

```bash
npm install @kala-ui/react
```

### 2. Import global styles

```tsx
// In your main entry point (App.tsx, main.tsx, or index.tsx)
import '@kala-ui/react/styles';
```

### 3. Configure Tailwind CSS

```ts
// tailwind.config.ts
import tailwindConfig from '@kala-ui/react/config/tailwind-base';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@kala-ui/react/**/*.{ts,tsx}',
  ],
  ...tailwindConfig,
};
```

### 4. Use components

```tsx
import { Button } from '@kala-ui/react/button';
import { Input } from '@kala-ui/react/input';

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Input placeholder="Enter text" />
    </div>
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

### Using design tokens

```tsx
import { colors, spacing, typography, themes } from '@kala-ui/design-tokens';

// Access design tokens programmatically
const primaryColor = colors.primary;
const padding = spacing.md;
const fontSize = typography.text.lg;
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

# Run linting
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
