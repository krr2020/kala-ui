/**
 * Steps Skeleton Component
 *
 * Loading placeholder for the Steps/Stepper component.
 * Supports horizontal and vertical layouts with connectors.
 */

import { Fragment } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export interface StepsSkeletonConfig {
	/**
	 * Number of steps
	 * @default 4
	 */
	stepCount?: number;
	/**
	 * Orientation of the stepper
	 * @default 'horizontal'
	 */
	orientation?: "horizontal" | "vertical";
	/**
	 * Show step labels and descriptions
	 * @default true
	 */
	showLabels?: boolean;
}

export interface StepsSkeletonProps extends StepsSkeletonConfig {
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
 * Steps skeleton component
 *
 * @example
 * ```tsx
 * <StepsSkeleton stepCount={4} orientation="horizontal" />
 *
 * <StepsSkeleton stepCount={3} orientation="vertical" showLabels />
 * ```
 */
export function StepsSkeleton({
	stepCount = 4,
	orientation = "horizontal",
	showLabels = true,
	className,
	"data-testid": dataTestId,
}: StepsSkeletonProps) {
	return (
		<nav
			data-testid={dataTestId || "steps-skeleton"}
			className={cn(
				"flex",
				orientation === "vertical" ? "flex-col" : "flex-row items-center",
				className,
			)}
			aria-label="Loading steps"
			aria-busy="true"
		>
			{Array.from({ length: stepCount }).map((_, i) => (
				<Fragment key={`step-${i}`}>
					{/* Step */}
					<div
						className={cn(
							"flex items-center",
							orientation === "vertical" ? "gap-3" : "flex-col gap-2",
						)}
					>
						{/* Step indicator */}
						<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

						{/* Step label */}
						{showLabels && (
							<div
								className={cn(
									orientation === "vertical" ? "flex-1" : "text-center",
								)}
							>
								<Skeleton
									className={cn(
										"h-4 mb-1",
										orientation === "vertical" ? "w-24" : "w-20 mx-auto",
									)}
								/>
								<Skeleton
									className={cn(
										"h-3",
										orientation === "vertical" ? "w-32" : "w-24 mx-auto",
									)}
								/>
							</div>
						)}
					</div>

					{/* Connector */}
					{i < stepCount - 1 && (
						<Skeleton
							className={cn(
								"flex-shrink-0",
								orientation === "vertical"
									? "w-0.5 h-12 mx-5"
									: "h-0.5 w-16 mx-2",
							)}
						/>
					)}
				</Fragment>
			))}
		</nav>
	);
}
