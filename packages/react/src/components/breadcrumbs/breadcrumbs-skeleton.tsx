/**
 * Breadcrumbs Skeleton Component
 *
 * Loading placeholder for the Breadcrumbs component.
 * Supports variable depth with separators.
 */

import { Fragment } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface BreadcrumbsSkeletonConfig {
	/**
	 * Number of breadcrumb levels
	 * @default 3
	 */
	depth?: number;
	/**
	 * Show home icon
	 * @default false
	 */
	showHome?: boolean;
	/**
	 * Separator character
	 * @default '/'
	 */
	separator?: string;
}

export interface BreadcrumbsSkeletonProps extends BreadcrumbsSkeletonConfig {
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
 * Breadcrumbs skeleton component
 *
 * @example
 * ```tsx
 * <BreadcrumbsSkeleton depth={3} />
 *
 * <BreadcrumbsSkeleton depth={4} showHome separator=">" />
 * ```
 */
export function BreadcrumbsSkeleton({
	depth = 3,
	showHome = false,
	separator = "/",
	className,
	"data-testid": dataTestId,
}: BreadcrumbsSkeletonProps) {
	return (
		<nav
			data-testid={dataTestId || "breadcrumbs-skeleton"}
			className={cn("flex items-center gap-2 text-sm", className)}
			aria-label="Loading breadcrumbs"
			aria-busy="true"
		>
			{showHome && (
				<>
					<Skeleton className="h-4 w-4" />
					<span className="text-muted-foreground">{separator}</span>
				</>
			)}
			{Array.from({ length: depth }).map((_, i) => (
				<Fragment key={`crumb-${i}`}>
					<Skeleton className="h-4 w-20" />
					{i < depth - 1 && (
						<span className="text-muted-foreground">{separator}</span>
					)}
				</Fragment>
			))}
		</nav>
	);
}
