# Contributing to Kala UI

Thank you for your interest in contributing to Kala UI! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ (CI runs on 24)
- pnpm 10+ (`corepack enable` picks up the pinned version)
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/kala-ui.git
cd kala-ui
```

3. Install dependencies:

```bash
pnpm install
```

4. Build all packages:

```bash
pnpm build
```

5. Start Storybook to see components in action:

```bash
pnpm storybook
```

## Development Workflow

### Branch Naming

Use clear, descriptive branch names:

- `feature/your-feature-name` - For new features
- `fix/your-bug-fix` - For bug fixes
- `docs/your-doc-change` - For documentation updates
- `refactor/your-refactor` - For code refactoring

### Making Changes

1. Create a new branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them with clear messages:

```bash
git add .
git commit -m "feat: add new component"
```

3. Run tests and linting:

```bash
pnpm type-check
pnpm lint
pnpm test
```

4. Fix any issues found

5. Push your branch to GitHub:

```bash
git push origin feature/your-feature-name
```

### Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

Examples:
```
feat(button): add loading state support
fix(input): handle empty value correctly
docs(readme): update installation instructions
```

## Code Style

We use [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Auto-fix with unsafe transformations
pnpm lint:fix-unsafe
```

### TypeScript Guidelines

- Use TypeScript for all new code
- Enable strict type checking
- Avoid `any` types
- Use proper interfaces and types
- Add JSDoc comments for complex logic

### Component Guidelines

- Use Radix UI primitives for accessibility
- Follow the existing component structure
- Use Tailwind CSS for styling
- Include proper prop types with TypeScript
- Add Storybook stories for new components
- Test components with Vitest and React Testing Library

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Write tests for all new components and features
- Use Vitest and React Testing Library
- Test user interactions and behavior
- Include edge cases
- Keep tests focused and readable

## Project Structure

```
kala-ui/
├── packages/
│   ├── react/           # @kala-ui/react — standard UI components + Storybook
│   ├── react-app/       # @kala-ui/react-app — app-level composites
│   └── react-hooks/     # @kala-ui/react-hooks — utility hooks
├── apps/
│   └── playground/      # Next.js App Router consumer gate
├── scripts/             # postbuild, boundary guard, storybook test harness
├── docs/                # RELEASING.md, MIGRATION-0.1.md, audit records
├── THEMING.md           # Theming documentation
├── CONTRIBUTING.md      # This file
└── README.md            # Project overview
```

Dependency direction is enforced by `scripts/check-package-boundaries.mjs`
(runs in `pnpm lint`): `react-app` → `react` → `react-hooks`, never the other
way around. App-level code imports the core via `@kala-ui/react/*` subpaths,
which resolve from the built `dist` — build `@kala-ui/react` (and
`@kala-ui/react-hooks`) before testing or type-checking `react-app`.

## Adding Components

### Step 1: Create the Component

Create a new component in `packages/react/src/components/your-component/`:

```
packages/react/src/components/your-component/
├── your-component.tsx  # Component implementation
├── your-component.stories.tsx  # Storybook stories
├── your-component.test.tsx     # Unit tests
└── index.ts            # Re-exports
```

### Step 2: Export from Index

Add exports to `packages/react/src/components/your-component/index.ts`:

```ts
export { YourComponent } from './your-component';
export type { YourComponentProps } from './your-component.types';
```

### Step 3: Update Package Exports

Add the component to `packages/react/package.json` exports (and the barrel in
`src/index.ts`):

```json
"./your-component": {
  "types": "./dist/components/your-component/index.d.ts",
  "default": "./dist/components/your-component/index.js"
}
```

### Step 4: Add Storybook Story

Create `packages/react/src/components/your-component/your-component.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './index';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

### Step 5: Write Tests

Add tests in `packages/react/src/components/your-component/__tests__/your-component.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { YourComponent } from '../index';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText(/your component/i)).toBeInTheDocument();
  });
});
```

## Dependencies & the pnpm catalog

Versions shared by two or more workspace packages live in the `catalog:` block
of `pnpm-workspace.yaml`. Reference them as `"react": "catalog:"` from any
package.json — bump the version once in the catalog and every package
follows. Single-package dependencies stay literal in that package's
package.json, and consumer-facing `peerDependencies` stay literal ranges.

When adding a dependency that already exists in the catalog, always use
`catalog:` instead of pinning a version.

## Design Tokens

Tokens live in CSS: `packages/react/src/styles/globals.css`. Theme values are
the `:root` / `.dark` / … custom properties; Tailwind utility mappings and
primitive scales (color ramps, fonts, text sizes, shadows, container widths)
are in the `@theme` block. See THEMING.md for the full reference.

## Documentation

- Update the README when adding major features
- Add JSDoc comments to public APIs
- Keep Storybook stories up to date
- Update THEMING.md when modifying theme-related code
- Document any breaking changes in CHANGELOG.md

## Pull Request Process

1. Ensure all tests pass and code is linted
2. Update documentation if needed
3. Update the CHANGELOG
4. Push your changes to your fork
5. Create a pull request to `main` branch
6. Fill out the PR template with:
   - Description of changes
   - Related issue (if any)
   - Screenshots for UI changes (if applicable)
   - Testing steps

### Pull Request Review Process

- All PRs require at least one approval
- Maintainers will review and provide feedback
- Address review comments promptly
- Keep PRs focused and small for easier review
- Squash commits when necessary for cleaner history

## Releasing

Releases are managed by maintainers following semantic versioning:
- `MAJOR.MINOR.PATCH` (e.g., 1.0.0, 1.1.0, 1.1.1)
- Major version: Breaking changes
- Minor version: New features (backward compatible)
- Patch version: Bug fixes (backward compatible)

Versioning and publishing run through [changesets](https://github.com/changesets/changesets) —
the full workflow (adding a changeset to your PR, prerelease/beta cycles,
publishing) is documented in [docs/RELEASING.md](./docs/RELEASING.md).

## Code of Conduct

Be respectful and inclusive:
- Treat everyone with respect
- Be welcoming to newcomers
- Focus on constructive feedback
- Help others learn and grow

## Getting Help

- Check existing issues on GitHub
- Read the documentation in THEMING.md
- Review existing code and components
- Ask questions in issues or discussions

## Credits

Kala UI is built using excellent open-source libraries. We'd like to thank:

### Core Dependencies
- **[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)** - Utility-first CSS framework
- **[Radix UI](https://github.com/radix-ui/primitives)** - Accessible UI primitives

### Component Libraries
- **[Vaul](https://github.com/emilkowalski/vaul)** - Drawer component
- **[Sonner](https://github.com/emilkowalski/sonner)** - Toast component
- **[cmdk](https://github.com/pacocoursey/cmdk)** - Command menu component

### Data Visualization
- **[ApexCharts](https://github.com/apexcharts/apexcharts.js)** - Charts library

### Drag & Drop
- **[@dnd-kit/core](https://github.com/clauderic/dnd-kit)** - Modern, lightweight drag and drop library for React

### Inspiration
- **[Bootstrap](https://getbootstrap.com/)** - Popular UI framework
- **[shadcn/ui](https://github.com/shadcn-ui/ui)** - Component library built with Radix UI

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
