"use client";

import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { nativeSelectStyles } from "../../config/select";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
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
	hasError?: boolean;
	/**
	 * Success state styling
	 */
	hasSuccess?: boolean;
	/** Per-part overrides: `root` targets the wrapper, `select` the native control, `icon` the chevron holder. */
	slotStyles?: SlotStyles;
}

function NativeSelect({
	ref,
	className,
	style,
	slotStyles,
	size = "md",
	hasError,
	hasSuccess,
	children,
	disabled,
	...props
}: NativeSelectProps) {
	const root = applySlot(nativeSelectStyles.root, slotStyles?.root);
	const select = applySlot(
		cn(
			nativeSelectStyles.select,
			nativeSelectStyles.size[size],
			hasError && nativeSelectStyles.hasError,
			hasSuccess && nativeSelectStyles.hasSuccess,
			className,
		),
		slotStyles?.select,
	);
	const icon = applySlot(nativeSelectStyles.icon, slotStyles?.icon);
	const iconGlyph = applySlot(nativeSelectStyles.iconGlyph[size], null);
	return (
		<div
			data-kala-component="select-native-select"
			className={root.className}
			style={root.style}
		>
			<select
				ref={ref}
				disabled={disabled}
				className={select.className}
				style={mergeStyle(style, select.style)}
				{...props}
			>
				{children}
			</select>
			<div className={icon.className} style={icon.style}>
				<ChevronDown className={iconGlyph.className} aria-hidden="true" />
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
	return (
		<option
			data-kala-component="select-native-select-option"
			ref={ref}
			{...props}
		/>
	);
}

export interface NativeSelectOptGroupProps
	extends React.ComponentProps<"optgroup"> {}

function NativeSelectOptGroup({
	ref,
	className,
	...props
}: NativeSelectOptGroupProps) {
	return (
		<optgroup
			data-kala-component="select-native-select-opt-group"
			ref={ref}
			className={className}
			{...props}
		/>
	);
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
