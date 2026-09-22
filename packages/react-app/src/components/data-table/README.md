# DataTable Component

A fully-featured, accessible data table with sorting, filtering, search, pagination, and row selection. Supports client-side and server-side data.

Part of [`@kala-ui/react-app`](https://github.com/krr2020/kala-ui) — app-level composites built on `@kala-ui/react`.

## Features

- **Sorting** — click column headers (asc → desc → none)
- **Filtering** — multiple filters with configurable operators
- **Global search** — across selected columns
- **Pagination** — configurable page sizes and navigation
- **Server-side support** — callbacks for API-based fetching (see [SERVER_SIDE_GUIDE.md](./SERVER_SIDE_GUIDE.md))
- **Row selection** — single or multiple, with bulk actions
- **Loading states** — skeleton loaders
- **Keyboard navigation** + WCAG 2.1 AA
- **TypeScript** — fully typed with generics
- **Responsive** — optional column hiding

## Usage

```tsx
import { DataTable } from "@kala-ui/react-app/data-table";
import type { ColumnDef } from "@kala-ui/react-app/data-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { id: "name", header: "Name", accessorKey: "name", enableSorting: true },
  { id: "email", header: "Email", accessorKey: "email", enableSorting: true },
  { id: "role", header: "Role", accessorKey: "role" },
];

function UsersTable() {
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
  ];

  return <DataTable data={users} columns={columns} />;
}
```

## Search

```tsx
<DataTable
  data={users}
  columns={columns}
  searchable={{ placeholder: "Search users...", ariaLabel: "Search users table" }}
/>
```

## Pagination

```tsx
<DataTable
  data={users}
  columns={columns}
  pagination={{
    page: 1,
    pageSize: 10,
    total: users.length,
    pageSizeOptions: [10, 20, 50, 100],
  }}
/>
```

## Row selection & bulk actions

```tsx
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

<DataTable
  data={users}
  columns={columns}
  selection={{
    enabled: true,
    selectedIds,
    getRowId: (user) => user.id,
    onSelectionChange: setSelectedIds,
  }}
  bulkActions={[
    {
      id: "delete",
      label: "Delete",
      variant: "destructive",
      onClick: (selectedUsers) => console.log("Delete", selectedUsers),
    },
  ]}
/>
```

## Custom cell rendering

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (user) => (
      <Badge variant={user.isActive ? "default" : "outline"}>
        {user.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
```

## Loading & empty states

```tsx
<DataTable data={users} columns={columns} isLoading={isLoading} loadingConfig={{ rows: 5 }} />
<DataTable data={[]} columns={columns} emptyState={{ message: "No users found" }} />
```

## Server-side mode

For large datasets, pass only the current page to `data`, set `pagination.total` from your API, and refetch in the `onChange` / `onSortChange` / `searchable.onChange` callbacks — DataTable handles UI state, you handle fetching. The complete walkthrough (sorting, filtering, debounced search, URL state) is in **[SERVER_SIDE_GUIDE.md](./SERVER_SIDE_GUIDE.md)**. State helpers: `useTableState` from the same subpath manages page/pageSize/sort/filters as one unit.

## TypeScript

Column definitions and callbacks are generic — `accessorKey` and `cell` row values are typechecked against your row type, and `onRowClick` receives the typed row.

## More

- Tests: `data-table.test.tsx` (rendering, sorting, search, pagination, selection, a11y)
- Interactive examples: `pnpm storybook`
