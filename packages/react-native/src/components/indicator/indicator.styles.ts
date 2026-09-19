/**
 * Non-component wiring for Indicator: the four anchor corners and the
 * style builder that places the badge for each overlap mode.
 */
import type {
	IndicatorAnchorOrigin,
	IndicatorOverlap,
} from "./indicator.types";

const CORNERS: Record<
	`${IndicatorAnchorOrigin["vertical"]}-${IndicatorAnchorOrigin["horizontal"]}`,
	{ top?: boolean; left?: boolean }
> = {
	"top-left": { top: true, left: true },
	"top-right": { top: true },
	"bottom-left": { left: true },
	"bottom-right": {}
};

/**
 * Places the badge for the corner + overlap pair; offset [x, y] nudges
 * after (positive x right, positive y down, Ant model).
 *
 * rectangular: the badge centers on the corner (-size/2 on the anchored
 * edges), matching the web translate(-50%, -50%) anchors.
 * circular: the centered anchor plus a size/2+2 pull-in, leaving a 2px
 * gap from each anchored edge so the withBorder ring reads against a
 * circular target (avatar status-dot convention).
 */
export function anchorStyle(
	anchorOrigin: IndicatorAnchorOrigin,
	overlap: IndicatorOverlap,
	offset: [number, number],
	size: number,
) {
	const half = size / 2;
	const inset = overlap === "circular" ? half + 2 : 0;
	const corner =
		CORNERS[`${anchorOrigin.vertical}-${anchorOrigin.horizontal}`];
	const [dx, dy] = offset;
	const style: Record<string, number> = {};
	if (corner.top) style.top = -half + inset + dy;
	else style.bottom = -half + inset - dy;
	if (corner.left) style.left = -half + inset + dx;
	else style.right = -half + inset - dx;
	return style;
}
