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
	const borderWidth = 2;
	return {
		width: BOX,
		height: BOX,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
		// resting box is border-defined, not card-filled: a card fill is
		// invisible on card-colored surfaces (dark sheets/pages). RN sizes
		// width/height border-box, so the stroke draws inside the 22dp box
		backgroundColor: active ? theme.primary : "transparent",
		borderWidth,
		borderColor: active ? theme.primary : theme.border,
	};
}

export function label(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 15, flex: 1 };
}
