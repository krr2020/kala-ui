import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function comboboxStyles(theme: KalaTheme): {
	search: TextStyle;
	empty: TextStyle;
} {
	return {
		search: {
			minHeight: 40,
			paddingHorizontal: 12,
			borderWidth: 1,
			borderRadius: 8,
			borderColor: theme.border,
			fontSize: 14,
			color: theme.foreground,
		},
		empty: {
			paddingVertical: 12,
			fontSize: 14,
			color: theme.mutedForeground,
		},
	};
}
