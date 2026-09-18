import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";

/**
 * Polymorphic props: everything the rendered element accepts, plus `as` /
 * `asChild`. Typed per element — `<Box as="a" href>` typechecks, `<Box
 * gap={2}>` (a Flex prop) is a compile error.
 */
export type BoxProps<T extends React.ElementType = "div"> = Omit<
	React.ComponentProps<T>,
	"as" | "asChild"
> & {
	as?: T;
	asChild?: boolean;
	slotStyles?: SlotStyles;
};

export function Box<T extends React.ElementType = "div">(props: BoxProps<T>) {
	const {
		className,
		style,
		slotStyles,
		asChild = false,
		as: Tag = "div",
		ref,
		...rest
	} = props as BoxProps<"div">;
	const Comp = (asChild ? Slot : Tag) as React.ElementType;
	const root = applySlot(cn(className), slotStyles?.root);
	return (
		<Comp
			data-kala-component="box"
			className={root.className}
			style={mergeStyle(style, root.style)}
			ref={ref}
			{...rest}
		/>
	);
}
