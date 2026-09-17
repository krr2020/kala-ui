/**
 * Style tables for Progress: size heights and the track/fill builders.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";
import type { ProgressSize } from "./progress.types";

export const HEIGHT: Record<ProgressSize, number> = { sm: 4, md: 10, lg: 16 };

export const trackStyle = (size: ProgressSize, theme: KalaTheme): ViewStyle => ({
	width: "100%",
	height: HEIGHT[size],
	borderRadius: 999,
	// 20% alpha ≈ "33" in #RRGGBBAA — web's bg-primary/20
	backgroundColor: `${String(theme.primary)}33`,
	overflow: "hidden",
	flexDirection: "row",
});

export const indicatorStyle = (pct: number, color: string): ViewStyle => ({
	width: `${pct}%`,
	height: "100%",
	backgroundColor: color,
	alignItems: "center",
	justifyContent: "center",
});

export const valueStyle = (
	color: string,
	size: ProgressSize,
): { color: string; fontSize: number; fontWeight: "500" } => ({
	color,
	fontSize: size === "lg" ? 12 : 10,
	fontWeight: "500",
});
