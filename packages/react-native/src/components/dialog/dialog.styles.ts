/**
 * Non-component wiring for Dialog: size clamps, drag-to-dismiss
 * geometry, and themed surfaces for the scrim, card, and compound parts.
 */
import type { TextStyle, ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { DialogSize } from "./dialog.types";

export const MAX_WIDTH: Record<Exclude<DialogSize, "full">, number> = {
	sm: 384,
	md: 512,
	lg: 672,
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
		width: isFull ? "100%" : "90%",
		height: isFull ? "100%" : undefined,
		maxWidth: isFull ? undefined : MAX_WIDTH[size],
		maxHeight: isFull ? undefined : "90%",
		borderRadius: isFull ? 0 : tokens.radius.card,
		backgroundColor: theme.card,
		borderWidth: 1,
		borderColor: theme.border,
		overflow: "hidden",
		opacity: dragOpacityFor(dragDy),
		// the card follows the finger while dragging; upward drags clamp at 0
		transform: [{ translateY: Math.max(0, dragDy) }],
	};
}

export const headerStyle = (theme: KalaTheme): ViewStyle => ({
	paddingHorizontal: 24,
	paddingVertical: 16,
	borderBottomWidth: 1,
	borderColor: theme.border,
	gap: 6,
});

export const footerStyle = (theme: KalaTheme): ViewStyle => ({
	flexDirection: "row",
	justifyContent: "flex-end",
	flexWrap: "wrap",
	gap: 8,
	paddingHorizontal: 24,
	paddingVertical: 16,
	borderTopWidth: 1,
	borderColor: theme.border,
	backgroundColor: theme.muted,
});

export const titleStyle = (theme: KalaTheme): TextStyle => ({
	color: theme.foreground,
	fontSize: 18,
	fontWeight: "600",
});

export const descriptionStyle = (theme: KalaTheme): TextStyle => ({
	color: theme.mutedForeground,
	fontSize: 14,
});

export const partTextStyle = (theme: KalaTheme): TextStyle => ({
	color: theme.foreground,
	fontSize: 14,
});

export const closeStyle = (): ViewStyle => ({
	position: "absolute",
	top: 10,
	right: 10,
	padding: 6,
	borderRadius: tokens.radius.control,
});
