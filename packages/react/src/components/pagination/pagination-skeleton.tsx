/**
 * Pagination Skeleton Component
 *
 * Loading placeholder for the Pagination component.
 * Shows page buttons and navigation controls.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface PaginationSkeletonConfig {
	/**
	 * Number of page buttons to show
	 * @default 5
	 */
	pageCount?: number;
	/**
	 * Show prev/next buttons
	 * @default true
	 */
	showPrevNext?: boolean;
	/**
	 * Show info text (e.g., "1-10 of 100")
	 * @default false
	 */
	showInfo?: boolean;
}

export interface PaginationSkeletonProps extends PaginationSkeletonConfig {
	/**
	 * Additional className for the skeleton container
	 */
	className?: string;
	/**
	 * Test ID for querying the element
	 */
	"data-testid"?: string;
}

/**
 * Pagination skeleton component
 *
 * @example
 * ```tsx
 * <PaginationSkeleton pageCount={5} />
 *
 * <PaginationSkeleton showInfo showPrevNext />
 * ```
 */
export function PaginationSkeleton({
	pageCount = 5,
	showPrevNext = true,
	showInfo = false,
	className,
	"data-testid": dataTestId,
}: PaginationSkeletonProps) {
	return (
		<nav
			data-testid={dataTestId || "pagination-skeleton"}
			className={cn("flex items-center gap-4", className)}
			aria-label="Loading pagination"
			aria-busy="true"
		>
			{/* Info text */}
			{showInfo && <Skeleton className="h-4 w-32" />}

			{/* Pagination controls */}
			<div className="flex items-center gap-1">
				{/* Previous button */}
				{showPrevNext && <Skeleton className="h-9 w-9" />}

				{/* Page buttons */}
				{Array.from({ length: pageCount }).map((_, i) => (
					<Skeleton key={`page-${i}`} className="h-9 w-9" />
				))}

				{/* Next button */}
				{showPrevNext && <Skeleton className="h-9 w-9" />}
			</div>
		</nav>
	);
}
