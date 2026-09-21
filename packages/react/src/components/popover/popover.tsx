"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import * as React from "react";
import { type PopoverColor, popoverStyles } from "../../config/popover";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type {
	PopoverContentProps,
	PopoverHeaderProps,
	PopoverProps,
} from "./popover.types";

export const popoverVariants = cva(popoverStyles.base, {
	variants: popoverStyles.variants,
	defaultVariants: popoverStyles.defaultVariants,
});

export const popoverHeaderVariants = cva(popoverStyles.header.base, {
	variants: popoverStyles.header.variants,
	defaultVariants: popoverStyles.header.defaultVariants,
});

export const popoverArrowVariants = cva(popoverStyles.arrow.base, {
	variants: popoverStyles.arrow.variants,
	defaultVariants: popoverStyles.arrow.defaultVariants,
});

// ============================================================================
// Popover Root
// ============================================================================

function Popover({ ...props }: PopoverProps) {
	return (
		<PopoverPrimitive.Root
			data-kala-component="popover"
			data-slot="popover"
			{...props}
		/>
	);
}

// ============================================================================
// Popover Trigger
// ============================================================================

function PopoverTrigger({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return (
		<PopoverPrimitive.Trigger
			data-kala-component="popover-trigger"
			data-slot="popover-trigger"
			{...props}
		/>
	);
}

// ============================================================================
// Popover Content
// ============================================================================

interface PopoverColorContextValue {
	variant: "default" | "solid";
	color: PopoverColor;
	headerColor?: PopoverColor;
}

const PopoverColorContext =
	React.createContext<PopoverColorContextValue | null>(null);

function PopoverContent({
	className,
	style,
	slotStyles: slotStylesRaw,
	align = "center",
	sideOffset = 4,
	variant = "default",
	color = "primary",
	headerColor,
	showArrow = true,
	children,
	...props
}: PopoverContentProps) {
	const slotStyles = useSlotStyles("popover", slotStylesRaw);
	const hasColoredHeader = headerColor !== undefined;
	const padding = hasColoredHeader ? "none" : "md";
	const arrowColor = headerColor ?? (variant === "solid" ? color : undefined);
	const root = applySlot(
		cn("group", popoverVariants({ variant, color, padding }), className),
		slotStyles?.root,
	);
	const arrow = applySlot(
		cn(
			"border-l border-t bg-inherit border-inherit",
			popoverArrowVariants({ color: arrowColor }),
			!arrowColor &&
				"bg-popover [border-color:var(--border)] kala-surface-popover",
		),
		slotStyles?.arrow,
	);

	return (
		<PopoverColorContext.Provider
			data-kala-component="popover-content"
			value={{ variant, color, headerColor }}
		>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					data-slot="popover-content"
					data-variant={variant}
					align={align}
					sideOffset={sideOffset}
					className={root.className}
					style={mergeStyle(style, root.style)}
					{...props}
				>
					{children}
					{showArrow && (
						<PopoverPrimitive.Arrow asChild width={12} height={6}>
							<div
								className={arrow.className}
								style={mergeStyle(
									{
										transform:
											variant === "default" && !hasColoredHeader
												? "translateY(-50%) rotate(225deg)"
												: "translateY(-50%) rotate(45deg)",
									},
									arrow.style,
								)}
							/>
						</PopoverPrimitive.Arrow>
					)}
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverColorContext.Provider>
	);
}

// ============================================================================
// Popover Header
// ============================================================================

function PopoverHeader({
	className,
	style,
	slotStyles: slotStylesRaw,
	color,
	...props
}: PopoverHeaderProps) {
	const slotStyles = useSlotStyles("popover", slotStylesRaw);
	const context = React.useContext(PopoverColorContext);
	const effectiveColor =
		color ??
		context?.headerColor ??
		(context?.variant === "solid" ? context.color : undefined);
	const root = applySlot(
		cn(popoverHeaderVariants({ color: effectiveColor }), className),
		slotStyles?.root,
	);

	return (
		<div
			data-kala-component="popover-header"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

// ============================================================================
// Popover Body
// ============================================================================

function PopoverBody({
	className,
	style,
	slotStyles: slotStylesRaw,
	...props
}: React.ComponentProps<"div"> & { slotStyles?: SlotStyles }) {
	const slotStyles = useSlotStyles("popover", slotStylesRaw);
	const context = React.useContext(PopoverColorContext);
	const hasColoredHeader =
		context?.headerColor !== undefined ||
		(context?.variant === "solid" && context.color !== undefined);
	const root = applySlot(
		cn(
			popoverStyles.body.base,
			hasColoredHeader && popoverStyles.body.padded,
			className,
		),
		slotStyles?.root,
	);

	return (
		<div
			data-kala-component="popover-body"
			className={root.className}
			style={mergeStyle(style, root.style)}
			{...props}
		/>
	);
}

// ============================================================================
// Popover Anchor
// ============================================================================

function PopoverAnchor({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
	return (
		<PopoverPrimitive.Anchor
			data-kala-component="popover-anchor"
			data-slot="popover-anchor"
			{...props}
		/>
	);
}

// ============================================================================
// Popover Close
// ============================================================================

function PopoverClose({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
	return (
		<PopoverPrimitive.Close
			data-kala-component="popover-close"
			data-slot="popover-close"
			{...props}
		/>
	);
}

export {
	Popover,
	PopoverAnchor,
	PopoverBody,
	PopoverClose,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
};
