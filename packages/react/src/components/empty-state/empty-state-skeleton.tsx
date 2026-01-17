/**
 * Empty State Skeleton Component
 *
 * Loading placeholder for the Empty State component.
 * Provides zero-CLS skeleton state that matches actual empty state layout.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { EmptyStateSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonButton, SkeletonCircle } from "../skeleton/skeleton-patterns";

export interface EmptyStateSkeletonProps extends EmptyStateSkeletonConfig {
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
 * Empty State skeleton component
 *
 * @example
 * ```tsx
 * <EmptyStateSkeleton />
 *
 * <EmptyStateSkeleton showAction={true} />
 * ```
 */
export function EmptyStateSkeleton({
	showIcon = true,
	showAction = false,
	className,
	"data-testid": dataTestId,
}: EmptyStateSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "empty-state-skeleton"}
			className={cn(
				"flex flex-col items-center justify-center rounded-lg border p-8 text-center",
				className,
			)}
		>
			{/* Icon */}
			{showIcon && (
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<SkeletonCircle size="2.5rem" />
				</div>
			)}

			{/* Title */}
			<Skeleton className="mt-4 h-6 w-48" />

			{/* Description */}
			<Skeleton className="mb-4 mt-2 h-4 max-w-sm" />

			{/* Action Button */}
			{showAction && <SkeletonButton width="8rem" />}
		</div>
	);
}

/**
 * Compound component: EmptyState.Skeleton
 */
EmptyStateSkeleton.Skeleton = EmptyStateSkeleton;
