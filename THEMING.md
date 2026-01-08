# Theming Guide

This guide explains how to use Kala UI's theming system and design tokens in your application.

## Installation

```bash
# Install the main React package (includes styles)
npm install @kala-ui/react

# Or if you need design tokens separately
npm install @kala-ui/design-tokens
```

## Quick Start

### 1. Import Global Styles

Add this to your main entry point (e.g., `App.tsx`, `main.tsx`, or `index.tsx`):

```tsx
import '@kala-ui/react/styles';
```

This imports the global CSS that includes:
- Tailwind CSS base styles
- CSS custom properties for themes
- Responsive breakpoints
- Focus ring utilities

### 2. Configure Tailwind CSS

In your `tailwind.config.ts`:

```ts
import tailwindConfig from '@kala-ui/react/config/tailwind-base';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@kala-ui/react/**/*.{ts,tsx}',
  ],
  ...tailwindConfig,
};
```

### 3. Set Up Theme Provider (Optional)

While not required, using a theme provider makes it easier to switch themes dynamically:

```tsx
import { useState } from 'react';

function App({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

## Available Themes

Kala UI includes 6 built-in themes:

| Theme | Class Name | Description |
|-------|------------|-------------|
| Light | `light` or `''` | Default light theme (no class needed) |
| Neutral | `neutral` | Subtle, neutral light theme |
| Accent | `accent` | Light theme with blue accent and shadow |
| Dark | `dark` | Dark mode theme |
| High Contrast Light | `high-contrast-light` | WCAG AAA compliant light theme |
| High Contrast Dark | `high-contrast-dark` | WCAG AAA compliant dark theme |

### Using Themes

Add the theme class to your root element:

```tsx
// Light (default)
<div className="light">
  {/* Your app */}
</div>

// Or no class (defaults to light)
<div>
  {/* Your app */}
</div>

// Neutral
<div className="neutral">
  {/* Your app */}
</div>

// Dark
<div className="dark">
  {/* Your app */}
</div>

// Accent
<div className="accent">
  {/* Your app */}
</div>
```

### Combining Themes

You can combine theme classes for variations:

```tsx
// Dark with accent colors
<div className="dark accent">
  {/* Your app */}
</div>
```

## CSS Custom Properties

Themes use CSS custom properties (CSS variables) for easy customization. Here are the available properties:

### Base Colors

```css
/* Background colors */
--background          /* Main background color */
--card               /* Card/popover background */
--popover            /* Popover background */

/* Text colors */
--foreground         /* Main text color */
--card-foreground    /* Card text color */
--popover-foreground /* Popover text color */

/* Action colors */
--primary            /* Primary brand color */
--primary-foreground /* Text on primary */
--secondary          /* Secondary brand color */
--secondary-foreground /* Text on secondary */

/* Muted colors */
--muted              /* Muted background */
--muted-foreground   /* Muted text */

/* Accent colors */
--accent             /* Accent background */
--accent-foreground  /* Text on accent */

/* Destructive */
--destructive        /* Destructive/error color */
--destructive-foreground /* Text on destructive */

/* Borders and inputs */
--border             /* Border color */
--border-alpha       /* Border opacity (0-1) */
--card-border-alpha  /* Card border opacity */
--input              /* Input background */

/* Focus ring */
--ring               /* Focus ring color */
--ring-offset-color  /* Focus ring offset color */

/* Shadows */
--shadow-color       /* Shadow color */
--shadow-alpha       /* Shadow opacity */
--shadow-spread      /* Shadow spread radius */

/* Semantic status colors */
--success            /* Success color */
--success-foreground /* Text on success */
--warning            /* Warning color */
--warning-foreground /* Text on warning */
--error              /* Error color */
--error-foreground   /* Text on error */
--info               /* Info color */
--info-foreground    /* Text on info */

/* Utilities */
--radius             /* Border radius */
--separator          /* Separator color */
```

## Using Design Tokens Programmatically

If you need design tokens in JavaScript/TypeScript:

```tsx
import { colors, spacing, typography, shadows, breakpoints, themes } from '@kala-ui/design-tokens';

// Use color tokens
const primaryColor = colors.primary; // '#3b82f6'
const backgroundColor = colors.gray[100];

// Use spacing
const padding = spacing.md; // '1rem'

// Use typography
const fontSize = typography.text.lg; // '1.125rem'
const fontWeight = typography.fontWeight.bold;

// Use shadows
const shadow = shadows.md;

// Use breakpoints
const breakpoint = breakpoints.md; // '768px'

// Use themes
const theme = themes.dark;
console.log(theme.name); // 'Dark'
console.log(theme.colorScheme); // 'dark'
```

## Dark Mode Support

### System Preference

To follow system preference, use Tailwind's `dark` class strategy:

```ts
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media' for system preference
  // ...
};
```

### Manual Toggle

```tsx
import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Apply theme class to root element
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)}>
      Toggle {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

## Customizing Themes

You can create custom themes by overriding CSS variables:

```css
/* Create a custom theme */
.custom-theme {
  --background: 210 40% 98%;
  --foreground: 222.2 84% 4.9%;
  --primary: 270 70% 50%;
  /* Override other variables as needed */
}
```

## Accessing Theme Tokens in Components

```tsx
// Using Tailwind utility classes
<div className="bg-background text-foreground border-border">
  Content
</div>

// Using inline styles with CSS variables
<div style={{
  backgroundColor: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))'
}}>
  Content
</div>
```

## TypeScript Support

TypeScript types are available for design tokens:

```tsx
import type { ThemeKey, ColorScale, SpacingScale } from '@kala-ui/design-tokens';

const currentTheme: ThemeKey = 'dark';
const primaryColor: ColorScale = 'blue.500';
const spacingValue: SpacingScale = 'md';
```

## Best Practices

1. **Use theme classes** - Apply theme classes at the root element, not individual components
2. **Leverage Tailwind utilities** - Use Tailwind's `bg-`, `text-`, `border-` classes that map to theme variables
3. **Test contrast** - Use high-contrast themes for better accessibility
4. **Respect system preferences** - Use media queries to detect system dark mode preference
5. **Maintain consistency** - Use design tokens instead of hard-coded values

## Migration from Custom Themes

If you have existing custom themes, you can:

1. Map your color values to CSS variables
2. Create a new theme class with your variables
3. Gradually update components to use Tailwind utilities

## Troubleshooting

**Styles not loading:**
- Ensure you've imported `@kala-ui/react/styles`
- Check that Tailwind is configured correctly
- Verify the content paths in `tailwind.config.ts`

**Theme not applying:**
- Make sure the theme class is on a parent element
- Check for conflicting CSS specificity
- Verify CSS variables are defined

**Dark mode not working:**
- Configure `darkMode` in `tailwind.config.ts`
- Ensure the `dark` class is applied to the root element
- Check that all components use theme-aware classes

## Support

For issues or questions about theming:
- Check the [Storybook documentation](https://krr2020.com/kala-ui)
- Review the source code in `packages/react/src/styles/globals.css`
- Check design tokens in `packages/design-tokens/src/`
