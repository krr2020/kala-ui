/**
 * Combobox Skeleton Component
 *
 * Loading placeholder for the Combobox component.
 * Supports both single and multi-select appearances.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface ComboboxSkeletonConfig {
	/**
	 * Multi-select mode (shows selected tags)
	 */
	multiSelect?: boolean;
	/**
	 * Number of selected items to show (for multi-select)
	 */
	selectedCount?: number;
	/**
	 * Size variant
	 */
	size?: "sm" | "default";
}

export interface ComboboxSkeletonProps extends ComboboxSkeletonConfig {
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
 * Combobox skeleton component
 *
 * @example
 * ```tsx
 * <ComboboxSkeleton />
 *
 * <ComboboxSkeleton multiSelect selectedCount={3} />
 * ```
 */
export function ComboboxSkeleton({
	multiSelect = false,
	selectedCount = 2,
	size = "default",
	className,
	"data-testid": dataTestId,
}: ComboboxSkeletonProps) {
	const height = size === "sm" ? "h-9" : "h-10";

	return (
		<div
			data-testid={dataTestId || "combobox-skeleton"}
			className={cn(
				"flex items-center gap-2 border rounded-md px-3",
				height,
				className,
			)}
		>
			{/* Selected items (for multi-select) */}
			{multiSelect && (
				<div className="flex gap-1">
					{Array.from({ length: selectedCount }).map((_, i) => (
						<Skeleton key={`selected-${i}`} className="h-6 w-20 rounded-full" />
					))}
				</div>
			)}

			{/* Input/placeholder area */}
			<Skeleton className={cn("h-5 flex-1", multiSelect && "min-w-[8rem]")} />

			{/* Dropdown chevron */}
			<Skeleton className="h-4 w-4 flex-shrink-0" />
		</div>
	);
}
