import { cn } from "../../lib/utils";
import { Flex, type FlexProps } from "../flex";

export interface StackProps extends Omit<FlexProps, "direction"> {
	direction?: "column" | "columnReverse";
}

function Stack({
	ref,
	className,
	direction = "column",
	gap = 4,
	align = "stretch",
	...props
}: StackProps) {
	return (
		<Flex
			data-kala-component="stack"
			ref={ref}
			direction={direction}
			gap={gap}
			align={align}
			className={cn("w-full", className)}
			{...props}
		/>
	);
}

export { Stack };
