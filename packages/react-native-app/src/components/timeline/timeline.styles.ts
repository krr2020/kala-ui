/**
 * Non-component wiring for Timeline: the status dot mapping, rail
 * geometry, and the entry text tables.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { TextStyle, ViewStyle } from "react-native";
import type { TimelineStatus } from "./timeline.types";

export const DOT = 32;

/** status wash for the dot; 'pending' stays hollow on a 2px ring */
export function dotSurfaceStyle(
	theme: KalaTheme,
	status: TimelineStatus,
): ViewStyle {
	switch (status) {
		case "success":
			return { backgroundColor: theme.success };
		case "error":
			return { backgroundColor: theme.destructive };
		case "warning":
			return { backgroundColor: theme.warning };
		case "pending":
			return { backgroundColor: theme.muted, borderWidth: 2 };
		default:
			return { backgroundColor: theme.primary };
	}
}

export const rootStyle: ViewStyle = { flexDirection: "column" };

export const itemStyle: ViewStyle = { flexDirection: "row", gap: 16 };

export const railStyle: ViewStyle = {
	flexDirection: "column",
	alignItems: "center",
};

export function dotStyle(theme: KalaTheme): ViewStyle {
	return {
		width: DOT,
		height: DOT,
		borderRadius: DOT / 2,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
		borderColor: theme.mutedForeground,
	};
}

export const innerDotStyle = (color: string): ViewStyle => ({
	width: 8,
	height: 8,
	borderRadius: 4,
	backgroundColor: color,
});

export function lineStyle(theme: KalaTheme): ViewStyle {
	return {
		width: 2,
		flex: 1,
		minHeight: 24,
		marginTop: 4,
		backgroundColor: theme.border,
	};
}

export const contentStyle = (isLast: boolean): ViewStyle => ({
	flex: 1,
	paddingBottom: isLast ? 0 : 24,
});

export const titleRowStyle: ViewStyle = {
	flexDirection: "row",
	alignItems: "flex-start",
	justifyContent: "space-between",
	gap: 8,
};

export function titleStyle(theme: KalaTheme): TextStyle {
	return {
		flex: 1,
		fontSize: 14,
		fontWeight: "500",
		color: theme.foreground,
	};
}

export function timestampStyle(theme: KalaTheme): TextStyle {
	return { fontSize: 12, color: theme.mutedForeground };
}

export function descriptionStyle(theme: KalaTheme): TextStyle {
	return {
		marginTop: 4,
		fontSize: 14,
		color: theme.mutedForeground,
	};
}
