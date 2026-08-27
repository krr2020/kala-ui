"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import * as React from "react";
import { type PopoverColor, popoverStyles } from "../../config/popover";
import { cn } from "../../lib/utils";

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

function Popover({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

// ============================================================================
// Popover Trigger
// ============================================================================

function PopoverTrigger({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// ============================================================================
// Popover Content
// ============================================================================

export interface PopoverContentProps
	extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, "color"> {
	/**
	 * Whether to show the arrow pointing to the trigger
	 * @default true
	 */
	showArrow?: boolean;
	/**
	 * Visual variant
	 * - default: surface background with border
	 * - solid: fully colored body (tinted by `color`)
	 * @default "default"
	 */
	variant?: "default" | "solid";
	/**
	 * Semantic color — tints a solid popover and the arrow
	 * @default "primary"
	 */
	color?: PopoverColor;
	/**
	 * Tint the PopoverHeader strip of a default (surface) popover
	 */
	headerColor?: PopoverColor;
}

interface PopoverColorContextValue {
	variant: "default" | "solid";
	color: PopoverColor;
	headerColor?: PopoverColor;
}

const PopoverColorContext =
	React.createContext<PopoverColorContextValue | null>(null);

function PopoverContent({
	className,
	align = "center",
	sideOffset = 4,
	variant = "default",
	color = "primary",
	headerColor,
	showArrow = true,
	children,
	...props
}: PopoverContentProps) {
	const hasColoredHeader = headerColor !== undefined;
	const padding = hasColoredHeader ? "none" : "md";
	const arrowColor = headerColor ?? (variant === "solid" ? color : undefined);

	return (
		<PopoverColorContext.Provider value={{ variant, color, headerColor }}>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					data-slot="popover-content"
					data-variant={variant}
					align={align}
					sideOffset={sideOffset}
					className={cn(
						"group",
						popoverVariants({ variant, color, padding }),
						className,
					)}
					{...props}
				>
					{children}
					{showArrow && (
						<PopoverPrimitive.Arrow asChild width={12} height={6}>
							<div
								className={cn(
									"border-l border-t bg-inherit border-inherit",
									popoverArrowVariants({ color: arrowColor }),
									!arrowColor &&
										"bg-popover [border-color:var(--border)] kala-surface-popover",
								)}
								style={{
									transform:
										variant === "default" && !hasColoredHeader
											? "translateY(-50%) rotate(225deg)"
											: "translateY(-50%) rotate(45deg)",
								}}
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

export interface PopoverHeaderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
	/**
	 * Tint the header strip. Falls back to the parent PopoverContent's
	 * headerColor (or its color for solid popovers); plain when unset.
	 */
	color?: PopoverColor;
}

function PopoverHeader({ className, color, ...props }: PopoverHeaderProps) {
	const context = React.useContext(PopoverColorContext);
	const effectiveColor =
		color ??
		context?.headerColor ??
		(context?.variant === "solid" ? context.color : undefined);

	return (
		<div
			className={cn(
				popoverHeaderVariants({ color: effectiveColor }),
				className,
			)}
			{...props}
		/>
	);
}

// ============================================================================
// Popover Body
// ============================================================================

function PopoverBody({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const context = React.useContext(PopoverColorContext);
	const hasColoredHeader =
		context?.headerColor !== undefined ||
		(context?.variant === "solid" && context.color !== undefined);

	return (
		<div
			className={cn("text-sm", hasColoredHeader ? "p-4" : "", className)}
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
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

// ============================================================================
// Popover Close
// ============================================================================

function PopoverClose({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
	return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
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
