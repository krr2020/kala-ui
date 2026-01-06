# Kala UI

A modern React component library and design system built with Radix UI primitives and Tailwind CSS.

## Packages

This monorepo contains:

- **[@kala-ui/design-tokens](./packages/design-tokens)** - Design system tokens (colors, spacing, typography, shadows, breakpoints, transitions)
- **[@kala-ui/react](./packages/react)** - Reusable React UI components

## Installation

```bash
# Install all packages
pnpm install

# Install specific package
pnpm add @kala-ui/react
```

## Usage

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

## Development

```bash
# Build all packages
pnpm build

# Type check all packages
pnpm type-check

# Run linting
pnpm lint

# Run tests
pnpm test

# Run Storybook
pnpm storybook
```

## Credits

This project is built using excellent open-source libraries. We'd like to thank the following projects:

### Core Dependencies

- **[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)** - Utility-first CSS framework for rapid UI development
- **[Radix UI](https://github.com/radix-ui/primitives)** - Unstyled, accessible UI primitives for building high-quality design systems

### Component Libraries

- **[Vaul](https://github.com/emilkowalski/vaul)** - Drawer component with accessible primitives
- **[Sonner](https://github.com/emilkowalski/sonner)** - Opinionated toast component for React
- **[cmdk](https://github.com/pacocoursey/cmdk)** - Fast, composable command menu component for React

### Data Visualization

- **[ApexCharts](https://github.com/apexcharts/apexcharts.js)** - Modern and interactive JavaScript charts

### Drag & Drop

- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - React Drag and Drop library

## Inspired From

This project draws inspiration from these excellent design systems and component libraries:

- **[Bootstrap](https://getbootstrap.com/)** - The most popular HTML, CSS, and JS library in the world
- **[shadcn/ui](https://github.com/shadcn-ui/ui)** - Beautifully designed components built with Radix UI and Tailwind CSS

## License

MIT
