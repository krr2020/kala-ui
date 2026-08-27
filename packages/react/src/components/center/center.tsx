import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { cn } from "../../lib/utils";

export interface CenterProps extends React.ComponentProps<"div"> {
	asChild?: boolean;
	inline?: boolean;
}

function Center({
	ref,
	className,
	inline = false,
	asChild = false,
	...props
}: CenterProps) {
	const Comp = asChild ? Slot : "div";
	return (
		<Comp
			data-kala-component="center"
			className={cn(
				"flex items-center justify-center",
				inline ? "inline-flex" : "flex",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
}

export { Center };
