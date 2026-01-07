"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import * as React from "react";
import { popoverStyles } from "../../config/popover";
import { cn } from "../../lib/utils";

const popoverVariants = cva(popoverStyles.base, {
	variants: popoverStyles.variants,
	defaultVariants: popoverStyles.defaultVariants,
});

const popoverHeaderVariants = cva(popoverStyles.header.base, {
	variants: popoverStyles.header.variants,
	defaultVariants: popoverStyles.header.defaultVariants,
});

const popoverArrowVariants = cva(popoverStyles.arrow.base, {
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
	extends React.ComponentProps<typeof PopoverPrimitive.Content> {
	/**
	 * Whether to show the arrow pointing to the trigger
	 * @default true
	 */
	showArrow?: boolean;
	/**
	 * Visual variant for the popover
	 * - default: White background with border
	 * - header-[color]: Colored header with white body
	 * - [color]: Full colored background
	 * @default "default"
	 */
	variant?:
		| "default"
		| "header-primary"
		| "header-secondary"
		| "header-success"
		| "header-danger"
		| "header-warning"
		| "header-info"
		| "primary"
		| "secondary"
		| "success"
		| "danger"
		| "warning"
		| "info";
}

const PopoverVariantContext =
	React.createContext<PopoverContentProps["variant"]>("default");

function PopoverContent({
	className,
	align = "center",
	sideOffset = 4,
	variant = "default",
	showArrow = true,
	children,
	...props
}: PopoverContentProps) {
	const hasColoredHeader = variant.startsWith("header-");
	const padding = hasColoredHeader ? "none" : "default";

	return (
		<PopoverVariantContext.Provider value={variant}>
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					data-slot="popover-content"
					data-variant={variant}
					align={align}
					sideOffset={sideOffset}
					className={cn(
						"group",
						popoverVariants({ variant, padding }),
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
									popoverArrowVariants({ variant }),
								)}
								style={{
									transform:
										variant === "default" || hasColoredHeader
											? "translateY(-50%) rotate(225deg)"
											: "translateY(-50%) rotate(45deg)",
								}}
							/>
						</PopoverPrimitive.Arrow>
					)}
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverVariantContext.Provider>
	);
}

// ============================================================================
// Popover Header
// ============================================================================

function PopoverHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const variant = React.useContext(PopoverVariantContext);

	return (
		<div
			className={cn(popoverHeaderVariants({ variant }), className)}
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
	const variant = React.useContext(PopoverVariantContext);
	const hasColoredHeader = variant?.startsWith("header-");
	const isFullyColored = variant !== "default" && !hasColoredHeader;

	return (
		<div
			className={cn(
				"text-sm",
				hasColoredHeader ? "p-4" : "", // Only add padding if there's a colored header
				isFullyColored ? "p-4" : "", // Add padding for fully colored variants
				className,
			)}
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
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverAnchor,
	PopoverClose,
};
