import * as React from "react";
import { cn } from "../../lib/utils";
import { Flex, type FlexProps } from "../flex";

export interface StackProps extends Omit<FlexProps, "direction"> {
	direction?: "column" | "columnReverse";
}

const Stack = React.forwardRef<HTMLElement, StackProps>(
	(
		{ className, direction = "column", gap = 4, align = "stretch", ...props },
		ref,
	) => {
		return (
			<Flex
				ref={ref}
				direction={direction}
				gap={gap}
				align={align}
				className={cn("w-full", className)}
				{...props}
			/>
		);
	},
);
Stack.displayName = "Stack";

export { Stack };
