import { Slot } from "@radix-ui/react-slot";
import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import type { CenterProps } from "./center.types";

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
