# AGENTS.md — @kala-ui/react

Core web component library: ~90 accessible components built on Radix UI primitives + Tailwind CSS, plus the token-driven theming system that the rest of the repo consumes.

## Commands

```bash
pnpm --filter @kala-ui/react build        # tsc + add-js-extensions + postcss (globals.css → dist/styles)
pnpm --filter @kala-ui/react test         # vitest run
pnpm --filter @kala-ui/react storybook    # composed Storybook (core + app stories)
pnpm --filter @kala-ui/react test:tokens  # build + tokens.test.ts — REQUIRED after any token/style change
```

## Structure

- `src/components/<name>/` — `<name>.tsx`, `<name>.types.ts`, `<name>.stories.tsx`, colocated tests, `index.ts` barrel. Loading-state variants live in `<name>-skeleton.tsx` with their own test.
- `src/styles/globals.css` — the token source of truth (`:root`/theme custom properties + `@theme` block). Contract: `TOKEN_SPEC.md`.
- `src/lib/`, `src/config/`, `src/__tests__/` — shared utils, exports config, cross-component suites (`a11y.test.tsx`, `component-markers.test.tsx`).

## Rules

- New component = implementation + types + stories + test + `index.ts` barrel + subpath export in `package.json` + barrel entry in `src/index.ts` (full walkthrough in root `CONTRIBUTING.md`).
- Every component module ships a `"use client"` banner — keep imports clean for React Server Components.
- Every component root carries a `data-kala-component="<kebab-name>"` attribute — a public, contractual API; `src/__tests__/component-markers.test.tsx` must stay green after refactors.
- Style changes must include PostCSS-compiled output paths (`dist/styles/globals.css`, `helpers.css`, `theme.css`) and pass `test:tokens`.
- Hot DOM nodes with wide ripple: `Button`, `TableCell`, `Skeleton`, `Text`, `Box`, `Flex`, `PaginationItem`.
