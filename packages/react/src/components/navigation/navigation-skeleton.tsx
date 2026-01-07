/**
 * Navigation Skeleton Component
 *
 * Loading placeholder for the Navigation component.
 * Supports horizontal and vertical layouts with configurable items.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface NavigationSkeletonConfig {
	/**
	 * Orientation of the navigation
	 * @default 'horizontal'
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * Number of navigation items
	 * @default 5
	 */
	itemCount?: number;
	/**
	 * Show icon skeletons
	 * @default false
	 */
	showIcons?: boolean;
	/**
	 * Show badge skeletons
	 * @default false
	 */
	showBadges?: boolean;
	/**
	 * Show nested navigation items
	 * @default false
	 */
	nested?: boolean;
}

export interface NavigationSkeletonProps extends NavigationSkeletonConfig {
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
 * Navigation skeleton component
 *
 * @example
 * ```tsx
 * <NavigationSkeleton orientation="horizontal" itemCount={5} />
 *
 * <NavigationSkeleton orientation="vertical" showIcons showBadges />
 * ```
 */
export function NavigationSkeleton({
	orientation = "horizontal",
	itemCount = 5,
	showIcons = false,
	showBadges = false,
	nested = false,
	className,
	"data-testid": dataTestId,
}: NavigationSkeletonProps) {
	return (
		<nav
			data-testid={dataTestId || "navigation-skeleton"}
			className={cn(
				"flex",
				orientation === "vertical" ? "flex-col gap-2" : "flex-row gap-6",
				className,
			)}
			aria-label="Loading navigation"
			aria-busy="true"
		>
			{Array.from({ length: itemCount }).map((_, i) => (
				<div
					key={`nav-${i}`}
					className={cn(
						"flex items-center",
						orientation === "vertical" ? "gap-3 px-3 py-2" : "gap-2",
					)}
				>
					{showIcons && (
						<Skeleton
							className={cn(
								"flex-shrink-0",
								orientation === "vertical" ? "h-5 w-5" : "h-4 w-4",
							)}
						/>
					)}
					<Skeleton
						className={cn(
							"h-4",
							orientation === "vertical" ? "w-24 flex-1" : "w-20",
						)}
					/>
					{showBadges && (
						<Skeleton className="h-4 w-4 rounded-full ml-auto flex-shrink-0" />
					)}
				</div>
			))}

			{/* Nested items */}
			{nested && orientation === "vertical" && (
				<div className="ml-8 space-y-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={`nested-${i}`} className="flex items-center gap-3 px-3 py-2">
							{showIcons && <Skeleton className="h-4 w-4 flex-shrink-0" />}
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			)}
		</nav>
	);
}
