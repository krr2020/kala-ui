# Structure Audit — 2026-09-21

File/folder-structure compliance of every component family in `packages/react`, `packages/react-app`, `packages/react-native`, `packages/react-native-app` against each package's own `AGENTS.md` conventions. Behavior, styling, and API correctness are out of scope. Verified by full tree walk of each `src/components/` directory; every item below names real paths.

## Baseline conventions (from each AGENTS.md)

| Package | Expected family layout |
| --- | --- |
| `react` | `src/components/<name>/` → `<name>.tsx` + `<name>.types.ts` + `<name>.stories.tsx` + colocated tests + `index.ts` barrel; loading variants as `<name>-skeleton.tsx` with their own test; base classes in `src/config/<name>.ts` |
| `react-app` | Same folder shape; contract port in progress with a documented `PORT_QUEUE`; config tables in `src/config/<family>.ts`; families ship `<family>.types.ts` |
| `react-native` | `src/components/<name>/` → `<name>.tsx` + `<name>.styles.ts` + `<name>.types.ts` + `index.ts`; tests under `src/components/__tests__/` |
| `react-native-app` | Same split as `react-native`; AGENTS.md states "Tests in `src/__tests__/`" |

---

## 1. `packages/react` (web core)

### Violations — items 1–6 below resolved 2026-09-22 (structure moves + docs sweep)

| Path | Resolution |
| --- | --- |
| `src/components/loading/` | Split into `page-loader/` + `section-loader/` families, each with its own `.types.ts`/`.test.tsx`/`.stories.tsx`/barrel; markers and the `useSlotStyles("loading")` family key unchanged. |
| `src/components/design-system/` | Relocated to `src/showcase/design-system/` (stories colocated) — it is an in-repo docs showcase, not a shipped component; no barrel entry, no subpath. |
| `src/components/select/` | `native-select/` extracted as its own family with `native-select.types.ts` and `config/native-select.ts`; select/ is single-component again. |
| `src/components/skeleton/` | Sanctioned in AGENTS.md (2026-09-22): `skeleton-wrapper.tsx` + `skeleton-patterns.tsx` + README are the documented multi-component exception; no other family adds extras without a note. |
| `src/components/error-boundary/` | Sanctioned in AGENTS.md (2026-09-22): `error-fallback.tsx` documented as the family's default arm. |
| `src/components/collapse/` | Resolved 2026-09-22: `collapse.stories.tsx` added (Default / SlowFade / HeightOnly, sibling CSF shape). |
| `src/components/theme-provider/` | Resolved 2026-09-22: `theme-provider.stories.tsx` added (Default / DataThemeAttribute with a `useTheme` switcher). The `.integration.test.ts` naming finding is **withdrawn** — the suffix is a sanctioned repo-wide pattern (8 `.integration.test.*` files across `packages/react/src`, e.g. `tokens`, `vocabulary`, `kala-provider`, `types-files`, `slot-styles-config`). |
| `src/config/` | Resolved 2026-09-22: coverage rule stated in AGENTS.md — migrated set = the `src/config/` barrel (live list, ~35/93); unported families are migrate-on-touch (extract on edit, re-export, pin in `slot-styles.test.tsx`), mirroring react-app's `PORT_QUEUE` discipline. |

### Docs drift — resolved 2026-09-22 (AGENTS.md inventory sweep)

- AGENTS.md family inventory rewritten as an exhaustive 93-family list, script-verified against the directory: `card`, `list`, `overlay`, `toolbar`, `input-group`, `page-transition`, `skip-to-content`, `segmented-control`, `kala-provider`, `native-select`, `page-loader`, `section-loader` all present; stale `loading` entry removed. `src/showcase/design-system/` documented as the non-shipped showcase location.

---

## 2. `packages/react-app`

### Violations — resolved 2026-09-21 (structure normalization pass)

| Path | Resolution |
| --- | --- |
| `metric-card/`, `sidebar/`, `user-menu-dropdown/` stray `__tests__/` dirs | Merged into the colocated `*.test.tsx` files (unique cases kept: metric-card aria-hidden + numeric edge cases, sidebar no-sections render, user-menu avatar-surface); dirs deleted. |
| `navigation/`, `nav-link/`, `dnd/` missing `<family>.types.ts` | Types extracted to `<family>.types.ts`; barrels re-export from them; public export set unchanged. |
| `charts/utils.ts` generic name | Renamed `chart-utils.ts` (+ test, + importers). |
| `data-table/useTableState.ts` camelCase | Renamed `use-table-state.ts` (+ test, + importers). |

The `.integration.test.tsx` suffix originally flagged under `charts/` is a sanctioned repo-wide pattern (28 such files in `packages/react-native`) — finding withdrawn. Formerly open — `chart-skeleton.tsx` lives in `charts/` while `sparkline-chart/` is a separate family; **resolved 2026-09-22**: `chart-skeleton` stays in `charts/` (all ApexCharts wrappers share it as their loading arm); `sparkline-chart/` is its own family (lighter SVG sparkline, not an ApexCharts wrapper, does not use chart-skeleton). Documented in AGENTS.md.

### Docs drift

