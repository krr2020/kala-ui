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
import { cn } from "../../lib/utils";
import { Label } from "../label";

export interface RadioGroupProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
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
}

export interface RadioGroupItemProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
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
	error?: boolean;
}

const RadioGroupContext = React.createContext<{
	variant?: "default" | "cards" | "buttons";
	size?: "sm" | "md" | "lg";
}>({});

const radioGroupVariants = cva("", {
	variants: radioGroupStyles.variants,
	defaultVariants: radioGroupStyles.defaultVariants,
});

const radioGroupItemVariants = cva(radioGroupItemStyles.base, {
	variants: radioGroupItemStyles.variants,
	defaultVariants: radioGroupItemStyles.defaultVariants,
});

const RadioGroup = React.forwardRef<
	React.ComponentRef<typeof RadioGroupPrimitive.Root>,
	RadioGroupProps
>(({ className, variant = "default", size = "md", ...props }, ref) => {
	return (
		<RadioGroupContext.Provider value={{ variant, size }}>
			<RadioGroupPrimitive.Root
				ref={ref}
				data-slot="radio-group"
				className={cn(radioGroupVariants({ variant }), className)}
				{...props}
			/>
		</RadioGroupContext.Provider>
	);
});

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
	React.ComponentRef<typeof RadioGroupPrimitive.Item>,
	RadioGroupItemProps
>(({ className, label, description, error, children, ...props }, ref) => {
	const { variant = "default", size = "md" } =
		React.useContext(RadioGroupContext);
	const hasContent = label || description || children;

	const radioButton = (
		<RadioGroupPrimitive.Item
			ref={ref}
			data-slot="radio-group-item"
			className={cn(
				radioGroupItemVariants({
					variant:
						variant === "default" || variant === "cards" ? "default" : variant,
					size,
					error: error ? true : undefined,
				}),
				!hasContent && className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				data-slot="radio-group-indicator"
				className="flex items-center justify-center"
			>
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					fill="currentColor"
					className={radioGroupIndicatorSizes[size]}
					aria-hidden="true"
				>
					<title>Selected</title>
					<circle cx="4" cy="4" r="4" />
				</svg>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);

	// For default variant with label/description or custom children
	if (variant === "default" && hasContent) {
		return (
			<div className={cn(radioGroupItemWrapperStyles.default, className)}>
				{radioButton}
				{children || (
					<div className="grid gap-1.5 leading-none">
						{label && (
							<Label
								htmlFor={props.id}
								className={cn(
									radioGroupLabelStyles.base,
									error && radioGroupLabelStyles.error,
								)}
							>
								{label}
							</Label>
						)}
						{description && (
							<p
								className={cn(
									radioGroupDescriptionStyles.base,
									error && radioGroupDescriptionStyles.error,
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

	// For cards variant
	if (variant === "cards") {
		return (
			<label
				htmlFor={props.id}
				className={cn(
					radioGroupItemWrapperStyles.cards,
					error && "border-destructive",
					className,
				)}
			>
				<div className="flex items-start gap-3 w-full">
					{radioButton}
					{children || (
						<div className="grid gap-1.5 leading-none flex-1">
							{label && (
								<div
									className={cn(
										radioGroupLabelStyles.cardBase,
										error && radioGroupLabelStyles.error,
									)}
								>
									{label}
								</div>
							)}
							{description && (
								<p
									className={cn(
										radioGroupDescriptionStyles.base,
										error && radioGroupDescriptionStyles.error,
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

	// For buttons variant
	if (variant === "buttons") {
		return (
			<label
				htmlFor={props.id}
				className={cn(
					radioGroupItemWrapperStyles.buttons,
					error && "border-destructive",
					className,
				)}
			>
				<RadioGroupPrimitive.Item
					ref={ref}
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
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
