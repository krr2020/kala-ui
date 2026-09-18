# AGENTS.md — @kala-ui/native-playground

Expo app exercising `@kala-ui/react-native` and `@kala-ui/react-native-app` — living docs for the native theming system and the visual verification surface for native changes.

## Commands

```bash
pnpm start        # expo start / Metro (run from apps/native-playground)
pnpm android      # expo run:android
pnpm ios          # expo run:ios
pnpm export       # expo export --platform web
```

Metro watches `packages/react-native` source, so library edits hot-reload without a rebuild.

## Structure

- `App.tsx` — root; registers `unistyles.ts` (Unistyles themes + breakpoints from `@kala-ui/react-native/themes`).
- `src/route-shell.tsx` — the in-app navigation shell (demo screen registry + switching).
- `src/demos/` — one demo screen per area: `basics`, `forms`, `navigation`, `overlays`, `feedback`, `charts`, `data-table`, `app-chrome-demo` (react-native-app), `tokens-demo`; shared `demo-block.tsx` + `stylesheet.ts`.
- `src/components/` — local demo-only helpers. `index.js`, `babel.config.js`, `metro.config.js` — Expo/Metro wiring.
- `android/`, `ios/` — checked-in native projects (`debug.keystore` under `android/app/` is a local dev artifact).

## Rules

- `react`/`react-dom` are pinned inline at `19.2.3` (Expo SDK 57's tested matrix) — deliberately NOT the pnpm catalog entry (web react is 19.3.0; a split pair inside one app breaks the bundle). Don't "fix" this to `catalog:`.
- Everything else versioned comes from the catalog; Expo SDK 57 pins are exact.
- Adding a native component or theme change? Add/extend a demo screen here so it stays exercised.
- Visual native changes need verification in this app (both light and dark themes) before committing.
