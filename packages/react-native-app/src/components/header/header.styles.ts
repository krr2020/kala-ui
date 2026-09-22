/**
 * Non-component wiring for Header: app-bar chrome, the 44dp touch
 * targets, and the loading skeleton's own surface and bones.
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
		borderBottomWidth: 1,
		borderBottomColor: theme.border,
		paddingHorizontal: 8,
	};
}

/** back/action hit area: 44dp floor with centered content */
export const touchTargetStyle: ViewStyle = {
	minHeight: 44,
	minWidth: 44,
	alignItems: "center",
	justifyContent: "center",
};

export function titleStyle(theme: KalaTheme): TextStyle {
	return {
		flex: 1,
		color: theme.foreground,
		fontSize: 17,
		fontWeight: "600",
		textAlign: "center",
	};
}

export const actionsRowStyle: ViewStyle = { flexDirection: "row", gap: 4 };

export function actionLabelStyle(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 15 };
}

// --- skeleton -----------------------------------------------------------

export const skeletonBarStyle: ViewStyle = {
	height: 56,
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	paddingHorizontal: 16,
	gap: 12,
};

export const skeletonCircleBone: ViewStyle = {
	height: 22,
	width: 22,
	borderRadius: 999,
};
export const skeletonTitleBone: ViewStyle = { height: 16, width: 140 };
