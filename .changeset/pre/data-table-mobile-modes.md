---
"@kala-ui/react-app": minor
---

feat(data-table): mobile layout modes with per-column roles.

`DataTable` gains `mobile?: "scroll" | "stack" | "cards"` (default `"scroll"`, today's table + horizontal overflow) and `mobileBreakpoint` (default 768). Below the breakpoint, `cards` collapses marked columns into title/badge/meta lines and `stack` renders every visible column as a label-value row; selection, row click, toolbar, pagination, loading and empty states all keep working, and the layout is SSR-safe (desktop-first render).

```tsx
<DataTable
  mobile="cards"
  columns={[
    { id: "name", header: "Name", accessorKey: "name", mobile: "title" },
    { id: "status", header: "Status", accessorKey: "status", mobile: "badge" },
    { id: "roll", header: "Roll No", accessorKey: "roll", mobile: "hidden" },
  ]}
/>
```

BREAKING: `ColumnDef.hideOnMobile` is removed. Migrate `hideOnMobile: true` to `mobile: "hidden"`. Unmarked columns stay visible on mobile as stacked label-value rows instead of disappearing.
