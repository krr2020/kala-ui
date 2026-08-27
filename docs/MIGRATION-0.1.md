# Migrating to 0.1.0-beta.0

`0.1.0-beta.0` is the consolidation of the 2026-08 modernization audit
(`docs/AUDIT-2026-08-27.md`): token-driven theming, ARIA coverage, React 19
APIs, and a hardened component catalog. This guide covers everything that
breaks when upgrading from `0.0.1-beta.x`.

The library is pre-1.0 and development-phase: no backward compatibility is
provided for removed APIs. Each section tells you what changed and what to
use instead.

## Installation & styles

The `@kala-ui/design-tokens` package is gone, along with the
`@kala-ui/react/config/tailwind-base` export, `tailwind.config.ts`, and the
`autoprefixer` dependency. There is no Tailwind configuration to extend
anymore.

```bash
pnpm remove @kala-ui/design-tokens
pnpm add @kala-ui/react @kala-ui/react-hooks
```

Import the compiled stylesheet once in your app root — it ships every
utility and helper class the library uses, so your app does **not** need
Tailwind CSS at all:

```css
@import "@kala-ui/react/styles";
@import "@kala-ui/react/styles/helpers";
```

If your app already runs Tailwind v4, you can keep your own setup and
instead `@source` the package so your compiler sees the library's class
names; both paths are supported. The helper classes are `kala-*`
(`kala-surface-card`, `kala-surface-input`, `kala-surface-popover`,
`kala-focus-ring`, `kala-ring*`, `kala-touch`) and are defined once in
`styles/helpers.css` under `@layer components` — your `className` overrides
always win, with no `!important` fights.

## Theming

Tokens are now **whole color values** (hsl/oklch/hex — any format), not raw
HSL channels. Alpha is composed with `color-mix`, so `--overlay` and
`--border-strong` channel variables and the `--radius` token were removed.

Override tokens on `:root` / `.dark` (or any ancestor) and every component,
chart, and scrim picks the change up automatically:

```css
:root {
	--primary: oklch(0.55 0.22 264);
	--ring: oklch(0.55 0.22 264);
}
.dark {
	--primary: oklch(0.72 0.17 264);
}
```

Dark mode is class-based: put `.dark` on `<html>`. The new
`ThemeProvider` / `useTheme` (from `@kala-ui/react` or the
`@kala-ui/react/theme-provider` subpath) manages the class with
`localStorage` persistence and system-preference detection.

Charts resolve colors from live CSS variables (with SSR-safe fallbacks), so
custom themes apply to charts too.

## React 19 & Server Components

- **`ref` is a plain prop** on every component — the `forwardRef` objects
  are gone. `const ref = useRef(null); <Button ref={ref} />` just works.
- The packages ship `"use client"` banners. Components and hooks can be
  imported directly into React Server Components (Next.js App Router)
  without adding your own `"use client"` boundary. `cn` from
  `@kala-ui/react/lib/utils` remains server-safe.
- Peer range is `react >= 19.2`.

## Component changes

| Component | Change | Migration |
| --- | --- | --- |
| `AppShell` | `navbar.collapsed` / `aside.collapsed` config removed | Panels are off-canvas below their `breakpoint` and docked from it up; pass only `width` and `breakpoint` |
| `Avatar` | `alt` is required | Provide `alt` (empty string for decorative) |
| `Banner` | Default role is `status` | Pass `role="alert"` for urgent messages |
| `Button` | `asChild` + `disabled` renders the child disabled | No migration; behavior fix |
| `Collapse` | Controlled prop is `in` | Rename `isOpen` → `in` |
| `Dialog` | New `size="full"` variant | — |
| `ErrorBoundary` | `resetKeys?: unknown[]` auto-reset; default fallback when `fallback` omitted | Optional |
| `Field` | Context-based; new `FieldControl` clones the control and wires `aria-describedby`/`aria-invalid` | Wrap inputs: `<Field><FieldLabel>…</FieldLabel><FieldControl><Input /></FieldControl><FieldError>…</FieldError></Field>` |
| `List` | `as` prop removed; items always render an `li` wrapper | Drop `as` |
| `List` | `lineClamp` uses static utilities (1–6) with an inline-style fallback beyond | No migration |
| `NavLink` | Navigation item is a button-style prop API (`label`, `icon`, …) | See the storybook docs |
| `ResizablePanelGroup` | Prop is `orientation` | Rename `direction` |
| `SegmentedControl` | Radiogroup of `role="radio"` buttons; arrows focus + select; per-instance indicator | Provide `name` to group |
| `Steps` | Renders `ol/li` with `aria-current` | No migration |
| `Text` | `color` accepts `primary \| secondary \| destructive \| success \| warning \| info \| muted` | Rename `default` → `primary`, `error` → `destructive` |
| Most form/display components | Variants × colors standardized on the same axes; unified `size` scale (`xs…xl`); `onValueChange` callbacks return `void` | Check each component's types; codemod-friendly renames |
| `useUncontrolled` consumers | Dual controlled/uncontrolled semantics (`value`/`defaultValue`) | Passing `value` makes the component controlled |
| `MultiSelect` | Trigger is a real `role="combobox"` overlay button | No migration |
| `TreeView` | Rewritten to the ARIA APG tree pattern (`role="tree"`, roving tabindex, keyboard nav) | No migration |

## Charts

`Chart`, `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `RadialBarChart`,
and `SparklineChart` lazy-load `apexcharts` — it is no longer part of the
initial bundle and never runs during SSR. Tests should `await findByTestId`
for chart content.

## Hooks (`@kala-ui/react-hooks`)

| Hook | Change |
| --- | --- |
| `useClickOutside` | `(handler, { events, ignore })` options API returning a stable `RefObject` |
| `useScrollLock` | Reference-counted; nested consumers no longer unlock each other |
| `useHover`, `useElementSize`, `useIntersection` | Return callback refs (stable); handle late mounts and node swaps |
| `useInterval` | `active` is reactive state |
| `useIdle` | Preserves `initialState` on mount |
| All | React 19 `RefObject<T \| null>` types |

## Removed exports

- `@kala-ui/design-tokens` (whole package)
- `@kala-ui/react/config/tailwind-base`
- `src/primitives/command/*` — use `@kala-ui/react/command`
- `lib/animations`, `lib/use-mobile` — use framer-motion transitions and
  `useMediaQuery` from `@kala-ui/react-hooks`
