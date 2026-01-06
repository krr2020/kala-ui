# DataTable Component

A fully-featured, accessible data table component with sorting, filtering, search, pagination, and row selection.

## Features

- ✅ **Sorting** - Click column headers to sort (asc → desc → none)
- ✅ **Filtering** - Multiple filter support with various operators
- ✅ **Global Search** - Search across multiple columns
- ✅ **Pagination** - Configurable page sizes and navigation
- ✅ **Row Selection** - Single or multiple row selection with bulk actions
- ✅ **Loading States** - Skeleton loaders for better UX
- ✅ **Empty States** - Customizable empty state messages
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **WCAG 2.1 AA Compliant** - Accessible to all users
- ✅ **React 19 Compatible** - Uses latest React features
- ✅ **TypeScript** - Fully typed with generics
- ✅ **Responsive** - Mobile-friendly with optional column hiding

## Installation

The DataTable component is already included in the `@repo/ui` package.

```tsx
import { DataTable } from '@repo/ui/data-table';
import type { ColumnDef } from '@repo/ui/data-table';
```

## Basic Usage

```tsx
import { DataTable, type ColumnDef } from '@repo/ui/data-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    enableSorting: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    enableSorting: true,
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
  },
];

function UsersTable() {
  const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'User' },
  ];

  return <DataTable data={users} columns={columns} />;
}
```

## With Search

```tsx
<DataTable
  data={users}
  columns={columns}
  searchable={{
    placeholder: 'Search users...',
    ariaLabel: 'Search users table',
  }}
/>
```

## With Pagination

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

## With Row Selection

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
/>
```

## With Bulk Actions

```tsx
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
      id: 'delete',
      label: 'Delete',
      variant: 'destructive',
      onClick: (selectedUsers) => {
        console.log('Delete', selectedUsers);
      },
    },
    {
      id: 'export',
      label: 'Export',
      onClick: (selectedUsers) => {
        console.log('Export', selectedUsers);
      },
    },
  ]}
/>
```

## Custom Cell Rendering

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: (user) => (
      <div className="flex items-center gap-2">
        <Avatar user={user} />
        <span className="font-medium">{user.name}</span>
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (user) => (
      <Badge variant={user.isActive ? 'default' : 'outline'}>
        {user.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
```

## Loading State

```tsx
<DataTable
  data={users}
  columns={columns}
  isLoading={isLoading}
  loadingConfig={{ rows: 5 }}
/>
```

## Empty State

```tsx
<DataTable
  data={[]}
  columns={columns}
  emptyState={{
    title: 'No users found',
    description: 'Get started by adding your first user.',
    action: {
      label: 'Add User',
      onClick: () => router.push('/users/new'),
    },
  }}
/>
```

## Clickable Rows

```tsx
<DataTable
  data={users}
  columns={columns}
  onRowClick={(user) => router.push(`/users/${user.id}`)}
  hoverable
/>
```

## With Footer

Add summary or totals at the bottom of the table:

```tsx
<DataTable
  data={users}
  columns={columns}
  footer={
    <tr>
      <td colSpan={3} className="px-4 py-3 text-sm font-semibold">
        Total: {users.length} users
      </td>
    </tr>
  }
/>
```

You can also use the footer for complex summaries:

```tsx
<DataTable
  data={products}
  columns={columns}
  footer={
    <tr>
      <td className="px-4 py-3 font-semibold">Total</td>
      <td className="px-4 py-3"></td>
      <td className="px-4 py-3 font-semibold text-right">
        ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
      </td>
    </tr>
  }
/>
```

## Full Example - Refactored Audit Log

Here's a real-world example showing how to refactor an existing table to use DataTable:

### Before (Old Implementation)

```tsx
// Old: AuditLogTable.tsx - Custom table with manual state management
export function AuditLogTable({ logs }: { logs: AuditLogEntry[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof AuditLogEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Manual sorting logic
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      // Complex sorting logic...
    });
  }, [logs, sortKey, sortDirection]);
  
  // Manual pagination logic
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedLogs.slice(start, start + PAGE_SIZE);
  }, [sortedLogs, currentPage]);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('timestamp')}>
            Timestamp {/* Manual sort indicator */}
          </TableHead>
          {/* More headers... */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedLogs.map((log) => (
          <TableRow key={log.id}>
            {/* Manual cell rendering... */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {/* Manual pagination controls... */}
  );
}
```

### After (Using DataTable)

