import type { KalaTheme } from "../../types";
import type { TextStyle } from "react-native";

export function label(theme: KalaTheme): TextStyle {
	return { fontSize: 14, fontWeight: "500", color: theme.foreground };
}

export function required(theme: KalaTheme): TextStyle {
	return { color: theme.destructive };
}

export function description(theme: KalaTheme): TextStyle {
	return { fontSize: 12, color: theme.mutedForeground };
}

export function error(theme: KalaTheme): TextStyle {
	return { fontSize: 12, color: theme.destructive };
}
