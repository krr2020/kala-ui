import { cn } from "../../lib/utils";
import { Flex } from "../flex";
import type { GroupProps } from "./group.types";

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
			data-kala-component="group"
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
