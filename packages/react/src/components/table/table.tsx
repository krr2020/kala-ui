'use client';

import type * as React from 'react';

import {
  tableBodyStyles,
  tableCaptionStyles,
  tableCellStyles,
  tableFooterStyles,
  tableHeadStyles,
  tableHeaderStyles,
  tableRowStyles,
} from '../../config/table';
import { cn } from '../../lib/utils';
import { Skeleton } from '../skeleton';

export interface TableProps extends React.ComponentProps<'table'> {
  /**
   * Show loading skeleton instead of content
   */
  isLoading?: boolean;
  /**
   * Number of skeleton rows to show when loading (default: 5)
   */
  loadingRows?: number;
  /**
   * Number of skeleton columns to show when loading (default: 4)
   */
  loadingColumns?: number;
  /**
   * Show actions column in skeleton (default: false)
   */
  loadingShowActions?: boolean;
  /**
   * Headers to show in skeleton (optional)
   */
  loadingHeaders?: string[];
}

function Table({ 
  className, 
  isLoading,
  loadingRows = 5,
  loadingColumns = 4,
  loadingShowActions = false,
  loadingHeaders,
  ...props 
}: TableProps) {
  // Render skeleton state directly
  if (isLoading) {
    const totalColumns = loadingShowActions ? loadingColumns + 1 : loadingColumns;
    const displayHeaders = loadingHeaders || Array(loadingColumns).fill('');

    return (
      <div className="bg-card border rounded-lg shadow-sm">
        <table className={cn('w-full caption-bottom text-sm', className)}>
          <thead className={cn(tableHeaderStyles.base)}>
            <tr className={cn(tableRowStyles.base)}>
              {displayHeaders.map((header, index) => (
                <th key={`header-${header || index}-${crypto.randomUUID()}`} className={cn(tableHeadStyles.base)}>
                  {header || <Skeleton className="h-4 w-24" />}
                </th>
              ))}
              {loadingShowActions && (
                <th key="actions-header" className={cn(tableHeadStyles.base)}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={cn(tableBodyStyles.base)}>
            {Array.from({ length: loadingRows }).map(() => {
              const rowId = crypto.randomUUID();
              return (
                <tr key={rowId} className={cn(tableRowStyles.base)}>
                  {Array.from({ length: totalColumns }).map(() => {
                    const cellId = crypto.randomUUID();
                    return (
                      <td key={cellId} className={cn(tableCellStyles.base)}>
                        <Skeleton
                          className="h-4"
                          style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto border rounded-lg bg-card theme-card">
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(tableHeaderStyles.base, className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(tableBodyStyles.base, className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(tableFooterStyles.base, className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(tableRowStyles.base, className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  translationKey,
  ...props
}: React.ComponentProps<'th'> & {
  /** Optional translation key for header text */
  translationKey?: string;
  /** Indicates the column is sortable and the current sort direction */
  'aria-sort'?: 'ascending' | 'descending' | 'none' | 'other';
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(tableHeadStyles.base, className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(tableCellStyles.base, className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  emptyStateKey,
  paginationLabelKey,
  ...props
}: React.ComponentProps<'caption'> & {
  /** Optional translation key for empty state text */
  emptyStateKey?: string;
  /** Optional translation key for pagination label */
  paginationLabelKey?: string;
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(tableCaptionStyles.base, className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
