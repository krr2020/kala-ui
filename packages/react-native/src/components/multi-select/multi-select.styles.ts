import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

/** selection chip rendered inside the trigger; wraps with the +N badge */
export function chip(theme: KalaTheme): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 8,
		height: 24,
		borderRadius: 12,
		backgroundColor: theme.secondary,
	};
}

export function chipText(theme: KalaTheme): TextStyle {
	// chips sit on the secondary fill — its foreground pair keeps the text
	// legible in dark themes where theme.foreground is near-white on slate
	return { fontSize: 12, color: theme.secondaryForeground };
}
