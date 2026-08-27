# Theming Guide

How to theme kala-ui. The system is plain CSS custom properties: every
component, chart, scrim, and focus ring reads from the same token set, and
token values are **whole CSS colors** (`hsl(...)`, `oklch(...)`, `#hex` —
never bare HSL channel triplets).

**You do not need Tailwind to use kala-ui.** Tailwind is an implementation
detail of the precompiled stylesheet; the tokens work everywhere.

## Quick start

```bash
npm install @kala-ui/react
```

```tsx
import "@kala-ui/react/styles"; // precompiled CSS: tokens, utilities, component classes
// import "@kala-ui/react-app/styles"; // utilities for @kala-ui/react-app (import after core)
```

Optional theme switching (class strategy, OS preference, persistence):

```tsx
import { ThemeProvider, useTheme } from "@kala-ui/react";

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ThemeToggle />
      {/* your app */}
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as never)}>
      <option value="system">System</option>
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
```

`ThemeProvider` applies the active theme as a class on `<html>`, persists the
choice to `localStorage` (key `kala-ui-theme`, configurable via `storageKey`),
resolves `"system"` through `prefers-color-scheme` (live), and syncs the CSS
`color-scheme` property (disable with `enableColorScheme={false}`). Themes:
`light` (default) · `neutral` · `accent` · `dark` · `high-contrast-light` ·
`high-contrast-dark`. You can also toggle the classes yourself — everything
(including charts) observes `<html>` class changes, with or without the
provider.

## Customizing the palette

Redefine tokens after the import, in any color format:

```css
@import "@kala-ui/react/styles";
/* @import "@kala-ui/react-app/styles"; */ /* if you use the app package */

:root {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: white;
  --kala-radius-control: 9999px; /* pill-shaped controls */
}

.dark {
  --primary: oklch(0.75 0.18 264);
}
```

That is the whole customization model. Every `bg-primary` button, chart
series, spinner, and link picks the change up — charts resolve token values
from the live stylesheet at render time (with curated fallbacks where no CSS
engine exists, e.g. SSR).

### Token reference

