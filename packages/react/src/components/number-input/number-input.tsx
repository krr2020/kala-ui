"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { numberInputStyles } from "../../config/number-input";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton/skeleton";
import type { NumberInputProps } from "./number-input.types";

// Permits intermediate typing states like "", "-", "1.", "1e", "-.5".
// Arrangements that aren't real numbers (e.g. "1.2.3") stay in the buffer and
// never commit — they revert on blur.
const NUMERIC_TEXT_PATTERN = /^[0-9.eE+-]*$/;

function NumberInput({
	className,
	style,
	slotStyles,
	min,
	max,
	step = 1,
	value,
	defaultValue,
	onValueChange,
	onChange,
	disabled = false,
	size = "md",
	hasError = false,
	hasSuccess = false,
	isLoading = false,
	onKeyDown,
	onBlur,
	ref,
	...props
}: NumberInputProps) {
	const [internalValue, setInternalValue] = React.useState<number | "">(
		defaultValue ?? "",
	);
	// While the field is focused, the raw text the user typed is the source of
	// truth for display; committed numbers would erase intermediate input like
	// "-" or "1." (the whole reason type="number" is not used here).
	const [inputText, setInputText] = React.useState<string | null>(null);

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
			onValueChange?.(newValue === "" ? undefined : newValue);
	};

	// 0.1 + 0.2 must be 0.3, not 0.30000000000000004: round the sum to the
	// decimal precision implied by the operands.
	const decimalsOf = (n: number): number => {
		const s = String(n);
		const mantissa = s.split("e")[0];
		const exp = s.includes("e") ? Number(s.split("e")[1]) : 0;
		return Math.max((mantissa.split(".")[1] ?? "").length - exp, 0);
	};

	const applyStep = (base: number, delta: number): number => {
		const precision = Math.min(
			Math.max(decimalsOf(step), decimalsOf(base), 0),
			100,
		);
		return Number((base + delta).toFixed(precision));
	};

	const increment = () => {
		if (disabled) return;
		const base = typeof currentValue === "number" ? currentValue : (min ?? 0);
		commit(clamp(applyStep(base, step)));
		setInputText(null);
	};

	const decrement = () => {
		if (disabled) return;
		const base = typeof currentValue === "number" ? currentValue : (min ?? 0);
		commit(clamp(applyStep(base, -step)));
		setInputText(null);
	};

	const commitBuffer = () => {
		if (inputText === null) return;
		setInputText(null);
		if (inputText.trim() === "") return;
		const parsed = Number(inputText);
		if (Number.isFinite(parsed)) {
			const clamped = clamp(parsed);
			if (clamped !== currentValue) commit(clamped);
		}
		// Non-numeric garbage simply reverts to the committed value.
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(e);
		if (e.defaultPrevented) return;

		if (e.key === "ArrowUp") {
			e.preventDefault();
			increment();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			decrement();
		} else if (e.key === "Enter") {
			commitBuffer();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e);
		const raw = e.target.value;
		if (!NUMERIC_TEXT_PATTERN.test(raw)) return;
		setInputText(raw);
		if (raw === "") {
			commit("");
			return;
		}
		const parsed = Number(raw);
		// Live-commit whenever the buffer is a complete number so the parent
		// tracks along; partial input ("-", "1.", "2e") waits for completion.
		if (Number.isFinite(parsed) && parsed !== currentValue) {
			commit(parsed);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		commitBuffer();
		onBlur?.(e);
	};

	const root = applySlot(
		cn(
			numberInputStyles.root,
			"focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
			size === "sm" ? "h-[var(--kala-control-h-sm)]" : "h-[var(--kala-control-h)]",
			hasError && "border-destructive focus-within:kala-ring-destructive",
			hasSuccess && "border-success",
			disabled && "opacity-50 cursor-not-allowed",
			className,
		),
		slotStyles?.root,
	);
	const rootStyle = mergeStyle(style, root.style);

	if (isLoading) {
		return (
			<Skeleton
				data-kala-component="number-input"
				className={cn(
					"w-full rounded-[var(--kala-radius-input,var(--kala-radius-control))]",
					size === "sm" ? "h-[var(--kala-control-h-sm)]" : "h-[var(--kala-control-h)]",
					root.className,
				)}
				style={rootStyle}
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

	const displayValue =
		inputText ?? (currentValue === "" ? "" : String(currentValue));

	const decrementSlot = applySlot(
		numberInputStyles.decrement,
		cn(slotStyles?.decrement, slotStyles?.divider),
	);
	const incrementSlot = applySlot(
		numberInputStyles.increment,
		cn(slotStyles?.increment, slotStyles?.divider),
	);

	return (
		<div
			data-kala-component="number-input"
			data-slot="number-input"
			className={root.className}
			style={rootStyle}
		>
			<button
				type="button"
				tabIndex={-1}
				aria-label="Decrease value"
				onClick={decrement}
				disabled={disabled || isAtMin}
				className={decrementSlot.className}
				style={decrementSlot.style}
			>
				<Minus
					aria-hidden="true"
					className={cn("stroke-2", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
				/>
			</button>

			<input
				ref={ref}
				{...props}
				type="text"
				inputMode="decimal"
				value={displayValue}
				disabled={disabled}
				onKeyDown={handleKeyDown}
				onChange={handleInputChange}
				onBlur={handleBlur}
				className={cn(
					"flex-1 min-w-0 bg-transparent text-center text-sm focus:outline-none disabled:cursor-not-allowed",
					size === "sm" ? "px-1 py-1" : "px-2 py-2",
				)}
			/>

			<button
				type="button"
				tabIndex={-1}
				aria-label="Increase value"
				onClick={increment}
				disabled={disabled || isAtMax}
				className={incrementSlot.className}
				style={incrementSlot.style}
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
