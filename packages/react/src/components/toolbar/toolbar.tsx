"use client";

import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import { toggleVariants } from "../toggle/toggle";
import type {
	ToolbarButtonProps,
	ToolbarLinkProps,
	ToolbarProps,
	ToolbarSeparatorProps,
	ToolbarToggleGroupProps,
	ToolbarToggleItemProps,
} from "./toolbar.types";

function Toolbar({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: ToolbarProps) {
	const slotStyles = useSlotStyles("toolbar", slotStylesRaw);
	const root = applySlot(
		cn(
			"flex h-10 items-center gap-1 rounded-md border bg-card p-1 kala-surface-input",
			className,
		),
		slotStyles?.root,
	);
	return (
		<ToolbarPrimitive.Root
			data-kala-component="toolbar"
			data-slot="toolbar"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function ToolbarButton({
	className,
	variant,
	size,
	...props
}: ToolbarButtonProps) {
	return (
		<ToolbarPrimitive.Button
			data-kala-component="toolbar-button"
			data-slot="toolbar-button"
			className={cn(toggleVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function ToolbarToggleGroup({ className, ...props }: ToolbarToggleGroupProps) {
	return (
		<ToolbarPrimitive.ToggleGroup
			data-kala-component="toolbar-toggle-group"
			data-slot="toolbar-toggle-group"
			className={cn("flex items-center gap-1", className)}
			{...props}
		/>
	);
}

function ToolbarToggleItem({
	className,
	variant,
	size,
	...props
}: ToolbarToggleItemProps) {
	return (
		<ToolbarPrimitive.ToggleItem
			data-kala-component="toolbar-toggle-item"
			data-slot="toolbar-toggle-item"
			className={cn(toggleVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
	return (
		<ToolbarPrimitive.Separator
			data-kala-component="toolbar-separator"
			data-slot="toolbar-separator"
			className={cn("mx-1 h-6 w-px bg-border", className)}
			{...props}
		/>
	);
}

function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
	return (
		<ToolbarPrimitive.Link
			data-kala-component="toolbar-link"
			data-slot="toolbar-link"
			className={cn(
				"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Toolbar,
	ToolbarButton,
	ToolbarLink,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
};
