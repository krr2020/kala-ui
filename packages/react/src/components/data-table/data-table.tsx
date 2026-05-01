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

import { useDisclosure } from '@kala-ui/react-hooks';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/utils';
import { Box } from '../box';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { EmptyState } from '../empty-state';
import { Flex } from '../flex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Stack } from '../stack';
import {
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { Text } from '../text';
import { DataTableBodyRows } from './data-table-body-rows';
import { DataTableFilterChips } from './data-table-filter-chips';
import { DataTableHeaderRow } from './data-table-header-row';
import { DataTableSkeleton } from './data-table-skeleton';
import { DataTableToolbar } from './data-table-toolbar';
import type { DataTableProps, PaginationConfig, SearchConfig } from './data-table.types';
import { PaginationNav } from './pagination-nav';
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
  skeletonConfig,
  skeleton,
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
  onSortChange,
  onFilterChange,
  toolbarContent,
}: DataTableProps<TData>) {
  // Determine page size
  const pageSize = useMemo(() => {
    if (!pagination) return data.length;
    if (typeof pagination === 'boolean') return 10;
    return pagination.pageSize;
  }, [pagination, data.length]);

  // Extract callbacks from configs
  const paginationCallback = useMemo(() => {
    if (!pagination || typeof pagination === 'boolean') return undefined;
    return pagination.onChange;
  }, [pagination]);

  const totalCount = useMemo(() => {
    if (!pagination || typeof pagination === 'boolean') return undefined;
    return pagination.total;
  }, [pagination]);

  const searchCallback = useMemo(() => {
    if (!searchable || typeof searchable === 'boolean') return undefined;
    return searchable.onChange;
  }, [searchable]);

  // Table state management
  const tableState = useTableState<TData>({
    data,
    columns,
    searchConfig: searchable,
    pageSize,
    total: totalCount,
    defaultSort,
    defaultFilters,
    onSortChange,
    onFilterChange,
    onSearchChange: searchCallback,
    onPaginationChange: paginationCallback,
  });

  const {
    pageData,
    sortConfig,
    toggleSort,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
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

  // Determine display data: use full data for server-side pagination, pageData for client-side
  const displayData = paginationCallback ? data : pageData;

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(selection?.selectedIds ?? new Set());

  // Scroll container ref for scroll-to-top/bottom buttons
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, { set: setShowScrollButtons }] = useDisclosure(false);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButtons(scrollHeight > clientHeight && scrollTop > 100);
    }
  }, [setShowScrollButtons]);

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
    if (!selection || displayData.length === 0) return false;
    const selectableRows = displayData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );
    return selectableRows.every((row) => selectedIds.has(selection.getRowId(row)));
  }, [selection, displayData, selectedIds]);

  const isSomeSelected = useMemo(() => {
    if (!selection || displayData.length === 0) return false;
    const selectableRows = displayData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );
    return selectableRows.some((row) => selectedIds.has(selection.getRowId(row))) && !isAllSelected;
  }, [selection, displayData, selectedIds, isAllSelected]);

  const handleSelectAll = useCallback(() => {
    if (!selection) return;

    const newSelectedIds = new Set(selectedIds);
    const selectableRows = displayData.filter(
      (row) => !selection.isRowSelectable || selection.isRowSelectable(row),
    );

    if (isAllSelected) {
      selectableRows.forEach((row) => {
        newSelectedIds.delete(selection.getRowId(row));
      });
    } else {
      selectableRows.forEach((row) => {
        newSelectedIds.add(selection.getRowId(row));
      });
    }

    setSelectedIds(newSelectedIds);
    selection.onSelectionChange(newSelectedIds);
  }, [selection, displayData, selectedIds, isAllSelected]);

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
      total: pagination.total ?? processedData.length,
    };
  }, [pagination, currentPage, currentPageSize, processedData.length]);

  // Render loading state
  if (isLoading) {
    if (skeleton) {
      return (
        <Stack gap={4} className={className}>
          {skeleton}
        </Stack>
      );
    }

    const showSearch = !!searchConfig;
    const showFilters = !!filterableColumns;
    const showPagination = !!paginationConfig;
    const showSelection = !!selection?.enabled;
    const showBulkActions = !!bulkActions;

    const skeletonRows = skeletonConfig?.rows ?? loadingConfig?.rows ?? 5;

    return (
      <Stack gap={4} className={className}>
        <DataTableSkeleton<TData>
          rows={skeletonRows}
          columns={columns}
          showSearch={showSearch}
          showFilters={showFilters}
          showPagination={showPagination}
          showSelection={showSelection}
          showBulkActions={showBulkActions}
          stickyHeader={stickyHeader}
          stickyFooter={stickyFooter}
        />
      </Stack>
    );
  }

  // Compute empty state config
  const emptyConfig = {
    title: searchQuery ? 'No results found' : 'No data available',
    description: searchQuery
      ? `No results found for "${searchQuery}". Try adjusting your search.`
      : 'There is no data to display at the moment.',
    ...emptyState,
  };

  return (
    <Stack
      className={cn(stickyFooter ? 'h-full min-h-0' : '', className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'region' : undefined}
      gap={0}
    >
      {/* Search and Bulk Actions */}
      <DataTableToolbar<TData>
        searchConfig={searchConfig}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bulkActions={bulkActions}
        selectedRows={selectedRows}
        selectedIdsCount={selectedIds.size}
        toolbarContent={toolbarContent}
        hasData={data.length > 0}
        className={stickyFooter ? 'shrink-0' : undefined}
      />

      {/* Active Filters Chips */}
      {filterableColumns && (
        <div className={stickyFooter ? 'shrink-0' : undefined}>
          <DataTableFilterChips<TData>
            filterConfigs={filterConfigs}
            filterableColumns={filterableColumns}
            onSetFilter={setFilter}
            onRemoveFilter={removeFilter}
            onClearFilters={clearFilters}
          />
        </div>
      )}

      {/* Empty state or Table */}
      {displayData.length === 0 ? (
        <EmptyState
          title={emptyConfig.title}
          description={emptyConfig.description}
          {...(emptyConfig.icon && { icon: emptyConfig.icon })}
          {...(emptyConfig.action && { action: emptyConfig.action })}
        />
      ) : (
        <>
          {/* Table Container */}
          <Box
            className={cn(
              'border relative overflow-hidden theme-card',
              stickyFooter && paginationConfig ? 'flex-1 min-h-0' : '',
              bordered && 'border-2',
              paginationConfig ? 'rounded-t-lg border-b-0' : 'rounded-lg',
            )}
          >
            <Box
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={cn(
                'overflow-auto relative',
                paginationConfig ? 'rounded-t-lg' : 'rounded-lg',
                stickyFooter ? 'flex-1 min-h-0 max-h-[70vh]' : 'max-h-[800px]',
              )}
            >
              <table className="w-full border-separate border-spacing-0 caption-bottom text-sm">
                {caption && <caption className="sr-only">{caption}</caption>}

                <DataTableHeaderRow<TData>
                  columns={columns}
                  selection={selection}
                  sortConfig={sortConfig}
                  onToggleSort={toggleSort}
                  filterableColumns={filterableColumns}
                  filterConfigs={filterConfigs}
                  onSetFilter={setFilter}
                  onRemoveFilter={removeFilter}
                  isAllSelected={isAllSelected}
                  isSomeSelected={isSomeSelected}
                  onSelectAll={handleSelectAll}
                  stickyHeader={stickyHeader}
                />

                <DataTableBodyRows<TData>
                  displayData={displayData}
                  columns={columns}
                  selection={selection}
                  selectedIds={selectedIds}
                  onSelectRow={handleSelectRow}
                  onRowClick={onRowClick}
                  compact={compact}
                  striped={striped}
                  hoverable={hoverable}
                  getRowClassName={getRowClassName}
                  getRowAttributes={getRowAttributes}
                  hasPagination={!!paginationConfig}
                  hasFooter={!!footer}
                />

                {/* Duplicate headers at bottom for long tables */}
                {headersBelow && displayData.length > 10 && (
                  <TableHeader
                    className={cn(
                      'bg-muted border-t',
                      stickyFooter &&
                        'sticky bottom-0 z-40 shadow-[0_-1px_0_0_hsl(var(--border))] backdrop-blur-sm bg-muted/95',
                    )}
                  >
                    <TableRow>
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
                          )}
                        >
                          <Flex
                            align="center"
                            gap={2}
                            className={cn(
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
                              <Text weight="medium">{column.header}</Text>
                            )}
                          </Flex>
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
            </Box>

            {showScrollButtons && (
              <Flex gap={2} className="absolute bottom-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={scrollToTop}
                  className="rounded-full shadow-lg h-9 w-9 bg-background/80 backdrop-blur-sm border-border-strong/20"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={scrollToBottom}
                  className="rounded-full shadow-lg h-9 w-9 bg-background/80 backdrop-blur-sm border-border-strong/20"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </Flex>
            )}
          </Box>

          {/* Pagination */}
          {paginationConfig && (
            <Flex
              align="center"
              justify="between"
              className={cn('px-4 py-3 border rounded-b-lg bg-muted/30', stickyFooter && 'shrink-0')}
            >
              <Flex align="center" gap={4}>
                <Text as="span" className="text-foreground inline">
                  {Math.min(
                    (paginationConfig.page - 1) * paginationConfig.pageSize + 1,
                    paginationConfig.total,
                  )}
                  {' - '}
                  {Math.min(paginationConfig.page * paginationConfig.pageSize, paginationConfig.total)}
                  {' / '}
                  <Text as="span" weight="medium" className="text-foreground inline">
                    {paginationConfig.total}
                  </Text>
                </Text>

                {paginationConfig.pageSizeOptions && (
                  <Flex align="center" gap={2}>
                    <Text size="sm" className="text-muted-foreground whitespace-nowrap">
                      Rows per page
                    </Text>
                    <Select
                      value={String(paginationConfig.pageSize)}
                      onValueChange={(value) => setPageSize(Number(value))}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={String(paginationConfig.pageSize)} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {paginationConfig.pageSizeOptions.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Flex>
                )}
              </Flex>

              <PaginationNav
                currentPage={paginationConfig.page}
                totalPages={totalPages}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
                onPageChange={setCurrentPage}
                onPreviousPage={previousPage}
                onNextPage={nextPage}
              />
            </Flex>
          )}
        </>
      )}
    </Stack>
  );
}

// Export skeleton for direct use
export { DataTableSkeleton } from './data-table-skeleton';
