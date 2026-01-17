/**
 * Table Skeleton Component
 * Provides a loading placeholder that matches the actual Table component structure
 * to prevent Cumulative Layout Shift (CLS)
 */

import {
	tableBodyStyles,
	tableCellStyles,
	tableHeaderStyles,
	tableHeadStyles,
	tableRowStyles,
} from "../../config/table";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface TableSkeletonProps {
	/**
	 * Number of rows to display (default: 5)
	 */
	rows?: number;
	/**
	 * Number of columns to display (default: 4)
	 */
	columns?: number;
	/**
	 * Column headers (optional - shows actual headers or skeletons)
	 */
	headers?: string[];
	/**
	 * Column widths to match actual table layout (prevents CLS)
	 */
	columnWidths?: string[];
	/**
	 * Whether to show action column
	 */
	showActions?: boolean;
	/**
	 * Whether to show selection checkboxes
	 */
	showCheckboxes?: boolean;
	/**
	 * Whether header should be sticky
	 */
	stickyHeader?: boolean;
}

export function TableSkeleton({
	rows = 5,
	columns = 4,
	headers,
	columnWidths,
	showActions = false,
	showCheckboxes = false,
	stickyHeader = false,
}: TableSkeletonProps) {
	const _totalColumns = columns + (showActions ? 1 : 0);
	const displayHeaders = headers || Array(columns).fill("");

	// Use provided column widths or default to full width
	const getCellWidth = (index: number): string | undefined => {
		if (columnWidths && index < columnWidths.length) {
			return columnWidths[index];
		}
		// Calculate default width based on alignment to match typical column behavior
		return undefined; // Let CSS handle default width
	};

	return (
		<div className="relative w-full overflow-x-auto border rounded-lg bg-card theme-card shadow-sm">
			<table data-slot="table" className="w-full caption-bottom text-sm">
				<thead
					data-slot="table-header"
					className={cn(
						tableHeaderStyles.base,
						"bg-muted/50",
						stickyHeader && "sticky top-0 z-1",
					)}
				>
					<tr
						data-slot="table-row"
						className={cn(tableRowStyles.base, "border-0")}
					>
						{showCheckboxes && (
							<th
								data-slot="table-head"
								className={cn(tableHeadStyles.base, "w-12")}
							/>
						)}
						{displayHeaders.map((header, index) => (
							<th
								data-slot="table-head"
								className={tableHeadStyles.base}
								key={`header-${header || index}-${crypto.randomUUID()}`}
								style={{ width: getCellWidth(index) }}
							>
								{header || <Skeleton className="h-4 w-24" />}
							</th>
						))}
						{showActions && (
							<th
								data-slot="table-head"
								className={tableHeadStyles.base}
								key="actions-header"
							>
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody data-slot="table-body" className={tableBodyStyles.base}>
					{Array.from({ length: rows }).map(() => {
						const rowId = crypto.randomUUID();
						return (
							<tr
								key={rowId}
								data-slot="table-row"
								className={cn(tableRowStyles.base, "border-0")}
							>
								{showCheckboxes && (
									<td data-slot="table-cell" className={tableCellStyles.base}>
										<Skeleton className="h-4 w-4 rounded" />
									</td>
								)}
								{Array.from({ length: columns }).map((_, colIndex) => {
									const cellId = crypto.randomUUID();
									return (
										<td
											key={cellId}
											data-slot="table-cell"
											className={tableCellStyles.base}
										>
											<Skeleton
												className="h-4"
												style={{ width: getCellWidth(colIndex) || "100%" }}
											/>
										</td>
									);
								})}
								{showActions && (
									<td data-slot="table-cell" className={tableCellStyles.base}>
										<Skeleton className="h-8 w-8" />
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
