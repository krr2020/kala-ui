import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const CIRCLE = 22;
export const DOT = 12;

export function root(): ViewStyle {
	return { flexDirection: "column", gap: 4, alignSelf: "flex-start" };
}

export function item(isDisabled: boolean): ViewStyle {
	return {
		minWidth: 44,
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		opacity: isDisabled ? 0.5 : 1,
	};
}

export function circle(theme: KalaTheme, checked: boolean): ViewStyle {
	return {
		width: CIRCLE,
		height: CIRCLE,
		borderRadius: 999,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: checked ? theme.primary : theme.card,
		borderColor: checked ? theme.primary : theme.border,
	};
}

export function dot(theme: KalaTheme): ViewStyle {
	return {
		width: DOT,
		height: DOT,
		borderRadius: 999,
		backgroundColor: theme.primaryForeground,
	};
}

export function label(theme: KalaTheme): { color: string; fontSize: number } {
	return { color: theme.foreground, fontSize: 15 };
}

export function description(
	theme: KalaTheme,
): { color: string; fontSize: number } {
	return { color: theme.mutedForeground, fontSize: 13 };
}
