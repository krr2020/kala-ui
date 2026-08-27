# Changelog

## 0.1.0-beta.1

### Minor Changes

- b5cd997: Add stable `data-kala-component` identification attributes to every component root.
  
  Every component (and each compound part, e.g. `dialog-content`, `card-header`, `data-table-toolbar`) now renders `data-kala-component="<kebab-name>"` on its root element. This is a guaranteed-stable public API for DevTools debugging, e2e selectors, and targeted consumer CSS overrides.
  
  - No styling or behavior changes — the attribute is identification only.
  - The ad-hoc `data-comp` markers previously used by a few components were migrated to `data-kala-component` (update any selectors that queried `[data-comp='...']`).
  - shadcn-compatible `data-slot` attributes are unchanged.

## 0.1.0-beta.0

### Minor Changes

- 2b8adc2: Kala UI 0.1.0 — token-driven theming, full a11y coverage, React 19 APIs, and a hardened component catalog (100+ components, 3,500+ tests).
  
  #### Breaking changes
  
  - **Package split**: `@kala-ui/react` now ships the ~90 standard UI components only. The 15 app-level composites (`AppShell`, `Header`, `Footer`, `Sidebar`, `Navigation`, `NavLink`, `DataTable`, `Dnd`, all `Chart` components, `MetricCard`, `SessionCard`, `UserMenuDropdown`, `SocialLoginButton(s)`) moved to the new **`@kala-ui/react-app`** package, which depends on core. Import both packages and `@import "@kala-ui/react-app/styles"` after the core stylesheet. `isActivePath` moved to `@kala-ui/react-app`; `FormSkeleton`/`FieldGroupSkeleton` are exported from `/field` instead of `/skeleton`. See `docs/MIGRATION-0.1.md`.
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

### Patch Changes

- Updated dependencies [2b8adc2]
  - @kala-ui/react-hooks@0.1.0-beta.4

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

### 0.0.1-beta.8 - 2026-08

### Added
- **DataTable**: Server-side data fetching support with callbacks
  - `onSortChange` callback for server-side sorting
  - `onFilterChange` callback for server-side filtering
  - `pagination.onChange` callback for server-side pagination
  - `searchable.onChange` callback for server-side search
  - Pagination now respects `pagination.total` prop for accurate page counts
  - New Storybook example: "Server-Side Data Fetching"
  - Updated documentation with server-side examples

### 0.0.1 - 2025-01-06

#### Added
- Initial release of Kala UI React component library
- 65+ accessible components built with Radix UI primitives
- Tailwind CSS integration with design tokens
- Full TypeScript support
- Storybook documentation
- Comprehensive test coverage

#### Components
- Accordion
- Alert
- Alert Dialog
- Avatar
- Badge
- Banner
- Button
- Calendar
- Command
- Combobox
- Charts
- Checkbox
- Date Picker
- Dialog
- Drawer
- Dropdown Menu
- Empty State
- Field
- File Upload
- Footer
- Header
- Input
- Input Group
- Input OTP
- Label
- List
- Navigation
- DND
- Menubar
- Navigation Menu
- Page Transition
- Pagination
- Steps
- Slider
- Toast
- Popover
- Progress
- Radio Group
- Resizable
- Select
- Separator
- Scroll Area
- Skeleton
- Skeleton Fade
- Skip to Content
- Social Login Button
- Social Login Buttons
- Sparkline Chart
- Spinner
- Switch
- Table
- Table Skeleton
- Data Table
- Tabs
- Tag Input
- Textarea
- Tooltip
- Toggle
- Password Strength Indicator
- Card
- Metric Card
- Multi Select
- Sidebar
- Breadcrumbs
- User Menu Dropdown
- Session Card
- Loading
- Error Boundary

#### Features
- Accessibility-first design with Radix UI primitives
- Dark mode support via CSS variables
- Modular component architecture
- Customizable via Tailwind CSS
- Type-safe with TypeScript
- Comprehensive testing with Vitest

#### Documentation
- Interactive Storybook stories
- Component usage examples
- Props documentation
