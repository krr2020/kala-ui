# AGENTS.md — @kala-ui/react-native

React Native + Expo arm: Unistyles themes generated from the web token source of truth, with the web component vocabulary rebuilt natively (not wrapped — reimplemented with RN primitives).

## Commands

```bash
pnpm --filter @kala-ui/react-native build       # tsc --noEmit (source-exported — no dist step)
pnpm --filter @kala-ui/react-native test        # vitest run && jest (both stacks)
node scripts/generate-themes.mjs                # regenerate themes from packages/react/src/styles/globals.css
node scripts/check-sdk-compat.mjs               # verify Expo SDK 57 exact pins
```

Verify visually in `apps/native-playground` — Metro watches this package's source, so edits hot-reload without a rebuild.

## Structure

- `src/themes/definitions.ts` — 4 Unistyles themes: `light`, `dark`, `high-contrast-light`, `high-contrast-dark`. Hex colors, alpha/spread as numbers. Web-only brand variants (neutral/accent/dark-accent) are deliberately NOT transcribed. Parity with the CSS is enforced by `src/__tests__/tokens-parity.test.ts` — regenerate after any web token change.
- `src/components/` — 45 reusable unit components mirroring web families (compound widgets live in `@kala-ui/react-native-app`):
  - Core: button, card, avatar, avatar-group, badge, tag, text, heading, icon, separator, indicator, toggle.
  - Forms: text-input, textarea, number-input, select, combobox, multi-select, checkbox, radio-group, switch, slider, rating, date-picker, time-picker, calendar, input-otp, field, label.
  - Overlays: dialog, alert-dialog, sheet, dropdown-menu, context-menu, toast.
  - Feedback/display: alert, banner, progress, ring-progress, spinner, skeleton, accordion, collapsible, tabs, segmented-control, toggle-group.
- `src/components/<name>/` — `<name>.tsx` (JSX only) + `<name>.styles.ts` (style tables + pure mapping helpers like `look()`/`tone()`); a family that fully delegates its surface to a composed shell needs no styles file (alert-dialog). Shared surface helpers: `input-surface.styles.ts`, `slot-styles.ts` (its `applySlot`/`SlotStyles` re-export from the root barrel so composite packages share one slot-merge helper).
- `src/lib/<name>.utils.ts` — pure utilities, dot-file naming (NOT `<name>-utils.ts`).
- Exports: root barrel `src/index.ts`; subpaths `./themes`, `./tokens`, `./types`.

## Rules

- Package is **source-exported** (`main`/`exports` point at `src/`) — never add a dist build or hand-write compiled output.
- Expo SDK 57 matrix pins are exact (`react-native 0.86.3`, `react 19.2.3`, `reanimated 4.5.1`…) — don't bump past the SDK's tested range.
- Themes are generated, never hand-edited — change `packages/react/src/styles/globals.css`, run `generate-themes.mjs`, keep `tokens-parity.test.ts` green.
- Tests: vitest for pure logic, jest-expo for component rendering — place each test in the runner that can execute it. Component tests live in `src/components/__tests__/`; theme/token tests in `src/__tests__/`.
- Icons come from `lucide-react-native`; animations from `reanimated` (worklets — mind the babel plugin in consuming apps).
