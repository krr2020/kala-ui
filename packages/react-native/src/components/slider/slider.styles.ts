import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const THUMB_PX = 20;
export const TRACK_H = 8;
export const THUMB_R = THUMB_PX / 2;
/** thumbs are 20dp visuals — the touch floor is met with symmetric hitSlop */
export const THUMB_HIT_SLOP = 12;

export function root(disabled: boolean): ViewStyle {
	// disabled is carried by part tokens (range/thumb), not a root fade:
	// a fade makes the thumb read as translucent instead of locked
	return {};
}

export function track(theme: KalaTheme): ViewStyle {
	return {
		height: TRACK_H,
		borderRadius: TRACK_H / 2,
		backgroundColor: theme.muted,
		justifyContent: "center",
	};
}

/**
 * The thumbs ride an inset rail, not the raw track: percentage lefts are
 * measured inside [THUMB_R, width−THUMB_R] so a thumb at 0%/100% sits flush
 * with the line's ends instead of overflowing them by half a circle.
 */
export function rail(): ViewStyle {
	return {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: THUMB_R,
		right: THUMB_R,
	};
}

/**
 * The fill is anchored with left+right (never width) so both ends land
 * exactly where they should without runtime track math: a single thumb
 * fills from the line's very start (−THUMB_R in rail coords) to the thumb
 * center; a multi-thumb range spans first-center → last-center.
 */
export function range(
	theme: KalaTheme,
	leftPct: number,
	rightPct: number,
	single: boolean,
	disabled: boolean,
): ViewStyle {
	return {
		position: "absolute",
		top: 0,
		left: single ? -THUMB_R : `${leftPct}%`,
		right: `${100 - rightPct}%`,
		height: TRACK_H,
		borderRadius: TRACK_H / 2,
		backgroundColor: disabled ? theme.mutedForeground : theme.primary,
	};
}

export function thumb(
	theme: KalaTheme,
	leftPct: number,
	disabled: boolean,
	z: number,
): ViewStyle {
	return {
		position: "absolute",
		// center the 20dp thumb on the 8dp line: (8−20)/2 = −6
		top: (TRACK_H - THUMB_PX) / 2,
		left: `${leftPct}%`,
		// rail points are thumb CENTERS — pull the box back by half a thumb
		marginLeft: -THUMB_R,
		width: THUMB_PX,
		height: THUMB_PX,
		borderRadius: THUMB_R,
		backgroundColor: theme.background,
		borderWidth: 2,
		borderColor: disabled ? theme.mutedForeground : theme.primary,
		// equal thumbs overlap; the later one stays on top deterministically
		zIndex: z,
	};
}
