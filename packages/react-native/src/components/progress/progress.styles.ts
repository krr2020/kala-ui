/**
 * Style tables for Progress: size heights and the track/fill builders.
 * A track carrying inner text (md/lg) renders at the 16dp text pill so
 * the value digits stay legible; the bar-only pill keeps its size height.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";
import type { ProgressSize } from "./progress.types";

export const HEIGHT: Record<ProgressSize, number> = { sm: 4, md: 10, lg: 16 };
/** smallest pill that fits the 10-12px value text without clipping */
export const TEXT_PILL_HEIGHT = 16;

export const trackStyle = (
	size: ProgressSize,
	theme: KalaTheme,
	hasText = false,
): ViewStyle => ({
	width: "100%",
	height: hasText ? Math.max(HEIGHT[size], TEXT_PILL_HEIGHT) : HEIGHT[size],
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

export type ValueStyle = {
	color: string;
	fontSize: number;
	fontWeight: "500";
	// Android pads Text with ascent/descent room by default — the md/lg
	// pill is only 10/16dp tall, so the padding clips the digits. The
	// indicator centers the text; keep the table the only style source
	// (no consumer prop path) so the fix cannot be overridden away.
	includeFontPadding: false;
	textAlignVertical: "center";
};

export const valueStyle = (color: string, size: ProgressSize): ValueStyle => ({
	color,
	fontSize: size === "lg" ? 12 : 10,
	fontWeight: "500",
	includeFontPadding: false,
	textAlignVertical: "center",
});
