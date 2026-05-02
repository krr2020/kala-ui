"use client";

import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { toggleVariants } from "../toggle/toggle";
import type { VariantProps } from "class-variance-authority";

function Toolbar({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
	return (
		<ToolbarPrimitive.Root
			data-slot="toolbar"
			className={cn(
				"flex h-10 items-center gap-1 rounded-md border bg-card p-1 theme-input",
				className,
			)}
			{...props}
		/>
	);
}

function ToolbarButton({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button> &
	VariantProps<typeof toggleVariants>) {
	return (
		<ToolbarPrimitive.Button
			data-slot="toolbar-button"
			className={cn(toggleVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function ToolbarToggleGroup({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) {
	return (
		<ToolbarPrimitive.ToggleGroup
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
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem> &
	VariantProps<typeof toggleVariants>) {
	return (
		<ToolbarPrimitive.ToggleItem
			data-slot="toolbar-toggle-item"
			className={cn(toggleVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function ToolbarSeparator({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
	return (
		<ToolbarPrimitive.Separator
			data-slot="toolbar-separator"
			className={cn("mx-1 h-6 w-px bg-border", className)}
			{...props}
		/>
	);
}

function ToolbarLink({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
	return (
		<ToolbarPrimitive.Link
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
	ToolbarToggleGroup,
	ToolbarToggleItem,
	ToolbarSeparator,
	ToolbarLink,
};
