/**
 * DataTableBodyRows Component
 * Table body rows with selection, cell rendering, and row interaction for DataTable
 */

'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils';
import { Checkbox } from '../checkbox';
import {
  TableBody,
  TableCell,
  TableRow,
} from '../table';
import type {
  ColumnDef,
  SelectionConfig,
} from './data-table.types';

interface DataTableBodyRowsProps<TData> {
  displayData: TData[];
  columns: ColumnDef<TData>[];
  selection?: SelectionConfig<TData>;
  selectedIds: Set<string>;
  onSelectRow: (row: TData) => void;
  onRowClick?: (row: TData) => void;
  compact: boolean;
  striped: boolean;
  hoverable: boolean;
  getRowClassName?: (row: TData) => string;
  getRowAttributes?: (row: TData) => HTMLAttributes<HTMLTableRowElement>;
  hasPagination: boolean;
  hasFooter: boolean;
}

export function DataTableBodyRows<TData>({
  displayData,
  columns,
  selection,
  selectedIds,
  onSelectRow,
  onRowClick,
  compact,
  striped,
  hoverable,
  getRowClassName,
  getRowAttributes,
  hasPagination,
  hasFooter,
}: DataTableBodyRowsProps<TData>) {
  return (
    <TableBody>
      {displayData.map((row, rowIndex) => {
        const isSelectable = !selection?.isRowSelectable || selection.isRowSelectable(row);
        const rowId = selection?.getRowId(row);
        const isSelected = rowId ? selectedIds.has(rowId) : false;
        const isClickable = !!onRowClick;
        const isLastRow = rowIndex === displayData.length - 1;

        const rowClassNames = cn(
          isSelected && 'bg-accent/50',
          striped && rowIndex % 2 === 0 && 'bg-muted/50',
          hoverable && 'hover:bg-muted/50',
          isClickable && 'cursor-pointer',
          compact && 'h-10',
          getRowClassName?.(row),
          'border-0',
        );

        return (
          <TableRow
            key={rowId ?? rowIndex}
            {...getRowAttributes?.(row)}
            data-state={isSelected ? 'selected' : undefined}
            onClick={() => isClickable && onRowClick(row)}
            className={rowClassNames}
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
                className={cn(!isLastRow || (hasPagination && !hasFooter)) && 'border-b'}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={!isSelectable}
                  aria-label={`Select row ${rowIndex + 1}`}
                  onCheckedChange={() => {
                    if (isSelectable) onSelectRow(row);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
            )}

            {/* Data cells */}
            {columns.map((column) => {
              const cellValue = column.accessorKey ? row[column.accessorKey] : undefined;

              const cellClassNames = cn(
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
                column.hideOnMobile && 'hidden md:table-cell',
                compact && 'py-2',
                (!isLastRow || (hasPagination && !hasFooter)) && 'border-b',
              );

              return (
                <TableCell key={column.id} className={cellClassNames}>
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
  );
}
