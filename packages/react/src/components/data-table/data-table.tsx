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

"use client";

import { useDisclosure } from "@kala-ui/react-hooks";
import {
	ArrowDown,
	ArrowUp,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Search,
	X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import { Box } from "../box";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { EmptyState } from "../empty-state";
import { Flex } from "../flex";
import { Input } from "../input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../select";
import { Stack } from "../stack";
import {
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "../table";
import { Text } from "../text";
import { ColumnHeaderFilter } from "./column-header-filter";
import type {
	DataTableProps,
	PaginationConfig,
	SearchConfig,
} from "./data-table.types";
import { DataTableSkeleton } from "./data-table-skeleton";
import { useTableState } from "./useTableState";

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
}: DataTableProps<TData>) {
	// Determine page size
	const pageSize = useMemo(() => {
		if (!pagination) return data.length;
		if (typeof pagination === "boolean") return 10;
		return pagination.pageSize;
	}, [pagination, data.length]);

	// Extract callbacks from configs
	const paginationCallback = useMemo(() => {
		if (!pagination || typeof pagination === "boolean") return undefined;
		return pagination.onChange;
	}, [pagination]);

	const totalCount = useMemo(() => {
		if (!pagination || typeof pagination === "boolean") return undefined;
		return pagination.total;
	}, [pagination]);

	const searchCallback = useMemo(() => {
		if (!searchable || typeof searchable === "boolean") return undefined;
		return searchable.onChange;
	}, [searchable]);

	// Table state management
	const tableState = useTableState<TData>({
		data: data,
		columns: columns,
		searchConfig: searchable,
		pageSize: pageSize,
		total: totalCount,
		defaultSort: defaultSort,
		defaultFilters: defaultFilters,
		onSortChange: onSortChange,
		onFilterChange: onFilterChange,
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
	const [selectedIds, setSelectedIds] = useState<Set<string>>(
		selection?.selectedIds ?? new Set(),
	);

	// Scroll container ref for scroll-to-top/bottom buttons
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [showScrollButtons, { set: setShowScrollButtons }] = useDisclosure(false);

	// Handle scroll event to show/hide scroll buttons
	const handleScroll = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				scrollContainerRef.current;
			setShowScrollButtons(scrollHeight > clientHeight && scrollTop > 100);
		}
	}, [setShowScrollButtons]);

	// Scroll to top/bottom functions
	const scrollToTop = useCallback(() => {
		scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const scrollToBottom = useCallback(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

	// Handle select all
	const isAllSelected = useMemo(() => {
		if (!selection || displayData.length === 0) return false;
		const selectableRows = displayData.filter(
			(row) => !selection.isRowSelectable || selection.isRowSelectable(row),
		);
		return selectableRows.every((row) =>
			selectedIds.has(selection.getRowId(row)),
		);
	}, [selection, displayData, selectedIds]);

	const isSomeSelected = useMemo(() => {
		if (!selection || displayData.length === 0) return false;
		const selectableRows = displayData.filter(
			(row) => !selection.isRowSelectable || selection.isRowSelectable(row),
		);
		return (
			selectableRows.some((row) => selectedIds.has(selection.getRowId(row))) &&
			!isAllSelected
		);
	}, [selection, displayData, selectedIds, isAllSelected]);

	const handleSelectAll = useCallback(() => {
		if (!selection) return;

		const newSelectedIds = new Set(selectedIds);
		const selectableRows = displayData.filter(
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
		if (typeof searchable === "boolean") {
			return {
				placeholder: "Search...",
				ariaLabel: "Search table",
			};
		}
		return {
			placeholder: searchable.placeholder ?? "Search...",
			ariaLabel: searchable.ariaLabel ?? "Search table",
			...searchable,
		};
	}, [searchable]);

	// Pagination config
	const paginationConfig: PaginationConfig | null = useMemo(() => {
		if (!pagination) return null;
		if (typeof pagination === "boolean") {
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
			// Use provided total if available, otherwise use processedData length
			total: pagination.total ?? processedData.length,
		};
	}, [pagination, currentPage, currentPageSize, processedData.length]);

	// Render search input helper
	const renderSearchInput = (forceShow = false) => {
		if (!searchConfig) return null;

		// Hide search if no data and not searching (unless forceShow is true)
		if (data.length === 0 && !searchQuery && !forceShow) return null;

		return (
			<Box className="flex-1 max-w-sm">
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
								onClick={() => setSearchQuery("")}
								className="p-1 text-muted-foreground hover:text-foreground h-auto"
								aria-label="Clear search"
							>
								<X className="h-4 w-4" />
							</Button>
						) : null
					}
					aria-label={searchConfig.ariaLabel}
				/>
			</Box>
		);
	};

	// Render loading state
	if (isLoading) {
		// Use custom skeleton if provided
		if (skeleton) {
			return <Stack gap={4} className={className}>{skeleton}</Stack>;
		}

		// Use skeletonConfig if provided, otherwise fall back to legacy loadingConfig
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

	// Render empty state
	if (displayData.length === 0) {
		const defaultEmptyState = {
			title: searchQuery ? "No results found" : "No data available",
			description: searchQuery
				? `No results found for "${searchQuery}". Try adjusting your search.`
				: "There is no data to display at the moment.",
		};

		const emptyConfig = { ...defaultEmptyState, ...emptyState };

		return (
			<Stack gap={4} className={className}>
				{renderSearchInput()}
				<EmptyState
					title={emptyConfig.title}
					description={emptyConfig.description}
					{...(emptyConfig.icon && { icon: emptyConfig.icon })}
					{...(emptyConfig.action && { action: emptyConfig.action })}
				/>
			</Stack>
		);
	}

	return (
		<Stack
			className={cn(
				stickyFooter ? "h-full min-h-0" : "",
				className,
			)}
			aria-label={ariaLabel}
			role={ariaLabel ? "region" : undefined}
		>
			{/* Search and Bulk Actions */}
			{(searchConfig || bulkActions) && (
				<Flex
					align="center"
					justify="between"
					gap={4}
					className={cn("mb-4 flex-wrap", stickyFooter && "shrink-0")}
				>
					{/* Search */}
					{renderSearchInput()}

					{/* Bulk Actions - Always visible to prevent CLS */}
					{bulkActions && (
						<Flex align="center" gap={2} className="flex-wrap min-h-[36px]">
							<Text size="sm" className="text-muted-foreground">
								{selectedIds.size} selected
							</Text>
							{bulkActions.map((action) => (
								<Button
									key={action.id}
									variant={action.variant ?? "outline"}
									size="sm"
									onClick={() => action.onClick(selectedRows)}
									disabled={selectedIds.size === 0 || action.disabled}
									className={cn(
										selectedIds.size === 0 && "opacity-50 cursor-not-allowed",
									)}
								>
									{action.icon}
									{action.label}
								</Button>
							))}
						</Flex>
					)}
				</Flex>
			)}

			{/* Active Filters Chips */}
			{filterableColumns && filterConfigs.length > 0 && (
				<Flex
					align="center"
					gap={2}
					className={cn("mb-4 flex-wrap", stickyFooter && "shrink-0")}
				>
					<Text size="sm" className="text-muted-foreground">Active filters:</Text>
					{filterConfigs.map((filter) => {
						const column = filterableColumns.find(
							(fc) => fc.key === filter.key,
						);
						if (!column) return null;

						const filterValueArray = Array.isArray(filter.value)
							? filter.value
							: [filter.value];

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
											removeFilter(filter.key);
										} else {
											const newValues = filterValueArray.filter(
												(v) => v !== value,
											);
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
				</Flex>
			)}

			{/* Table Container */}
			<Box
				className={cn(
					"border relative overflow-hidden theme-card",
					stickyFooter && paginationConfig ? "flex-1 min-h-0" : "",
					bordered && "border-2",
					paginationConfig ? "rounded-t-lg border-b-0" : "rounded-lg",
				)}
			>
				<Box
					ref={scrollContainerRef}
					onScroll={handleScroll}
					className={cn(
						"overflow-auto relative",
						paginationConfig ? "rounded-t-lg" : "rounded-lg",
						stickyFooter ? "flex-1 min-h-0 max-h-[70vh]" : "max-h-[600px]",
					)}
				>
					<table className="w-full border-separate border-spacing-0 caption-bottom text-sm">
						{caption && <caption className="sr-only">{caption}</caption>}
						<TableHeader
							className={cn(
								stickyHeader && "sticky top-0 z-1 bg-muted/95 backdrop-blur-sm",
								"[&_tr]:border-0",
							)}
						>
							<TableRow className="border-0">
								{/* Selection column */}
								{selection?.enabled && (
									<TableHead
										className={cn(
											"w-12 rounded-tl-lg",
											stickyHeader
												? "border-b border-border-strong/50"
												: "border-b",
										)}
									>
										<Checkbox
											checked={
												isAllSelected
													? true
													: isSomeSelected
														? "indeterminate"
														: false
											}
											onCheckedChange={handleSelectAll}
											aria-label="Select all rows"
										/>
									</TableHead>
								)}

								{/* Data columns */}
								{columns.map((column, index) => {
									const isSorted =
										column.accessorKey &&
										sortConfig?.key === column.accessorKey;
									const sortDirection = isSorted ? sortConfig.direction : null;
									const canSort =
										column.enableSorting !== false && column.accessorKey;

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
												column.align === "center" && "text-center",
												column.align === "right" && "text-right",
												column.hideOnMobile && "hidden md:table-cell",
												stickyHeader
													? "border-b border-border-strong/50"
													: "border-b",
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
															toggleSort(column.accessorKey as keyof TData)
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
																className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-40"
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
														onFilterChange={setFilter}
														onFilterRemove={removeFilter}
													/>
												)}
											</Flex>
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
						<TableBody>
							{displayData.map((row, rowIndex) => {
								const isSelectable =
									!selection?.isRowSelectable || selection.isRowSelectable(row);
								const rowId = selection?.getRowId(row);
								const isSelected = rowId ? selectedIds.has(rowId) : false;
								const isClickable = !!onRowClick;
								const isLastRow = rowIndex === displayData.length - 1;

								return (
									<TableRow
										key={rowId ?? rowIndex}
										{...getRowAttributes?.(row)}
										data-state={isSelected ? "selected" : undefined}
										onClick={() => isClickable && onRowClick(row)}
										className={cn(
											isSelected && "bg-accent/50",
											striped && rowIndex % 2 === 0 && "bg-muted/50",
											hoverable && "hover:bg-muted/50",
											isClickable && "cursor-pointer",
											compact && "h-10",
											getRowClassName?.(row),
											"border-0",
										)}
										role={isClickable ? "button" : undefined}
										tabIndex={isClickable ? 0 : undefined}
										onKeyDown={(e) => {
											if (isClickable && (e.key === "Enter" || e.key === " ")) {
												e.preventDefault();
												onRowClick(row);
											}
										}}
									>
										{/* Selection cell */}
										{selection?.enabled && (
											<TableCell
												className={cn(
													(!isLastRow || (!!paginationConfig && !footer)) &&
													"border-b",
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
											const cellValue = column.accessorKey
												? row[column.accessorKey]
												: undefined;

											return (
												<TableCell
													key={column.id}
													className={cn(
														column.align === "center" && "text-center",
														column.align === "right" && "text-right",
														column.hideOnMobile && "hidden md:table-cell",
														compact && "py-2",
														(!isLastRow || (!!paginationConfig && !footer)) &&
														"border-b",
													)}
												>
													{column.cell
														? column.cell(row)
														: cellValue !== null && cellValue !== undefined
															? String(cellValue)
															: "—"}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>

						{/* Duplicate headers at bottom for long tables */}
						{headersBelow && displayData.length > 10 && (
							<TableHeader
								className={cn(
									"bg-muted border-t",
									stickyFooter &&
									"sticky bottom-0 z-40 shadow-[0_-1px_0_0_hsl(var(--border))] backdrop-blur-sm bg-muted/95",
								)}
							>
								<TableRow>
									{/* Selection column */}
									{selection?.enabled && (
										<TableHead className="w-12">
											<Checkbox
												checked={
													isAllSelected
														? true
														: isSomeSelected
															? "indeterminate"
															: false
												}
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
												column.align === "center" && "text-center",
												column.align === "right" && "text-right",
												stickyFooter && "",
											)}
										>
											<Flex
												align="center"
												gap={2}
												className={cn(
													column.align === "center" && "justify-center",
													column.align === "right" && "justify-end",
												)}
											>
												{column.enableSorting !== false ? (
													<Button
														variant="ghost"
														size="sm"
														className="h-auto p-0 -ml-2 justify-start font-medium hover:bg-transparent"
														onClick={() =>
															toggleSort(
																column.accessorKey ||
																(column.id as keyof TData),
															)
														}
														aria-label={`Sort by ${column.header}`}
													>
														{column.header}
														{sortConfig?.key ===
															(column.accessorKey || column.id) &&
															(sortConfig.direction === "asc" ? (
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
							<TableFooter
								className={cn("border-t", !!paginationConfig && "border-b")}
							>
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
					className={cn(
						"px-4 py-3 border rounded-b-lg bg-muted/30",
						stickyFooter && "shrink-0",
					)}
				>
					<Flex align="center" gap={4}>
						<Text size="sm" className="text-muted-foreground whitespace-nowrap">
							Showing{" "}
							<Text as="span" weight="medium" className="text-foreground inline">
								{Math.min(
									(paginationConfig.page - 1) * paginationConfig.pageSize + 1,
									paginationConfig.total,
								)}
							</Text>{" "}
							to{" "}
							<Text as="span" weight="medium" className="text-foreground inline">
								{Math.min(
									paginationConfig.page * paginationConfig.pageSize,
									paginationConfig.total,
								)}
							</Text>{" "}
							of{" "}
							<Text as="span" weight="medium" className="text-foreground inline">
								{paginationConfig.total}
							</Text>{" "}
							results
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

					<Flex align="center" gap={2}>
						<Button
							variant="outline"
							size="sm"
							onClick={previousPage}
							disabled={!hasPreviousPage}
							className="h-8 w-8 p-0"
						>
							<ChevronLeft className="h-4 w-4" />
							<Box as="span" className="sr-only">Previous page</Box>
						</Button>
						<Flex align="center" gap={1}>
							<Text size="sm" weight="medium">
								Page {paginationConfig.page} of {totalPages}
							</Text>
						</Flex>
						<Button
							variant="outline"
							size="sm"
							onClick={nextPage}
							disabled={!hasNextPage}
							className="h-8 w-8 p-0"
						>
							<ChevronRight className="h-4 w-4" />
							<Box as="span" className="sr-only">Next page</Box>
						</Button>
					</Flex>
				</Flex>
			)}
		</Stack>
	);
}

// Export skeleton for direct use
export { DataTableSkeleton } from "./data-table-skeleton";
