/**
 * Button Component
 * Base button primitive with variants
 */

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { buttonStyles } from "../../config/button";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { ButtonProps } from "./button.types";

const buttonVariants = cva(buttonStyles.base, {
	variants: buttonStyles.variants,
	compoundVariants: buttonStyles.compoundVariants as never,
	defaultVariants: buttonStyles.defaultVariants,
});

	export function Button({
		ref,
		className,
		style,
		slotStyles,
		variant,
		color,
		size,
		fullWidth,
		rounded,
		isLoading,
		asChild = false,
		children,
		disabled,
		...props
	}: ButtonProps) {
		const Comp = asChild ? Slot : "button";
		const effectiveDisabled = isLoading || disabled;
		const root = applySlot(
			cn(
				buttonVariants({
					variant,
					color,
					size,
					fullWidth,
					rounded,
					className,
				}),
				// asChild renders arbitrary elements (e.g. <a>) where the
					// `disabled` attribute is invalid — fall back to ARIA + CSS
				asChild &&
					effectiveDisabled &&
					"pointer-events-none aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
			),
			slotStyles?.root,
		);
		const spinner = applySlot(buttonStyles.spinner, slotStyles?.spinner);
		return (
			<Comp
				data-kala-component="button"
				className={root.className}
				style={mergeStyle(style, root.style)}
				ref={ref}
				disabled={asChild ? undefined : effectiveDisabled}
				aria-disabled={asChild ? effectiveDisabled || undefined : undefined}
				aria-busy={isLoading || undefined}
				{...props}
			>
			{asChild ? (
				children
			) : (
				<>
					{isLoading && (
						<svg
							className={spinner.className}
							style={spinner.style}
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					)}
					{children}
				</>
			)}
		</Comp>
	);
}

export { buttonVariants };
