import type { FlexProps } from "../flex";

export interface StackProps extends Omit<FlexProps, "direction"> {
	direction?: "column" | "columnReverse";
}
