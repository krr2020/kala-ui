# AGENTS.md — @kala-ui/react-native

React Native + Expo arm of the library: Unistyles themes transcribed from the web token source of truth (`packages/react/src/styles/globals.css`), with the component vocabulary rebuilt natively.

## Commands

```bash
pnpm --filter @kala-ui/react-native build      # tsc --noEmit (source-exported — no dist step)
pnpm --filter @kala-ui/react-native test       # vitest run && jest (both stacks)
node scripts/check-sdk-compat.mjs              # verify Expo SDK 57 exact pins
```

Verify visually in `apps/native-playground` (Metro watches this package's source — edits hot-reload without a rebuild).

## Structure

- `src/themes/definitions.ts` — Unistyles theme definitions transcribed from web tokens.
- `src/components/<name>/` — `<name>.tsx` (JSX only) + `<name>.styles.ts` (style tables and pure mapping helpers like `look()`/`tone()`).
- `src/lib/<name>.utils.ts` — pure utilities, dot-file naming (NOT `<name>-utils.ts`).
- `src/tokens/`, `src/types/` — exported via `./tokens` / `./types` subpaths.

## Rules

- Package is **source-exported** (`main`/`exports` point at `src/`); never add a `dist` build step or hand-write compiled output.
- Expo SDK 57 matrix pins are exact (`react-native 0.86.3`, `react 19.2.3`, …) — don't bump past the SDK's tested range.
- Dark-family themes (`dark`, `dark-accent`, `high-contrast-dark`) lack `success`/`warning` tokens — consumers must fall back gracefully rather than assuming parity with light-family themes.
- Tests run under both vitest (pure logic) and jest/expo (component rendering); place each test in the runner that can execute it.
