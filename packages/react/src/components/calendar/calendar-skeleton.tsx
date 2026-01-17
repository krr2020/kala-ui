/**
 * Calendar Skeleton Component
 *
 * Loading placeholder for the Calendar component.
 * Displays month header and calendar grid.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

export interface CalendarSkeletonConfig {
	/**
	 * Show month/year header
	 * @default true
	 */
	showHeader?: boolean;
	/**
	 * Show day labels (S M T W T F S)
	 * @default true
	 */
	showDayLabels?: boolean;
	/**
	 * Number of weeks to show
	 * @default 5
	 */
	weekCount?: number;
}

export interface CalendarSkeletonProps extends CalendarSkeletonConfig {
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
 * Calendar skeleton component
 *
 * @example
 * ```tsx
 * <CalendarSkeleton />
 *
 * <CalendarSkeleton weekCount={6} />
 * ```
 */
export function CalendarSkeleton({
	showHeader = true,
	showDayLabels = true,
	weekCount = 5,
	className,
	"data-testid": dataTestId,
}: CalendarSkeletonProps) {
	const dayCount = weekCount * 7;

	return (
		<section
			data-testid={dataTestId || "calendar-skeleton"}
			className={cn("p-4", className)}
			aria-label="Loading calendar"
			aria-busy="true"
		>
			{/* Header - Month/Year */}
			{showHeader && (
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-4 w-4" /> {/* Prev button */}
					<Skeleton className="h-5 w-32" /> {/* Month Year */}
					<Skeleton className="h-4 w-4" /> {/* Next button */}
				</div>
			)}

			{/* Day labels */}
			{showDayLabels && (
				<div className="grid grid-cols-7 gap-2 mb-2">
					{["S", "M", "T", "W", "T", "F", "S"].map((_, i) => (
						<Skeleton key={`day-label-${i}`} className="h-8 w-8 mx-auto" />
					))}
				</div>
			)}

			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-2">
				{Array.from({ length: dayCount }).map((_, i) => (
					<Skeleton key={`day-${i}`} className="h-8 w-8 mx-auto rounded" />
				))}
			</div>
		</section>
	);
}
