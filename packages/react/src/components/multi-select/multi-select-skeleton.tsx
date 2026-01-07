/**
 * Multi-Select Skeleton Component
 *
 * Loading placeholder for the Multi-Select component.
 * Shows selected tags and input area.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface MultiSelectSkeletonConfig {
	/**
	 * Number of selected tags to show
	 */
	tagCount?: number;
	/**
	 * Size variant
	 */
	size?: "sm" | "default";
}

export interface MultiSelectSkeletonProps extends MultiSelectSkeletonConfig {
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
 * Multi-Select skeleton component
 *
 * @example
 * ```tsx
 * <MultiSelectSkeleton tagCount={3} />
 *
 * <MultiSelectSkeleton size="sm" />
 * ```
 */
export function MultiSelectSkeleton({
	tagCount = 3,
	size = "default",
	className,
	"data-testid": dataTestId,
}: MultiSelectSkeletonProps) {
	const minHeight = size === "sm" ? "min-h-9" : "min-h-10";

	return (
		<div
			data-testid={dataTestId || "multi-select-skeleton"}
			className={cn(
				"flex flex-wrap gap-2 border rounded-md p-2",
				minHeight,
				className,
			)}
		>
			{/* Selected tags */}
			{Array.from({ length: tagCount }).map((_, i) => (
				<Skeleton key={`tag-${i}`} className="h-6 w-24 rounded-full" />
			))}

			{/* Input placeholder */}
			<Skeleton className="h-5 w-32 flex-1" />
		</div>
	);
}
