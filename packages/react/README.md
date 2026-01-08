# @kala-ui/react

Comprehensive React UI component library built with Radix UI and Tailwind CSS. This package provides 65+ production-ready, accessible components for building modern web applications.

## Overview

This package contains:
- **65+ React Components**: Buttons, inputs, dialogs, dropdowns, data tables, charts, and more
- **Radix UI Primitives**: Accessible, unstyled component primitives
- **Tailwind CSS Styling**: Utility-first CSS framework with design tokens
- **TypeScript**: Fully typed components with strict mode
- **Storybook**: Interactive component documentation and visual testing
- **Testing**: Comprehensive test coverage with Vitest and Testing Library

## Installation & Usage

### NPM Installation

Install the package from npm:

```bash
npm install @kala-ui/react
```

Or using pnpm:

```bash
pnpm add @kala-ui/react
```

Or using yarn:

```bash
yarn add @kala-ui/react
```

Then import components:

```tsx
import { Button } from '@kala-ui/react/button';
import { Input } from '@kala-ui/react/input';
import { Dialog } from '@kala-ui/react/dialog';

function MyComponent() {
  return (
    <Dialog>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Dialog>
  );
}
```

### Available Components

**Form Controls**
- `button`, `input`, `textarea`, `checkbox`, `switch`, `select`, `radio-group`, `label`, `field`

Import from:

```tsx
import { Button } from '@kala-ui/react/button';
import { Input } from '@kala-ui/react/input';
import { Field } from '@kala-ui/react/field';
```

**Layout**
- `header`, `footer`, `navigation`, `sidebar`, `card`, `separator`, `tabs`, `accordion`

Import from:

```tsx
import { Header } from '@kala-ui/react/header';
import { Card } from '@kala-ui/react/card';
import { Tabs } from '@kala-ui/react/tabs';
```

**Feedback**
- `alert`, `alert-dialog`, `dialog`, `tooltip`, `popover`, `banner`, `spinner`, `skeleton`

Import from:

```tsx
import { Alert } from '@kala-ui/react/alert';
import { Dialog } from '@kala-ui/react/dialog';
import { Spinner } from '@kala-ui/react/spinner';
```

**Data Display**
- `avatar`, `badge`, `table`, `data-table`, `breadcrumbs`, `charts`, `metric-card`

Import from:

```tsx
import { Avatar } from '@kala-ui/react/avatar';
import { Badge } from '@kala-ui/react/badge';
import { Table } from '@kala-ui/react/table';
import { DataTable } from '@kala-ui/react/data-table';
import { AreaChart, LineChart, BarChart } from '@kala-ui/react/charts';
```

**Notifications**
- `toast` - Toast notification system with full Sonner API support

Import from:

```tsx
import { toast, Toast } from '@kala-ui/react/toast';

// Use the API
toast.success('Success message');
toast.error('Error message');
toast.dismiss(toastId);

// Use the component
<Toast />

// Promise-based toasts
toast.promise(promise, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error',
});
```

**Advanced**
- `dropdown-menu`, `user-menu-dropdown`, `social-login-button`, `password-strength-indicator`, `session-card`

Import from:

```tsx
import { DropdownMenu } from '@kala-ui/react/dropdown-menu';
import { SocialLoginButton } from '@kala-ui/react/social-login-button';
```

**Utilities**

Import utilities:

```tsx
import { cn } from '@kala-ui/react/lib/utils';
```

**Styles**

Import global styles in JavaScript/TypeScript files:

```ts
import '@kala-ui/react/styles';
```

Or import in CSS files:

```css
@import '@kala-ui/react/styles';
```

## Key Components

**DataTable** - Advanced data table with server-side support
- Sorting, filtering, searching, pagination
- Row selection and bulk actions
- Server-side callbacks for large datasets (10,000+ records)
- See [data-table README](./src/components/data-table/README.md) for details

**Charts** - Data visualization components
- Area, Bar, Line, Donut, Pie, Radial Bar charts
- Built with ApexCharts
- Dark mode support

**DND** - Drag and drop components
- Sortable lists and grids with animations
- Built with @dnd-kit/core

