"use client";

import type * as React from "react";
import {
	tableBodyStyles,
	tableCaptionStyles,
	tableCellStyles,
	tableFooterStyles,
	tableHeaderStyles,
	tableHeadStyles,
	tableRowStyles,
} from "../../config/table";
import { cn } from "../../lib/utils";
import { Box } from "../box";
import { Skeleton } from "../skeleton";
import type { TableSkeletonConfig } from "./table.types";

// Table Skeleton component (defined inline to avoid circular dependencies)
function TableSkeleton({
	rows = 5,
	columns = 4,
	headers,
	showActions = false,
	showCheckboxes = false,
}: TableSkeletonConfig) {
	return (
		<Box className="relative w-full overflow-x-auto border rounded-lg bg-card theme-card">
			<table className="w-full caption-bottom text-sm">
				{headers ? (
					<thead className="border-b bg-muted/50">
						<tr>
							{showCheckboxes && (
								<th className="w-10 px-4 py-3 text-left">
									<Skeleton className="h-4 w-4" />
								</th>
							)}
							{headers.map((_header, i) => (
								<th key={i} className="px-4 py-3 text-left">
									<Skeleton className="h-4 w-24" />
								</th>
							))}
							{showActions && (
								<th className="w-16 px-4 py-3 text-right">
									<Skeleton className="ml-auto h-4 w-8" />
								</th>
							)}
						</tr>
					</thead>
				) : (
					<thead className="border-b bg-muted/50">
						<tr>
							{showCheckboxes && (
								<th className="w-10 px-4 py-3 text-left">
									<Skeleton className="h-4 w-4" />
								</th>
							)}
							{Array.from({ length: columns }).map((_, i) => (
								<th key={i} className="px-4 py-3 text-left">
									<Skeleton className="h-4 w-24" />
								</th>
							))}
							{showActions && (
								<th className="w-16 px-4 py-3 text-right">
									<Skeleton className="ml-auto h-4 w-8" />
								</th>
							)}
						</tr>
					</thead>
				)}
				<tbody className={tableBodyStyles.base}>
					{Array.from({ length: rows }).map((_, rowIndex) => (
						<tr
							key={rowIndex}
							className="border-b transition-colors hover:bg-muted/50"
						>
							{showCheckboxes && (
								<td className="w-10 px-4 py-3">
									<Skeleton className="h-4 w-4" />
								</td>
							)}
							{Array.from({ length: columns }).map((_, colIndex) => (
								<td key={colIndex} className="px-4 py-3">
									<Skeleton className="h-4 w-full max-w-[200px]" />
								</td>
							))}
							{showActions && (
								<td className="w-16 px-4 py-3 text-right">
									<Skeleton className="ml-auto h-4 w-8" />
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</Box>
	);
}

export interface TableProps extends React.ComponentProps<"table"> {
	/**
	 * Show loading skeleton instead of content
	 */
	isLoading?: boolean;
	/**
	 * Number of skeleton rows to show when loading (default: 5) - DEPRECATED: Use skeletonConfig
	 */
	loadingRows?: number;
	/**
	 * Number of skeleton columns to show when loading (default: 4) - DEPRECATED: Use skeletonConfig
	 */
	loadingColumns?: number;
	/**
	 * Show actions column in skeleton (default: false) - DEPRECATED: Use skeletonConfig
	 */
	loadingShowActions?: boolean;
	/**
	 * Headers to show in skeleton (optional) - DEPRECATED: Use skeletonConfig
	 */
	loadingHeaders?: string[];
	/**
	 * Skeleton configuration for advanced control (preferred)
	 */
	skeletonConfig?: TableSkeletonConfig;
	/**
	 * Custom skeleton override
	 */
	skeleton?: React.ReactNode;
}

function Table({
	className,
	isLoading,
	loadingRows = 5,
	loadingColumns = 4,
	loadingShowActions = false,
	loadingHeaders,
	skeletonConfig,
	skeleton,
	...props
}: TableProps) {
	// Render skeleton state directly
	if (isLoading) {
		// Use custom skeleton if provided
		if (skeleton) {
			return <>{skeleton}</>;
		}

		// Use skeletonConfig if provided, otherwise fall back to legacy props
		const config = skeletonConfig || {
			rows: loadingRows,
			columns: loadingColumns,
			headers: loadingHeaders,
			showActions: loadingShowActions,
		};

		return <TableSkeleton {...config} />;
	}

	return (
		<Box
			data-slot="table-container"
			className="relative w-full overflow-x-auto border rounded-lg bg-card theme-card"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</Box>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn(tableHeaderStyles.base, className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn(tableBodyStyles.base, className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(tableFooterStyles.base, className)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
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
}: React.ComponentProps<"th"> & {
	/** Optional translation key for header text */
	translationKey?: string;
	/** Indicates the column is sortable and the current sort direction */
	"aria-sort"?: "ascending" | "descending" | "none" | "other";
}) {
	return (
		<th
			data-slot="table-head"
			className={cn(tableHeadStyles.base, className)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
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
}: React.ComponentProps<"caption"> & {
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

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
	TableSkeleton,
};

// Compound component pattern - export Table as subcomponent
export type { TableSkeletonConfig } from "./table.types";

// Allow Table.Skeleton syntax (using Object.defineProperty on Table function)
Object.defineProperty(Table, "Skeleton", {
	get() {
		return TableSkeleton;
	},
	enumerable: true,
	configurable: true,
});
