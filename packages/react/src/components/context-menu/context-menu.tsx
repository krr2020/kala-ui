"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import type * as React from "react";

import { dropdownMenuStyles } from "../../config/dropdown-menu";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type {
	ContextMenuContentProps,
	ContextMenuProps,
} from "./context-menu.types";

function ContextMenu({ ...props }: ContextMenuProps) {
	return (
		<ContextMenuPrimitive.Root
			data-kala-component="context-menu"
			data-slot="context-menu"
			{...props}
		/>
	);
}

function ContextMenuTrigger({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
	return (
		<ContextMenuPrimitive.Trigger
			data-kala-component="context-menu-trigger"
			data-slot="context-menu-trigger"
			{...props}
		/>
	);
}

function ContextMenuPortal({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
	return <ContextMenuPrimitive.Portal {...props} />;
}

function ContextMenuContent({
	className,
	style,
	slotStyles,
	forceMount,
	...props
}: ContextMenuContentProps) {
	const root = applySlot(
		cn(
			"z-30 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground kala-surface-popover",
			"data-[state=open]:animate-in data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
			"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
			"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className,
		),
		slotStyles?.root,
	);
	return (
		<ContextMenuPrimitive.Portal forceMount={forceMount}>
			<ContextMenuPrimitive.Content
				forceMount={forceMount}
				data-kala-component="context-menu-content"
				data-slot="context-menu-content"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</ContextMenuPrimitive.Portal>
	);
}

function ContextMenuGroup({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
	return (
		<ContextMenuPrimitive.Group
			data-kala-component="context-menu-group"
			data-slot="context-menu-group"
			{...props}
		/>
	);
}

function ContextMenuItem({
	className,
	inset,
	color,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
	inset?: boolean;
	color?: "destructive";
}) {
	return (
		<ContextMenuPrimitive.Item
			data-kala-component="context-menu-item"
			data-slot="context-menu-item"
			data-inset={inset}
			data-color={color}
			className={cn(
				dropdownMenuStyles.item.base,
				inset && dropdownMenuStyles.item.inset,
				color === "destructive" && dropdownMenuStyles.item.destructive,
				className,
			)}
			{...props}
		/>
	);
}

function ContextMenuCheckboxItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
	return (
		<ContextMenuPrimitive.CheckboxItem
			data-kala-component="context-menu-checkbox-item"
			data-slot="context-menu-checkbox-item"
			className={cn(dropdownMenuStyles.checkboxItem, className)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<ContextMenuPrimitive.ItemIndicator>
					<Check className="size-4 text-primary" />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>
	);
}

function ContextMenuRadioGroup({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
	return (
		<ContextMenuPrimitive.RadioGroup
			data-kala-component="context-menu-radio-group"
			data-slot="context-menu-radio-group"
			{...props}
		/>
	);
}

function ContextMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
	return (
		<ContextMenuPrimitive.RadioItem
			data-kala-component="context-menu-radio-item"
			data-slot="context-menu-radio-item"
			className={cn(dropdownMenuStyles.radioItem, className)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<ContextMenuPrimitive.ItemIndicator>
					<Circle className="size-2 fill-primary text-primary" />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>
	);
}

function ContextMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
	inset?: boolean;
}) {
	return (
		<ContextMenuPrimitive.Label
			data-kala-component="context-menu-label"
			data-slot="context-menu-label"
			data-inset={inset}
			className={cn(
				dropdownMenuStyles.label,
				inset && dropdownMenuStyles.labelInset,
				className,
			)}
			{...props}
		/>
	);
}

function ContextMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
	return (
		<ContextMenuPrimitive.Separator
			data-kala-component="context-menu-separator"
			data-slot="context-menu-separator"
			className={cn(dropdownMenuStyles.separator, className)}
			{...props}
		/>
	);
}

function ContextMenuShortcut({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-kala-component="context-menu-shortcut"
			data-slot="context-menu-shortcut"
			className={cn(dropdownMenuStyles.shortcut, className)}
			{...props}
		/>
	);
}

function ContextMenuSub({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
	return (
		<ContextMenuPrimitive.Sub
			data-kala-component="context-menu-sub"
			data-slot="context-menu-sub"
			{...props}
		/>
	);
}

function ContextMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
	inset?: boolean;
}) {
	return (
		<ContextMenuPrimitive.SubTrigger
			data-kala-component="context-menu-sub-trigger"
			data-slot="context-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
				"data-[inset]:pl-8",
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
				'[&_svg:not([class*="text-"])]:text-muted-foreground',
				className,
			)}
			{...props}
		>
			{children}
			<ChevronRight className="ml-auto size-4" />
		</ContextMenuPrimitive.SubTrigger>
	);
}

function ContextMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
	return (
		<ContextMenuPrimitive.SubContent
			data-kala-component="context-menu-sub-content"
			data-slot="context-menu-sub-content"
			className={cn(
				"z-30 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground kala-surface-popover",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
				"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				className,
			)}
			{...props}
		/>
	);
}

export {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
};
