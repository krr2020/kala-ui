# AGENTS.md — @kala-ui/react-hooks

37 SSR-safe utility hooks: state, debounce/timing, DOM observers, browser APIs, SSR helpers. No component code lives here — both `react` and `react-app` depend on it.

## Commands

```bash
pnpm --filter @kala-ui/react-hooks build     # tsdown → dist (ESM + CJS + d.ts)
pnpm --filter @kala-ui/react-hooks dev       # tsdown --watch
pnpm --filter @kala-ui/react-hooks test      # vitest run (note: root test:watch/test:coverage skip this package)
```

## Structure

- One hook per file in `src/` (`use-debounce.ts`, `use-hotkeys.ts`, …), re-exported from `src/index.ts`.
- Tests in `src/__tests__/`, one file per hook, with `setup.ts`.
- `EXAMPLES.md` — usage docs per hook; update when changing a hook's API.

## Rules

- Lint is `biome check .` (stricter than other packages' `biome lint .`).
- Hooks must stay SSR-safe — guard `window`/`document` access and provide jsdom-clean teardown.
- Package is `"sideEffects": false`; keep exports tree-shakeable.
