"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import type * as React from "react";

import { dropdownMenuStyles } from "../../config/dropdown-menu";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";

function DropdownMenu({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	return (
		<DropdownMenuPrimitive.Root
			data-kala-component="dropdown-menu"
			data-slot="dropdown-menu"
			{...props}
		/>
	);
}

function DropdownMenuPortal({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
	return <DropdownMenuPrimitive.Portal {...props} />;
}

function DropdownMenuTrigger({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
	return (
		<DropdownMenuPrimitive.Trigger
			data-kala-component="dropdown-menu-trigger"
			data-slot="dropdown-menu-trigger"
			{...props}
		/>
	);
}

function DropdownMenuContent({
	className,
	style,
	slotStyles,
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
	/** Per-part overrides: `root` wins over `className`/`style` on the portal-rendered surface. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(dropdownMenuStyles.content, slotStyles?.root);
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				data-kala-component="dropdown-menu-content"
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				className={cn(root.className, className)}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
}

function DropdownMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return (
		<DropdownMenuPrimitive.Group
			data-kala-component="dropdown-menu-group"
			data-slot="dropdown-menu-group"
			{...props}
		/>
	);
}

function DropdownMenuItem({
	className,
	style,
	slotStyles,
	inset,
	color,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	inset?: boolean;
	color?: "destructive";
	/** Per-part overrides: `root` wins over `className`/`style`. */
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(
			dropdownMenuStyles.item.base,
			inset && dropdownMenuStyles.item.inset,
			color === "destructive" && dropdownMenuStyles.item.destructive,
			className,
		),
		slotStyles?.root,
	);
	return (
		<DropdownMenuPrimitive.Item
			data-kala-component="dropdown-menu-item"
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-color={color}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function DropdownMenuCheckboxItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-kala-component="dropdown-menu-checkbox-item"
			data-slot="dropdown-menu-checkbox-item"
			className={cn(dropdownMenuStyles.checkboxItem, className)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<Check className="size-4 text-primary" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
}

function DropdownMenuRadioGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
	return (
		<DropdownMenuPrimitive.RadioGroup
			data-kala-component="dropdown-menu-radio-group"
			data-slot="dropdown-menu-radio-group"
			{...props}
		/>
	);
}

function DropdownMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
	return (
		<DropdownMenuPrimitive.RadioItem
			data-kala-component="dropdown-menu-radio-item"
			data-slot="dropdown-menu-radio-item"
			className={cn(dropdownMenuStyles.radioItem, className)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<Circle className="size-2 fill-primary text-primary" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
}

function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.Label
			data-kala-component="dropdown-menu-label"
			data-slot="dropdown-menu-label"
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

function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			data-kala-component="dropdown-menu-separator"
			data-slot="dropdown-menu-separator"
			className={cn(dropdownMenuStyles.separator, className)}
			{...props}
		/>
	);
}

function DropdownMenuShortcut({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-kala-component="dropdown-menu-shortcut"
			data-slot="dropdown-menu-shortcut"
			className={cn(dropdownMenuStyles.shortcut, className)}
			{...props}
		/>
	);
}

function DropdownMenuSub({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
	return (
		<DropdownMenuPrimitive.Sub
			data-kala-component="dropdown-menu-sub"
			data-slot="dropdown-menu-sub"
			{...props}
		/>
	);
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.SubTrigger
			data-kala-component="dropdown-menu-sub-trigger"
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			className={cn(
				"flex cursor-pointer select-none items-center gap-2 rounded-[var(--kala-radius-sm)] px-3 py-2 text-sm outline-none transition-colors",
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
		</DropdownMenuPrimitive.SubTrigger>
	);
}

function DropdownMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
	return (
		<DropdownMenuPrimitive.SubContent
			data-kala-component="dropdown-menu-sub-content"
			data-slot="dropdown-menu-sub-content"
			className={cn(
				"z-30 min-w-[10rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden",
				"rounded-[var(--kala-radius-card)] border bg-popover p-1 text-popover-foreground kala-surface-popover",
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
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
