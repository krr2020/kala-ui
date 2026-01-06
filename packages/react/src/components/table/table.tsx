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

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
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
