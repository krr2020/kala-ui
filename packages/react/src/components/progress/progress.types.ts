import type * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

type ProgressColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info";
type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps
	extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	/**
	 * Progress value (0-100)
	 */
	value?: number;
	/**
	 * Maximum value
	 * @default 100
	 */
	max?: number;
	/**
	 * Minimum value
	 * @default 0
	 */
	min?: number;
	/**
	 * Color variant
	 * @default "default"
	 */
	color?: ProgressColor;
	/**
	 * Size variant
	 * @default "md"
	 */
	size?: ProgressSize;
	/**
	 * Show striped pattern
	 * @default false
	 */
	striped?: boolean;
	/**
	 * Animate striped pattern
	 * @default false
	 */
	animated?: boolean;
	/**
	 * Label to display inside progress bar
	 */
	label?: string;
	/**
	 * Show value as percentage
	 * @default false
	 */
	showValue?: boolean;
}

export interface ProgressBarProps {
	value: number;
	color?: ProgressColor;
	striped?: boolean;
	animated?: boolean;
	label?: string;
	className?: string;
}
