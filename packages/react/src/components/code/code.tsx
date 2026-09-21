import { applySlot, mergeStyle } from "../../lib/slot-styles";
import { cn } from "../../lib/utils";
import { useSlotStyles } from "../kala-provider";
import type { CodeProps } from "./code.types";

export function Code({
	ref,
	className,
	style,
	slotStyles: slotStylesRaw,
	block = false,
	color,
	children,
	...props
}: CodeProps) {
	const slotStyles = useSlotStyles("code", slotStylesRaw);
	const Comp = block ? "pre" : "code";

	return (
		<Comp
			data-kala-component="code"
			// biome-ignore lint/suspicious/noExplicitAny: polymorphic ref
			ref={ref as any}
			className={
				applySlot(
					cn(
						"font-mono text-sm",
						block
							? "block w-full overflow-x-auto rounded-lg bg-muted p-4"
							: "rounded bg-muted px-1.5 py-0.5",
						color,
						className,
					),
					slotStyles?.root,
				).className
			}
			style={mergeStyle(style, applySlot(null, slotStyles?.root).style)}
			{...props}
		>
			{children}
		</Comp>
	);
}
