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

/** Drag offset and keyboard lift add to the entry/exit offset so
 * dismissal, animation and keyboard avoidance compose instead of fighting
 * for the transform. Runs inside worklets: the directive lets the
 * reanimated babel plugin copy it onto the UI runtime, while plain JS
 * callers (tests) run it unchanged. */
export function composeOffset(entry: number, drag: number, kb = 0): number {
	"worklet";
	return entry + drag - kb;
}

/** eased slide curve shared by the sheet entrance and exit */
export const SHEET_EASE = Easing.bezier(
	...(motion.ease.standard as [number, number, number, number]),
);

/** Overlay backdrop color composed from the theme's overlay + overlayAlpha
 * tokens — themes differ in overlay strength, so a shared hardcode would
 * wash out dark mode. Pure JS: the string is resolved on the JS thread and
 * only ever rides a static View style (the animated part is opacity). */
export function sheetOverlay(theme: {
	overlay: string;
	overlayAlpha: number;
}): string {
	const hex = theme.overlay.replace("#", "");
	const full =
		hex.length === 3
			? hex
					.split("")
				.map((c) => c + c)
				.join("")
			: hex;
	const n = Number.parseInt(full, 16);
	const alpha = Math.min(1, Math.max(0, theme.overlayAlpha));
	return `rgba(${(n >> 16) & 0xff}, ${(n >> 8) & 0xff}, ${n & 0xff}, ${Math.round(alpha * 100) / 100})`;
}

export function sheetHeader(theme: { separator: string }): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: tokens.space.gutter,
		// hairline dividing the header from the body when a title renders
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: theme.separator,
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
