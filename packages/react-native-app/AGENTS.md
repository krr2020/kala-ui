# AGENTS.md — @kala-ui/react-native-app

App-level composite components for React Native — mobile application chrome built on `@kala-ui/react-native` primitives (the native counterpart of `@kala-ui/react-app`).

## Commands

```bash
pnpm --filter @kala-ui/react-native-app build    # tsc --noEmit (source-exported)
pnpm --filter @kala-ui/react-native-app test     # vitest run && jest
```

## Structure

`src/components/`: `app-shell/`, `header/`, `tab-bar/` (mobile-native nav pattern with no web equivalent), `charts/`, `data-table/`, `metric-card/` + `src/lib/`, barrel at `src/index.ts`. Tests in `src/__tests__/`.

## Rules

- Source-exported like its dependency — no dist step; `exports` points at `src/index.ts`.
- Import primitives only via `@kala-ui/react-native` (boundary direction: this package → `react-native`, never the reverse).
- Follow the same component split as `@kala-ui/react-native`: `<name>.tsx` for JSX, `<name>.styles.ts` for style tables and mapping helpers; dot-file `<name>.utils.ts` for pure helpers.
- SDK-57 pin and dual-test-runner rules from `packages/react-native/AGENTS.md` apply here too.
