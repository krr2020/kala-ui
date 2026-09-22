/**
 * Non-component wiring for DropdownMenu: the theme slice its rows map
 * over plus the trigger/row/text tables. ContextMenu renders through
 * the same tables via renderMenuItem.
 */
import type { TextStyle, ViewStyle } from "react-native";

/**
 * Structural slice of the theme the menu rows need — keeps renderMenuItem
 * decoupled from the full KalaTheme type.
 */
export interface MenuTheme {
	foreground: string;
	mutedForeground: string;
	primary: string;
	destructive: string;
	separator: string;
	card: string;
	border: string;
}

/** action/checkbox/radio/label row skeleton */
export const rowBase: ViewStyle = {
	minHeight: 44,
	flexDirection: "row",
	alignItems: "center",
	gap: 8,
	paddingHorizontal: 12,
	borderRadius: 8,
};

export function separatorStyle(theme: MenuTheme): ViewStyle {
	return { height: 1, backgroundColor: theme.separator };
}

/** non-interactive group-label row text */
export const labelTextStyle = (theme: MenuTheme): TextStyle => ({
	fontSize: 12,
	fontWeight: "600",
	color: theme.mutedForeground,
});

/** radio dot; the checkbox arm draws a lucide Check instead */
export const indicatorStyle = (theme: MenuTheme): ViewStyle => ({
	width: 8,
	height: 8,
	borderRadius: 4,
	backgroundColor: theme.primary,
});

/** one row-text table; the caller picks the color token by item state */
export function rowTextStyle(
	theme: MenuTheme,
	color: "foreground" | "mutedForeground" | "destructive",
): TextStyle {
	return { flex: 1, fontSize: 14, color: theme[color] };
}

export function triggerStyle(theme: MenuTheme): ViewStyle {
	return {
		minHeight: 36,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: theme.border,
		backgroundColor: theme.card,
	};
}

export const triggerLabelStyle = (theme: MenuTheme): TextStyle => ({
	fontSize: 14,
	color: theme.foreground,
});

export const chevronStyle = (theme: MenuTheme): TextStyle => ({
	fontSize: 12,
	color: theme.mutedForeground,
});

/** row gap inside the sheet — same cadence as ContextMenu's list */
export const contentStyle: ViewStyle = { gap: 2 };

export const emptyTextStyle = (theme: MenuTheme): TextStyle => ({
	fontSize: 14,
	color: theme.mutedForeground,
});
