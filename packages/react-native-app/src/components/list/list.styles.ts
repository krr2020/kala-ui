/**
 * Non-component wiring for List: size tables, skeleton row dimensions,
 * the shared divider factory, and the themed card surface.
 */
import type { ViewStyle } from "react-native";
import { tokens } from "@kala-ui/react-native";
import type { KalaTheme } from "@kala-ui/react-native";
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

/** Skeleton row geometry — line height and leading circle diameters. */
export const SKELETON = {
	lineH: { dense: 12, regular: 16 },
	avatarCircle: 32,
	iconCircle: { dense: 16, regular: 20 },
} as const;

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
