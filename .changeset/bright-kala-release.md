---
'@kala-ui/react': minor
'@kala-ui/react-hooks': minor
---

Kala UI 0.1.0 — token-driven theming, full a11y coverage, React 19 APIs, and a hardened component catalog (100+ components, 3,500+ tests).

#### Breaking changes

- **Theming**: Tailwind v4-native `globals.css` (`@theme`/`@custom-variant dark`); `@kala-ui/design-tokens` package, `tailwind-base` config export, `tailwind.config.ts`, and the `--overlay`/`--border-strong`/`--radius` token removals. Tokens are whole color values overridable on `:root`/`.dark`; alpha via `color-mix`. Custom helper classes renamed to `kala-*` and defined once in `styles/helpers.css`.
- **`"use client"` directives** are emitted in both packages' dist — every component and hook server-renders in React Server Component apps without a manual client boundary.
- **React 19 ref-as-prop**: all components accept `ref` directly (no more `forwardRef` objects).
- **AppShell**: `navbar.collapsed`/`aside.collapsed` config removed in favor of breakpoint-correct off-canvas layout (`breakpoint` + width only).
- **Button**: `asChild` now renders the child disabled correctly instead of dropping the attribute.
- **Field** is context-based (`Field` + `FieldControl` wires `aria-describedby`/`aria-invalid`); **List** `as` prop removed (always renders an `li` wrapper); **List `lineClamp`** uses static utilities; **Avatar `alt` is required**; **Banner** default role is `status`.
- **Text colors** normalized to `primary|secondary|destructive|success|warning|info|muted`; **variants×colors** standardized across form/display components; unified `size` scale; standardized `onValueChange` void callbacks; `useUncontrolled` dual (value/defaultValue) semantics.
- **Charts** lazy-load apexcharts (no eager bundle import); chart colors resolve live CSS vars with SSR fallbacks.
- **Hooks**: `useClickOutside(handler, { events, ignore })` options API returning a stable ref; `useScrollLock` reference-counted; `useHover`/`useElementSize`/`useIntersection` return callback refs (late-mount and node-swap safe); `useInterval.active` is reactive state; `useIdle` preserves `initialState`; React 19 `RefObject<T | null>` types.
- Removed dead exports: `src/primitives/command` duplicate palette, `lib/animations`, `lib/use-mobile`.

#### Added

- `ThemeProvider`/`useTheme` (class strategy, localStorage, system preference) and six built-in themes (light, neutral, accent, dark, high-contrast-light, high-contrast-dark).
- `FieldControl`, `Dialog size="full"`, `ErrorBoundary resetKeys` + default fallback, `Collapse id/className/style`, `TreeView` ARIA APG tree with roving tabindex, keyboard-navigable `Rating` (half steps), `useTableState` controlled `page`, `isActivePath` helper.
- Storybook test-runner visual regression harness (smoke for every story, image snapshots for core components in light + dark), GitHub Actions CI, and a Next.js App Router consumer integration gate.

#### Fixed

- DateRangePicker closes after the second day click (react-day-picker v10 range semantics); DatePicker/ColorInput/TimePicker controlled-open, alignment, and scroll-into-view behavior; MultiSelect search reset and combobox a11y; TagInput IME composition guard; NumberInput float drift; FileUpload `accept` matching and same-file re-selection; Input suffix icon click-through; Alert re-render on children change; Navigation/Sidebar active-link prefix matching; sonner theme follows tokens.
