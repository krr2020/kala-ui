/**
 * DataTableToolbar Component
 * Search input, bulk actions, and custom toolbar content for DataTable
 */

'use client';

import { Search, X } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Box } from '../box';
import { Button } from '../button';
import { Flex } from '../flex';
import { Input } from '../input';
import { Text } from '../text';
import type { BulkAction, SearchConfig } from './data-table.types';

interface DataTableToolbarProps<TData> {
  searchConfig: SearchConfig<TData> | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bulkActions?: BulkAction<TData>[];
  selectedRows: TData[];
  selectedIdsCount: number;
  toolbarContent?: React.ReactNode;
  hasData: boolean;
  className?: string;
}

export function DataTableToolbar<TData>({
  searchConfig,
  searchQuery,
  onSearchChange,
  bulkActions,
  selectedRows,
  selectedIdsCount,
  toolbarContent,
  hasData,
  className,
}: DataTableToolbarProps<TData>) {
  const showSearch = searchConfig && (hasData || searchQuery);
  const showRight = toolbarContent || bulkActions;

  if (!showSearch && !showRight) return null;

  return (
    <Flex align="center" justify="between" gap={4} className={cn('mb-4 flex-wrap', className)}>
      {/* Search */}
      {showSearch && (
        <Box className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder={searchConfig!.placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            prefixIcon={<Search className="h-4 w-4" />}
            suffixIcon={
              searchQuery ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-muted-foreground hover:text-foreground h-auto"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null
            }
            aria-label={searchConfig!.ariaLabel}
          />
        </Box>
      )}

      {/* Right side: toolbar content + bulk actions */}
      {showRight && (
        <Flex align="center" gap={2} className="flex-wrap">
          {toolbarContent}
          {bulkActions && (
            <Flex align="center" gap={2} className="flex-wrap min-h-[36px]">
              <Text size="sm" className="text-muted-foreground">
                {selectedIdsCount} selected
              </Text>
              {bulkActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant ?? 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={selectedIdsCount === 0 || action.disabled}
                  className={selectedIdsCount === 0 ? 'opacity-50 cursor-not-allowed' : undefined}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}
