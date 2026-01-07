/**
 * Sidebar Skeleton Component
 *
 * Loading placeholder for the Sidebar component.
 * Supports sections, header, footer, and collapsed state.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface SidebarSkeletonConfig {
	/**
	 * Whether sidebar is collapsed
	 * @default false
	 */
	collapsed?: boolean;
	/**
	 * Show header/logo area
	 * @default true
	 */
	showHeader?: boolean;
	/**
	 * Show footer/user profile
	 * @default true
	 */
	showFooter?: boolean;
	/**
	 * Number of navigation sections
	 * @default 3
	 */
	sectionCount?: number;
	/**
	 * Items per section
	 * @default 4
	 */
	itemsPerSection?: number;
}

export interface SidebarSkeletonProps extends SidebarSkeletonConfig {
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
 * Sidebar skeleton component
 *
 * @example
 * ```tsx
 * <SidebarSkeleton sectionCount={3} itemsPerSection={4} />
 *
 * <SidebarSkeleton collapsed />
 * ```
 */
export function SidebarSkeleton({
	collapsed = false,
	showHeader = true,
	showFooter = true,
	sectionCount = 3,
	itemsPerSection = 4,
	className,
	"data-testid": dataTestId,
}: SidebarSkeletonProps) {
	return (
		<aside
			data-testid={dataTestId || "sidebar-skeleton"}
			className={cn(
				"flex flex-col h-full bg-popover border-r",
				collapsed ? "w-16" : "w-64",
				className,
			)}
			aria-label="Loading sidebar"
			aria-busy="true"
		>
			{/* Header / Logo */}
			{showHeader && (
				<div className="flex items-center h-16 px-6 border-b">
					{collapsed ? (
						<Skeleton className="h-8 w-8 mx-auto" />
					) : (
						<Skeleton className="h-8 w-32" />
					)}
				</div>
			)}

			{/* Navigation sections */}
			<div className="flex-1 overflow-y-auto py-4 px-3">
				{Array.from({ length: sectionCount }).map((_, sectionIndex) => (
					<div key={sectionIndex} className="mb-6 last:mb-0">
						{/* Section label */}
						{!collapsed && (
							<Skeleton className="h-3 w-20 mb-2 mx-3" />
						)}

						{/* Section items */}
						<div className="space-y-2">
							{Array.from({ length: itemsPerSection }).map((_, itemIndex) => (
								<div
									key={itemIndex}
									className={cn(
										"flex items-center px-3 py-2",
										collapsed ? "justify-center" : "gap-3",
									)}
								>
									{/* Icon */}
									<Skeleton className="h-5 w-5 flex-shrink-0" />

									{/* Label */}
									{!collapsed && <Skeleton className="h-4 flex-1" />}

									{/* Badge */}
									{!collapsed && itemIndex === 0 && (
										<Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Footer / User profile */}
			{showFooter && (
				<div className="p-4 border-t">
					<div
						className={cn(
							"flex items-center",
							collapsed ? "justify-center" : "gap-3",
						)}
					>
						{/* Avatar */}
						<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

						{/* User info */}
						{!collapsed && (
							<div className="flex-1 min-w-0">
								<Skeleton className="h-4 w-24 mb-1" />
								<Skeleton className="h-3 w-32" />
							</div>
						)}
					</div>
				</div>
			)}
		</aside>
	);
}
