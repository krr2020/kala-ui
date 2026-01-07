/**
 * Popover Skeleton Component
 *
 * Loading placeholder for the Popover component.
 * Compact skeleton for small content areas.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface PopoverSkeletonConfig {
	/**
	 * Number of content rows
	 * @default 3
	 */
	contentRows?: number;
	/**
	 * Use compact spacing
	 * @default true
	 */
	compact?: boolean;
}

export interface PopoverSkeletonProps extends PopoverSkeletonConfig {
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
 * Popover skeleton component
 *
 * @example
 * ```tsx
 * <PopoverSkeleton contentRows={3} />
 *
 * <PopoverSkeleton contentRows={5} compact={false} />
 * ```
 */
export function PopoverSkeleton({
	contentRows = 3,
	compact = true,
	className,
	"data-testid": dataTestId,
}: PopoverSkeletonProps) {
	return (
		<aside
			data-testid={dataTestId || "popover-skeleton"}
			className={cn("space-y-2", compact ? "p-2" : "p-4", className)}
			aria-label="Loading popover"
			aria-busy="true"
		>
			{Array.from({ length: contentRows }).map((_, i) => (
				<Skeleton key={`content-${i}`} className="h-4 w-48" />
			))}
		</aside>
	);
}
