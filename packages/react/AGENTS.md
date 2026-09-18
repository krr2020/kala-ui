# AGENTS.md — @kala-ui/react

Core web component library: ~85 accessible components built on Radix UI primitives + Tailwind CSS, plus the token-driven theming system the whole repo consumes.

## Commands

```bash
pnpm --filter @kala-ui/react build        # tsc + add-js-extensions + postcss (globals.css → dist/styles/*.css)
pnpm --filter @kala-ui/react test         # vitest run (~3,400 tests, 164 files)
pnpm --filter @kala-ui/react storybook    # composed Storybook — core + app stories, port 6006
pnpm --filter @kala-ui/react test:tokens  # build + src/styles/tokens.test.ts — REQUIRED after any token/style change
```

## Structure

- `src/components/<name>/` — `<name>.tsx` + `<name>.types.ts` + `<name>.stories.tsx` + colocated tests + `index.ts` barrel. Loading-state variants live in `<name>-skeleton.tsx` with their own test.
- Component families (all under `src/components/`):
  - Primitives/layout: box, flex, grid, stack, center, container, paper, group, separator, aspect-ratio, scroll-area, resizable.
  - Form: input, textarea, number-input, select, combobox, multi-select, checkbox, radio-group, switch, slider, rating, date-picker, time-picker, calendar, color-input, file-upload, input-otp, tag-input, password-strength-indicator, field, label.
  - Overlays/menus: dialog, alert-dialog, drawer (vaul), popover, hover-card, tooltip, dropdown-menu, context-menu, command (cmdk), menubar, navigation-menu, breadcrumbs.
  - Feedback/data: alert, banner, toast (sonner), progress, ring-progress, spinner, loading, loading-overlay, skeleton, table, pagination, tabs, accordion, collapsible, collapse, steps, timeline, tree-view, empty-state, error-boundary.
  - Identity/text: avatar, avatar-group, badge, tag, heading, text, code, kbd, copy-button, spoiler, indicator, toggle, toggle-group, button, button-group, burger, theme-provider.
- `src/styles/globals.css` — the token source of truth (`:root` / `.dark` / theme custom properties + `@theme` block). Contract: `TOKEN_SPEC.md`; compiled to `dist/styles/globals.css` (utilities), `helpers.css`, `theme.css` (Tailwind mode).
- `src/lib/` (shared utils), `src/config/` (exports config), `src/__tests__/` (cross-component suites: `a11y.test.tsx`, `component-markers.test.tsx`).

## Rules

- New component = implementation + types + stories + test + `index.ts` barrel + subpath export in `package.json` + barrel entry in `src/index.ts` (full walkthrough in root `CONTRIBUTING.md` "Adding Components").
- Every component module ships a `"use client"` banner — imports must stay clean for React Server Components (no `useEffect`-pulling modules re-exported through server-safe paths).
- Every component root carries a `data-kala-component="<kebab-name>"` attribute — a public, contractual API; `src/__tests__/component-markers.test.tsx` must stay green after refactors.
- Style/token changes must pass `test:tokens` and land in all PostCSS outputs (`globals.css`, `helpers.css`, `theme.css`); then regenerate native themes (see `packages/react-native/AGENTS.md`).
- High-ripple DOM nodes — changes cascade widely: `Button`, `TableCell`, `Skeleton`, `Text`, `Box`, `Flex`, `PaginationItem`.
