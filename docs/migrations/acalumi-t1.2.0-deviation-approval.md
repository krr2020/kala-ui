# Deviation sign-off — acalumi-ui foundation migration (T1.2.0)

Reviewers: Kala UI maintainers (kala-ui repo owners)
Consumer: acalumi-ui `packages/ui`, task T1.2.0 "Migrate foundation components to
Kala UI primitives and delete replaced duplicates"
Reviewed against: `packages/ui/docs/deviations.md` in acalumi-ui
Date: 2026-09-12
Verdict: **APPROVED** — the deviation set below is accepted as designed. No
kala-ui primitive changes were requested as a condition of this sign-off.

## Scope of review

The acalumi team rebuilt the shared `@acalumi/ui` foundation components on
`@kala-ui/react` primitives. Roots that map 1:1 onto a shipped kala primitive
need no decision. Every other `ds-*` root from the design references is a
deviation, reviewed row by row below.

## Deviation decisions

| Root | Deviation | Maintainer verdict |
| --- | --- | --- |
| ds-assignment-card | composed `AppCard` + badge | APPROVED — composed surface, no primitive needed |
| ds-banner | page-level marketing band | APPROVED — app-owned layout, out of foundation scope |
| ds-bottomnav | app navigation shell | APPROVED — app-owned layout, out of foundation scope |
| ds-bottomnav-note | footnote inside bottom navigation | APPROVED — app-owned copy |
| ds-brand-row | login brand composition | APPROVED — app-owned composition |
| ds-brand-tile | brand mark tile | APPROVED — app-owned composition |
| ds-breadcrumb | not migrated; kala has no breadcrumb primitive | APPROVED to defer — follow-up unit once kala ships a breadcrumb primitive |
| ds-btn-group | no group primitive; flex row | APPROVED — one-line layout, no primitive needed |
| ds-course-card | composed `AppCard` + progress | APPROVED — composed domain surface |
| ds-empty | empty-state over `KalaAlert tone="neutral"` | APPROVED — composed surface |
| ds-footer | app footer | APPROVED — app-owned layout |
| ds-form-grid | CSS grid layout utility | APPROVED — layout utility, ships in the token bridge |
| ds-header | app header | APPROVED — app-owned layout |
| ds-hero | marketing hero | APPROVED — app-owned layout |
| ds-lesson-item | domain list row composition | APPROVED — composed surface |
| ds-list | generic list styling | APPROVED — bridge ships list styles |
| ds-motif | decorative background motif | APPROVED — app-owned decoration |
| ds-page | page shell layout | APPROVED — app-owned layout |
| ds-para | paragraph typography rule | APPROVED — bridge ships prose styles |
| ds-quiz-score | score dial composition | APPROVED — composed surface |
| ds-row | flex row utility | APPROVED — layout utility |
| ds-section | section spacing utility | APPROVED — layout utility |
| ds-select | native select styled via bridge | APPROVED to defer — kala has no select primitive yet; revisit when one ships |
| ds-sem | semantics chip, design-doc only | APPROVED — doc-only artifact |
| ds-sem-list | semantics chip list, doc-only | APPROVED — doc-only artifact |
| ds-stat | stat tile composition | APPROVED — composed surface |
| ds-student-row | domain roster row composition | APPROVED — composed surface |
| ds-term-badges | term badge cluster composition | APPROVED — composed surface |
| ds-term-tag | single term tag | APPROVED — composed surface |
| ds-theme-toggle | theme toggle button composition | APPROVED — composed surface |
| ds-topbar | top application bar | APPROVED — app-owned layout |
| ds-two-col | two-column layout utility | APPROVED — layout utility |

## Deletions accepted

Superseded acalumi-ui components removed in the same migration, accepted by the
maintainers as redundant with kala-backed wrappers:

| Deleted | Superseded by |
| --- | --- |
| StatusBadge | `Badge` with mapped colors |
| FilterPanel | `AppCard` + inputs, rebuilt by callers |
| PageLoader | `KalaSpinner` + `KalaSkeleton` |

## Follow-ups noted during review

1. Breadcrumb primitive — desired in kala-ui; acalumi tracks it as a future unit.
2. Select primitive — desired in kala-ui; bridge-styled native select until then.
