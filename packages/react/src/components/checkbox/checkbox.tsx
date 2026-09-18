"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { checkboxIndicatorStyles, checkboxStyles } from "../../config/checkbox";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import type { CheckboxProps } from "./checkbox.types";

function Checkbox({
	className,
	style,
	slotStyles,
	isLoading = false,
	ref,
	...props
}: CheckboxProps & { slotStyles?: SlotStyles }) {
	if (isLoading) {
		const skel = applySlot(cn("h-4 w-4 rounded", className), slotStyles?.root);
		return (
			<Skeleton
				data-kala-component="checkbox"
				className={skel.className}
				style={mergeStyle(style, skel.style)}
			/>
		);
	}

	const root = applySlot(cn(checkboxStyles.base, className), slotStyles?.root);
	const indicator = applySlot(
		checkboxIndicatorStyles.base,
		slotStyles?.indicator,
	);
	return (
		<CheckboxPrimitive.Root
			data-kala-component="checkbox"
			ref={ref}
			data-slot="checkbox"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className={indicator.className}
				style={indicator.style}
			>
				{props.checked === "indeterminate" ? (
					<Minus className="size-3.5 stroke-3" />
				) : (
					<Check className="size-3.5 stroke-3" />
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
