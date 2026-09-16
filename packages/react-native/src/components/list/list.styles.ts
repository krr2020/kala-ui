/**
 * Non-component wiring for List: size tables, the shared divider
 * factory, skeleton row dimensions, and the themed card surface.
 */
import type { ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { ListItemIconSize } from "./list.types";

export const ICON_SIZES: Record<ListItemIconSize, number> = {
	sm: tokens.size.icon.sm,
	md: tokens.size.icon.md,
	lg: tokens.size.icon.lg,
};

export const AVATAR_SIZES: Record<ListItemIconSize, number> = {
	sm: 32,
	md: 40,
	lg: 48,
};

/** 1px full-bleed separator row drawn between items regardless of dense padding. */
export function dividerStyle(theme: KalaTheme): ViewStyle {
	return {
		height: 1,
		alignSelf: "stretch",
		backgroundColor: String(theme.separator),
	};
}

/** Card surface for the list container. */
export function surfaceStyle(theme: KalaTheme): ViewStyle {
	return {
		backgroundColor: String(theme.card),
		borderRadius: tokens.radius.card,
		borderWidth: 1,
		borderColor: String(theme.border),
		overflow: "hidden",
	};
}
