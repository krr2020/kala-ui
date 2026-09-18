# AGENTS.md — @kala-ui/react-native-app

App-level composite components for React Native (mobile application chrome) built on `@kala-ui/react-native` primitives.

## Commands

```bash
pnpm --filter @kala-ui/react-native-app build    # tsc --noEmit (source-exported)
pnpm --filter @kala-ui/react-native-app test     # vitest run && jest
```

## Rules

- Source-exported like its dependency — no dist step; `exports` points at `src/index.ts`.
- Import primitives only via `@kala-ui/react-native` (boundary direction: this package → `react-native`, never the reverse).
- Follow the same component split as `@kala-ui/react-native`: `<name>.tsx` for JSX, `<name>.styles.ts` for style tables and mapping helpers.
- See `packages/react-native/AGENTS.md` for the SDK-57 pin and dual-test-runner rules — they apply here too.
