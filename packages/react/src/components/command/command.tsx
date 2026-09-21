"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import type * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { useSlotStyles } from "../kala-provider";
import type { CommandDialogProps, CommandProps } from "./command.types";

function Command({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: CommandProps) {
	const slotStyles = useSlotStyles("command", slotStylesRaw);
	const root = applySlot(
		cn(
			"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
			className,
		),
		slotStyles?.root,
	);
	return (
		<CommandPrimitive
			data-kala-component="command"
			ref={ref}
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<Dialog data-kala-component="command-dialog" {...props}>
			<DialogContent className="overflow-hidden p-0 shadow-lg" size="lg">
				<DialogTitle className="sr-only">Command Menu</DialogTitle>
				<Command className="**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])~[cmdk-group]]:pt-0 **:[[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

function CommandInput({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div
			data-kala-component="command-input"
			className="flex items-center border-b border-separator px-3"
			cmdk-input-wrapper=""
		>
			<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				ref={ref}
				className={cn(
					"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function CommandList({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-kala-component="command-list"
			ref={ref}
			className={cn(
				"max-h-[300px] overflow-y-auto overflow-x-hidden",
				className,
			)}
			{...props}
		/>
	);
}

function CommandEmpty({
	ref,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-kala-component="command-empty"
			ref={ref}
			className="py-6 text-center text-sm"
			{...props}
		/>
	);
}

function CommandGroup({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			data-kala-component="command-group"
			ref={ref}
			className={cn(
				"overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CommandSeparator({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			data-kala-component="command-separator"
			ref={ref}
			className={cn("-mx-1 h-px bg-separator", className)}
			{...props}
		/>
	);
}
function CommandItem({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			data-kala-component="command-item"
			ref={ref}
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			data-kala-component="command-shortcut"
			className={cn(
				"ml-auto text-xs tracking-widest text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
};

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
