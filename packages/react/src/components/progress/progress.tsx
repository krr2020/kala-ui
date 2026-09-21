"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";
import { progressStyles } from "../../config/progress";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { ProgressBarProps, ProgressProps } from "./progress.types";

type ProgressSize = "sm" | "md" | "lg";

const sizeClasses = progressStyles.sizes;

const colorClasses = progressStyles.colors;

const stripedGradient = progressStyles.stripedGradient;

function Progress({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	value = 0,
	max = 100,
	min = 0,
	color = "primary",
	size = "md",
	striped = false,
	animated = false,
	label,
	showValue = false,
	...props
}: ProgressProps) {
	const slotStyles = useSlotStyles("progress", slotStylesRaw);
	// Clamp value between min and max
	const clampedValue = Math.min(Math.max(value ?? 0, min), max);
	const percentage = ((clampedValue - min) / (max - min)) * 100;

	const root = applySlot(
		cn(progressStyles.root, sizeClasses[size], className),
		slotStyles?.root,
	);
	const indicator = applySlot(
		cn(
			progressStyles.indicator,
			colorClasses[color],
			striped && stripedGradient,
			striped && "bg-size-[1rem_1rem]",
			animated && striped && "animate-progress-stripes",
		),
		slotStyles?.indicator,
	);
	const valueLabel = applySlot(
		cn(
			progressStyles.valueLabel,
			color === "primary" && "text-primary-foreground",
			color === "success" && "text-success-foreground",
			color === "info" && "text-info-foreground",
			color === "warning" && "text-warning-foreground",
			color === "destructive" && "text-destructive-foreground",
			size === "md" && "text-[10px]",
			size === "lg" && "text-xs",
		),
		slotStyles?.label,
	);

	return (
		<ProgressPrimitive.Root
			data-kala-component="progress"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			value={clampedValue}
			max={max}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={indicator.className}
				style={mergeStyle(
					{ transform: `translateX(-${100 - percentage}%)` },
					indicator.style,
				)}
			>
				{(label || showValue) && size !== "sm" && (
					<span className={valueLabel.className} style={valueLabel.style}>
						{label || (showValue && `${Math.round(percentage)}%`)}
					</span>
				)}
			</ProgressPrimitive.Indicator>
		</ProgressPrimitive.Root>
	);
}

/**
 * ProgressBar for use in multiple bar scenarios
 */
function ProgressBar({
	ref,
	value,
	color = "primary",
	striped = false,
	animated = false,
	label,
	className,
}: ProgressBarProps) {
	return (
		<div
			data-kala-component="progress-bar"
			ref={ref}
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
			className={cn(
				"h-full transition-all duration-500 ease-in-out flex items-center justify-center",
				colorClasses[color],
				striped && stripedGradient,
				striped && "bg-size-[1rem_1rem]",
				animated && striped && "animate-progress-stripes",
				className,
			)}
			style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
		>
			{label && (
				<span
					className={cn(
						"text-xs font-medium px-2",
						color === "primary" && "text-primary-foreground",
						color === "success" && "text-success-foreground",
						color === "info" && "text-info-foreground",
						color === "warning" && "text-warning-foreground",
						color === "destructive" && "text-destructive-foreground",
					)}
				>
					{label}
				</span>
			)}
		</div>
	);
}

/**
 * Container for multiple progress bars
 */
function ProgressGroup({
	ref,
	className,
	size = "md",
	children,
	...props
}: React.ComponentProps<"div"> & { size?: ProgressSize }) {
	return (
		<div
			data-kala-component="progress-group"
			ref={ref}
			role="presentation"
			className={cn(progressStyles.group, sizeClasses[size], className)}
			{...props}
		>
			{children}
		</div>
	);
}

export { Progress, ProgressBar, ProgressGroup };
