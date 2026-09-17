import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const BOX = 22;

export function root(disabled: boolean): ViewStyle {
	return {
		minWidth: 44,
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		opacity: disabled ? 0.5 : 1,
	};
}

export function box(theme: KalaTheme, active: boolean): ViewStyle {
	return {
		width: BOX,
		height: BOX,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: active ? theme.primary : theme.card,
		borderWidth: 1,
		borderColor: active ? theme.primary : theme.border,
	};
}

export function label(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 15, flex: 1 };
}
