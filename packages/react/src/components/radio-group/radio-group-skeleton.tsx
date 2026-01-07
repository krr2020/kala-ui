/**
 * Radio Group Skeleton Component
 *
 * Loading placeholder for the Radio Group component.
 * Matches radio button layout with vertical/horizontal orientation.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface RadioGroupSkeletonConfig {
	/**
	 * Number of radio options
	 */
	optionCount?: number;
	/**
	 * Layout orientation
	 */
	orientation?: "vertical" | "horizontal";
	/**
	 * Show description for each option
	 */
	showDescription?: boolean;
}

export interface RadioGroupSkeletonProps extends RadioGroupSkeletonConfig {
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
 * Radio Group skeleton component
 *
 * @example
 * ```tsx
 * <RadioGroupSkeleton optionCount={3} orientation="vertical" />
 *
 * <RadioGroupSkeleton orientation="horizontal" showDescription />
 * ```
 */
export function RadioGroupSkeleton({
	optionCount = 3,
	orientation = "vertical",
	showDescription = false,
	className,
	"data-testid": dataTestId,
}: RadioGroupSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "radio-group-skeleton"}
			className={cn(
				"flex",
				orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-4",
				className,
			)}
		>
			{Array.from({ length: optionCount }).map((_, i) => (
				<div
					key={`radio-option-${i}`}
					className={cn(
						"flex items-start gap-2",
						showDescription && "flex-col",
					)}
				>
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
						<Skeleton className="h-4 w-24" />
					</div>
					{showDescription && <Skeleton className="h-3 w-32 ml-6" />}
				</div>
			))}
		</div>
	);
}