| Group | Tokens |
| --- | --- |
| Base | `--background`, `--foreground`, `--background-alpha` |
| Surfaces | `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--card-border-alpha` |
| Brand | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground` |
| Feedback | `--success`, `--warning`, `--error`, `--info`, `--destructive` + `-foreground` each |
| Text/lines | `--muted`, `--muted-foreground`, `--border`, `--border-strong`, `--border-alpha`, `--separator`, `--input` |
| Focus | `--ring`, `--ring-offset-color` |
| Scrim | `--overlay`, `--overlay-alpha` (dialog/drawer/sidebar overlays; `bg-overlay` utility, `/40`-style modifiers work) |
| Shadows | `--shadow-color`, `--shadow-alpha`, `--shadow-spread` |
| Shape/density | `--kala-radius-control`, `--kala-radius-card`, `--kala-control-h`, `--kala-control-px`, `--kala-card-pad` |

Notes:

- `--*-foreground` tokens exist so text placed ON a filled surface stays
  legible — when you change `--primary`, change `--primary-foreground` to a
  contrasting color.
- Alpha tokens (`--border-alpha`, `--overlay-alpha`, `--shadow-alpha`) let a
  theme draw borders/scrims/shadows at partial opacity in any color format;
  kala-ui applies them with `color-mix()`.
- `--kala-*` knobs set the shape language in one place: control radius, card
  radius, control height, control padding, card padding. Prefer them over
  per-component overrides.
- `--border-strong` is the stronger border used for table headers/separators.

## Built-in themes

`:root` defaults to the light theme. Other themes are classes on `<html>`
(or any wrapper): `neutral`, `accent`, `dark`, `dark accent`,
`high-contrast-light`, `high-contrast-dark`.

## Custom themes

Add your own class and redefine whatever the theme changes:

```css
.my-brand {
  --primary: #7c3aed;
  --primary-foreground: #ffffff;
  --kala-radius-control: 9999px; /* pill controls */
}
```

```tsx
document.documentElement.classList.add("my-brand");
```

## Component CSS classes

Styling hooks emitted by components (all `kala-` prefixed, defined in
`@layer components` so your utilities always win):

- `kala-surface-card`, `kala-surface-input`, `kala-surface-popover` — themed
  surface (background/border, card adds the themed shadow)
- `kala-focus-ring`, `kala-focus-ring-destructive`, `kala-focus-ring-success`,
  `kala-focus-within-ring`, `kala-focus-within-ring-destructive` — keyboard
  focus rings
- `kala-ring`, `kala-ring-destructive` — persistent (always-on) rings
- `kala-touch` — touch-target enabler: on `pointer: coarse` devices (phones,
  tablets) expands the element's hit area to at least 44×44px via a
  transparent overlay; a no-op everywhere else. Applied automatically to
  compact controls (Button, Checkbox, Switch, Radio, icon actions), so you
  never need it by hand — add it to your own small buttons if you want the
  same guarantee. Never changes visuals, only the tap area.

Because these live in the `components` cascade layer, any utility or
unlayered CSS you add beats them — `className` overrides just work:

```tsx
<Card className="bg-red-500/10 border-red-500" /> // wins over kala-surface-card
```

## Using with your own Tailwind build

Two supported recipes. Both cover the core package; if you also use
`@kala-ui/react-app`, add its stylesheet/`@source` alongside the core one
(every recipe below shows the app-package line commented).

### A. Precompiled stylesheets (recommended)

```ts
import "@kala-ui/react/styles";
// import "@kala-ui/react-app/styles"; // only if you use @kala-ui/react-app
```

Works with any setup — Tailwind or not, any framework. Utilities referenced
by kala-ui components are already compiled in. The app package's stylesheet
is utilities-only: the theme, tokens, preflight and `kala-*` helper classes
all ship once via `@kala-ui/react/styles`, which must be imported first.

### B. Compile kala-ui into your own Tailwind v4 build

```css
@import "tailwindcss";
@import "@kala-ui/react/tailwind"; /* shared @theme mapping + dark variant */
@source "../node_modules/@kala-ui/react/dist";
/* @source "../node_modules/@kala-ui/react-app/dist";  app package */
@import "@kala-ui/react/styles/helpers";

/* tokens — start from the :root block of @kala-ui/react/styles
   and customize: */
:root {
  --primary: #7c3aed;
  --primary-foreground: #ffffff;
}

/* mirror kala-ui's class-based dark mode: */
@custom-variant dark (&:where(.dark, .dark *));
```

- `@source` scans the shipped JS for utility class names so they compile.
- `@kala-ui/react/tailwind` is the shared theme source both packages build
  against — importing it keeps your utilities identical to the precompiled
  ones (the `@custom-variant` line becomes optional but harmless).
- `helpers.css` carries the `kala-*` component classes (already layered).
- Token definitions are NOT included in this mode — copy the default `:root`
  and `.dark` blocks from `@kala-ui/react/styles` once, then customize;
  otherwise components fall back to inherited/initial values for colors.

## Charts

Charts (`Chart`, `LineChart`, `AreaChart`, `BarChart`, `DonutChart`,
`RadialBarChart`, `SparklineChart` — all in `@kala-ui/react-app`) are
theme-aware with zero config:

- Series colors derive from `--primary`, `--success`, `--warning`,
  `--destructive`, `--info` (lighter tints in light themes, darker shades in
  dark themes, computed with `color-mix`).
- Grid lines follow `--border`, axis labels follow `--muted-foreground`,
  tooltips follow `--popover` / `--popover-foreground`.
- Theme switches (`.dark` etc. on `<html>`) are picked up live via a
  `MutationObserver` — no remount needed.
- Explicit `color`/`colors` props still win for one-off branding.

## FAQ

**Where do the palette scales live?** In CSS: the `@theme` block of
`@kala-ui/react/styles` defines the primitive color ramps, fonts, text scale,
shadows, and container widths. There is no separate tokens package — CSS is
the single source of truth.

**How do I remove the rounded look globally?**
`:root { --kala-radius-control: 0; --kala-radius-card: 0; }`

**How do I make dialog scrims less dark?**
`:root { --overlay: hsl(0 0% 0%); --overlay-alpha: 0.3; }`
