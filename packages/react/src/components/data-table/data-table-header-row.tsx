/**
 * DataTableHeaderRow Component
 * Column headers with sort indicators and filter popovers for DataTable
 */

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Flex } from "../flex";
import { TableHead, TableHeader, TableRow } from "../table";
import { Text } from "../text";
import { ColumnHeaderFilter } from "./column-header-filter";
import type {
	ColumnDef,
	FilterableColumn,
	FilterConfig,
	SelectionConfig,
	SortConfig,
} from "./data-table.types";

interface DataTableHeaderRowProps<TData> {
	columns: ColumnDef<TData>[];
	selection?: SelectionConfig<TData>;
	sortConfig: SortConfig<TData> | null;
	onToggleSort: (key: keyof TData) => void;
	filterableColumns?: FilterableColumn<TData>[];
	filterConfigs: FilterConfig<TData>[];
	onSetFilter: (filter: FilterConfig<TData>) => void;
	onRemoveFilter: (key: keyof TData) => void;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	onSelectAll: () => void;
	stickyHeader: boolean;
}

export function DataTableHeaderRow<TData>({
	columns,
	selection,
	sortConfig,
	onToggleSort,
	filterableColumns,
	filterConfigs,
	onSetFilter,
	onRemoveFilter,
	isAllSelected,
	isSomeSelected,
	onSelectAll,
	stickyHeader,
}: DataTableHeaderRowProps<TData>) {
	return (
		<TableHeader
			className={
				stickyHeader
					? "sticky top-0 z-1 bg-muted/95 backdrop-blur-sm [&_tr]:border-0"
					: "[&_tr]:border-0"
			}
		>
			<TableRow className="border-0">
				{/* Selection column */}
				{selection?.enabled && (
					<TableHead
						className={
							stickyHeader
								? "w-12 rounded-tl-lg border-b border-border-strong/50"
								: "w-12 rounded-tl-lg border-b"
						}
					>
						<Checkbox
							checked={
								isAllSelected ? true : isSomeSelected ? "indeterminate" : false
							}
							onCheckedChange={onSelectAll}
							aria-label="Select all rows"
						/>
					</TableHead>
				)}

				{/* Data columns */}
				{columns.map((column, index) => {
					const isSorted =
						column.accessorKey && sortConfig?.key === column.accessorKey;
					const sortDirection = isSorted ? sortConfig.direction : null;
					const canSort = column.enableSorting !== false && column.accessorKey;

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
								column.align === "center" && "text-center",
								column.align === "right" && "text-right",
								column.hideOnMobile && "hidden md:table-cell",
								stickyHeader ? "border-b border-border-strong/50" : "border-b",
								isFirst && "rounded-tl-lg",
								isLast && "rounded-tr-lg",
							)}
							aria-sort={
								isSorted && sortDirection
									? sortDirection === "asc"
										? "ascending"
										: "descending"
									: "none"
							}
						>
							<Flex
								align="center"
								gap={1}
								className={cn(
									column.align === "center" && "justify-center",
									column.align === "right" && "justify-end",
								)}
							>
								{canSort && column.accessorKey ? (
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											onToggleSort(column.accessorKey as keyof TData)
										}
										className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-accent font-semibold text-foreground hover:text-accent-foreground"
										aria-label={
											column.ariaLabel
												? `Sort by ${column.ariaLabel}`
												: `Sort by ${column.header}`
										}
									>
										{column.header}
										{isSorted ? (
											sortDirection === "asc" ? (
												<ChevronUp
													className="ml-2 h-4 w-4"
													aria-hidden="true"
												/>
											) : (
												<ChevronDown
													className="ml-2 h-4 w-4"
													aria-hidden="true"
												/>
											)
										) : (
											<ChevronDown
												className="ml-2 h-4 w-4 opacity-40"
												aria-hidden="true"
											/>
										)}
									</Button>
								) : (
									<Text weight="semibold" className="text-muted-foreground">
										{column.header}
									</Text>
								)}
								{filterColumn && (
									<ColumnHeaderFilter
										column={filterColumn}
										activeFilters={filterConfigs}
										onFilterChange={onSetFilter}
										onFilterRemove={onRemoveFilter}
									/>
								)}
							</Flex>
						</TableHead>
					);
				})}
			</TableRow>
		</TableHeader>
	);
}
