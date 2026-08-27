/**
 * Command Primitives - Shared command palette components
 *
 * These primitives are built on top of cmdk and used by components like
 * Combobox and MultiSelect. They provide a consistent command interface
 * throughout the design system.
 *
 * @see https://cmdk.paco.me/
 */

"use client";

import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { Flex } from "../../components/flex";
import { cn } from "../../lib/utils";

// ============================================================================
// Command
// ============================================================================

function Command({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			ref={ref}
			className={cn(
				"flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
				className,
			)}
			{...props}
		/>
	);
}
// ============================================================================
// CommandInput
// ============================================================================

function CommandInput({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<Flex
			align="center"
			className="border-b border-separator px-3"
			cmdk-input-wrapper=""
		>
			<CommandPrimitive.Input
				ref={ref}
				className={cn(
					"flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</Flex>
	);
}
// ============================================================================
// CommandList
// ============================================================================

function CommandList({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			ref={ref}
			className={cn(
				"max-h-[300px] overflow-y-auto overflow-x-hidden",
				className,
			)}
			{...props}
		/>
	);
}
// ============================================================================
// CommandEmpty
// ============================================================================

function CommandEmpty({
	ref,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			ref={ref}
			className="py-6 text-center text-sm"
			{...props}
		/>
	);
}
// ============================================================================
// CommandGroup
// ============================================================================

function CommandGroup({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			ref={ref}
			className={cn(
				"overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
// ============================================================================
// CommandSeparator
// ============================================================================

function CommandSeparator({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			ref={ref}
			className={cn("-mx-1 h-px bg-border", className)}
			{...props}
		/>
	);
}
// ============================================================================
// CommandItem
// ============================================================================

function CommandItem({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			ref={ref}
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

// ============================================================================
// Exports
// ============================================================================

export {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
};
