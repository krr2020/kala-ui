# Glossary

## Purpose

Shared vocabulary for Kala UI, a React component library with a token-driven theming system, organized as a pnpm monorepo (`packages/react`, `packages/react-hooks`, `packages/react-app`). Use these terms consistently when reading docs, writing components, or implementing tasks.

## Terms

**Component library** — The ~90 accessible, production-ready primitives built on Radix UI and Tailwind CSS, shipped from `packages/react` (see `packages/react/README.md`). Covered by [Core UI Component Library](features/core-ui-component-library.md).

**Form Controls** — The form input suite: inputs, selects, comboboxes, checkboxes, date/time pickers, multi-select, tag-input, password-strength-indicator, OTP input. See [Form Controls](features/form-controls.md).

**Layout Primitives** — Box, Flex, Grid, Stack, Center, Container, Group, and Paper for composing layouts. See [Layout Primitives](features/layout-primitives.md).

**Navigation Components** — Breadcrumbs, navigation-menu, menubar, pagination, tabs, and tree-view primitives. See [Navigation Components](features/navigation-components.md).

**Overlays & Menus** — Dialogs, drawers, popovers, tooltips, dropdown/context menus, command palette, and toasts. See [Overlays & Menus](features/overlays-menus.md).

**Application Chrome Composites** — AppShell, Header, Sidebar, Footer, Navigation, and NavLink composites for full application layouts. See [Application Chrome Composites](features/application-chrome-composites.md).

**Charts** — Area, Bar, Line, Donut, RadialBar, and Sparkline data-visualization components. See [Charts](features/charts.md).

**Token-Driven Theming** — Whole-CSS-color custom-property token system with  themes, overridable on `:root` and dark selectors; Tailwind not required. See [Token-Driven Theming](features/token-driven-theming.md).

**Dark Mode & Theme Switching** — ThemeProvider with `resolvedTheme` awareness; `dark` and `high contrast dark` map to Sonner's `dark` theme so toasts follow the active theme. See [Dark Mode & Theme Switching](features/dark-mode-theme-switching.md).

**DOM Component Identification** — Components are identifiable in the DOM via documented CSS class naming conventions. See [DOM Component Identification](features/dom-component-identification.md).

**React Hooks Collection** — `@kala-ui/react-hooks` (`packages/react-hooks/README.md`): 37 SSR-safe, React 19 typed hooks grouped as State & values, Debounce & timing, Elements & DOM, Browser APIs, and SSR & utilities (e.g. `useDebouncedValue`, `useLocalStorage`). See [React Hooks Collection](features/react-hooks-collection.md).

**React Server Components (RSC) Support** — React 19 / React Server Components readiness of the library's components. See [React Server Components Support](features/react-server-components-support.md).

**Playground App** — `@kala-ui/react-app` (`packages/react-app/README.md`), a Next.js app exercising the library with client and server routes. See [Playground App](features/playground-app.md).

**Storybook Documentation** — Component docs and interactive stories; commands include start/build/test Storybook. See [Storybook Documentation](features/storybook-documentation.md).

**Skeleton** — Loading-placeholder component documented in `packages/react/src/components/skeleton/README.md`.

**DataTable** — Higher-level table component in the playground app (`packages/react-app/src/components/data-table/README.md`) supporting search, pagination, server-side data fetching, row selection, bulk actions, custom cell rendering, loading/empty states, clickable rows, and footer; documented with a `DataTableProps` API reference and a "Refactored Audit Log" before/after example.

**Migrations** — Version-to-version migration guides and deviation approvals, e.g. `docs/migrations/acalumi-t1.2.0-deviation-approval.md` (a domain contract). Related structural notes in `MIGRATION 0.1.md` and `RELEASING.md`, covered by [Architecture](architecture.md).

**Component** (general) — Any exported React UI primitive from `packages/react`; components are client-usable, RSC-ready where noted.

**Controls** — Shorthand for Form Controls (inputs and pickers), distinct from Navigation Components and Overlays.

## Implementation map

- `packages/react/README.md` — core component library entry point and vocabulary source.
- `packages/react-hooks/README.md` — hooks taxonomy (State & values, Debounce & timing, Elements & DOM, Browser APIs, SSR & utilities).
- `packages/react-app/README.md` — `@kala-ui/react-app` playground package.
- `packages/react-app/src/components/data-table/README.md` — DataTable feature vocabulary and API.
- `packages/react/src/components/skeleton/README.md` — Skeleton component docs.
- `docs/migrations/acalumi-t1.2.0-deviation-approval.md` — migration/deviation contract naming.
- Structural overview: [Architecture](architecture.md); command reference: [Getting started](getting-started.md).

## Working notes

- Terms map 1:1 to feature pages; prefer the wiki page over re-reading package READMEs when implementing tasks.
- `@kala-ui/react-hooks` documents Installation (with an "or" alternative registry), usage examples for `useDebouncedValue` and `useLocalStorage` — treat these as the canonical hook API names.
- DataTable terminology ("bulk actions", "custom cell rendering", "server-side data fetching") is specific to the playground app package, not the core library.

## Evidence

| Source | What it grounds |
| --- | --- |
| packages/react/README.md | Core component library |
| packages/react-hooks/README.md | Hooks collection, categories, examples |
| packages/react-app/README.md | Playground app package |
| packages/react-app/src/components/data-table/README.md | DataTable feature/API terms |
| packages/react/src/components/skeleton/README.md | Skeleton component |
| docs/migrations/acalumi-t1.2.0-deviation-approval.md | Migrations terminology |