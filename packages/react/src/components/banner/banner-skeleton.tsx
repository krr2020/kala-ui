/**
 * Banner Skeleton Component
 *
 * Loading placeholder for the Banner component.
 * Provides zero-CLS skeleton state that matches actual banner layout.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { BannerSkeletonConfig } from "../skeleton/skeleton.types";
import { SkeletonCircle } from "../skeleton/skeleton-patterns";

export interface BannerSkeletonProps extends BannerSkeletonConfig {
	/**
	 * Additional className for the skeleton container
	 */
	className?: string;
	/**
	 * Inline style for the skeleton container
	 */
	style?: React.CSSProperties;
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
	color = "info",
	showIcon = true,
	showCloseButton = true,
	className,
	style,
	"data-testid": dataTestId,
}: BannerSkeletonProps) {
	return (
		<div
			data-kala-component="banner-skeleton"
			data-testid={dataTestId || "banner-skeleton"}
			style={style}
			className={cn(
				"w-full px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
				color === "info" && "bg-info text-info-foreground",
				color === "warning" && "bg-warning text-warning-foreground",
				color === "destructive" && "bg-destructive text-destructive-foreground",
				color === "success" && "bg-success text-success-foreground",
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
