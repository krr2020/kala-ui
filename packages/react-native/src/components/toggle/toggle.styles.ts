import type { TextStyle, ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { ToggleSize } from "./toggle.types";

export const TOGGLE_HEIGHT: Record<ToggleSize, number> = {
	sm: 36,
	md: tokens.size.controlH,
	lg: 44,
};

export const PAD_X: Record<ToggleSize, number> = { sm: 6, md: 8, lg: 10 };

export const TOGGLE_FONT: Record<ToggleSize, number> = {
	sm: 13,
	md: 14,
	lg: 16,
};

/** per-tier height over the shared 44dp touch floor */
export function baseSurface(size: ToggleSize): ViewStyle {
	const height = TOGGLE_HEIGHT[size];
	return {
		minHeight: height,
		minWidth: 44,
		paddingHorizontal: PAD_X[size],
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 8,
		// a long label shrinks the text instead of pushing past the parent
		maxWidth: "100%",
		borderRadius: tokens.radius.control,
	};
}

/**
 * Touch-slop expansion for the 44dp floor: heights below 44 grow the
 * pressable's touch area, not its visual box. Must land on the Pressable
 * `hitSlop` prop — RN silently ignores hitSlop inside a style object.
 */
export function hitSlopFor(
	size: ToggleSize,
): { top: number; bottom: number; left: number; right: number } | undefined {
	const slop = Math.max(0, (44 - TOGGLE_HEIGHT[size]) / 2);
	return slop > 0 ? { top: slop, bottom: slop, left: 0, right: 0 } : undefined;
}

export function text(size: ToggleSize, fg: string): TextStyle {
	return {
		color: fg,
		fontSize: TOGGLE_FONT[size],
		fontWeight: "500",
		// long labels wrap inside the surface instead of widening it
		flexShrink: 1,
		textAlign: "center",
	};
}
