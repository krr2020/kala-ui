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

/** bottom gap while the software keyboard is up — the keyboard replaces
 * the nav bar as the surface to clear, so the card pad collapses to this */
export const KEYBOARD_BOTTOM_GAP = 8;

/** ms the sheet holds its keyboard geometry after the keyboard hides.
 * Android fires DidHide the instant the tap that dismisses the keyboard
 * lands; resetting geometry at that moment re-lays-out the card under the
 * finger and Android cancels the in-flight press, so the reset waits out
 * the tap. iOS runs the reset immediately. */
export const KB_HIDE_SETTLE_MS = 200;

/** Keyboard geometry for a bottom-anchored sheet: the sheet lifts by the
 * FULL keyboard height (its bottom rides the keyboard top) and sheds only
 * the height that would poke above the top inset. Pure math on plain
 * numbers so the JS-thread listener can call it and worklets only read
 * the result through the shared value. */
export interface KeyboardAdjust {
	kbHeight: number;
	windowHeight: number;
	topInset: number;
	sheetHeight: number;
}

/** translateY applied while the keyboard is up — always the full visible
 * keyboard height so the pinned footer clears it. */
export function keyboardLift({ kbHeight }: KeyboardAdjust): number {
	return Math.max(0, kbHeight);
}

/** height the sheet must shed so its lifted top stops below the status
 * bar; 0 whenever the window still fits the sheet above the keyboard */
export function keyboardShrink({
	kbHeight,
	windowHeight,
	topInset,
	sheetHeight,
}: KeyboardAdjust): number {
	if (kbHeight <= 0) return 0;
	return Math.max(
		0,
		sheetHeight - (windowHeight - topInset - kbHeight),
	);
}

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
		// breathing room around the title row, above and below — kept tight;
		// the grabber tier above already supplies the sheet's inner rhythm
		paddingTop: 2,
		paddingBottom: 8,
		// negative margin cancels the content gutter so the hairline spans
		// the sheet edge to edge; inner padding restores the text rail
		marginHorizontal: -tokens.space.gutter,
		paddingHorizontal: tokens.space.gutter,
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
	// 44px hit target per the touch-target floor; never yields space to a
	// long wrapping title
	return {
		width: 44,
		height: 44,
		flexShrink: 0,
		alignItems: "center",
		justifyContent: "center",
	};
}

/** drawn affordance inside the close hit target — the Pressable keeps the
 * 44px target; this circle is what the user sees */
export function sheetCloseBubble(theme: { border: string }): ViewStyle {
	return {
		width: 32,
		height: 32,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: theme.border,
		alignItems: "center",
		justifyContent: "center",
	};
}

/** pinned footer tier — mirrors the header: hairline bleeding edge to
 * edge, padded content rail, breathing room below the body */
export function sheetFooter(theme: { border: string }): ViewStyle {
	return {
		marginHorizontal: -tokens.space.gutter,
		paddingHorizontal: tokens.space.gutter,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: theme.border,
	};
}
