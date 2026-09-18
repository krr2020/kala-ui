/**
 * Non-component wiring for the Dialog shell: size clamps, drag-to-dismiss
 * geometry, and themed scrim/card/close surfaces. Compound part styles
 * live in their own part files.
 */
import type { ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { DialogSize } from "./dialog.types";

export const MAX_WIDTH: Record<Exclude<DialogSize, "full">, number> = {
	sm: 384,
	md: 512,
	lg: 672,
};

/** Per-tier width as a share of the padded wrapper — distinct on phones. */
export const WIDTH_PCT: Record<DialogSize, "80%" | "90%" | "100%"> = {
	sm: "80%",
	md: "90%",
	lg: "100%",
	full: "100%",
};

export const DRAG_DISMISS_THRESHOLD = 96;
export const MIN_DRAG_OPACITY = 0.5;

/** Linear fade from 1 to MIN_DRAG_OPACITY across the threshold distance. */
export function dragOpacityFor(dragDy: number): number {
	return (
		1 -
		(Math.min(dragDy, DRAG_DISMISS_THRESHOLD) * (1 - MIN_DRAG_OPACITY)) /
			DRAG_DISMISS_THRESHOLD
	);
}

/**
 * Ink scrim over the foreground token so the veil re-tints with dark
 * mode instead of a hardcoded black.
 */
export const scrimStyle = (theme: KalaTheme): ViewStyle => ({
	position: "absolute",
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	backgroundColor: `${String(theme.foreground)}80`,
});

export function cardStyle(
	theme: KalaTheme,
	size: DialogSize,
	dragDy: number,
): ViewStyle {
	const isFull = size === "full";
	return {
		// tier share of the padded wrapper; the px cap binds first on tablets
		width: WIDTH_PCT[size],
		height: isFull ? "100%" : undefined,
		maxWidth: isFull ? undefined : MAX_WIDTH[size],
		maxHeight: isFull ? undefined : "90%",
		// full bleeds edge to edge: no radius, no outer border, no caps;
		// keyboard safety comes from the wrapper's KeyboardAvoidingView
		borderRadius: isFull ? 0 : tokens.radius.card,
		borderWidth: isFull ? 0 : 1,
		backgroundColor: theme.card,
		borderColor: theme.border,
		overflow: "hidden",
		// fixed chrome: header and footer pin top/bottom, the body column
		// child between them is the only scroll region
		flexDirection: "column",
		opacity: dragOpacityFor(dragDy),
		// the card follows the finger while dragging; upward drags clamp at 0
		transform: [{ translateY: Math.max(0, dragDy) }],
	};
}

export const closeStyle = (): ViewStyle => ({
	position: "absolute",
	top: 10,
	right: 10,
	padding: 6,
	borderRadius: tokens.radius.control,
});

/**
 * Status-bar clearance for the dialog wrapper. The translucent Modal
 * draws under the bar, so the wrapper pads down by the safe-area top
 * inset; the 24 fallback covers environments reporting no inset.
 */
export const safeTopPadding = (topInset: number | undefined): number =>
	topInset ?? 24;
