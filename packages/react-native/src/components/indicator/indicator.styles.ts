/**
 * Non-component wiring for Indicator: the nine anchor positions and the
 * style builder that centers the dot on each one.
 */
import type { IndicatorPosition } from "./indicator.types";

type Axis = "start" | "center" | "end";

export const ANCHORS: Record<
	IndicatorPosition,
	{ vertical: Axis; horizontal: Axis }
> = {
	"top-left": { vertical: "start", horizontal: "start" },
	"top-center": { vertical: "start", horizontal: "center" },
	"top-right": { vertical: "start", horizontal: "end" },
	"middle-left": { vertical: "center", horizontal: "start" },
	"middle-center": { vertical: "center", horizontal: "center" },
	"middle-right": { vertical: "center", horizontal: "end" },
	"bottom-left": { vertical: "end", horizontal: "start" },
	"bottom-center": { vertical: "end", horizontal: "center" },
	"bottom-right": { vertical: "end", horizontal: "end" },
};

/** Centers the dot on the anchor point; offset insets the anchored edges. */
export function anchorStyle(
	position: IndicatorPosition,
	offset: number,
	half: number,
) {
	const { vertical, horizontal } = ANCHORS[position];
	const style: Record<string, number | string> = {};
	if (vertical === "start") style.top = -half + offset;
	else if (vertical === "center") {
		style.top = "50%";
		style.marginTop = -half;
	} else style.bottom = -half + offset;
	if (horizontal === "start") style.left = -half + offset;
	else if (horizontal === "center") {
		style.left = "50%";
		style.marginLeft = -half;
	} else style.right = -half + offset;
	return style;
}
