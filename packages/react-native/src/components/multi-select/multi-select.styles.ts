import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function chipRow(): ViewStyle {
	return { flexDirection: "row", alignItems: "center", gap: 4 };
}

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

export function searchField(theme: KalaTheme): TextStyle {
	return {
		minHeight: 40,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: theme.border,
		fontSize: 14,
		color: theme.foreground,
	};
}

export function groupHeader(theme: KalaTheme): TextStyle {
	return {
		marginTop: 8,
		fontSize: 12,
		fontWeight: "600",
		color: theme.mutedForeground,
	};
}

export function emptyText(theme: KalaTheme): TextStyle {
	return {
		paddingVertical: 12,
		fontSize: 14,
		color: theme.mutedForeground,
	};
}
