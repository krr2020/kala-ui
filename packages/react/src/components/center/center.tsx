import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
	inline?: boolean;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
	({ className, inline = false, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";
		return (
			<Comp
				className={cn(
					"flex items-center justify-center",
					inline ? "inline-flex" : "flex",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Center.displayName = "Center";

export { Center };
