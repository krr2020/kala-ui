"use client";

import { ChevronDown } from "lucide-react";
import { nativeSelectStyles } from "../../config/native-select";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type {
	NativeSelectOptGroupProps,
	NativeSelectOptionProps,
	NativeSelectProps,
} from "./native-select.types";

function NativeSelect({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	size = "md",
	hasError,
	hasSuccess,
	children,
	disabled,
	...props
}: NativeSelectProps) {
	const slotStyles = useSlotStyles("select", slotStylesRaw);
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
