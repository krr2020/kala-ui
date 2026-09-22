/**
 * Non-component wiring for the charts family (bar/donut/sparkline +
 * skeleton): empty-state surfaces, the donut overlay chrome, and the
 * legend-row layout.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { DimensionValue, TextStyle, ViewStyle } from "react-native";

/** centered empty message inside the boxed empty arm */
export function emptyTextStyle(theme: KalaTheme, fontSize: number): TextStyle {
	return { color: theme.mutedForeground, fontSize };
}

/** boxed empty arm: centered box on a themed hairline (bar variant) */
export function emptyBoxStyle(
	theme: KalaTheme,
	dimensions: { width?: DimensionValue; height: number },
): ViewStyle {
	return {
		...dimensions,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: theme.border,
	};
}

export const labelRowStyle = (width: number): ViewStyle => ({
	flexDirection: "row",
	width,
});

export function labelTextStyle(theme: KalaTheme): TextStyle {
	return {
		flex: 1,
		textAlign: "center",
		fontSize: 11,
		color: theme.mutedForeground,
	};
}

/** donut svg pins under the overlay so the center total hits the middle */
export const svgOverlayStyle: ViewStyle = {
	position: "absolute",
	top: 0,
	left: 0,
};

export const donutOverlayStyle = (size: number): ViewStyle => ({
	position: "absolute",
	width: size,
	height: size,
	justifyContent: "center",
	alignItems: "center",
});

export const donutTotalStyle: TextStyle = { fontSize: 20, fontWeight: "700" };

// --- skeleton -----------------------------------------------------------

export const skeletonRootStyle: ViewStyle = { gap: 12 };

export const skeletonPlotStyle = (height: number): ViewStyle => ({
	height,
	width: "100%",
});

export const skeletonLegendRowStyle: ViewStyle = {
	flexDirection: "row",
	gap: 12,
	justifyContent: "center",
};

export const skeletonLegendChipStyle: ViewStyle = {
	flexDirection: "row",
	gap: 4,
	alignItems: "center",
};

export const skeletonLegendDot: ViewStyle = { width: 8, height: 8 };
export const skeletonLegendBone: ViewStyle = { width: 32, height: 8 };
