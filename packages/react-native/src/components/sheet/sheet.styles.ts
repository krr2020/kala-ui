import type { ViewStyle } from "react-native";
import { Easing } from "react-native-reanimated";
import { motion, tokens } from "../../tokens";

/**
 * Non-component wiring for Sheet: the offscreen sentinel used before the
 * content height is measured, the drag/entry offset composition, and the
 * header surface styles.
 */

// translateY held before onLayout delivers the snap height — guarantees
// the content starts fully below the viewport instead of flashing at rest
export const OFFSCREEN_Y = 10000;

/** Drag offset adds to the entry/exit offset so dismissal and animation
 * compose instead of fighting for the transform. Runs inside worklets:
 * the directive lets the reanimated babel plugin copy it onto the UI
 * runtime, while plain JS callers (tests) run it unchanged. */
export function composeOffset(entry: number, drag: number): number {
	"worklet";
	return entry + drag;
}

/** eased slide curve shared by the sheet entrance and exit */
export const SHEET_EASE = Easing.bezier(
	...(motion.ease.standard as [number, number, number, number]),
);

export function sheetHeader(): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: tokens.space.gutter,
	};
}

export function sheetTitle(theme: { foreground: string }): {
	color: string;
	fontSize: number;
	fontWeight: "600";
} {
	return { color: theme.foreground, fontSize: 16, fontWeight: "600" };
}

export function sheetCloseHit(): ViewStyle {
	// 44px hit target per the touch-target floor
	return {
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
	};
}
