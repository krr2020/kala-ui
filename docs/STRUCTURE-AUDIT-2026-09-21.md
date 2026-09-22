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

### Violations

| Path | Deviation |
| --- | --- |
| `src/components/loading/` | No `loading.tsx`. The family is `page-loader.tsx` + `section-loader.tsx` sharing one `loading.types.ts` — neither component has its own `<name>.types.ts`, breaking the one-types-file-per-component rule everywhere else followed. |
| `src/components/design-system/` | Four loose components (`overview.tsx`, `category-section.tsx`, `component-preview-card.tsx`, `design-system-utils.ts`) in one folder: no per-component folders, no `index.ts` barrels, no `.types.ts` files. Wired via a `package.json` subpath but absent from the root barrel `src/index.ts` and from the AGENTS.md family inventory. Biggest structural outlier in the package. |
| `src/components/select/` | `native-select.tsx` is a second component inside `select/` (own stories + test) but has no folder of its own and no `native-select.types.ts` — types borrowed from `select.types.ts`. |
| `src/components/skeleton/` | `skeleton-wrapper.tsx` and `skeleton-patterns.tsx` are extra components outside the sanctioned `<name>.tsx` / `<name>-skeleton.tsx` naming; plus a colocated `README.md`. |
| `src/components/error-boundary/` | Extra component `error-fallback.tsx` beyond the `<name>.tsx` + `<name>-skeleton.tsx` pattern (its native-app twin is sanctioned by that package's docs; here it is undocumented). |
| `src/components/collapse/` | No `collapse.stories.tsx` — every other family ships stories. |
| `src/components/theme-provider/` | No `theme-provider.stories.tsx`; extra `theming-docs.integration.test.tsx` uses an integration-test naming not seen elsewhere in the package. |
| `src/config/` | 34 style tables for ~95 families. The AGENTS.md rule "per-part base classes live in `src/config/<name>.ts`" applies to **every** family, yet `react-app` documents its equivalent gap as a `PORT_QUEUE` while `react` documents neither a queue nor an exemption — either the docs overstate the rule or the port is unmapped. |

### Docs drift (code fine, AGENTS.md inventory stale)

- Present in `src/components/` but absent from the AGENTS.md family list: `card`, `list`, `overlay`, `toolbar`, `input-group`, `page-transition`, `skip-to-content`, `segmented-control`, `kala-provider`, `loading` itself is listed only implicitly via the families bullet.
- `card` in particular is a full family (with skeleton + config table) missing from the primitives inventory.

---

## 2. `packages/react-app`

### Violations — resolved 2026-09-21 (structure normalization pass)

| Path | Resolution |
| --- | --- |
| `metric-card/`, `sidebar/`, `user-menu-dropdown/` stray `__tests__/` dirs | Merged into the colocated `*.test.tsx` files (unique cases kept: metric-card aria-hidden + numeric edge cases, sidebar no-sections render, user-menu avatar-surface); dirs deleted. |
| `navigation/`, `nav-link/`, `dnd/` missing `<family>.types.ts` | Types extracted to `<family>.types.ts`; barrels re-export from them; public export set unchanged. |
| `charts/utils.ts` generic name | Renamed `chart-utils.ts` (+ test, + importers). |
| `data-table/useTableState.ts` camelCase | Renamed `use-table-state.ts` (+ test, + importers). |

The `.integration.test.tsx` suffix originally flagged under `charts/` is a sanctioned repo-wide pattern (28 such files in `packages/react-native`) — finding withdrawn. Open item: `chart-skeleton.tsx` lives in `charts/` while `sparkline-chart/` is a separate family — decide its home with the PORT_QUEUE port.

### Docs drift

- `PORT_QUEUE` lists families whose current shape matches the queue's own description of "not yet ported" (header, sidebar, navigation, nav-link, data-table, sparkline-chart) — consistent, but the ported list omits `chart-skeleton`'s status.
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

### Violations

AGENTS.md says "Follow the same component split as `@kala-ui/react-native`" (`<name>.styles.ts` for style tables). Nine families have **no styles file**:

| Path |
| --- |
| `src/components/app-shell/` |
| `src/components/charts/` (whole family: bar-chart, donut-chart, sparkline, chart-skeleton) |
| `src/components/copy-button/` |
| `src/components/data-table/` |
| `src/components/header/` |
| `src/components/metric-card/` |
| `src/components/steps/` |
| `src/components/tab-bar/` |
| `src/components/timeline/` (confirmed fully inline in `timeline.tsx`) |

Only `empty-state`, `error-boundary`, `list`, `loading-overlay`, `password-strength-indicator`, `screen-stack` comply.

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
3. **react-native-app: decide the styles-file rule** — either port the nine families or amend AGENTS.md to scope `<name>.styles.ts` to families with non-trivial style surface.
4. **react: fix `loading/`** — split into `page-loader/` + `section-loader/` families (or document the shared-family pattern), each with its own types file.
5. **react: relocate `design-system/`** into proper per-component folders with barrels + types, or move it out of `components/` (it is a showcase, not a primitive).
6. **react: `native-select` → its own folder** with `native-select.types.ts`; rename `skeleton-wrapper`/`skeleton-patterns` to fit the naming or document them.
7. **Docs sweep** (partial, 2026-09-21): `screen-stack` added to react-native-app's inventory; `useTableState.ts`/`utils.ts` renamed rather than documented. Remaining: add missing families to both web AGENTS.md inventories (card, kala-provider, …) and state the react config-table coverage rule (port queue or exemption).

Items 1–2 are quick, self-contained follow-up units; 3–5 need a maintainers' decision on intended convention before code moves.
