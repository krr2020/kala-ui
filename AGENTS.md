# AGENTS.md

Kala UI — pnpm monorepo for a token-driven React component library (web + React Native). Node 18+, pnpm 10 (`corepack enable` picks up the pinned version). LLM guidance only; humans see `CONTRIBUTING.md`.

## Layout

| Path | Package | What |
| --- | --- | --- |
| `packages/react` | `@kala-ui/react` | ~90 web components (Radix + Tailwind): primitives, form controls, overlays/menus + theming tokens + Storybook |
| `packages/react-app` | `@kala-ui/react-app` | 15 app composites on the core: AppShell, DataTable, charts, dnd, dashboard/auth widgets |
| `packages/react-hooks` | `@kala-ui/react-hooks` | 37 SSR-safe hooks: state, timing, DOM observers, browser APIs |
| `packages/react-native` | `@kala-ui/react-native` | Native arm: Unistyles themes + ~50 rebuilt components (source-exported) |
| `packages/react-native-app` | `@kala-ui/react-native-app` | Native chrome: app-shell, tab-bar, native charts/data-table (source-exported) |
| `apps/playground` | `@kala-ui/playground` | Next.js App Router consumer gate — RSC/server-render check for web |
| `apps/native-playground` | `@kala-ui/native-playground` | Expo app exercising native packages — living docs for mobile theming |

Each package has its own `AGENTS.md` with local conventions, structure, and inventory.

## Commands (root)

```bash
pnpm build            # build packages (order handled by filters; hooks/core first when testing react-app)
pnpm build:apps       # playground next build — the RSC consumer gate
pnpm type-check       # tsc --noEmit across packages
pnpm lint             # boundary guard (scripts/check-package-boundaries.mjs) + biome per package
pnpm test             # vitest across packages (3,600+ tests)
pnpm storybook        # composed Storybook (core + app stories, port 6006)
pnpm test-storybook   # 710-story smoke + visual regression suite
```

## Hard rules

- **Dependency direction** (enforced by `pnpm lint`): `react-app` → `react` → `react-hooks`, never reversed. Native: `react-native-app` → `react-native`. Apps consume packages, never the reverse. `react-app` imports the core via `@kala-ui/react/*` subpaths that resolve from **built `dist`** — build `@kala-ui/react` and `react-hooks` before testing/type-checking `react-app`.
- **Web tokens are the source of truth.** `packages/react/src/styles/tokens.css` holds the semantic token set (`--primary`, …); `globals.css` composes it with `helpers.css`/`theme.css` and is the entry consumers import (`THEMING.md`, `packages/react/TOKEN_SPEC.md`); `packages/react-native` themes are generated from it (`generate-themes.mjs`, parity-tested). Never hand-diverge either side.
- **Versions**: shared dep versions live in the `catalog:` block of `pnpm-workspace.yaml` — reference `"dep": "catalog:"`, never pin duplicates. `peerDependencies` stay literal ranges. Expo SDK 57 native pins are exact (`react-native 0.86.3`, `react 19.2.3`); don't bump past the SDK's tested matrix.
- **Commits**: Conventional Commits — `feat(button): add loading state support`. Branches: `feature/…`, `fix/…`, `docs/…`, `refactor/…`.
- **Tooling**: Biome for lint/format. Never hand-edit `dist/`; `scripts/add-js-extensions.mjs` fixes ESM relative imports after tsc.
- **Releases**: changesets (`docs/RELEASING.md`); breaking changes need a migration doc; check `docs/AUDIT-2026-08-27.md` before touching component behavior.

## Change-type → verification

- Component (web): package test + Storybook + marker/a11y suites stay green.
- Token/style: `pnpm --filter @kala-ui/react test:tokens`, then regenerate native themes + parity test.
- New export: subpath in package.json + barrel entry + docs per package AGENTS.md.
- Anything user-facing: exercise in the matching playground before committing.
