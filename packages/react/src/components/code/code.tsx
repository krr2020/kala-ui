import type * as React from "react";
import { cn } from "../../lib/utils";
import { applySlot, mergeStyle, type SlotStyles } from "../../lib/slot-styles";

export interface CodeProps
	extends React.HTMLAttributes<HTMLElement>,
		React.RefAttributes<HTMLElement> {
	/** Whether to render as a block (pre) or inline (code) */
	block?: boolean;
	/** Color scheme (class name for text/bg, e.g. "text-blue-600 bg-blue-50") */
	color?: string;
	slotStyles?: SlotStyles;
}

export function Code({
	ref,
	className,
	style,
	slotStyles,
	block = false,
	color,
	children,
	...props
}: CodeProps) {
	const Comp = block ? "pre" : "code";

	return (
		<Comp
			data-kala-component="code"
			// biome-ignore lint/suspicious/noExplicitAny: polymorphic ref
			ref={ref as any}
			className={applySlot(
				cn(
					"font-mono text-sm",
					block
						? "block w-full overflow-x-auto rounded-lg bg-muted p-4"
						: "rounded bg-muted px-1.5 py-0.5",
					color,
					className,
				),
				slotStyles?.root,
			).className}
			style={mergeStyle(
				style,
				applySlot(null, slotStyles?.root).style,
			)}
			{...props}
		>
			{children}
		</Comp>
	);
}
