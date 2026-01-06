# @repo/design-tokens

Centralized design system tokens for consistent UI implementation across the application.

## Purpose

This package provides design system tokens including:
- **Colors**: Complete color palettes (primary, secondary, neutral, semantic)
- **Spacing**: Consistent spacing scale for margins, padding, and gaps
- **Typography**: Font families, sizes, weights, and line heights
- **Shadows**: Elevation and shadow definitions
- **Breakpoints**: Responsive breakpoint definitions
- **Transitions**: Animation durations, timing functions, and presets

## Installation

### NPM Installation

Install from npm:

```bash
npm install @kala-ui/design-tokens
```

Or using pnpm:

```bash
pnpm add @kala-ui/design-tokens
```

Or using yarn:

```bash
yarn add @kala-ui/design-tokens
```

### Workspace Installation

This package is part of the monorepo and is already available in all workspace packages.

```bash
pnpm add @kala-ui/design-tokens
```

## Usage

### Import All Tokens

```typescript
import { colors, spacing, typography, shadows, breakpoints, transitions } from '@repo/design-tokens';
```

### Using in Tailwind Config

The design tokens are integrated into Tailwind configuration:

```typescript
// apps/web/tailwind.config.ts or packages/ui/tailwind.config.ts
import { colors, spacing, typography, shadows, breakpoints, transitions } from '@kala-ui/design-tokens';
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        // ... other color mappings
      },
      spacing: spacing,
      fontFamily: typography.fontFamily,
      // ... other token mappings
    },
  },
};
```

### Using in React Components

```typescript
import { colors, spacing, typography } from '@kala-ui/design-tokens';

// Direct usage
<div style={{ 
  color: colors.primary[500],
  padding: spacing.md,
  fontFamily: typography.fontFamily.sans.join(', ')
}}>
  Content
</div>

// With Tailwind classes (recommended)
<div className="text-primary-500 p-md font-sans">
  Content
</div>
```

### Color Palette

```typescript
import { colors } from '@kala-ui/design-tokens';

// Primary colors (50-950 scale)
colors.primary[500] // '#3b82f6'

// Semantic colors
colors.success[500] // '#10b981'
colors.error[500] // '#ef4444'
colors.warning[500] // '#f59e0b'
colors.info[500] // '#0ea5e9'

// Neutral colors
colors.neutral[500] // '#737373'
```

### Spacing Scale

```typescript
import { spacing } from '@kala-ui/design-tokens';

// Numeric scale (0-96)
spacing[4] // '1rem' (16px)
spacing[8] // '2rem' (32px)

// Named scale
spacing.xs // '0.5rem' (8px)
spacing.sm // '0.75rem' (12px)
spacing.md // '1rem' (16px)
spacing.lg // '1.5rem' (24px)
spacing.xl // '2rem' (32px)
```

### Typography

```typescript
import { typography } from '@kala-ui/design-tokens';

// Font families
typography.fontFamily.sans // ['Inter', 'system-ui', ...]
typography.fontFamily.mono // ['ui-monospace', 'SFMono-Regular', ...]

// Font sizes (with line heights)
typography.fontSize.base // ['1rem', { lineHeight: '1.5rem' }]
typography.fontSize.xl // ['1.25rem', { lineHeight: '1.75rem' }]

// Font weights
typography.fontWeight.normal // '400'
typography.fontWeight.semibold // '600'
typography.fontWeight.bold // '700'
```

### Shadows

```typescript
import { shadows } from '@kala-ui/design-tokens';

// Box shadows
shadows.boxShadow.sm // '0 1px 3px 0 rgb(0 0 0 / 0.1), ...'
shadows.boxShadow.md // '0 4px 6px -1px rgb(0 0 0 / 0.1), ...'

// Component-specific shadows
shadows.component.card
shadows.component.modal
shadows.component.dropdown

// Elevation levels (includes z-index)
shadows.elevation[1] // { zIndex: 10, boxShadow: '...' }
```

### Breakpoints

```typescript
import { breakpoints, mediaQuery } from '@kala-ui/design-tokens';

// Breakpoint values
breakpoints.sm // '640px'
breakpoints.md // '768px'
breakpoints.lg // '1024px'

// Media query helpers
mediaQuery.up('md') // '@media (min-width: 768px)'
mediaQuery.down('lg') // '@media (max-width: 1023.98px)'
mediaQuery.between('sm', 'lg') // '@media (min-width: 640px) and (max-width: 1024px)'
```

### Transitions

```typescript
import { transitions } from '@kala-ui/design-tokens';

// Durations
transitions.duration.fast // '150ms'
transitions.duration.base // '200ms'
transitions.duration.slow // '500ms'

// Timing functions
transitions.timingFunction.easeInOut // 'cubic-bezier(0.4, 0, 0.2, 1)'

// Presets
transitions.preset.hover // 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
transitions.preset.fade // 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'

// Keyframes (for CSS animations)
transitions.keyframes.fadeIn
transitions.keyframes.slideInFromTop
```

## Type Safety

All tokens are fully typed for TypeScript autocomplete and type checking:

```typescript
import type { ColorName, ColorScale, FontSize, SpacingScale } from '@kala-ui/design-tokens';

// Type-safe color selection
const primaryColor: ColorScale = 500; // Valid
const colorName: ColorName = 'primary'; // Valid

// Type-safe spacing
const spacingValue: SpacingScale = 'md'; // Valid
```

## Integration

Design tokens are integrated with:
- Tailwind CSS configuration (`apps/web/tailwind.config.ts`, `packages/ui/tailwind.config.ts`)
- Component libraries (`@kala-ui/react`)
- Theme definitions
- Direct usage in styled components

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Prefer Tailwind classes** over inline styles when possible
3. **Use semantic color names** (success, error, warning) for consistent meaning
4. **Follow the spacing scale** for consistent visual rhythm
5. **Use transition presets** for consistent animation behavior

## Adding New Tokens

1. Define tokens in appropriate category file under `src/` (e.g., `colors.ts`, `spacing.ts`)
2. Export from `src/index.ts`
3. Update this README with usage examples
4. Document in consuming applications (Tailwind configs)
5. Update TypeScript types as needed
