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
		padding: INSET,
		alignItems: "flex-start",
		justifyContent: "center",
	};
}

export function thumb(theme: KalaTheme, value: boolean): ViewStyle {
	return {
		width: THUMB,
		height: THUMB,
		borderRadius: THUMB / 2,
		// unchecked thumb is muted, not card: card sits within a hair of the
		// input track in dark themes (both #1e-slate), leaving the off circle
		// invisible exactly when the user needs to see the off state
		backgroundColor: value ? theme.card : theme.mutedForeground,
		transform: [{ translateX: value ? THUMB_TRAVEL : 0 }],
	};
}
