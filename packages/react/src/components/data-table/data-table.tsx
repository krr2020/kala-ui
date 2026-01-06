/**
 * DataTable Component
 * Fully-featured, accessible data table with sorting, filtering, search, and pagination
 *
 * Features:
 * - Sorting (single column)
 * - Filtering (multiple filters)
 * - Global search
 * - Pagination with configurable page sizes
 * - Row selection (optional)
 * - Bulk actions (optional)
 * - Loading states
 * - Empty states
 * - Full keyboard navigation
 * - WCAG 2.1 AA compliant
 * - React 19 compatible
 */

'use client';

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../badge';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { EmptyState } from '../empty-state';
import { FieldLabel } from '../field';
import { Input } from '../input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Skeleton } from '../skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { ColumnHeaderFilter } from './column-header-filter';
import type { DataTableProps, PaginationConfig, SearchConfig } from './types';
import { useTableState } from './useTableState';

/**
 * DataTable Component
 */
export function DataTable<TData>({
  data,
  columns,
  searchable,
  pagination,
  defaultSort,
  defaultFilters,
  filterableColumns,
  emptyState,
  isLoading = false,
  loadingConfig,
  selection,
  bulkActions,
  onRowClick,
  getRowClassName,
  getRowAttributes,
  stickyHeader = true,
  compact = false,
  striped = false,
  bordered = false,
  hoverable = true,
  caption,
  footer,
  className,
  ariaLabel,
  stickyFooter = false,
  headersBelow = false,
}: DataTableProps<TData>) {
  // Determine page size
  const pageSize = useMemo(() => {
    if (!pagination) return data.length;
    if (typeof pagination === 'boolean') return 10;
    return pagination.pageSize;
  }, [pagination, data.length]);

  // Table state management (avoid passing explicit `undefined` with exactOptionalPropertyTypes)
  const tableState = useTableState<TData>({
    data,
    columns,
    ...(searchable ? { searchConfig: searchable } : {}),
    pageSize,
    ...(defaultSort ? { defaultSort } : {}),
    ...(defaultFilters ? { defaultFilters } : {}),
  });

  const {
    pageData,
    sortConfig,
    toggleSort,
    searchQuery,
    setSearchQuery,
    currentPage,
    pageSize: currentPageSize,
    setPageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    processedData,
    filterConfigs,
    setFilter,
    removeFilter,
    clearFilters,
  } = tableState;

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(selection?.selectedIds ?? new Set());

  // Scroll container ref for scroll-to-top/bottom buttons
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Handle scroll event to show/hide scroll buttons
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButtons(scrollHeight > clientHeight && scrollTop > 100);
    }
  }, []);

  // Scroll to top/bottom functions
  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // Handle select all
  const isAllSelected = useMemo(() => {
    if (!selection || pageData.length === 0) return false;
    const selectableRows = pageData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );
    return selectableRows.every((row) => selectedIds.has(selection.getRowId(row)));
  }, [selection, pageData, selectedIds]);

  const isSomeSelected = useMemo(() => {
    if (!selection || pageData.length === 0) return false;
    const selectableRows = pageData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );
    return selectableRows.some((row) => selectedIds.has(selection.getRowId(row))) && !isAllSelected;
  }, [selection, pageData, selectedIds, isAllSelected]);

  const handleSelectAll = useCallback(() => {
    if (!selection) return;

    const newSelectedIds = new Set(selectedIds);
    const selectableRows = pageData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );

    if (isAllSelected) {
      // Deselect all on current page
      selectableRows.forEach((row) => {
        newSelectedIds.delete(selection.getRowId(row));
      });
    } else {
      // Select all on current page
      selectableRows.forEach((row) => {
        newSelectedIds.add(selection.getRowId(row));
      });
    }

    setSelectedIds(newSelectedIds);
    selection.onSelectionChange(newSelectedIds);
  }, [selection, pageData, selectedIds, isAllSelected]);

  const handleSelectRow = useCallback(
    (row: TData) => {
      if (!selection) return;
      const rowId = selection.getRowId(row);
      const newSelectedIds = new Set(selectedIds);

      if (newSelectedIds.has(rowId)) {
        newSelectedIds.delete(rowId);
      } else {
        newSelectedIds.add(rowId);
      }

      setSelectedIds(newSelectedIds);
      selection.onSelectionChange(newSelectedIds);
    },
    [selection, selectedIds],
  );

  // Get selected rows for bulk actions
  const selectedRows = useMemo(() => {
    if (!selection) return [];
    return data.filter((row) => selectedIds.has(selection.getRowId(row)));
  }, [data, selectedIds, selection]);

  // Search config
  const searchConfig: SearchConfig<TData> | null = useMemo(() => {
    if (!searchable) return null;
    if (typeof searchable === 'boolean') {
      return {
        placeholder: 'Search...',
        ariaLabel: 'Search table',
      };
    }
    return {
      placeholder: searchable.placeholder ?? 'Search...',
      ariaLabel: searchable.ariaLabel ?? 'Search table',
      ...searchable,
    };
  }, [searchable]);

  // Pagination config
  const paginationConfig: PaginationConfig | null = useMemo(() => {
    if (!pagination) return null;
    if (typeof pagination === 'boolean') {
      return {
        page: currentPage,
        pageSize: currentPageSize,
        total: processedData.length,
        pageSizeOptions: [10, 20, 50, 100],
      };
    }
    return {
      ...pagination,
      page: currentPage,
      pageSize: currentPageSize,
      total: processedData.length,
    };
  }, [pagination, currentPage, currentPageSize, processedData.length]);

  // Render search input helper
  const renderSearchInput = (forceShow = false) => {
    if (!searchConfig) return null;

    // Hide search if no data and not searching (unless forceShow is true)
    if (data.length === 0 && !searchQuery && !forceShow) return null;

    return (
      <div className="flex-1 max-w-sm">
        <Input
          type="search"
          placeholder={searchConfig.placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefixIcon={<Search className="h-4 w-4" />}
          suffixIcon={
            searchQuery ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="p-1 text-muted-foreground hover:text-foreground h-auto"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null
          }
          aria-label={searchConfig.ariaLabel}
        />
      </div>
    );
  };

  // Render loading state
  if (isLoading) {
    const rows = loadingConfig?.rows ?? 5;
    return (
      <div className={cn('space-y-4', className)}>
        {searchConfig && <Skeleton className="h-10 w-full max-w-sm bg-muted" />}
        <div className="rounded-lg border overflow-hidden theme-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {selection?.enabled && <TableHead className="w-12" />}
                {columns.map((column) => (
                  <TableHead key={column.id}>
                    <Skeleton className="h-4 w-24 bg-muted" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, idx) => (
                <TableRow key={idx} className="border-b">
                  {selection?.enabled && (
                    <TableCell>
                      <Skeleton className="h-4 w-4 bg-muted" />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-32 bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Render empty state
  if (pageData.length === 0) {
    const defaultEmptyState = {
      title: searchQuery ? 'No results found' : 'No data available',
      description: searchQuery
        ? `No results found for "${searchQuery}". Try adjusting your search.`
        : 'There is no data to display at the moment.',
    };

    const emptyConfig = { ...defaultEmptyState, ...emptyState };

    return (
      <div className={cn('space-y-4', className)}>
        {renderSearchInput()}
        <EmptyState
          title={emptyConfig.title}
          description={emptyConfig.description}
          {...(emptyConfig.icon && { icon: emptyConfig.icon })}
          {...(emptyConfig.action && { action: emptyConfig.action })}
        />
      </div>
    );
  }

  return (
    <section
      className={cn('flex flex-col', stickyFooter ? 'h-full min-h-0' : '', className)}
      aria-label={ariaLabel}
    >
      {/* Search and Bulk Actions */}
      {(searchConfig || bulkActions) && (
        <div
          className={cn(
            'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4',
            stickyFooter && 'shrink-0',
          )}
        >
          {/* Search */}
          {renderSearchInput()}

          {/* Bulk Actions - Always visible to prevent CLS */}
          {bulkActions && (
            <div className="flex items-center gap-2 flex-wrap min-h-[36px]">
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              {bulkActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant ?? 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={selectedIds.size === 0 || action.disabled}
                  className={cn(selectedIds.size === 0 && 'opacity-50 cursor-not-allowed')}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Chips */}
      {filterableColumns && filterConfigs.length > 0 && (
        <div className={cn('flex flex-wrap items-center gap-2 mb-4', stickyFooter && 'shrink-0')}>
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterConfigs.map((filter) => {
            const column = filterableColumns.find((fc) => fc.key === filter.key);
            if (!column) return null;

            const filterValueArray = Array.isArray(filter.value) ? filter.value : [filter.value];

            return filterValueArray.map((value, idx) => (
              <Badge
                key={`${String(filter.key)}-${value}-${idx}`}
                variant="secondary"
                className="gap-1.5 pl-2 pr-1 py-1 bg-primary/10 text-primary border-primary/20"
              >
                <span className="text-xs font-medium">
                  {column.label}: {String(value)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (filterValueArray.length === 1) {
                      removeFilter(filter.key);
                    } else {
                      const newValues = filterValueArray.filter((v) => v !== value);
                      setFilter({
                        key: filter.key,
                        operator: filter.operator,
                        value: newValues,
                      });
                    }
                  }}
                  className="h-4 w-4 p-0 hover:bg-primary/20 rounded-sm"
                  aria-label={`Remove ${column.label} filter: ${String(value)}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ));
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div
        className={cn(
          'border relative overflow-hidden theme-card',
          stickyFooter && paginationConfig ? 'flex-1 min-h-0' : '',
          bordered && 'border-2',
          paginationConfig ? 'rounded-t-lg border-b-0' : 'rounded-lg',
        )}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={cn(
            'overflow-auto relative',
            paginationConfig ? 'rounded-t-lg' : 'rounded-lg',
            stickyFooter ? 'flex-1 min-h-0 max-h-[70vh]' : 'max-h-[600px]',
          )}
        >
          <table className="w-full border-separate border-spacing-0 caption-bottom text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <TableHeader
              className={cn(
                stickyHeader && 'sticky top-0 z-1 bg-muted/95 backdrop-blur-sm',
                '[&_tr]:border-0',
              )}
            >
              <TableRow className="border-0">
                {/* Selection column */}
                {selection?.enabled && (
                  <TableHead
                    className={cn(
                      'w-12 rounded-tl-lg',
                      stickyHeader ? 'border-b border-border-strong/50' : 'border-b',
                    )}
                  >
                    <Checkbox
                      checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}

                {/* Data columns */}
                {columns.map((column, index) => {
                  const isSorted = column.accessorKey && sortConfig?.key === column.accessorKey;
                  const sortDirection = isSorted ? sortConfig.direction : null;
                  const canSort = column.enableSorting !== false && column.accessorKey;

                  // Check if this column has a filter config
                  const filterColumn = filterableColumns?.find(
                    (fc) => fc.key === column.accessorKey,
                  );

                  const isFirst = !selection?.enabled && index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <TableHead
                      key={column.id}
                      style={{ width: column.width }}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.hideOnMobile && 'hidden md:table-cell',
                        stickyHeader ? 'border-b border-border-strong/50' : 'border-b',
                        isFirst && 'rounded-tl-lg',
                        isLast && 'rounded-tr-lg',
                      )}
                      aria-sort={
                        isSorted && sortDirection
                          ? sortDirection === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          column.align === 'center' && 'justify-center',
                          column.align === 'right' && 'justify-end',
                        )}
                      >
                        {canSort && column.accessorKey ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSort(column.accessorKey as keyof TData)}
                            className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-accent font-semibold text-foreground hover:text-accent-foreground"
                            aria-label={
                              column.ariaLabel
                                ? `Sort by ${column.ariaLabel}`
                                : `Sort by ${column.header}`
                            }
                          >
                            {column.header}
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="ml-2 h-4 w-4" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                              )
                            ) : (
                              <ChevronDown
                                className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-40"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        ) : (
                          <span className="font-semibold text-muted-foreground">
                            {column.header}
                          </span>
                        )}
                        {filterColumn && (
                          <ColumnHeaderFilter
                            column={filterColumn}
                            activeFilters={filterConfigs}
                            onFilterChange={setFilter}
                            onFilterRemove={removeFilter}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((row, rowIndex) => {
                const isSelectable = !selection?.isRowSelectable || selection.isRowSelectable(row);
                const rowId = selection?.getRowId(row);
                const isSelected = rowId ? selectedIds.has(rowId) : false;
                const isClickable = !!onRowClick;
                const isLastRow = rowIndex === pageData.length - 1;

                return (
                  <TableRow
                    key={rowId ?? rowIndex}
                    {...getRowAttributes?.(row)}
                    data-state={isSelected ? 'selected' : undefined}
                    onClick={() => isClickable && onRowClick(row)}
                    className={cn(
                      isSelected && 'bg-accent/50',
                      striped && rowIndex % 2 === 0 && 'bg-muted/50',
                      hoverable && 'hover:bg-muted/50',
                      isClickable && 'cursor-pointer',
                      compact && 'h-10',
                      getRowClassName?.(row),
                      'border-0',
                    )}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }}
                  >
                    {/* Selection cell */}
                    {selection?.enabled && (
                      <TableCell
                        className={cn(
                          (!isLastRow || (!!paginationConfig && !footer)) && 'border-b',
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={!isSelectable}
                          aria-label={`Select row ${rowIndex + 1}`}
                          onCheckedChange={() => {
                            if (isSelectable) handleSelectRow(row);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => {
                      const cellValue = column.accessorKey ? row[column.accessorKey] : undefined;

                      return (
                        <TableCell
                          key={column.id}
                          className={cn(
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.hideOnMobile && 'hidden md:table-cell',
                            compact && 'py-2',
                            (!isLastRow || (!!paginationConfig && !footer)) && 'border-b',
                          )}
                        >
                          {column.cell
                            ? column.cell(row)
                            : cellValue !== null && cellValue !== undefined
                              ? String(cellValue)
                              : '—'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>

            {/* Duplicate headers at bottom for long tables */}
            {headersBelow && pageData.length > 10 && (
              <TableHeader
                className={cn(
                  'bg-muted border-t',
                  stickyFooter &&
                    'sticky bottom-0 z-40 shadow-[0_-1px_0_0_hsl(var(--border))] backdrop-blur-sm bg-muted/95',
                )}
              >
                <TableRow>
                  {/* Selection column */}
                  {selection?.enabled && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows (bottom)"
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.className,
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        stickyFooter && 'border-t-2 border-border-strong/50',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          column.align === 'center' && 'justify-center',
                          column.align === 'right' && 'justify-end',
                        )}
                      >
                        {column.enableSorting !== false ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 -ml-2 justify-start font-medium hover:bg-transparent"
                            onClick={() =>
                              toggleSort(column.accessorKey || (column.id as keyof TData))
                            }
                            aria-label={`Sort by ${column.header}`}
                          >
                            {column.header}
                            {sortConfig?.key === (column.accessorKey || column.id) &&
                              (sortConfig.direction === 'asc' ? (
                                <ArrowUp
                                  className="ml-2 h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowDown
                                  className="ml-2 h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              ))}
                          </Button>
                        ) : (
                          <span className="font-medium">{column.header}</span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}

            {footer && (
              <TableFooter className={cn('border-t', !!paginationConfig && 'border-b')}>
                <TableRow className="border-0">
                  <TableCell
                    colSpan={columns.length + (selection?.enabled ? 1 : 0)}
                    className="p-4"
                  >
                    {footer}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </table>
        </div>

        {/* Scroll to Top/Bottom Buttons */}
        {showScrollButtons && (
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="h-8 w-8 p-0 rounded-full shadow-lg bg-background theme-card"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToBottom}
              className="h-8 w-8 p-0 rounded-full shadow-lg bg-background theme-card"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {/* Pagination - Always show if pagination is enabled */}
      {paginationConfig && (
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-between gap-4 bg-background px-4 py-3 rounded-b-lg theme-card',
            bordered ? 'border-x-2 border-b-2' : 'border-x border-b',
            stickyFooter && 'sticky bottom-0 z-1 shadow-xl border-t-2 bg-background',
          )}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * currentPageSize + 1} to{' '}
              {Math.min(currentPage * currentPageSize, paginationConfig.total)} of{' '}
              {paginationConfig.total} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Page size selector */}
            {paginationConfig.pageSizeOptions && (
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="page-size" className="text-sm text-muted-foreground mb-0">
                  Rows per page:
                </FieldLabel>
                <Select
                  value={String(currentPageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20 h-9 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paginationConfig.pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={!hasPreviousPage}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!hasNextPage}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
