	import { Slot } from "@radix-ui/react-slot";
	import type * as React from "react";
	import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";
	import { cn } from "../../lib/utils";

	export interface CenterProps extends React.ComponentProps<"div"> {
		asChild?: boolean;
		inline?: boolean;
		slotStyles?: SlotStyles;
	}

	function Center({
		ref,
		className,
		style,
		slotStyles,
		inline = false,
		asChild = false,
		...props
	}: CenterProps) {
		const Comp = asChild ? Slot : "div";
		const root = applySlot(
			cn(
				"flex items-center justify-center",
				inline ? "inline-flex" : "flex",
				className,
			),
			slotStyles?.root,
		);
		return (
			<Comp
				data-kala-component="center"
				className={root.className}
				style={mergeStyle(style, root.style)}
				ref={ref}
				{...props}
			/>
		);
	}

export { Center };
