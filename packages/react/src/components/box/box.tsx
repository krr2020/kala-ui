import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
	asChild?: boolean;
	as?: React.ElementType;
	// biome-ignore lint/suspicious/noExplicitAny: Support polymorphic props
	[key: string]: any;
}

const Box = React.forwardRef<HTMLElement, BoxProps>(
	({ className, asChild = false, as: Tag = "div", ...props }, ref) => {
		const Comp = asChild ? Slot : Tag;
		return <Comp className={cn(className)} ref={ref} {...props} />;
	},
);
Box.displayName = "Box";

export { Box };
