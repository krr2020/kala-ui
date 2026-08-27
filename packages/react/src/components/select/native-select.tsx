"use client";

import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "../../lib/utils";

export interface NativeSelectProps
	extends Omit<React.ComponentProps<"select">, "size"> {
	/**
	 * Size variant
	 * @default "md"
	 */
	size?: "sm" | "md";
	/**
	 * Error state styling
	 */
	error?: boolean;
}

function NativeSelect({
	ref,
	className,
	size = "md",
	error,
	children,
	disabled,
	...props
}: NativeSelectProps) {
	return (
		<div className="relative w-full">
			<select
				ref={ref}
				disabled={disabled}
				className={cn(
					"w-full rounded-md border bg-background text-sm transition-colors kala-surface-input",
					"kala-focus-ring",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"appearance-none pr-10",
					{
						"h-9 px-3 py-2": size === "md",
						"h-8 px-2 py-1 text-xs": size === "sm",
						"border-destructive kala-focus-ring-destructive": error,
					},
					className,
				)}
				{...props}
			>
				{children}
			</select>
			<div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
				<ChevronDown
					className={cn("opacity-70", size === "sm" ? "size-3" : "size-4")}
					aria-hidden="true"
				/>
			</div>
		</div>
	);
}

export interface NativeSelectOptionProps
	extends React.ComponentProps<"option"> {}

function NativeSelectOption({
	ref,
	className,
	...props
}: NativeSelectOptionProps) {
	return <option ref={ref} {...props} />;
}

export interface NativeSelectOptGroupProps
	extends React.ComponentProps<"optgroup"> {}

function NativeSelectOptGroup({
	ref,
	className,
	...props
}: NativeSelectOptGroupProps) {
	return <optgroup ref={ref} className={className} {...props} />;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