- ~~`PORT_QUEUE` lists families whose current shape matches the queue's own description of "not yet ported" (header, sidebar, navigation, nav-link, data-table, sparkline-chart) — consistent, but the ported list omits `chart-skeleton`'s status.~~ Resolved 2026-09-22: the ported list now names `chart-skeleton` explicitly (charts port).
- `social-login-buttons.tsx` (plural, second component in `social-login-button/`) is sanctioned by AGENTS.md — **not** a violation.

---

## 3. `packages/react-native`

### Violations — resolved 2026-09-22 (style-table extraction pass)

All ~45 families follow `<name>.tsx` + `<name>.styles.ts` + `<name>.types.ts` + `index.ts`. The five that lacked a styles file:

| Path | Resolution |
| --- | --- |
| `src/components/alert-dialog/` | Documented exemption: the family delegates its whole surface to Dialog/Button (no inline styles to extract). |
| `src/components/combobox/` | `combobox.styles.ts` extracted (value text, clear affordance, empty text, list/skeleton sizing). |
| `src/components/context-menu/` | `context-menu.styles.ts` extracted (trigger, child row, content gap). |
| `src/components/dropdown-menu/` | `dropdown-menu.styles.ts` extracted (MenuTheme slice, row/trigger/text tables); `renderMenuItem` stays in the component file and re-exports unchanged. |
| `src/components/separator/` | `separator.styles.ts` extracted (themed divider by orientation). |

Everything else (types files, barrels, test placement under `src/components/__tests__/`) is consistent across the package.

### Docs drift

- ~~AGENTS.md structure section doesn't state where component tests live~~ — fixed 2026-09-22: test homes now stated in the Rules section; the styles-file rule now scopes the composed-shell exemption.

---

## 4. `packages/react-native-app`

### Violations — resolved 2026-09-22 (styles-file port, all nine families)

AGENTS.md says "Follow the same component split as `@kala-ui/react-native`" (`<name>.styles.ts` for style tables). The nine families that had none now carry one; `charts/` (four components) shares one `charts.styles.ts`, the `list/` multi-file precedent:

| Path | Resolution |
| --- | --- |
| `src/components/app-shell/` | `app-shell.styles.ts` (shell frame + content regions). |
| `src/components/charts/` | `charts.styles.ts` (empty arms, donut overlay, labels, skeleton bones). |
| `src/components/copy-button/` | `copy-button.styles.ts` (icon size/tint). |
| `src/components/data-table/` | `data-table.styles.ts` (header/row/cell tables + skeleton). |
| `src/components/header/` | `header.styles.ts` (bar chrome, 44dp targets + skeleton). |
| `src/components/metric-card/` | `metric-card.styles.ts` (TONE_BG map, card/body/text + skeleton). |
| `src/components/steps/` | `steps.styles.ts` (circle geometry, connectors, text tables). |
| `src/components/tab-bar/` | `tab-bar.styles.ts` (bar chrome, item/label + skeleton). |
| `src/components/timeline/` | `timeline.styles.ts` (status dot mapping, rail, entry text). |

Decision 2026-09-22: port all nine rather than scope the AGENTS.md rule — the two native packages keep one convention.

| Path | Deviation |
| --- | --- |
| `src/components/__tests__/` | AGENTS.md previously stated "Tests in `src/__tests__/`" — corrected 2026-09-21 to the real home. |
| `src/components/steps/`, `tab-bar/`, `timeline/`, `copy-button/`, `data-table/` | No skeleton arm despite web counterparts shipping one and the package docs listing these as parallel families (loading-state parity gap). |

### Docs drift

- `screen-stack/` was missing from the AGENTS.md structure list — added 2026-09-21.

---

## Prioritized remediation

1. ✅ Done 2026-09-21: react-app duplicates merged into colocated tests; react-native-app AGENTS.md corrected to the real test home (`src/components/__tests__/`).
2. ✅ Done 2026-09-22: react-native style tables extracted for combobox, context-menu, dropdown-menu, separator; alert-dialog recorded as the composed-shell exemption (AGENTS.md updated, test homes documented).
3. ✅ Done 2026-09-22: react-native-app — all nine families ported to `<name>.styles.ts` (maintainer decision: port, don't scope the rule).
4. ✅ Done 2026-09-22: react `loading/` split into `page-loader/` + `section-loader/` families (types/tests/stories split per component; markers + slotStyles family keys unchanged).
5. ✅ Done 2026-09-22: react `design-system/` moved out of `components/` to `src/showcase/design-system/` (showcase, not a primitive; stories colocated; marker-guard skip filters removed).
6. ✅ Done 2026-09-22: `native-select/` is its own family with `native-select.types.ts` + `config/native-select.ts` + barrel + subpath; `skeleton-wrapper`/`skeleton-patterns` (and `error-fallback`) naming sanctioned in AGENTS.md's multi-component-families note.
7. ✅ Done 2026-09-22: docs sweep — react AGENTS.md inventory exhaustive (93 families, script-verified), config-table coverage rule stated (port-queue/migrate-on-touch), react-app ported list names `chart-skeleton`; missing stories added (`collapse`, `theme-provider`).

All remediation items 1–7 closed 2026-09-22. The only deviation left open by design is §4's loading-state parity gap (react-native-app families without a skeleton arm) — a feature backlog, not a structure violation.
