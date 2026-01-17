/**
 * DataTable Skeleton Component
 * Provides a full-featured loading placeholder that matches the DataTable component structure
 * including search bar, filters, table with selections, and pagination
 */

import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { FieldLabel } from "../field";
import { Input } from "../input";
import { Select, SelectTrigger, SelectValue } from "../select";
import { Skeleton } from "../skeleton";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../table";
import type { ColumnDef } from "./data-table.types";

export interface DataTableSkeletonConfig<TData = unknown> {
	/**
	 * Number of skeleton rows to show (default: 5)
	 */
	rows?: number;
	/**
	 * Column definitions for accurate layout matching
	 */
	columns: ColumnDef<TData>[];
	/**
	 * Show search bar skeleton (default: true if searchable)
	 */
	showSearch?: boolean;
	/**
	 * Show filter pills skeleton (default: true if filterable)
	 */
	showFilters?: boolean;
	/**
	 * Number of filter pills to show (default: 3)
	 */
	filterCount?: number;
	/**
	 * Show pagination skeleton (default: true if pagination)
	 */
	showPagination?: boolean;
	/**
	 * Show selection checkboxes (default: false)
	 */
	showSelection?: boolean;
	/**
	 * Show bulk actions bar (default: false)
	 */
	showBulkActions?: boolean;
	/**
	 * Enable sticky header
	 */
	stickyHeader?: boolean;
	/**
	 * Enable sticky footer (for pagination)
	 */
	stickyFooter?: boolean;
}

export function DataTableSkeleton<TData = unknown>({
	rows = 5,
	columns,
	showSearch = false,
	showFilters = false,
	filterCount = 3,
	showPagination = false,
	showSelection = false,
	showBulkActions = false,
	stickyHeader = true,
	stickyFooter = false,
}: DataTableSkeletonConfig<TData>) {
	return (
		<div className="flex flex-col">
			{/* Search Bar Skeleton */}
			{showSearch && (
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 shrink-0">
					<div className="flex-1 max-w-sm">
						<Input
							type="search"
							placeholder="Search..."
							disabled
							className="opacity-50"
						/>
					</div>

					{/* Bulk Actions Bar Skeleton */}
					{showBulkActions && (
						<div className="flex items-center gap-2 flex-wrap min-h-[36px]">
							<span className="text-sm text-muted-foreground">0 selected</span>
							<Button
								variant="outline"
								size="sm"
								disabled
								className="opacity-50"
							>
								Edit
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled
								className="opacity-50"
							>
								Delete
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Active Filters Pills Skeleton */}
			{showFilters && (
				<div className="flex flex-wrap items-center gap-2 mb-4 shrink-0">
					<span className="text-sm text-muted-foreground">Active filters:</span>
					{Array.from({ length: filterCount }).map((_, i) => (
						<Badge
							key={`filter-${i}`}
							variant="secondary"
							className="gap-1.5 pl-2 pr-1 py-1 bg-primary/10 text-primary border-primary/20"
						>
							<span className="text-xs font-medium">Filter: Value</span>
							<Button
								variant="ghost"
								size="sm"
								disabled
								className="h-4 w-4 p-0 hover:bg-primary/20 rounded-sm"
							>
								<Skeleton className="h-3 w-3" />
							</Button>
						</Badge>
					))}
					<Button
						variant="ghost"
						size="sm"
						disabled
						className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
					>
						Clear all
					</Button>
				</div>
			)}

			{/* Table Container */}
			<div
				className={cn(
					"border relative overflow-hidden theme-card",
					showPagination ? "rounded-t-lg border-b-0" : "rounded-lg",
					stickyFooter ? "flex-1 min-h-0" : "",
				)}
			>
				<div
					className={cn(
						"overflow-auto relative",
						showPagination ? "rounded-t-lg" : "rounded-lg",
						stickyFooter ? "flex-1 min-h-0 max-h-[70vh]" : "max-h-[600px]",
					)}
				>
					<table className="w-full border-separate border-spacing-0 caption-bottom text-sm">
						<TableHeader
							className={cn(
								stickyHeader && "sticky top-0 z-1 bg-muted/95 backdrop-blur-sm",
								"[&_tr]:border-0",
							)}
						>
							<TableRow className="border-0">
								{/* Selection column */}
								{showSelection && (
									<TableHead
										className={cn(
											"w-12 rounded-tl-lg",
											stickyHeader
												? "border-b border-border-strong/50"
												: "border-b",
										)}
									>
										<Checkbox disabled />
									</TableHead>
								)}

								{/* Data columns */}
								{columns.map((column, index) => {
									const isFirst = !showSelection && index === 0;
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
										>
											<div
												className={cn(
													"flex items-center gap-1",
													column.align === "center" && "justify-center",
													column.align === "right" && "justify-end",
												)}
											>
												{/* Skeleton for column header or filter icon */}
												{column.enableFiltering ? (
													<>
														<Skeleton className="h-4 flex-1" />
														<Skeleton className="h-4 w-4" />
													</>
												) : (
													<Skeleton className="h-4 w-24" />
												)}
											</div>
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: rows }).map((_, rowIndex) => {
								const isLastRow = rowIndex === rows - 1;

								return (
									<TableRow key={rowIndex} className={cn("border-0")}>
										{/* Selection cell */}
										{showSelection && (
											<TableCell>
												<Checkbox
													disabled
													aria-label={`Select row ${rowIndex + 1}`}
												/>
											</TableCell>
										)}

										{/* Data cells */}
										{columns.map((column) => {
											return (
												<TableCell
													key={column.id}
													className={cn(
														column.align === "center" && "text-center",
														column.align === "right" && "text-right",
														column.hideOnMobile && "hidden md:table-cell",
														!isLastRow && "border-b",
													)}
												>
													<Skeleton className="h-4 w-32" />
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</table>
				</div>
			</div>

			{/* Pagination Skeleton */}
			{showPagination && (
				<div
					className={cn(
						"flex flex-col sm:flex-row items-center justify-between gap-4 bg-background px-4 py-3 rounded-b-lg theme-card border-x border-b",
						stickyFooter && "sticky bottom-0 z-1 shadow-xl bg-background",
					)}
				>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Skeleton className="h-4 w-48" />
					</div>

					<div className="flex items-center gap-2">
						{/* Page size selector */}
						<div className="flex items-center gap-2">
							<FieldLabel
								htmlFor="page-size"
								className="text-sm text-muted-foreground mb-0"
							>
								Rows per page:
							</FieldLabel>
							<Select disabled>
								<SelectTrigger className="w-20 h-9 text-foreground opacity-50">
									<SelectValue />
								</SelectTrigger>
							</Select>
						</div>

						{/* Page navigation */}
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="sm"
								disabled
								className="opacity-50"
							>
								<Skeleton className="h-4 w-4" />
							</Button>
							<span className="text-sm text-muted-foreground px-2">
								<Skeleton className="h-4 w-16 inline-block" />
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled
								className="opacity-50"
							>
								<Skeleton className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
