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
	return { fontSize: 12, color: theme.foreground };
}
