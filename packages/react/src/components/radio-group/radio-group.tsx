"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import * as React from "react";
import {
	radioGroupDescriptionStyles,
	radioGroupIndicatorSizes,
	radioGroupItemStyles,
	radioGroupItemWrapperStyles,
	radioGroupLabelStyles,
	radioGroupStyles,
} from "../../config/radio-group";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { Label } from "../label";

export interface RadioGroupProps
	extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
	/**
	 * Visual variant of the radio group
	 * @default "default"
	 */
	variant?: "default" | "cards" | "buttons";
	/**
	 * Size of radio buttons
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg";
	/** Per-part style overrides (root wins over className/style) */
	slotStyles?: SlotStyles;
}

export interface RadioGroupItemProps
	extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
	/**
	 * Label text for the radio item
	 */
	label?: string;
	/**
	 * Description text displayed below the label
	 */
	description?: string;
	/**
	 * Show error state
	 */
	hasError?: boolean;
	/** Per-part style overrides (root wins over className/style) */
	slotStyles?: SlotStyles;
}

const RadioGroupContext = React.createContext<{
	variant?: "default" | "cards" | "buttons";
	size?: "sm" | "md" | "lg";
}>({});

export const radioGroupVariants = cva("", {
	variants: radioGroupStyles.variants,
	defaultVariants: radioGroupStyles.defaultVariants,
});

export const radioGroupItemVariants = cva(radioGroupItemStyles.base, {
	variants: radioGroupItemStyles.variants,
	defaultVariants: radioGroupItemStyles.defaultVariants,
});

function RadioGroup({
	ref,
	className,
	style,
	slotStyles,
	variant = "default",
	size = "md",
	...props
}: RadioGroupProps) {
	const root = applySlot(
		cn(radioGroupVariants({ variant }), className),
		slotStyles?.root,
	);
	return (
		<RadioGroupContext.Provider value={{ variant, size }}>
			<RadioGroupPrimitive.Root
				ref={ref}
				data-kala-component="radio-group"
				data-slot="radio-group"
				className={root.className}
				style={mergeStyle(style, root.style)}
				{...props}
			/>
		</RadioGroupContext.Provider>
	);
}

	function RadioGroupItem({
		ref,
		className,
		style,
		slotStyles,
		label,
		description,
		hasError,
		id,
		children,
		...props
	}: RadioGroupItemProps) {
		const { variant = "default", size = "md" } =
			React.useContext(RadioGroupContext);
		const autoId = React.useId();
		const itemId = id ?? autoId;
		const hasContent = label || description || children;

		const indicator = applySlot(
			"flex items-center justify-center",
			slotStyles?.indicator,
		);

		const itemRoot = applySlot(
			cn(
				radioGroupItemVariants({
					variant:
						variant === "default" || variant === "cards" ? "default" : variant,
					size,
					hasError: hasError ? true : undefined,
					}),
				!hasContent && className,
			),
			hasContent ? undefined : slotStyles?.root,
		);

		const radioButton = (
			<RadioGroupPrimitive.Item
				ref={ref}
				id={itemId}
				data-kala-component="radio-group-item"
				data-slot="radio-group-item"
				className={itemRoot.className}
				style={hasContent ? undefined : mergeStyle(style, itemRoot.style)}
				{...props}
		>
				<RadioGroupPrimitive.Indicator
					data-slot="radio-group-indicator"
					className={indicator.className}
					style={indicator.style}
				>
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					fill="currentColor"
					className={radioGroupIndicatorSizes[size]}
					aria-hidden="true"
				>
					<circle cx="4" cy="4" r="4" />
				</svg>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);

	// For default variant with label/description or custom children
	if (variant === "default" && hasContent) {
		const wrapper = applySlot(
			cn(radioGroupItemWrapperStyles.default, className),
			slotStyles?.root,
		);
		return (
			<div
				data-kala-component="radio-group-item"
				className={wrapper.className}
				style={mergeStyle(style, wrapper.style)}
			>
				{radioButton}
				{children || (
					<div className="grid gap-1.5 leading-none">
						{label && (
							<Label
								htmlFor={itemId}
								className={cn(
									radioGroupLabelStyles.base,
									hasError && radioGroupLabelStyles.hasError,
								)}
							>
								{label}
							</Label>
						)}
						{description && (
							<p
								className={cn(
									radioGroupDescriptionStyles.base,
									hasError && radioGroupDescriptionStyles.hasError,
								)}
							>
								{description}
							</p>
						)}
					</div>
				)}
			</div>
		);
	}

	if (variant === "cards") {
			const wrapper = applySlot(
				cn(
					radioGroupItemWrapperStyles.cards,
					hasError && "border-destructive",
					className,
				),
				slotStyles?.root,
			);
			return (
				<label
					data-kala-component="radio-group-item"
					htmlFor={itemId}
					className={wrapper.className}
					style={mergeStyle(style, wrapper.style)}
				>
				<div className="flex items-start gap-3 w-full">
					{radioButton}
					{children || (
						<div className="grid gap-1.5 leading-none flex-1">
							{label && (
								<div
									className={cn(
										radioGroupLabelStyles.cardBase,
										hasError && radioGroupLabelStyles.hasError,
									)}
								>
									{label}
								</div>
							)}
							{description && (
								<p
									className={cn(
										radioGroupDescriptionStyles.base,
										hasError && radioGroupDescriptionStyles.hasError,
									)}
								>
									{description}
								</p>
							)}
						</div>
					)}
				</div>
			</label>
		);
	}

	if (variant === "buttons") {
			const wrapper = applySlot(
				cn(
					radioGroupItemWrapperStyles.buttons,
					hasError && "border-destructive",
					className,
				),
				slotStyles?.root,
			);
			return (
				<label
					data-kala-component="radio-group-item"
					htmlFor={itemId}
					className={wrapper.className}
					style={mergeStyle(style, wrapper.style)}
				>
				<RadioGroupPrimitive.Item
					ref={ref}
					id={itemId}
					data-slot="radio-group-item"
					className="sr-only"
					{...props}
				>
					<RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" />
				</RadioGroupPrimitive.Item>
				<span>{label || children}</span>
			</label>
		);
	}

	return radioButton;
}

export { RadioGroup, RadioGroupItem };
