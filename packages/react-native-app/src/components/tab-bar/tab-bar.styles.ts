/**
 * Non-component wiring for TabBar: the bottom-bar chrome, tab item
 * layout, and the loading skeleton's surface and bones.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { TextStyle, ViewStyle } from "react-native";

export const HEIGHT = 56;
export const ICON = 22;

export function barStyle(theme: KalaTheme): ViewStyle {
	return {
		height: HEIGHT,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.background,
		borderTopWidth: 1,
		borderTopColor: theme.border,
		paddingHorizontal: 4,
	};
}

export const itemStyle: ViewStyle = {
	flex: 1,
	minHeight: 44,
	minWidth: 44,
	alignItems: "center",
	justifyContent: "center",
	gap: 2,
};

export const itemLabelStyle = (tint: string): TextStyle => ({
	color: tint,
	fontSize: 11,
});

// --- skeleton -----------------------------------------------------------

export const skeletonBarStyle: ViewStyle = {
	height: 56,
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-around",
	paddingHorizontal: 16,
};

export const skeletonTabChipStyle: ViewStyle = { alignItems: "center", gap: 4 };

export const skeletonIconBone: ViewStyle = {
	height: 22,
	width: 22,
	borderRadius: 999,
};
export const skeletonLabelBone: ViewStyle = { height: 10, width: 48 };
