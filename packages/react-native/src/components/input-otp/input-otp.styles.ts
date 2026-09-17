import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const row: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	gap: 8,
};

// zero-size off-stage field: keeps keyboard focus ownership without
// participating in layout
export const field: TextStyle = {
	width: 1,
	height: 1,
	opacity: 0,
};

export const slot: ViewStyle = {
	minWidth: 44,
	minHeight: 44,
	alignItems: "center",
	justifyContent: "center",
	borderWidth: 1,
	borderRadius: 8,
};

export function slotText(theme: KalaTheme): TextStyle {
	return { fontSize: 16, color: theme.foreground };
}

export const separator: ViewStyle = {
	alignItems: "center",
	justifyContent: "center",
	paddingHorizontal: 4,
};

export function separatorText(theme: KalaTheme): TextStyle {
	return { fontSize: 16, color: theme.mutedForeground };
}
