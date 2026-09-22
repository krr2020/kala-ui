/**
 * Non-component wiring for MetricCard: the tone→token accent mapping,
 * card/body/text tables, and the skeleton's shared card frame.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { TextStyle, ViewStyle } from "react-native";
import type { MetricTone } from "./metric-card.types";

export const TONE_BG: Partial<Record<MetricTone, string>> = {
	primary: "primary",
	destructive: "destructive",
	success: "success",
	warning: "warning",
	info: "info",
	muted: "muted",
};

export function cardStyle(theme: KalaTheme): ViewStyle {
	return {
		flexDirection: "row",
		backgroundColor: theme.card,
		borderWidth: 1,
		borderColor: theme.border,
	};
}

export const accentStyle = (color: string): ViewStyle => ({
	width: 4,
	backgroundColor: color,
});

export const bodyStyle: ViewStyle = { flex: 1, padding: 16, gap: 6 };

export const titleRowStyle: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
};

export function titleStyle(theme: KalaTheme): TextStyle {
	return {
		fontSize: 12,
		fontWeight: "600",
		color: theme.mutedForeground,
	};
}

export function valueStyle(theme: KalaTheme): TextStyle {
	return { fontSize: 30, fontWeight: "700", color: theme.foreground };
}

export const changeStyle = (color: string): TextStyle => ({
	fontSize: 13,
	color,
});

export function subtitleStyle(theme: KalaTheme): TextStyle {
	return { fontSize: 13, color: theme.mutedForeground };
}

// --- skeleton -----------------------------------------------------------

/** the skeleton reuses the live card frame with a muted accent */
export const skeletonAccentStyle = (theme: KalaTheme): ViewStyle => ({
	width: 4,
	backgroundColor: theme.muted,
});

export const skeletonBodyStyle: ViewStyle = { flex: 1, padding: 16, gap: 10 };

export const skeletonTitleBone: ViewStyle = { height: 12, width: "50%" };
export const skeletonValueBone: ViewStyle = { height: 28, width: "70%" };
export const skeletonChangeBone: ViewStyle = { height: 12, width: "40%" };
