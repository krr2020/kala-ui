import type { TextStyle, ViewStyle } from "react-native";

export function triggerSurface(): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 44,
		minWidth: 44,
	};
}

export function triggerLabel(fg: string): TextStyle {
	return { color: fg, fontSize: 15, fontWeight: "600", flex: 1 };
}

export function contentSurface(): ViewStyle {
	return { overflow: "hidden", paddingTop: 4 };
}

export function contentText(fg: string): TextStyle {
	return { color: fg, fontSize: 14, lineHeight: 20 };
}
