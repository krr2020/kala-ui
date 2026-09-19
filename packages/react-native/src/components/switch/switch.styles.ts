import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const TRACK_W = 40;
export const TRACK_H = 24;
export const THUMB = 20;
export const INSET = 2;
export const THUMB_TRAVEL = TRACK_W - THUMB - 2 * INSET;

export function root(disabled: boolean): ViewStyle {
	return {
		minWidth: 44,
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		gap: 10,
		opacity: disabled ? 0.5 : 1,
	};
}

export function label(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 15, flex: 1 };
}

export function track(theme: KalaTheme, value: boolean): ViewStyle {
	return {
		width: TRACK_W,
		height: TRACK_H,
		borderRadius: TRACK_H / 2,
		backgroundColor: value ? theme.primary : theme.input,
	};
}

// the off pill's stroke is an absolute overlay, not a borderWidth on the
// track: a border shrinks the content box (24 - 2 stroke - 2x2 padding =
// 18dp), which starves the 20dp thumb's vertical centering and drops it
// below center. The overlay outlines without touching child layout.
export function trackStroke(theme: KalaTheme): ViewStyle {
	return {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: TRACK_H / 2,
		borderWidth: 1,
		borderColor: theme.border,
	};
}

export function thumb(
	theme: KalaTheme,
	value: boolean,
	disabled: boolean,
): ViewStyle {
	return {
		position: "absolute",
		top: INSET,
		left: INSET,
		width: THUMB,
		height: THUMB,
		borderRadius: THUMB / 2,
		// constant knob geometry, theme-aware knob color: the on-knob uses
	// primaryForeground (the token designed to sit on primary — navy in
	// dark), the off-knob mutedForeground (soft slate in dark, visible on
	// the input pill yet never stark white)
		backgroundColor: value ? theme.primaryForeground : theme.mutedForeground,
	elevation: disabled ? 0 : 2,
	shadowColor: theme.shadowColor,
		shadowOpacity: disabled ? 0 : 0.15,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
		transform: [{ translateX: value ? THUMB_TRAVEL : 0 }],
	};
}
