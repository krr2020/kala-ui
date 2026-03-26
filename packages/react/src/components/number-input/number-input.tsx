"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";
import type { NumberInputProps } from "./number-input.types";

function NumberInput({
	className,
	min,
	max,
	step = 1,
	value,
	defaultValue,
	onChange,
	disabled = false,
	size = "default",
	hasError = false,
	isLoading = false,
	ref,
	...props
}: NumberInputProps) {
	const [internalValue, setInternalValue] = React.useState<number | "">(
		defaultValue ?? "",
	);

	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : internalValue;

	const clamp = (val: number): number => {
		let clamped = val;
		if (min !== undefined) clamped = Math.max(min, clamped);
		if (max !== undefined) clamped = Math.min(max, clamped);
		return clamped;
	};

	const commit = (newValue: number | "") => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onChange?.(newValue === "" ? undefined : newValue);
	};

	const increment = () => {
		if (disabled) return;
		const base = typeof currentValue === "number" ? currentValue : (min ?? 0);
		commit(clamp(base + step));
	};

	const decrement = () => {
		if (disabled) return;
		const base = typeof currentValue === "number" ? currentValue : (min ?? 0);
		commit(clamp(base - step));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			increment();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			decrement();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		if (raw === "" || raw === "-") {
			commit("");
		} else {
			const parsed = Number(raw);
			if (!Number.isNaN(parsed)) {
				commit(parsed);
			}
		}
	};

	const handleBlur = () => {
		if (typeof currentValue === "number") {
			const clamped = clamp(currentValue);
			if (clamped !== currentValue) commit(clamped);
		}
	};

	if (isLoading) {
		return (
			<Skeleton
				className={cn(
					"w-full rounded-md",
					size === "sm" ? "h-8" : "h-10",
					className,
				)}
			/>
		);
	}

	const isAtMin =
		min !== undefined &&
		typeof currentValue === "number" &&
		currentValue <= min;
	const isAtMax =
		max !== undefined &&
		typeof currentValue === "number" &&
		currentValue >= max;

	return (
		<div
			data-slot="number-input"
			className={cn(
				"flex w-full rounded-md border bg-card theme-input transition-colors",
				"focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
				size === "sm" ? "h-8" : "h-10",
				hasError && "border-destructive focus-within:ring-destructive",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
		>
			<button
				type="button"
				tabIndex={-1}
				aria-label="Decrease value"
				onClick={decrement}
				disabled={disabled || isAtMin}
				className="flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-inherit"
			>
				<Minus
					aria-hidden="true"
					className={cn("stroke-2", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
				/>
			</button>

			<input
				ref={ref}
				type="number"
				aria-valuenow={
					typeof currentValue === "number" ? currentValue : undefined
				}
				aria-valuemin={min}
				aria-valuemax={max}
				value={currentValue}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				onKeyDown={handleKeyDown}
				onChange={handleInputChange}
				onBlur={handleBlur}
				className={cn(
					"flex-1 min-w-0 bg-transparent text-center text-sm focus:outline-none disabled:cursor-not-allowed",
					"[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					size === "sm" ? "px-1 py-1" : "px-2 py-2",
				)}
				{...props}
			/>

			<button
				type="button"
				tabIndex={-1}
				aria-label="Increase value"
				onClick={increment}
				disabled={disabled || isAtMax}
				className="flex items-center justify-center px-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-inherit"
			>
				<Plus
					aria-hidden="true"
					className={cn("stroke-2", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
				/>
			</button>
		</div>
	);
}

export { NumberInput };
