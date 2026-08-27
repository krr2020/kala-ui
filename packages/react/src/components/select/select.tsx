"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type * as React from "react";

import {
	selectContentStyles,
	selectItemStyles,
	selectLabelStyles,
	selectScrollButtonStyles,
	selectSeparatorStyles,
	selectTriggerStyles,
} from "../../config/select";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({
	ref,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group ref={ref} {...props} />;
}
function SelectValue({
	ref,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value ref={ref} {...props} />;
}

import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(selectTriggerStyles.base, {
	variants: selectTriggerStyles.variants,
	defaultVariants: selectTriggerStyles.defaultVariants,
});

function SelectTrigger({
	ref,
	className,
	size = "md",
	isLoading = false,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: "sm" | "md";
	isLoading?: boolean;
}) {
	if (isLoading) {
		return (
			<Skeleton
				className={cn(
					"w-full rounded-md flex items-center justify-between",
					size === "sm" ? "h-9" : "h-10",
					className,
				)}
			/>
		);
	}

	return (
		<SelectPrimitive.Trigger
			ref={ref}
			data-slot="select-trigger"
			data-size={size}
			className={cn(selectTriggerVariants({ size }), className)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDown className="size-4 opacity-50" aria-hidden="true" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}
function SelectScrollUpButton({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			ref={ref}
			data-slot="select-scroll-up-button"
			className={cn(selectScrollButtonStyles.base, className)}
			{...props}
		>
			<ChevronUp className="size-4" aria-hidden="true" />
		</SelectPrimitive.ScrollUpButton>
	);
}
function SelectScrollDownButton({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			ref={ref}
			data-slot="select-scroll-down-button"
			className={cn(selectScrollButtonStyles.base, className)}
			{...props}
		>
			<ChevronDown className="size-4" aria-hidden="true" />
		</SelectPrimitive.ScrollDownButton>
	);
}
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

function SelectContent({
	ref,
	className,
	children,
	position = "popper",
	align = "center",
	matchTriggerWidth = false,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
	matchTriggerWidth?: boolean;
}) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				data-slot="select-content"
				className={cn(
					selectContentStyles.base,
					matchTriggerWidth
						? "w-(--radix-select-trigger-width)"
						: "min-w-[8rem]",
					position === "popper" && selectContentStyles.popper,
					className,
				)}
				position={position}
				align={align}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							`${selectContentStyles.viewportPopper} ${matchTriggerWidth ? "max-w-(--radix-select-trigger-width)" : "min-w-(--radix-select-trigger-width)"}`,
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}
function SelectLabel({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			ref={ref}
			data-slot="select-label"
			className={cn(selectLabelStyles.base, className)}
			{...props}
		/>
	);
}
function SelectItem({
	ref,
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			ref={ref}
			data-slot="select-item"
			className={cn(selectItemStyles.base, className)}
			{...props}
		>
			<span className="absolute right-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<Check className="size-4" aria-hidden="true" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}
function SelectSeparator({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			ref={ref}
			data-slot="select-separator"
			className={cn(selectSeparatorStyles.base, className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