```tsx
// New: Simplified with DataTable
import { DataTable, type ColumnDef } from '@repo/ui/data-table';
import { Badge } from '@repo/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

const auditLogColumns: ColumnDef<AuditLogEntry>[] = [
  {
    id: 'timestamp',
    header: 'Timestamp',
    accessorKey: 'timestamp',
    enableSorting: true,
    cell: (log) => (
      <span className="font-mono text-xs">
        {new Date(log.timestamp).toLocaleString()}
      </span>
    ),
  },
  {
    id: 'action',
    header: 'Action',
    accessorKey: 'action',
    cell: (log) => (
      <Badge variant={getActionVariant(log.action)}>
        {formatAction(log.action)}
      </Badge>
    ),
  },
  {
    id: 'user',
    header: 'User',
    cell: (log) => (
      <div className="flex flex-col">
        <span className="font-medium">{log.user?.username}</span>
        <span className="text-xs text-muted-foreground">{log.user?.email}</span>
      </div>
    ),
  },
  {
    id: 'ip',
    header: 'IP Address',
    accessorKey: 'ip',
    cell: (log) => <span className="font-mono text-xs">{log.ip || 'N/A'}</span>,
  },
  {
    id: 'details',
    header: 'Details',
    cell: (log) => (
      <span className="text-sm text-muted-foreground truncate max-w-xs">
        {formatDetails(log.metadata)}
      </span>
    ),
  },
];

export function AuditLogPage() {
  const { data, isLoading } = useAuditLogs();
  
  return (
    <DataTable
      data={data?.activities ?? []}
      columns={auditLogColumns}
      isLoading={isLoading}
      searchable={{
        placeholder: 'Search audit logs...',
        searchKeys: ['action', 'user', 'ip'],
      }}
      pagination={{
        page: 1,
        pageSize: 20,
        total: data?.pagination.total ?? 0,
        pageSizeOptions: [10, 20, 50],
      }}
      defaultSort={{
        key: 'timestamp',
        direction: 'desc',
      }}
      emptyState={{
        title: 'No audit logs found',
        description: 'No activity has been recorded yet.',
      }}
      caption="Admin activity audit log"
      ariaLabel="Audit log table"
    />
  );
}
```

### Code Reduction

- **Before**: ~300 lines (manual state, sorting, pagination, rendering)
- **After**: ~80 lines (just column definitions)
- **Reduction**: 73% less code!

## API Reference

### DataTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | Required | Array of data to display |
| `columns` | `ColumnDef<TData>[]` | Required | Column definitions |
| `searchable` | `SearchConfig \| boolean` | `false` | Enable global search |
| `pagination` | `PaginationConfig \| boolean` | `false` | Enable pagination |
| `defaultSort` | `SortConfig<TData>` | - | Initial sort configuration |
| `defaultFilters` | `FilterConfig<TData>[]` | `[]` | Initial filters |
| `selection` | `SelectionConfig<TData>` | - | Row selection config |
| `bulkActions` | `BulkAction<TData>[]` | - | Bulk action buttons |
| `isLoading` | `boolean` | `false` | Show loading state |
| `emptyState` | `EmptyStateConfig` | - | Custom empty state |
| `onRowClick` | `(row: TData) => void` | - | Row click handler |
| `hoverable` | `boolean` | `true` | Hover effect on rows |
| `compact` | `boolean` | `false` | Reduced padding |
| `striped` | `boolean` | `false` | Alternate row colors |
| `stickyHeader` | `boolean` | `false` | Fixed header on scroll |
| `ariaLabel` | `string` | - | Accessibility label |

### ColumnDef

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique column identifier |
| `header` | `string` | Column header text |
| `accessorKey` | `keyof TData` | Key to access data |
| `cell` | `(row: TData) => ReactNode` | Custom cell renderer |
| `enableSorting` | `boolean` | Allow sorting |
| `sortFn` | `(a, b, direction) => number` | Custom sort function |
| `width` | `string` | Column width (CSS) |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |
| `hideOnMobile` | `boolean` | Hide on small screens |

## Accessibility

The DataTable component follows WCAG 2.1 AA guidelines:

- ✅ Semantic HTML (`<table>`, `<thead>`, `<tbody>`)
- ✅ ARIA attributes (`aria-sort`, `aria-label`, `role="region"`)
- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ✅ Focus indicators for all interactive elements
- ✅ Screen reader announcements for sort changes
- ✅ Proper heading hierarchy
- ✅ Skip-to-content support via row navigation

## Performance Tips

1. **Memoize column definitions** outside component or with `useMemo`
2. **Use `accessorKey`** instead of `cell` when possible (faster)
3. **Paginate large datasets** (> 100 rows)
4. **Debounce search** (built-in 300ms debounce)
5. **Virtual scrolling** - Consider `react-virtual` for 1000+ rows

## TypeScript

The component is fully typed with TypeScript generics:

```tsx
interface MyData {
  id: string;
  name: string;
}

// Type-safe column definitions
const columns: ColumnDef<MyData>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name', // ✅ typechecked
    cell: (row) => row.name, // ✅ row is MyData
  },
];

// Type-safe DataTable
<DataTable<MyData>
  data={myData}
  columns={columns}
  onRowClick={(row) => {
    console.log(row.name); // ✅ row is MyData
  }}
/>
```

## Testing

See `DataTable.test.tsx` for comprehensive test examples covering:
- Rendering
- Sorting
- Search
- Pagination
- Row selection
- Accessibility
- Custom rendering

## Storybook

Run `pnpm storybook` to see interactive examples in Storybook.

## Migration Guide

### From custom Table to DataTable

1. **Extract column definitions**:
   ```tsx
   const columns: ColumnDef<YourType>[] = [
     { id: 'col1', header: 'Column 1', accessorKey: 'key1' },
   ];
   ```

2. **Replace state management**:
   - Remove `useState` for sort, filter, pagination
   - DataTable handles it internally

3. **Replace manual rendering**:
   - Remove `<Table>`, `<TableRow>`, etc.
   - Use `<DataTable>` with props

4. **Add optional features**:
   - `searchable` for search
   - `pagination` for pagination
   - `selection` for row selection

## Examples in Codebase

Real-world usage examples:
- `apps/web/src/app/[locale]/admin/users/page.tsx` - User management
- `apps/web/src/app/[locale]/admin/roles/page.tsx` - Role management
- `apps/web/src/app/[locale]/admin/audit-log/page.tsx` - Audit logs

## Support

For questions or issues, check:
- Storybook examples
- Test file for usage patterns
- Existing implementations in admin pages
