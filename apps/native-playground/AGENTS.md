# AGENTS.md — @kala-ui/native-playground

Expo app exercising `@kala-ui/react-native` and `@kala-ui/react-native-app` — living docs for the native theming system.

## Commands

```bash
pnpm start        # expo start / Metro (run from apps/native-playground)
pnpm android      # expo run:android
pnpm ios          # expo run:ios
pnpm export       # expo export --platform web
```

Metro watches `packages/react-native` source, so library edits hot-reload without a rebuild.

## Rules

- `react`/`react-dom` are pinned inline at `19.2.3` (Expo SDK 57's tested matrix) — deliberately NOT the pnpm catalog entry (web react is 19.3.0; a split pair inside one app breaks the bundle). Don't "fix" this to `catalog:`.
- Everything else versioned comes from the catalog; Expo SDK 57 pins are exact.
- `android/` and `ios/` hold native projects; `debug.keystore` under `android/app/` is a local dev artifact.
