import type { ViewStyle } from "react-native";
import { tokens } from "../../tokens";

/**
 * The single-mode convention treats '' as "nothing active", so controlled
 * and uncontrolled deselect must normalize to the same empty array.
 */
export function toValues(value: string | string[] | undefined): string[] {
	if (Array.isArray(value)) return value;
	return value ? [value] : [];
}

interface GroupSurfaceTheme {
	muted: string;
	border: string;
}

/**
 * The group renders as ONE control surface (border or muted track) that
 * owns the corner radius; items are strips clipped by overflow hidden.
 */
export function groupSurface(
	variant: "default" | "outline",
	theme: GroupSurfaceTheme,
): ViewStyle {
	return {
		flexDirection: "row",
		alignSelf: "flex-start",
		alignItems: "stretch",
		overflow: "hidden",
		borderRadius: tokens.radius.control,
		backgroundColor: variant === "outline" ? "transparent" : theme.muted,
		borderWidth: variant === "outline" ? 1 : 0,
		borderColor: theme.border,
	};
}

/**
 * Joined items drop their own chrome (the track owns border + radius) and
 * non-first items carry the hairline separator between neighbors.
 */
export function groupedItemSurface(
	base: ViewStyle,
	first: boolean,
	borderColor: string,
): ViewStyle {
	return {
		...base,
		borderWidth: 0,
		borderRadius: 0,
		...(first ? undefined : { borderLeftWidth: 1, borderColor }),
	};
}
