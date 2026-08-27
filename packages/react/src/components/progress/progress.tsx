"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";
import { cn } from "../../lib/utils";
import type { ProgressBarProps, ProgressProps } from "./progress.types";

type ProgressColor =
	| "primary"
	| "secondary"
	| "destructive"
	| "success"
	| "warning"
	| "info";
type ProgressSize = "sm" | "md" | "lg";

const sizeClasses: Record<ProgressSize, string> = {
	sm: "h-1",
	md: "h-2.5",
	lg: "h-4",
};

const colorClasses: Record<ProgressColor, string> = {
	primary: "bg-primary",
	secondary: "bg-secondary",
	destructive: "bg-destructive",
	success: "bg-success",
	warning: "bg-warning",
	info: "bg-info",
};

const stripedGradient =
	"bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]";

function Progress({
	ref,
	className,
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
	// Clamp value between min and max
	const clampedValue = Math.min(Math.max(value ?? 0, min), max);
	const percentage = ((clampedValue - min) / (max - min)) * 100;

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				"relative w-full overflow-hidden rounded-full bg-primary/20",
				sizeClasses[size],
				className,
			)}
			value={clampedValue}
			max={max}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					"h-full w-full flex-1 transition-all duration-500 ease-in-out",
					colorClasses[color],
					striped && stripedGradient,
					striped && "bg-size-[1rem_1rem]",
					animated && striped && "animate-progress-stripes",
				)}
				style={{ transform: `translateX(-${100 - percentage}%)` }}
			>
				{(label || showValue) && size !== "sm" && (
					<span
						className={cn(
							"flex h-full items-center justify-center text-xs font-medium",
							color === "primary" && "text-primary-foreground",
							color === "success" && "text-success-foreground",
							color === "info" && "text-info-foreground",
							color === "warning" && "text-warning-foreground",
							color === "destructive" && "text-destructive-foreground",
							size === "md" && "text-[10px]",
							size === "lg" && "text-xs",
						)}
					>
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
			ref={ref}
			role="presentation"
			className={cn(
				"relative w-full overflow-hidden rounded-full bg-primary/20 flex",
				sizeClasses[size],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export { Progress, ProgressBar, ProgressGroup };
