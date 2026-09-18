# AGENTS.md

Kala UI — pnpm monorepo for a token-driven React component library (web + React Native). Node 18+, pnpm 10 (`corepack enable` picks up the pinned version).

## Layout

| Path | Package | What |
| --- | --- | --- |
| `packages/react` | `@kala-ui/react` | ~90 accessible web components (Radix UI + Tailwind), theming tokens, Storybook |
| `packages/react-app` | `@kala-ui/react-app` | App-level composites: AppShell, DataTable, charts, dnd |
| `packages/react-hooks` | `@kala-ui/react-hooks` | 37 utility hooks |
| `packages/react-native` | `@kala-ui/react-native` | Native arm: Unistyles themes + components (source-exported) |
| `packages/react-native-app` | `@kala-ui/react-native-app` | Native app chrome (source-exported) |
| `apps/playground` | `@kala-ui/playground` | Next.js consumer gate (RSC/server-render check) |
| `apps/native-playground` | `@kala-ui/native-playground` | Expo app exercising the native packages |

Each package has its own `AGENTS.md` with local conventions.

## Commands (root)

```bash
pnpm build          # build all packages (tsc/postcss/tsdown per package)
pnpm type-check     # tsc --noEmit across packages
pnpm lint           # boundary guard (scripts/check-package-boundaries.mjs) + biome per package
pnpm test           # vitest across packages (3,600+ tests)
pnpm storybook      # composed Storybook
pnpm test-storybook # 710-story smoke + visual regression suite
pnpm build:apps     # Next.js consumer gate
```

## Hard rules

- **Dependency direction**: `react-app` → `react` → `react-hooks`, never reversed. `react-app` imports the core via `@kala-ui/react/*` subpaths which resolve from **built `dist`** — build `@kala-ui/react` and `react-hooks` before testing/type-checking `react-app`. Enforced by `pnpm lint`.
- **Versions**: shared dependency versions live in the `catalog:` block of `pnpm-workspace.yaml` — reference as `"dep": "catalog:"`, never pin duplicates. Consumer-facing `peerDependencies` stay literal ranges. Expo SDK 57 native pins are exact on purpose; `packages/react-native/scripts/check-sdk-compat.mjs` verifies them.
- **Commits**: Conventional Commits — `feat(button): add loading state support`. Branches: `feature/…`, `fix/…`, `docs/…`, `refactor/…`.
- **Tooling**: Biome for lint/format. Don't hand-edit `dist/`; `scripts/add-js-extensions.mjs` fixes ESM imports post-build.
- **Releases**: changesets (`docs/RELEASING.md`); breaking changes need a migration doc.

## Pointers

- Theming/token contract: `THEMING.md`, `packages/react/TOKEN_SPEC.md`
- Contribution workflow and guidelines: `CONTRIBUTING.md`
- Audit findings register: `docs/AUDIT-2026-08-27.md`
