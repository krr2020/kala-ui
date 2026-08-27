# DataTable Server-Side Data Fetching Guide

This guide explains how to use the DataTable component with server-side data fetching for large datasets.

## Why Server-Side Mode?

For large datasets (10,000+ records), loading all data at once is inefficient:
- ❌ High memory usage
- ❌ Slow initial page load
- ❌ Poor user experience

Server-side mode solves this by:
- ✅ Loading only the current page's data
- ✅ Making API calls when pagination/sort/filter changes
- ✅ Efficient memory usage
- ✅ Fast page loads

## Quick Start

```tsx
import { DataTable } from '@kala-ui/react/data-table';
import { useState, useEffect } from 'react';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/users?page=${currentPage}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setUsers(data.items);
      setTotalRecords(data.total);
      setIsLoading(false);
    };
    fetchData();
  }, [currentPage, pageSize]);

  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={isLoading}
      pagination={{
        page: currentPage,
        pageSize: pageSize,
        total: totalRecords,
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
    />
  );
}
```

## Available Callbacks

### 1. Pagination Callback

Triggered when page number or page size changes:

```tsx
pagination={{
  page: currentPage,
  pageSize: pageSize,
  total: totalRecords,
  onChange: (page, size) => {
    console.log('Page changed to:', page, 'Size:', size);
    setCurrentPage(page);
    setPageSize(size);
  },
}}
```

### 2. Sort Callback

Triggered when column sorting changes:

```tsx
onSortChange={(sort) => {
  if (sort) {
    console.log('Sort by:', sort.key, 'Direction:', sort.direction);
  } else {
    console.log('Sort cleared');
  }
  setSortConfig(sort);
  setCurrentPage(1); // Reset to page 1
}}
```

### 3. Search Callback

Triggered when search query changes (debounced by 300ms):

```tsx
searchable={{
  placeholder: 'Search...',
  onChange: (query) => {
    console.log('Search query:', query);
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1
  },
}}
```

### 4. Filter Callback

Triggered when filters change:

```tsx
onFilterChange={(filters) => {
  console.log('Active filters:', filters);
  setFilters(filters);
  setCurrentPage(1); // Reset to page 1
}}
```

## Complete Example with All Callbacks

```tsx
import { DataTable, type ColumnDef, type SortConfig, type FilterConfig } from '@kala-ui/react/data-table';
import { useState, useEffect, useCallback } from 'react';

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
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig<User> | null>(null);
  const [filters, setFilters] = useState<FilterConfig<User>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data whenever any parameter changes
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Build query params
    const params = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: pageSize.toString(),
      search: searchQuery,
    });

    if (sortConfig) {
      params.append('sortBy', sortConfig.key.toString());
      params.append('sortOrder', sortConfig.direction);
    }

    filters.forEach((filter, index) => {
      params.append(`filter[${index}][key]`, filter.key.toString());
      params.append(`filter[${index}][operator]`, filter.operator);
      params.append(`filter[${index}][value]`, String(filter.value));
    });

    try {
      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();
      setUsers(data.items);
      setTotalRecords(data.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortConfig, filters, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={isLoading}
      pagination={{
        page: currentPage,
        pageSize: pageSize,
        total: totalRecords,
        pageSizeOptions: [10, 20, 50, 100],
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
      searchable={{
        placeholder: 'Search users...',
        debounce: 300,
        onChange: (query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        },
      }}
      onSortChange={(sort) => {
        setSortConfig(sort);
        setCurrentPage(1);
      }}
      onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
      }}
    />
  );
}
```

## API Response Format

Your API should return data in this format:

```json
{
  "items": [
    { "id": "1", "name": "Alice", "email": "alice@example.com", "role": "Admin" },
    { "id": "2", "name": "Bob", "email": "bob@example.com", "role": "User" }
  ],
  "total": 10000,
  "page": 1,
  "pageSize": 10
}
```

## Best Practices

1. **Always reset to page 1** when search/sort/filter changes
2. **Set `pagination.total`** to the total count from your API (not `data.length`)
3. **Use loading states** to show feedback during API calls
4. **Handle errors** gracefully with try-catch blocks
5. **Debounce search** (built-in 300ms debounce in DataTable)
6. **Use `useCallback`** for `fetchData` to prevent unnecessary re-renders
7. **Pass only current page data** to the `data` prop (not all records)

## Common Mistakes

❌ **Don't pass all data:**
```tsx
<DataTable data={all10000Records} /> // Wrong!
```

✅ **Only pass current page:**
```tsx
<DataTable data={currentPage20Records} /> // Correct!
```

❌ **Don't use `data.length` for total:**
```tsx
pagination={{ total: users.length }} // Wrong!
```

✅ **Use API's total count:**
```tsx
pagination={{ total: totalRecordsFromAPI }} // Correct!
```

❌ **Don't forget to handle loading:**
```tsx
<DataTable data={users} /> // No loading feedback!
```

✅ **Show loading state:**
```tsx
<DataTable data={users} isLoading={isLoading} /> // Better UX!
```

## Client-Side vs Server-Side Comparison

| Feature | Client-Side | Server-Side |
|---------|-------------|-------------|
| **Data in Memory** | All records | Only current page |
| **Initial Load** | Slower (all data) | Faster (one page) |
| **User Interactions** | Instant | Network delay |
| **Best For** | < 1,000 records | > 10,000 records |
| **Callbacks Needed** | No | Yes |
| **API Calls** | Once | On every state change |

## Troubleshooting

### Pagination not working?
- Ensure `pagination.total` is set to API's total count, not `data.length`
- Check that `onChange` callback updates state correctly

### Sort/Filter not triggering API calls?
- Add `onSortChange` and `onFilterChange` callbacks
- Verify callbacks are updating state
- Check that `useEffect` dependency array includes state variables

### Loading state not showing?
- Set `isLoading={true}` before API call
- Set `isLoading={false}` after API call completes
- Consider using skeleton config for better UX

### Page not resetting on search/sort/filter?
- Always call `setCurrentPage(1)` in your callbacks
- This ensures users see the first page of new results

## See Also

- [DataTable README](./README.md) - Complete component documentation
- [Storybook Example](./data-table.stories.tsx) - Interactive examples
- [API Reference](./data-table.types.ts) - TypeScript type definitions
