/**
 * InputGroup - Group inputs and addons together
 *
 * Note: Input components with icons or password toggle should not use wrapper divs.
 * For best compatibility, use simple inputs without additional features inside InputGroup.
 */

import type * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { InputGroupProps } from "./input-group.types";

function InputGroup({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	children,
	...props
}: InputGroupProps) {
	const slotStyles = useSlotStyles("input-group", slotStylesRaw);
	const root = applySlot(
		cn(
			"flex w-full items-stretch",
			// Reset rounded corners for children - focus on direct children that are not headers/labels
			"[&>*:not(:first-child)]:rounded-l-none",
			"[&>*:not(:last-child)]:rounded-r-none",
			// Handle borders to avoid double borders
			"[&>*:not(:first-child)]:border-l-0",
			// Ensure focus ring appears on top
			"[&>*:focus-within]:z-10",
			"[&>*:focus]:z-10",
			className,
		),
		slotStyles?.root,
	);
	return (
		// biome-ignore lint/a11y/useSemanticElements: div[role=group] is the correct generic grouping element here; fieldset is for form legend groups and brings default styles
		<div
			data-kala-component="input-group"
			ref={ref}
			role="group"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		>
			{children}
		</div>
	);
}
function InputGroupText({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("input-group", slotStylesRaw);
	const root = applySlot(
		cn(
			"flex items-center justify-center whitespace-nowrap rounded-md border bg-muted px-3 text-sm text-muted-foreground kala-surface-card",
			className,
		),
		slotStyles?.root,
	);
	return (
		<div
			data-kala-component="input-group-text"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

export { InputGroup, InputGroupText };
