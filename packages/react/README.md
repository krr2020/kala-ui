# @kala-ui/react

Standard UI components for [Kala UI](https://github.com/krr2020/kala-ui) — the design-system vocabulary: primitives, form controls, overlays and menus, built with Radix UI and Tailwind CSS.

~90 accessible, production-ready components. App-level composites (AppShell, DataTable, charts, drag-and-drop) live in [`@kala-ui/react-app`](../react-app), which depends on this package.

## Installation

```bash
npm install @kala-ui/react
# optional: app-level composites
npm install @kala-ui/react-app
```

Import the compiled stylesheet once (no Tailwind required in your app):

```css
@import "@kala-ui/react/styles";
/* @import "@kala-ui/react-app/styles"; */ /* after core, if used */
```

## Usage

```tsx
import { Button } from "@kala-ui/react/button";
import { Input } from "@kala-ui/react/input";
import { Dialog } from "@kala-ui/react/dialog";
import { cn } from "@kala-ui/react/lib/utils";
```

Every component has a subpath export (`@kala-ui/react/<component>`) plus the barrel (`@kala-ui/react`).

## Component catalog

- **Layout**: `box`, `flex`, `grid`, `stack`, `group`, `center`, `container`, `paper`, `aspect-ratio`, `overlay`, `separator`, `resizable`, `scroll-area`, `collapsible`, `collapse`, `accordion`, `tabs`
- **Typography**: `text`, `heading`, `code`, `kbd`
- **Buttons & toggles**: `button`, `button-group`, `copy-button`, `burger`, `toggle`, `toggle-group`, `toolbar`, `segmented-control`
- **Forms**: `input`, `textarea`, `number-input`, `input-group`, `input-otp`, `label`, `field`, `checkbox`, `radio-group`, `switch`, `slider`, `select`, `combobox`, `multi-select`, `calendar`, `date-picker`, `time-picker`, `color-input`, `tag-input`, `file-upload`, `password-strength-indicator`, `rating`, `command`
- **Display**: `avatar`, `avatar-group`, `badge`, `tag`, `card`, `indicator`, `spinner`, `skeleton`, `progress`, `ring-progress`, `banner`, `table`, `tree-view`, `list`, `timeline`, `steps`, `pagination`, `breadcrumbs`
- **Overlays & menus**: `dialog`, `alert-dialog`, `drawer`, `popover`, `hover-card`, `tooltip`, `dropdown-menu`, `context-menu`, `menubar`, `navigation-menu`
- **Feedback & utility**: `alert`, `empty-state`, `error-boundary`, `loading`, `loading-overlay`, `spoiler`, `page-transition`, `skip-to-content`, `toast`, `theme-provider`

## Theming

Six built-in themes (light, neutral, accent, dark, high-contrast-light, high-contrast-dark), class-based dark mode, and a `ThemeProvider`. Every component reads CSS custom properties — override tokens on `:root`/`.dark` and the whole library follows. See [THEMING.md](../../THEMING.md).

```css
:root {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: white;
}
```

## React Server Components

All component modules ship with a `"use client"` banner, so they import cleanly into RSC apps (`dist/lib` stays server-safe for `cn()`).

## Development

```bash
pnpm storybook        # composed dev Storybook (core + app stories)
pnpm test             # unit tests (vitest + testing-library)
pnpm type-check       # tsc --noEmit
pnpm lint             # biome
pnpm build            # tsc + postbuild + compiled CSS
```

## Credits

- **[Radix UI](https://github.com/radix-ui/primitives)** — unstyled, accessible UI primitives
- **[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)** — utility-first CSS
- **[Vaul](https://github.com/emilkowalski/vaul)**, **[Sonner](https://github.com/emilkowalski/sonner)**, **[cmdk](https://github.com/pacocoursey/cmdk)**, **[react-day-picker](https://github.com/gpbl/react-day-picker)**, **[framer-motion](https://github.com/motiondivision/motion)**

See the [Storybook documentation](https://krr2020.com/kala-ui) for complete interactive docs.
