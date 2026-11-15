import type { TextStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function label(theme: KalaTheme): TextStyle {
	return { fontSize: 14, fontWeight: "500", color: theme.foreground };
}

export function required(theme: KalaTheme): TextStyle {
	return { color: theme.destructive };
}
