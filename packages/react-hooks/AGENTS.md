# AGENTS.md — @kala-ui/react-hooks

38 SSR-safe utility hooks — no component code. Both `@kala-ui/react` and `@kala-ui/react-app` depend on this package.

## Commands

```bash
pnpm --filter @kala-ui/react-hooks build     # tsdown → dist (ESM + CJS + d.ts)
pnpm --filter @kala-ui/react-hooks dev       # tsdown --watch
pnpm --filter @kala-ui/react-hooks test      # vitest run — root test:watch/test:coverage SKIP this package
```

## Structure

- One hook per directory in `src/`, re-exported (hook + types) from `src/index.ts`:
  - State: `use-counter`, `use-toggle`, `use-disclosure`, `use-list-state`, `use-uncontrolled`, `use-previous`, `use-pagination`, `use-id`, `use-mounted`.
  - Timing: `use-debounce`, `use-debounced-value`, `use-timeout`, `use-interval`.
  - DOM/events: `use-click-outside`, `use-focus-trap`, `use-hotkeys`, `use-hover`, `use-mouse`, `use-move`, `use-element-size`, `use-viewport-size`, `use-window-event`, `use-window-scroll`, `use-scroll-lock`, `use-intersection`, `use-merged-ref`, `use-isomorphic-effect`.
  - Browser APIs: `use-clipboard`, `use-local-storage` (exports both `useLocalStorage` and `useSessionStorage`), `use-media-query`, `use-network`, `use-os`, `use-color-scheme`, `use-reduced-motion`, `use-document-title`, `use-idle`.
- `src/utils/` — shared helpers (`useCallbackRef`); `use-merged-ref` also exports `mergeRefs`/`assignRef`, `use-move` exports `clamp`. `src/__tests__/` — one test file per hook + `setup.ts`.
- `README.md` — usage doc per hook; update it when changing a hook's API.

## Rules

- Lint is `biome check .` (stricter than other packages' `biome lint .`).
- Hooks must stay SSR-safe — guard `window`/`document` access, clean up effects.
- Package is `"sideEffects": false`; keep exports tree-shakeable.
- New hook = `src/<name>/` directory + test in `src/__tests__/` + barrel entry in `src/index.ts` + `README.md` section.
