import { cn } from "../../lib/utils";
import { Flex, type FlexProps } from "../flex";

export interface GroupProps extends Omit<FlexProps, "direction"> {
	direction?: "row" | "rowReverse";
}

function Group({
	ref,
	className,
	direction = "row",
	gap = 4,
	align = "center",
	wrap = "wrap",
	...props
}: GroupProps) {
	return (
		<Flex
			ref={ref}
			direction={direction}
			gap={gap}
			align={align}
			wrap={wrap}
			className={cn(className)}
			{...props}
		/>
	);
}

export { Group };
