# React Native Strategy

Decision record for `@kala-ui/react-native`: why it exists, the styling
engine choice, the customization contract, and how components are
validated. Written before any native code lands — treat it as the
contract the scaffold must implement.

## Problem

Several React Native apps (paisa trak, ntele, roadpulse, …) each carry
their own styling system and duplicated copies of the same components.
The result is the classic drift: a `Button` in one app is not a `Button`
in another, theming is per-app, and every fix is copy-pasted N times.

The web side of this monorepo already solved this with
`@kala-ui/react` + `@kala-ui/react-app` + `@kala-ui/react-hooks` and a
token-driven theming system (see `THEMING.md` and
`packages/react/TOKEN_SPEC.md`). The native packages replicate that
shape — under the constraint that there is no Radix and no CSS on
React Native, so the styling foundation must be chosen deliberately.

## Goals

- One standard component design shared across all native apps.
- Apps keep flexibility: rebrand via theme, adjust per-usage via
  variant props, and escape-hatch per part without forking components.
- Easy swapping: an app can move from its local component to the
  kala-ui one with minimal churn.
- Token parity with the web library — same semantic token names, so
  web and native render one design language.

## Non-goals

- A cross-platform web+native component codebase. The web packages are
  established; native gets its own components with shared tokens, not
  shared rendering.
