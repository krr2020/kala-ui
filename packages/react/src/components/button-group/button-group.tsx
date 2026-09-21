import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type {
	ButtonGroupProps,
	ButtonGroupSeparatorProps,
	ButtonGroupTextProps,
} from "./button-group.types";

const buttonGroupVariants = cva("inline-flex isolate", {
	variants: {
		orientation: {
			horizontal:
				"flex-row [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none [&>button:not(:first-child)]:-ml-px [&>button:hover]:relative [&>button:hover]:z-10 [&>button:focus-visible]:relative [&>button:focus-visible]:z-10 [&>a:not(:first-child)]:rounded-l-none [&>a:not(:last-child)]:rounded-r-none [&>a:not(:first-child)]:-ml-px [&>a:hover]:relative [&>a:hover]:z-10 [&>a:focus-visible]:relative [&>a:focus-visible]:z-10",
			vertical:
				"flex-col [&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none [&>button:not(:first-child)]:-mt-px [&>button:hover]:relative [&>button:hover]:z-10 [&>button:focus-visible]:relative [&>button:focus-visible]:z-10 [&>a:not(:first-child)]:rounded-t-none [&>a:not(:last-child)]:rounded-b-none [&>a:not(:first-child)]:-mt-px [&>a:hover]:relative [&>a:hover]:z-10 [&>a:focus-visible]:relative [&>a:focus-visible]:z-10",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});

function ButtonGroup({
	className,
	style,
	slotStyles: slotStylesRaw,
	orientation = "horizontal",
	separated = false,
	children,
	...props
}: ButtonGroupProps) {
	const slotStyles = useSlotStyles("button-group", slotStylesRaw);
	const childrenArray = React.Children.toArray(children);

	return (
		<div
			data-kala-component="button-group"
			className={
				applySlot(
					cn(buttonGroupVariants({ orientation }), className),
					slotStyles?.root,
				).className
			}
			style={mergeStyle(style, applySlot(null, slotStyles?.root).style)}
			{...props}
		>
			{separated
				? childrenArray.map((child, index) => {
						const isLast = index === childrenArray.length - 1;
						const key = React.isValidElement(child)
							? child.key || index
							: index;

						return (
							<React.Fragment key={key}>
								{child}
								{!isLast && <ButtonGroupSeparator orientation={orientation} />}
							</React.Fragment>
						);
					})
				: children}
		</div>
	);
}

export const buttonGroupSeparatorVariants = cva("shrink-0 bg-separator z-30", {
	variants: {
		orientation: {
			horizontal: "w-px self-stretch -ml-px",
			vertical: "h-px self-stretch -mt-px",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});

function ButtonGroupSeparator({
	className,
	orientation = "horizontal",
	...props
}: ButtonGroupSeparatorProps) {
	return (
		<hr
			data-kala-component="button-group-separator"
			{...(orientation && { "aria-orientation": orientation })}
			className={cn(buttonGroupSeparatorVariants({ orientation }), className)}
			{...props}
		/>
	);
}

function ButtonGroupText({
	className,
	children,
	asChild = false,
	...props
}: ButtonGroupTextProps) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-kala-component="button-group-text"
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
				"text-foreground bg-muted border",
				"first:rounded-l last:rounded-r",
				"[.flex-col>&]:first:rounded-t [.flex-col>&]:last:rounded-b [.flex-col>&]:first:rounded-l-none [.flex-col>&]:last:rounded-r-none",
				className,
			)}
			{...props}
		>
			{children}
		</Comp>
	);
}

export {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	buttonGroupVariants,
};
