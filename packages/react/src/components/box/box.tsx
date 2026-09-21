import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { BoxProps } from "./box.types";

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
