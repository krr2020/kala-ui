/**
 * Field Skeleton Component
 *
 * Loading placeholder for the Field component wrapper.
 * Matches field label + control + helper text layout.
 */

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { FieldSkeletonConfig } from "../skeleton/skeleton.types";

export interface FieldSkeletonProps extends FieldSkeletonConfig {
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
 * Field skeleton component
 *
 * @example
 * ```tsx
 * <FieldSkeleton showLabel required showHelperText />
 *
 * <FieldSkeleton variant="error" showLabel />
 * ```
 */
export function FieldSkeleton({
	showLabel = true,
	required = false,
	showHelperText = false,
	controlHeight = "2.5rem",
	variant = "default",
	className,
	"data-testid": dataTestId,
}: FieldSkeletonProps) {
	return (
		<div
			data-testid={dataTestId || "field-skeleton"}
			className={cn("flex w-full flex-col gap-2", className)}
		>
			{/* Label */}
			{showLabel && (
				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-24" />
					{required && <Skeleton className="h-3 w-3 rounded-full" />}
				</div>
			)}

			{/* Control/Input */}
			<Skeleton
				className={cn(
					"w-full rounded-md",
					variant === "error" && "border-destructive",
				)}
				style={{ height: controlHeight }}
			/>

			{/* Helper text or error */}
			{showHelperText && (
				<Skeleton
					className={cn("h-3 w-48", variant === "error" && "bg-destructive/20")}
				/>
			)}
		</div>
	);
}
