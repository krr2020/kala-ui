import type { FlexProps } from "../flex/flex.types";

export interface GroupProps extends Omit<FlexProps, "direction"> {
	direction?: "row" | "rowReverse";
}
