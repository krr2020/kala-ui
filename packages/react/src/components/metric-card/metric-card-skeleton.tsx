/**
 * Metric Card Skeleton Component
 *
 * Loading placeholder variants for the Metric Card component.
 * Provides zero-CLS skeleton states that match actual metric card layouts.
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Card } from "../card";
import { Skeleton } from "../skeleton";
import type { MetricCardSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonCircle } from "../skeleton/skeleton-patterns";

export interface MetricCardSkeletonProps extends MetricCardSkeletonConfig {
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
 * Metric Card skeleton component with multiple variants
 *
 * @example
 * ```tsx
 * <MetricCardSkeleton variant="default" />
 *
 * <MetricCardSkeleton variant="withIcon" />
 * ```
 */
export function MetricCardSkeleton({
	variant = "default",
	showIcon = false,
	showChange = true,
	className,
	"data-testid": dataTestId,
}: MetricCardSkeletonProps) {
	return (
		<Card
			ref={React.createRef<HTMLDivElement>()}
			data-testid={dataTestId || "metric-card-skeleton"}
			className={cn(className)}
		>
			<div className="p-6">
				{/* Header: title + optional icon */}
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-4 w-24" />
					{variant === "withIcon" || showIcon ? (
						<SkeletonCircle size="1.5rem" className="rounded-md" />
					) : null}
				</div>

				{/* Value */}
				<div className="mb-3">
					<Skeleton className="h-10 w-32" />
				</div>

				{/* Change/subtitle */}
				{(variant === "default" || showChange) && (
					<div className="text-sm">
						<Skeleton className="h-4 w-32" />
					</div>
				)}
			</div>
		</Card>
	);
}

/**
 * Compound component: MetricCard.Skeleton
 */
MetricCardSkeleton.Skeleton = MetricCardSkeleton;
