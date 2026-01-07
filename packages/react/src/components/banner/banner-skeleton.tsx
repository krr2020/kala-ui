/**
 * Banner Skeleton Component
 *
 * Loading placeholder for the Banner component.
 * Provides zero-CLS skeleton state that matches actual banner layout.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";
import { SkeletonCircle } from "../skeleton/skeleton-patterns";
import type { BannerSkeletonConfig } from "../skeleton/skeleton.types";

export interface BannerSkeletonProps extends BannerSkeletonConfig {
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
 * Banner skeleton component
 *
 * @example
 * ```tsx
 * <BannerSkeleton />
 *
 * <BannerSkeleton showIcon={true} showCloseButton={true} />
 * ```
 */
export function BannerSkeleton({
	variant = "info",
	showIcon = true,
	showCloseButton = true,
	className,
	"data-testid": dataTestId,
}: BannerSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "banner-skeleton"}
			className={cn(
				"w-full px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
				variant === "info" && "bg-info text-info-foreground",
				variant === "warning" && "bg-warning text-warning-foreground",
				variant === "error" && "bg-destructive text-destructive-foreground",
				variant === "success" && "bg-success text-success-foreground",
				className,
			)}
		>
			<div className="flex-1 flex items-center gap-3">
				{showIcon && <SkeletonCircle size="1rem" className="rounded-md" />}
				<Skeleton className="h-4 w-64" />
			</div>
			{showCloseButton && <Skeleton className="h-4 w-4 rounded" />}
		</div>
	);
}

/**
 * Compound component: Banner.Skeleton
 */
BannerSkeleton.Skeleton = BannerSkeleton;
