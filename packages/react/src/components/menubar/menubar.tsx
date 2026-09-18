"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

function MenubarMenu({
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
	return (
		<MenubarPrimitive.Menu
			data-kala-component="menubar-menu"
			data-slot="menubar-menu"
			{...props}
		/>
	);
}

function Menubar({
	className,
	style,
	slotStyles,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Root> & {
	slotStyles?: SlotStyles;
}) {
	const root = applySlot(
		cn(
			"flex h-10 items-center space-x-1 rounded-md border bg-background p-1 kala-surface-card",
			className,
		),
		slotStyles?.root,
	);
	return (
		<MenubarPrimitive.Root
			data-kala-component="menubar"
			data-slot="menubar"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

function MenubarTrigger({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
	return (
		<MenubarPrimitive.Trigger
			data-kala-component="menubar-trigger"
			data-slot="menubar-trigger"
			className={cn(
				"flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function MenubarSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
	inset?: boolean;
}) {
	return (
		<MenubarPrimitive.SubTrigger
			data-kala-component="menubar-sub-trigger"
			data-slot="menubar-sub-trigger"
			data-inset={inset}
			className={cn(
				"flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"data-inset:pl-8",
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
				'[&_svg:not([class*="text-"])]:text-muted-foreground',
				className,
			)}
			{...props}
		>
			{children}
			<ChevronRight className="ml-auto size-4" />
		</MenubarPrimitive.SubTrigger>
	);
}

function MenubarSubContent({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
	return (
		<MenubarPrimitive.SubContent
			data-kala-component="menubar-sub-content"
			data-slot="menubar-sub-content"
			className={cn(
				"z-30 min-w-[10rem] max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin) overflow-x-hidden overflow-y-auto",
				"rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
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

function MenubarContent({
	className,
	align = "start",
	alignOffset = -4,
	sideOffset = 8,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
	return (
		<MenubarPrimitive.Portal data-kala-component="menubar-content">
			<MenubarPrimitive.Content
				data-slot="menubar-content"
				align={align}
				alignOffset={alignOffset}
				sideOffset={sideOffset}
				className={cn(
					"z-30 min-w-[12rem] max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin) overflow-x-hidden overflow-y-auto",
					"rounded-md border bg-popover p-1 text-popover-foreground kala-surface-popover",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
					"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
					"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
					"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className,
				)}
				{...props}
			/>
		</MenubarPrimitive.Portal>
	);
}

function MenubarItem({
	className,
	inset,
	color,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
	inset?: boolean;
	color?: "destructive";
}) {
	return (
		<MenubarPrimitive.Item
			data-kala-component="menubar-item"
			data-slot="menubar-item"
			data-inset={inset}
			data-color={color}
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"data-inset:pl-8",
				"data-[color=destructive]:text-destructive",
				"data-[color=destructive]:hover:bg-destructive/10",
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
				'[&_svg:not([class*="text-"])]:text-muted-foreground',
				className,
			)}
			{...props}
		/>
	);
}

function MenubarCheckboxItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
	return (
		<MenubarPrimitive.CheckboxItem
			data-kala-component="menubar-checkbox-item"
			data-slot="menubar-checkbox-item"
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-2 pl-8 pr-3 text-sm outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<MenubarPrimitive.ItemIndicator>
					<Check className="size-4 text-primary" />
				</MenubarPrimitive.ItemIndicator>
			</span>
			{children}
		</MenubarPrimitive.CheckboxItem>
	);
}

function MenubarRadioGroup({
	...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
	return (
		<MenubarPrimitive.RadioGroup
			data-kala-component="menubar-radio-group"
			data-slot="menubar-radio-group"
			{...props}
		/>
	);
}

function MenubarRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
	return (
		<MenubarPrimitive.RadioItem
			data-kala-component="menubar-radio-item"
			data-slot="menubar-radio-item"
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-2 pl-8 pr-3 text-sm outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
				<MenubarPrimitive.ItemIndicator>
					<Circle className="size-2 fill-primary text-primary" />
				</MenubarPrimitive.ItemIndicator>
			</span>
			{children}
		</MenubarPrimitive.RadioItem>
	);
}

function MenubarLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
	inset?: boolean;
}) {
	return (
		<MenubarPrimitive.Label
			data-kala-component="menubar-label"
			data-slot="menubar-label"
			data-inset={inset}
			className={cn(
				"px-3 py-1.5 text-sm font-semibold text-foreground",
				"data-inset:pl-8",
				className,
			)}
			{...props}
		/>
	);
}

function MenubarSeparator({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
	return (
		<MenubarPrimitive.Separator
			data-kala-component="menubar-separator"
			data-slot="menubar-separator"
			className={cn("-mx-1 my-1 h-px bg-separator", className)}
			{...props}
		/>
	);
}

function MenubarShortcut({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			data-kala-component="menubar-shortcut"
			className={cn(
				"ml-auto text-xs tracking-widest text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function MenubarSub({
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
	return (
		<MenubarPrimitive.Sub
			data-kala-component="menubar-sub"
			data-slot="menubar-sub"
			{...props}
		/>
	);
}

function MenubarGroup({
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
	return (
		<MenubarPrimitive.Group
			data-kala-component="menubar-group"
			data-slot="menubar-group"
			{...props}
		/>
	);
}

function MenubarPortal({
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
	return (
		<MenubarPrimitive.Portal
			data-kala-component="menubar-portal"
			data-slot="menubar-portal"
			{...props}
		/>
	);
}

export {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarPortal,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
};
