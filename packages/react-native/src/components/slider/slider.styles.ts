import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const THUMB_PX = 20;
export const TRACK_H = 8;
export const THUMB_R = THUMB_PX / 2;
/** thumbs are 20dp visuals — the touch floor is met with symmetric hitSlop */
export const THUMB_HIT_SLOP = 12;

export function root(disabled: boolean): ViewStyle {
	return { opacity: disabled ? 0.5 : 1 };
}

export function track(theme: KalaTheme): ViewStyle {
	return {
		height: TRACK_H,
		borderRadius: TRACK_H / 2,
		backgroundColor: theme.muted,
		justifyContent: "center",
	};
}

export function range(theme: KalaTheme, widthPct: number): ViewStyle {
	return {
		position: "absolute",
		left: 0,
		height: TRACK_H,
		borderRadius: TRACK_H / 2,
		backgroundColor: theme.primary,
		width: `${widthPct}%`,
	};
}

export function thumb(theme: KalaTheme, leftPct: number): ViewStyle {
	return {
		position: "absolute",
		left: `${leftPct}%`,
		// center the thumb on its value point
		marginLeft: -THUMB_R,
		width: THUMB_PX,
		height: THUMB_PX,
		borderRadius: THUMB_R,
		backgroundColor: theme.background,
		borderWidth: 2,
		borderColor: theme.primary,
	};
}
