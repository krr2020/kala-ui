import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function calendarStyles(theme: KalaTheme): {
	monthLabel: TextStyle;
	weekday: TextStyle;
} {
	return {
		monthLabel: { color: theme.foreground, fontSize: 15, fontWeight: "600" },
		weekday: {
			color: theme.mutedForeground,
			fontSize: 12,
			fontWeight: "600",
			textAlign: "center",
		},
	};
}

export const NAV_HIT_SLOP = 6;

export function navCell(
	CELL_SIZE: number,
	state: { disabled: boolean; pressed: boolean },
): ViewStyle {
	return {
		width: CELL_SIZE,
		height: CELL_SIZE,
		alignItems: "center",
		justifyContent: "center",
		opacity: state.disabled ? 0.35 : state.pressed ? 0.6 : 1,
	};
}
