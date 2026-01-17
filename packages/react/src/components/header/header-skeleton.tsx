/**
 * Header Skeleton Component
 *
 * Loading placeholder for the Header component.
 * Matches logo + navigation + actions layout.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface HeaderSkeletonConfig {
	/**
	 * Show navigation items
	 * @default true
	 */
	showNavigation?: boolean;
	/**
	 * Number of navigation items
	 * @default 4
	 */
	navItemCount?: number;
	/**
	 * Show search input
	 * @default false
	 */
	showSearch?: boolean;
	/**
	 * Show notifications button
	 * @default false
	 */
	showNotifications?: boolean;
	/**
	 * Show user menu button
	 * @default true
	 */
	showUserMenu?: boolean;
}

export interface HeaderSkeletonProps extends HeaderSkeletonConfig {
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
 * Header skeleton component
 *
 * @example
 * ```tsx
 * <HeaderSkeleton showNavigation showSearch showUserMenu />
 *
 * <HeaderSkeleton navItemCount={5} showNotifications />
 * ```
 */
export function HeaderSkeleton({
	showNavigation = true,
	navItemCount = 4,
	showSearch = false,
	showNotifications = false,
	showUserMenu = true,
	className,
	"data-testid": dataTestId,
}: HeaderSkeletonProps) {
	return (
		<header
			data-testid={dataTestId || "header-skeleton"}
			className={cn(
				"flex items-center justify-between p-4 border-b bg-background",
				className,
			)}
		>
			{/* Logo */}
			<Skeleton className="h-8 w-32 flex-shrink-0" />

			{/* Navigation (desktop) */}
			{showNavigation && (
				<div className="hidden md:flex gap-6 flex-1 mx-8">
					{Array.from({ length: navItemCount }).map((_, i) => (
						<Skeleton key={`nav-${i}`} className="h-4 w-20" />
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center gap-3 flex-shrink-0">
				{/* Search */}
				{showSearch && (
					<Skeleton className="hidden sm:block h-9 w-64 rounded-full" />
				)}

				{/* Notifications */}
				{showNotifications && <Skeleton className="h-9 w-9 rounded-full" />}

				{/* User menu */}
				{showUserMenu && <Skeleton className="h-9 w-9 rounded-full" />}

				{/* Mobile menu trigger */}
				<Skeleton className="h-9 w-9 md:hidden" />
			</div>
		</header>
	);
}
