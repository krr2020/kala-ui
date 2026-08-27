---
"@kala-ui/react": minor
"@kala-ui/react-app": minor
---

Add stable `data-kala-component` identification attributes to every component root.

Every component (and each compound part, e.g. `dialog-content`, `card-header`, `data-table-toolbar`) now renders `data-kala-component="<kebab-name>"` on its root element. This is a guaranteed-stable public API for DevTools debugging, e2e selectors, and targeted consumer CSS overrides.

- No styling or behavior changes — the attribute is identification only.
- The ad-hoc `data-comp` markers previously used by a few components were migrated to `data-kala-component` (update any selectors that queried `[data-comp='...']`).
- shadcn-compatible `data-slot` attributes are unchanged.
