/**
 * Alert Skeleton Component
 *
 * Loading placeholder for the Alert component.
 * Provides zero-CLS skeleton state that matches actual alert layout.
 */

import { alertStyles } from "../../config/alert";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { AlertSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonCircle } from "../skeleton/skeleton-patterns";

export interface AlertSkeletonProps extends AlertSkeletonConfig {
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
 * Alert skeleton component
 *
 * @example
 * ```tsx
 * <AlertSkeleton />
 *
 * <AlertSkeleton variant="warning" showIcon={true} />
 * ```
 */
export function AlertSkeleton({
	variant = "primary",
	showIcon = true,
	className,
	"data-testid": dataTestId,
}: AlertSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "alert-skeleton"}
			role="alert"
			className={cn(
				alertStyles.base,
				variant &&
					alertStyles.compoundVariants?.find(
						(v) => v.variant === variant && v.style === "default",
					)?.className,
				className,
			)}
		>
			{showIcon && <SkeletonCircle size="1rem" className="rounded-md" />}
			<div className="flex-1">
				<Skeleton className="h-5 w-48 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>
		</div>
	);
}

/**
 * Compound component: Alert.Skeleton
 */
AlertSkeleton.Skeleton = AlertSkeleton;
