import * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.ComponentProps<"div"> {
	/**
	 * Enable fade transition instead of pulse animation
	 */
	fade?: boolean;
	/**
	 * Fade duration in milliseconds (default: 300)
	 */
	fadeDuration?: number;
	/**
	 * Test ID for querying the element
	 */
	"data-testid"?: string;
}

/**
 * Skeleton component for loading placeholder
 *
 * Supports both pulse and fade modes for different loading states.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
	(
		{
			className,
			fade = false,
			fadeDuration = 300,
			style,
			"data-testid": dataTestId,
			...props
		},
		ref,
	) => {
		return (
			<div
				ref={ref}
				data-slot="skeleton"
				data-testid={dataTestId}
				className={cn(
					"bg-muted dark:bg-muted/70 rounded-md",
					fade ? "animate-fade-in" : "animate-pulse",
					className,
				)}
				style={{
					...style,
					transitionDuration: fade
						? `${fadeDuration}ms`
						: style?.transitionDuration,
				}}
				{...props}
			/>
		);
	},
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