See the [Storybook documentation](https://krr2020.com/kala-ui) for complete component catalog.

## Development

### Running Storybook

Start the development server to view and test components interactively:

```bash
# From workspace root
pnpm --filter @repo/ui storybook

# Or from packages/ui
pnpm storybook
```

This starts Storybook at http://localhost:6006

### Building Storybook

Build a static version for deployment:

```bash
pnpm --filter @repo/ui build-storybook
```

Output is in `storybook-static/` directory.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm storybook` | Run Storybook dev server on port 6006 |
| `pnpm build-storybook` | Build static Storybook for production |
| `pnpm test` | Run all component tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm lint` | Run Biome linter |
| `pnpm build` | type-check only (no build output) |

## CI/CD Integration

Storybook is built and validated in the CI pipeline:

- **Workflow:** `.github/workflows/ci.yml` (storybook job)
- **Triggers:** Pull requests and pushes to main branch
- **Build Time:** ~2-4 minutes with cache
- **Artifacts:** Static build available for 7 days

The Storybook build must pass for PRs to be merged. This ensures component stories don't break.

### Testing Before Push

Before pushing changes, verify locally:

```bash
# Run same checks as CI
pnpm type-check
pnpm lint
pnpm test
pnpm build-storybook
```

Or use the full validation command:

```bash
pnpm validate:all
```

## Adding New Components

1. **Create component directory**:
   ```bash
   packages/ui/src/components/my-component/
   ├── index.ts              # Public exports
   ├── my-component.tsx      # Component implementation
   ├── my-component.test.tsx # Tests
   └── my-component.stories.tsx # Storybook story
   ```

2. **Implement component** with:
   - TypeScript for type safety
   - React 19 features (use client/server as needed)
   - Tailwind CSS classes for styling
   - Radix UI primitives where applicable
   - `cn()` utility for class merging

3. **Write tests**:
   - Use Vitest + Testing Library
   - Test rendering, interactions, accessibility
   - Aim for >80% coverage

4. **Create Storybook story**:
   - Document all component variants
   - Add interactive controls for props
   - Include usage examples
   - See [`docs/STORYBOOK.md`](../../docs/STORYBOOK.md) for guidelines

5. **Add package export** in `package.json`:
   ```json
   {
     "exports": {
       "./my-component": {
         "types": "./src/components/my-component/index.ts",
         "default": "./src/components/my-component/index.ts"
       }
     }
   }
   ```

6. **Run validation**:
   ```bash
   pnpm type-check  # Check types
   pnpm lint        # Check code style
   pnpm test        # Run tests
   pnpm storybook   # Verify story appears
   ```

## Package Structure

```
packages/ui/
├── .storybook/          # Storybook configuration
│   ├── main.ts          # Addons, builders, features
│   └── preview.tsx      # Global decorators, parameters
├── src/
│   ├── components/      # All React components
│   │   └── [component]/
│   │       ├── index.ts              # Exports
│   │       ├── [component].tsx       # Implementation
│   │       ├── [component].test.tsx  # Tests
│   │       └── [component].stories.tsx # Story
│   ├── hooks/           # Shared React hooks
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles, Tailwind CSS
├── package.json         # Exports, scripts, dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind CSS config
└── vitest.config.ts     # Vitest config
```

## Technologies

- **React 19**: UI framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety with strict mode
- **Storybook 8**: Component development and documentation
- **Vitest**: Fast unit testing
- **Testing Library**: React component testing

## Documentation

📚 **[Live Storybook Documentation](https://krr2020.com/kala-ui)** - Interactive component examples and usage guides

- **Main Storybook Guide**: [`docs/STORYBOOK.md`](../../docs/STORYBOOK.md)
- **Architecture**: [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
- **Testing**: [`docs/TESTING.md`](../../docs/TESTING.md)
- **Development Workflow**: [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md)

## Related Packages

- `@kala-ui/design-tokens` - Design system tokens

## Credits

This component library is built using excellent open-source libraries. We'd like to thank the following projects:

### Core Dependencies

- **[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)** - Utility-first CSS framework for rapid UI development
- **[Radix UI](https://github.com/radix-ui/primitives)** - Unstyled, accessible UI primitives for building high-quality design systems
- **[shadcn/ui](https://github.com/shadcn-ui/ui)** - Beautifully designed components built with Radix UI and Tailwind CSS

### Component Libraries

- **[Vaul](https://github.com/emilkowalski/vaul)** - Drawer component with accessible primitives
- **[Sonner](https://github.com/emilkowalski/sonner)** - Opinionated toast component for React
- **[cmdk](https://github.com/pacocoursey/cmdk)** - Fast, composable command menu component for React

### Data Visualization

- **[ApexCharts](https://github.com/apexcharts/apexcharts.js)** - Modern and interactive JavaScript charts

### Drag & Drop

- **[@dnd-kit/core](https://github.com/clauderic/dnd-kit)** - Modern, lightweight drag and drop library for React

---

For detailed component usage, props, and examples, see the [Storybook documentation](../../docs/STORYBOOK.md) or run `pnpm storybook`.
