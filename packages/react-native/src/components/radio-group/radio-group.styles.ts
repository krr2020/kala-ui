import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const CIRCLE = 22;
// active dot is the standard half-circle mark: 10dp in the 22dp circle,
// matching the web md indicator ratio (8/16)
export const DOT = 10;
export const STROKE = 2;
// standard stacked-list pitch: 44dp rows + 4 gap
export const GROUP_GAP = 4;
// inline row (web skeleton orientation=horizontal, gap-4)
export const INLINE_GAP = 16;

export function root(orientation: "vertical" | "horizontal" = "vertical"): ViewStyle {
	return orientation === "horizontal"
		? {
				flexDirection: "row",
				flexWrap: "wrap",
				gap: INLINE_GAP,
				alignItems: "center",
				alignSelf: "flex-start",
			}
		: { flexDirection: "column", gap: GROUP_GAP, alignSelf: "flex-start" };
}

export function item(isDisabled: boolean): ViewStyle {
	return {
		minWidth: 44,
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		// in the inline row a long-label item shrinks (body wraps) instead
		// of clipping or pushing siblings out
		flexShrink: 1,
		opacity: isDisabled ? 0.5 : 1,
	};
}

export function circle(
	theme: KalaTheme,
	checked: boolean,
	hasError = false,
): ViewStyle {
	return {
		width: CIRCLE,
		height: CIRCLE,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		// resting circle is border-defined like the Checkbox box: a card
		// fill disappears on card-colored surfaces; the 2dp stroke matches
		backgroundColor: checked ? theme.primary : "transparent",
		borderWidth: STROKE,
		borderColor: checked
			? theme.primary
			: hasError
				? theme.destructive
				: theme.border,
	};
}

export function dot(theme: KalaTheme, hasError = false): ViewStyle {
	return {
		width: DOT,
		height: DOT,
		borderRadius: 999,
		// checked fill stays primary on error (Checkbox precedent); the dot
		// itself flips destructive to flag the invalid selection
		backgroundColor: hasError ? theme.destructive : theme.primaryForeground,
	};
}

export function body(): ViewStyle {
	return { gap: 1, flexShrink: 1 };
}

export function label(theme: KalaTheme): TextStyle {
	return { color: theme.foreground, fontSize: 15 };
}

export function description(theme: KalaTheme): TextStyle {
	return { color: theme.mutedForeground, fontSize: 13 };
}