- Locking apps into a specific styling syntax. Consumers see
  components and tokens only; the styling engine is an implementation
  detail (same as Tailwind is on web — "you do not need Tailwind to
  use kala-ui").

## Package structure

Mirrors the web layout:

| Package | Directory | Contents |
|---|---|---|
| `@kala-ui/react-native` | `packages/react-native` | primitives: Button, Input, Sheet, Toast, Skeleton, Icon, … |
| `@kala-ui/react-native-app` | `packages/react-native-app` | composites (lists, cards, tab shells) — added later, only once primitives stabilize |
| `apps/native-playground` | `apps/native-playground` | Expo app exercising the packages; doubles as Storybook host and Maestro E2E target |

Peer dependencies: `react`, `react-native`, `expo`,
`react-native-reanimated`, `react-native-gesture-handler`,
`react-native-svg`. Each app controls its own RN/Expo versions; the
library never pins them.

Hooks: do not force `@kala-ui/react-hooks` to be universal. DOM-event
hooks (`useClickOutside`, …) do not port; `useSyncExternalStore`-based
ones port nearly free. Start with adaptations inlined in
`react-native`; split into a `react-native-hooks` package only when a
second app needs the same adaptation.

## Styling engine: react-native-unistyles (v3)

**Decision: `react-native-unistyles` v3.**

Unistyles is a styling *engine*, not a component kit — the same
position Radix occupies on web: we own the primitives, the library
owns theming + performance. It maps one-to-one onto the existing web
contract:

| Web contract | Unistyles equivalent |
|---|---|
| CSS custom properties on `:root`/`.dark` | named themes (`light`, `dark`, `high-contrast-*`) with the same semantic token names |
| `ThemeProvider` + runtime switching | `unistyles.setTheme('dark')` — runtime, no reload |
| cva variant APIs | `variants` + `dynamicVariants` in stylesheets |
| `prefers-color-scheme` | breakpoints / orientation / media features resolved on the UI thread via C++ interop — zero JS re-renders |
| tokens as the public contract | fully-typed themes and stylesheets; consumers never touch styling syntax |

Rejected alternatives:

- **NativeWind** — best Tailwind-syntax parity, but it makes
  `className` part of the library's public contract and couples every
  consumer to its babel/metro chain. An app-authoring tool, not a
  library seam.
- **Tamagui** — heaviest option, compiler complexity, gravity pulls
  toward its own component kit. Cross-platform codegen is not a goal
  here.
- **Shopify Restyle** — sound theming model but JS-side style
  resolution and weaker media-query support; superseded by Unistyles
  v3 for this use case.
- **Dripsy / NativeBase** — stale or legacy.

Performance is a deciding factor for the consuming apps (finance lists
in paisa trak, live data in roadpulse): orientation changes, tablets,
and dynamic-type scenarios resolve in C++ instead of re-rendering
component trees through JS.

## Customization contract

Apps customize through a defined three-tier ladder. No tier may be
skipped — without tier 3, the first unusual layout requirement forces a
component fork and duplication returns.

| Tier | Mechanism | Use case |
|---|---|---|
| 1. Theme override | app registers a Unistyles theme overriding token values (colors, radius, spacing, typography) | app-wide rebrand |
| 2. Variant props | `variant`, `size`, `tone` props on every component (cva philosophy as on web) | per-usage intent |
| 3. Slot styles | every component accepts a styles object keyed by part: `styles={{ root: {...}, label: {...} }}` | surgical escape hatch — the native equivalent of Radix per-part `className` |

Rule of thumb: tokens first, slots last. If an app reaches for slot
styles twice for the same need, that need becomes a variant in the
library.

## Motion

**Decision: `react-native-reanimated` v4.**

Motion is specified as **tokens, not code**:

- The token spec gains a `motion` section: durations (`instant 100ms`,
  `fast 200ms`, `normal 300ms`), easings, and named spring configs
  (`gentle`, `snappy`, `bouncy`).
- Components expose `animated` props with library defaults — sheets
  get `entering`/`exiting`, buttons get pressed-state springs,
  skeletons shimmer. Apps may pass their own worklet or `={undefined}`
  to disable.
- No wrapper library (Moti & co.): the component API already is the
  declarative layer, and one fewer dependency tracks Reanimated majors.
- RN's built-in CSS animations (new architecture) are not yet mature
  enough to build a library contract on; revisit after they stabilize.

Animations run on the UI thread, so scrolling lists stay at 60fps even
while JS is busy.

## Icons

**Decision: `lucide-react-native` + `react-native-svg` (peer dep).**

The web packages already standardize on `lucide-react` (used in 59
component files) plus `simple-icons` for brand marks — native gets
pixel-identical icons and a shared visual language for free.

The library exposes its own `<Icon>` wrapper taking token-based
`size="sm"` and `color="color.foreground"`, not raw numbers. Apps never
import lucide directly, so a future icon-set swap is a one-file change.
`simple-icons` ports the same way for brand marks (banks, Google,
Apple, …).

## Validation

Port the web pyramid, layer for layer:

1. **Static** — strict TypeScript + Biome (same config family as
   `packages/react-app/biome.json`); extend
   `scripts/check-package-boundaries.mjs` rules so nothing in
   `packages/` imports app code.
2. **Unit + interaction + a11y** — Jest (jest-expo preset) +
   `@testing-library/react-native`. Port the `__tests__/a11y.test.tsx`
   contract: assert `accessibilityRole`, `accessibilityLabel`, and
   state announcements for every component. This is where 44/48dp
   targets and labeled controls are caught before device QA.
3. **Component markers** — the web
   `component-markers.test.tsx` contract becomes a `testID`
   convention (`k-button-root`, `k-sheet-overlay`, …) enforced by a
   markers test. Keeps E2E and app debugging deterministic.
4. **Visual + docs** — Storybook for React Native hosted in
   `apps/native-playground`. Every component gets a story; the
   playground doubles as living docs for app developers.
5. **On-device E2E** — Maestro flows against the playground app.
   YAML-based, near-zero setup, works with Expo dev builds and real
   devices. One flow per interactive component (e.g. "open sheet →
   assert overlay testID → swipe to dismiss").
6. **Cross-app compatibility** — peer deps + changesets releases
   exactly like the web packages; breaking changes require a migration
   doc patterned on `docs/MIGRATION-0.1.md`.

Validation must not stop at the library boundary: screens inside the
consuming apps can re-diverge even with a shared kit. The token spec is
the only thing that prevents that — which is why token parity (below)
is treated as the deliverable and components as its consumer.

## Token parity

The core deliverable. Port `packages/react/TOKEN_SPEC.md` first, before
any component: same semantic token names (`color.background`,
`color.foreground`, spacing scale, radius, typography) plus the new
`motion` section. The six web themes (`light`, `neutral`, `accent`,
`dark`, `high-contrast-light`, `high-contrast-dark`) become six named
Unistyles themes. Token parity across web ↔ native is what actually
kills "every app looks different"; the engine is just the vehicle.

## Consumer setup

One-time per app:

1. Install `@kala-ui/react-native` + peer deps.
2. Add the Unistyles babel plugin (or Expo config plugin) — identical
   for every app, so setup friction is amortized day one.
3. Register an app theme that overrides token values (tier 1) where the
   app's brand differs.
4. Migrate screens component-by-component; local components retire as
   their kala-ui equivalents land.

## Rollout

Original plan:

1. Scaffold `packages/react-native` with the token port (incl. motion
   tokens) and Unistyles wiring; no components yet.
2. Seed `Icon`, `Button`, `Sheet` + the Jest/markers test harness.
3. Scaffold `apps/native-playground` with Storybook.
4. Pilot in one app (smallest surface first), then roll out to the
   rest; harvest the pilot's slot-style usage as new variants.
5. Introduce `@kala-ui/react-native-app` composites once primitives
   stabilize across at least two apps.

### Progress

Steps 1–3 are complete. 36 components are live in
`packages/react-native/src/components/`, each with the folder convention
(`{name}.tsx` + `{name}.types.ts` + `index.ts`), `k-*` testID markers,
a11y assertions, slot-styles coverage, and a playground demo:

| Wave | Components | Commit |
|------|------------|--------|
| Scaffold | token port, Unistyles themes, Jest/markers harness | `42c61ba` |
| 1 | Icon, Button, Sheet | `2423069` |
| 2 | Text, Heading, TextInput, Card | `dba25eb` |
| 3 | Badge, Avatar, Checkbox, Switch | `30d84e7` |
| 4 | Label, Separator, Spinner, Progress | `c11a367` |
| 5 | Skeleton, RadioGroup, Alert, Toast | `c6108ed` |
| 6 | EmptyState, Tabs, Tag, SegmentedControl | `6ec37e1` |
| 7 | Rating, Pagination | `e422add` |
| 8 | Slider | `808550e` |
| 9 | Dialog, AlertDialog | `e1766b5` |
| 10 | Toggle, ToggleGroup, Indicator | `7273ae1` |
| 11 | Accordion, Collapsible | `b86f103` |
| 12 | Textarea, Banner | `a6a55e5` |
| 13 | List family (List, ListItem + Icon/Avatar/Content/Title/Text/Action/Badge slots, 5 skeleton variants) | `7d7c036` |

Also landed: the tier-3 slot-styles customization contract
(`15e9ffb`..`bf901ce`), mobile-hardened Dialog/AlertDialog (`0bfc7b0`),
and the playground App split into `demos/{tokens,basics,feedback,
navigation,overlays}-demo.tsx` modules (`284d867`, `caf9a0c`) with an
app-seam integration test pinning the render surface.

Validation state at Wave 13: 270 scoped Jest tests green, both Vitest
suites green, `tsc --noEmit` clean, Biome clean.

### Pending

Remaining web components, triaged by mobile value:

| Wave | Components | Rationale |
|------|------------|-----------|
| 14 | Select, Field, NumberInput, InputGroup | forms completion; Select maps to a bottom-sheet picker, Field is the composable row primitive every later form control needs |
| 15 | AvatarGroup, RingProgress, CopyButton, LoadingOverlay, ErrorBoundary | small (≤102 lines each), high-frequency |
| 16 | InputOtp, PasswordStrengthIndicator, Steps | SMS-code auth + onboarding |
| 17 | DropdownMenu (ActionSheet pattern), ContextMenu, Toolbar | overflow/long-press actions |
| 18 | Timeline, TagInput, Table, Breadcrumbs | data display |
| 19 | DatePicker, Calendar, TimePicker, MultiSelect, Combobox | large; consider community libs |

Deliberately **not ported**:

- Layout primitives (`Box`, `Stack`, `Group`, `Center`, `Flex`, `Grid`,
  `Container`) — RN's first-class flexbox style props make them pure
  indirection.
- Web-modality-only surfaces (`HoverCard`, `Command`, `Kbd`, `Menubar`,
  `NavigationMenu`, `TreeView`, `Resizable`, `ScrollArea`,
  `SkipToContent`, `ColorInput`, `Overlay`, `ThemeProvider`, `Code`,
  `Burger`) — hover/keyboard/resize concepts with no native equivalent,
  or covered by RN primitives / Unistyles theming.
- Covered under other names: `input` → `TextInput`, `collapse` →
  `Collapsible`, `paper` → `Card`.

Step 5 started — Wave A1 app chrome in `@kala-ui/react-native-app`:
`AppShell`, `Header`/`HeaderSkeleton`, `TabBar`/`TabBarSkeleton`
(data-driven items, internal row renderer) and `isActivePath`, all on
`@kala-ui/react-native` primitives with zero new third-party deps. Web
composites with no mobile analog (Sidebar, DnD, CSS-grid shell regions)
stay web-only. Next up: rollout step 4 (pilot in one app) and Wave A2
(charts on the existing react-native-svg peer, data-table, metric-card).

Wave A2 shipped in `@kala-ui/react-native-app`: `BarChart`,
`DonutChart`, `Sparkline`, `ChartSkeleton`, read-only `DataTable` +
`DataTableSkeleton`, and `MetricCard`/`MetricCardSkeleton`. Charts are
hand-rolled SVG on the existing `react-native-svg` peer (geometry in
`src/lib/chart-geometry.ts`) — ApexCharts stays web-only, and the
mobile table is a pressable list (sorting/filters/pagination stay web),
both deliberate divergences from the web composites. Next: rollout
step 4 (pilot in one app).

## Open questions

- New-architecture-only (RN 0.76+), or do any target apps still run
  old architecture / Expo Go? Unistyles v3 supports both, but Reanimated
  v4 is new-architecture-first — affects the pilot app choice.
- Dark-mode token naming: reuse the web `high-contrast-*` pair or
  introduce a native-specific `dim` theme?
- Monetization/publishing: private registry for the native packages or
  same public npm flow as web?
