/**
 * Metric Card Skeleton Component
 *
 * Loading placeholder variants for the Metric Card component.
 * Provides zero-CLS skeleton states that match actual metric card layouts.
 */

import { Card } from "@kala-ui/react/card";
import { cn } from "@kala-ui/react/lib/utils";
import type { MetricCardSkeletonConfig } from "@kala-ui/react/skeleton";
import { Skeleton, SkeletonCircle } from "@kala-ui/react/skeleton";
import * as React from "react";
import { metricCardSkeletonStyles } from "../../config/metric-card";

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
			data-kala-component="metric-card-skeleton"
			ref={React.createRef<HTMLDivElement>()}
			data-testid={dataTestId || "metric-card-skeleton"}
			className={cn(className)}
		>
			<div className={metricCardSkeletonStyles.body}>
				{/* Header: title + optional icon */}
				<div className={metricCardSkeletonStyles.head}>
					<Skeleton className={metricCardSkeletonStyles.title} />
					{variant === "withIcon" || showIcon ? (
						<SkeletonCircle
							size="1.5rem"
							className={metricCardSkeletonStyles.icon}
						/>
					) : null}
				</div>

				{/* Value */}
				<div className={metricCardSkeletonStyles.valueBlock}>
					<Skeleton className={metricCardSkeletonStyles.value} />
				</div>

				{/* Change/subtitle */}
				{(variant === "default" || showChange) && (
					<div className={metricCardSkeletonStyles.meta}>
						<Skeleton className={metricCardSkeletonStyles.metaLine} />
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
