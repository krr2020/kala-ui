import type * as React from "react";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

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
	slotStyles?: SlotStyles;
}

/**
 * Skeleton component for loading placeholder
 *
 * Supports both pulse and fade modes for different loading states.
 */
	function Skeleton({
		ref,
		className,
		fade = false,
		fadeDuration = 300,
		style,
		slotStyles,
		"data-testid": dataTestId,
		...props
	}: SkeletonProps) {
		const root = applySlot(
			cn(
				"bg-muted dark:bg-muted/70 rounded-md",
				fade ? "animate-fade-in" : "animate-pulse",
				className,
			),
			slotStyles?.root,
		);
		const mergedStyle = mergeStyle(style, root.style);
		return (
			<div
				data-kala-component="skeleton"
				ref={ref}
				data-slot="skeleton"
				data-testid={dataTestId}
				className={root.className}
				style={{
					...mergedStyle,
					transitionDuration: fade
					? `${fadeDuration}ms`
					: mergedStyle?.transitionDuration,
				}}
			{...props}
		/>
	);
}

export { Skeleton };
