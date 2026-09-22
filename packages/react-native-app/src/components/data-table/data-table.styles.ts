/**
 * Non-component wiring for DataTable: header row, pressable body rows,
 * and the loading skeleton's surface and bones.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { TextStyle, ViewStyle } from "react-native";

export const rootStyle = (theme: KalaTheme): ViewStyle => ({
	borderWidth: 1,
	borderColor: theme.border,
});

export function headerRowStyle(theme: KalaTheme): ViewStyle {
	return { flexDirection: "row", backgroundColor: theme.background };
}

export function headerCellStyle(theme: KalaTheme): TextStyle {
	return {
		flex: 1,
		fontSize: 12,
		fontWeight: "600",
		color: theme.mutedForeground,
		paddingHorizontal: 12,
		paddingVertical: 8,
	};
}

export function emptyTextStyle(theme: KalaTheme): TextStyle {
	return {
		color: theme.mutedForeground,
		padding: 16,
		textAlign: "center",
	};
}

export function rowStyle(theme: KalaTheme): ViewStyle {
	return {
		flexDirection: "row",
		minHeight: 44,
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: theme.border,
	};
}

export const cellStyle: ViewStyle = { flex: 1, paddingHorizontal: 12 };

export function cellTextStyle(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 14 };
}

// --- skeleton -----------------------------------------------------------

export function skeletonSurfaceStyle(theme: KalaTheme): ViewStyle {
	return {
		borderWidth: 1,
		borderColor: theme.border,
		padding: 12,
		gap: 10,
	};
}

export const skeletonHeaderBone: ViewStyle = { height: 14, width: "60%" };
export const skeletonRowBone: ViewStyle = { height: 12, width: "100%" };
