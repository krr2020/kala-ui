/**
 * DataTableFilterChips Component
 * Active filter badges with remove/clear actions for DataTable
 */

'use client';

import { X } from 'lucide-react';

import { Badge } from '../badge';
import { Button } from '../button';
import { Flex } from '../flex';
import { Text } from '../text';
import type { FilterableColumn, FilterConfig } from './data-table.types';

interface DataTableFilterChipsProps<TData> {
  filterConfigs: FilterConfig<TData>[];
  filterableColumns: FilterableColumn<TData>[];
  onSetFilter: (filter: FilterConfig<TData>) => void;
  onRemoveFilter: (key: keyof TData) => void;
  onClearFilters: () => void;
}

export function DataTableFilterChips<TData>({
  filterConfigs,
  filterableColumns,
  onSetFilter,
  onRemoveFilter,
  onClearFilters,
}: DataTableFilterChipsProps<TData>) {
  if (filterConfigs.length === 0) return null;

  return (
    <Flex align="center" gap={2} className="mb-4 flex-wrap">
      <Text size="sm" className="text-muted-foreground">
        Active filters:
      </Text>
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
            <Text size="xs" weight="medium">
              {column.label}: {String(value)}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (filterValueArray.length === 1) {
                  onRemoveFilter(filter.key);
                } else {
                  const newValues = filterValueArray.filter((v) => v !== value);
                  onSetFilter({
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
        onClick={onClearFilters}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </Flex>
  );
}
