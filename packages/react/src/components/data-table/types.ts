/**
 * DataTable Types
 * Type definitions for the DataTable component with full TypeScript support
 */

import type { HTMLAttributes, ReactNode } from 'react';

import type { EmptyStateProps } from '../empty-state';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig<TData> {
  key: keyof TData;
  direction: SortDirection;
}

/**
 * Filter operator types
 */
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in';

/**
 * Filter configuration
 */
export interface FilterConfig<TData> {
  key: keyof TData;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Filterable column configuration
 */
export interface FilterableColumn<TData> {
  /** Key of the column to filter */
  key: keyof TData;
  /** Label to display for the filter */
  label: string;
  /** Type of filter input */
  type: 'select' | 'text';
  /** Options for select filter */
  options?: Array<{ label: string; value: string }>;
  /** Placeholder for text filter */
  placeholder?: string;
  /** Filter operator to use (default: 'equals' for select, 'contains' for text) */
  operator?: FilterOperator;
}

/**
 * Column definition for DataTable
 */
export interface ColumnDef<TData> {
  /** Unique identifier for the column */
  id: string;
  /** Column header label */
  header: string;
  /** Key to access data from row object */
  accessorKey?: keyof TData;
  /** Custom cell renderer */
  cell?: (row: TData) => ReactNode;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom CSS class for the column */
  className?: string;
  /** Enable filtering for this column */
  enableFiltering?: boolean;
  /** Custom sort function */
  sortFn?: (a: TData, b: TData, direction: SortDirection) => number;
  /** Column width (CSS value) */
  width?: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Hide column on mobile */
  hideOnMobile?: boolean;
  /** ARIA label for column header */
  ariaLabel?: string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Page size options */
  pageSizeOptions?: number[];
}

/**
 * Search configuration
 */
export interface SearchConfig<TData> {
  /** Placeholder text for search input */
  placeholder?: string;
  /** Keys to search in */
  searchKeys?: (keyof TData)[];
  /** Debounce delay in ms */
  debounce?: number;
  /** ARIA label for search input */
  ariaLabel?: string;
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon component */
  icon?: EmptyStateProps['icon'];
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Loading state configuration
 */
export interface LoadingConfig {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Show loading overlay */
  overlay?: boolean;
}

/**
 * Row selection configuration
 */
export interface SelectionConfig<TData> {
  /** Enable row selection */
  enabled: boolean;
  /** Selected row IDs */
  selectedIds: Set<string>;
  /** Get unique ID from row */
  getRowId: (row: TData) => string;
  /** Selection change handler */
  onSelectionChange: (selectedIds: Set<string>) => void;
  /** Disable selection for specific rows */
  isRowSelectable?: (row: TData) => boolean;
}

/**
 * Bulk action definition
 */
export interface BulkAction<TData> {
  /** Action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: ReactNode;
  /** Action handler */
  onClick: (selectedRows: TData[]) => void | Promise<void>;
  /** Disabled state */
  disabled?: boolean;
  /** Variant (default, destructive, etc.) */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  /** Requires confirmation */
  requireConfirmation?: boolean;
  /** Confirmation message */
  confirmationMessage?: string;
}

/**
 * DataTable Props
 */
export interface DataTableProps<TData> {
  /** Table data */
  data: TData[];
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Enable global search */
  searchable?: SearchConfig<TData> | boolean;
  /** Enable pagination */
  pagination?: PaginationConfig | boolean;
  /** Initial sort configuration */
  defaultSort?: SortConfig<TData>;
  /** Initial filter configuration */
  defaultFilters?: FilterConfig<TData>[];
  /** Filterable columns configuration */
  filterableColumns?: FilterableColumn<TData>[];
  /** Empty state configuration */
  emptyState?: EmptyStateConfig;
  /** Loading state */
  isLoading?: boolean;
  /** Loading configuration */
  loadingConfig?: LoadingConfig;
  /** Row selection */
  selection?: SelectionConfig<TData>;
  /** Bulk actions */
  bulkActions?: BulkAction<TData>[];
  /** Row click handler */
  onRowClick?: (row: TData) => void;
  /** Custom row class name function */
  getRowClassName?: (row: TData) => string;
  /** Custom row attributes function */
  getRowAttributes?: (row: TData) => HTMLAttributes<HTMLTableRowElement>;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Compact mode (reduced padding) */
  compact?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Bordered */
  bordered?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Custom table caption for a11y */
  caption?: string;
  /** Table footer content */
  footer?: ReactNode;
  /** Custom CSS class for table container */
  className?: string;
  /** ARIA label for the table */
  ariaLabel?: string;
  /** Sticky footer (keeps pagination visible when scrolling) */
  stickyFooter?: boolean;
  /** Show duplicate column headers below data rows */
  headersBelow?: boolean;
}

/**
 * Table state hook return type
 */
export interface TableState<TData> {
  /** Current filtered and sorted data */
  processedData: TData[];
  /** Current page data (if pagination enabled) */
  pageData: TData[];
  /** Current sort configuration */
  sortConfig: SortConfig<TData> | null;
  /** Set sort configuration */
  setSortConfig: (config: SortConfig<TData> | null) => void;
  /** Toggle sort for a column */
  toggleSort: (key: keyof TData) => void;
  /** Current filter configurations */
  filterConfigs: FilterConfig<TData>[];
  /** Add or update filter */
  setFilter: (filter: FilterConfig<TData>) => void;
  /** Remove filter */
  removeFilter: (key: keyof TData) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Search query */
  searchQuery: string;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Set current page */
  setCurrentPage: (page: number) => void;
  /** Page size */
  pageSize: number;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Total pages */
  totalPages: number;
  /** Has next page */
  hasNextPage: boolean;
  /** Has previous page */
  hasPreviousPage: boolean;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
}
