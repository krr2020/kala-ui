import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const ITEM = 40;
export const VISIBLE = 3;
export const WHEEL_HEIGHT = ITEM * VISIBLE;

export function wheelRow(selected: boolean): ViewStyle {
	return {
		height: ITEM,
		alignItems: "center",
		justifyContent: "center",
		opacity: selected ? 1 : 0.4,
	};
}

export function wheelText(
	theme: KalaTheme,
	selected: boolean,
): { color: string; fontSize: number; fontWeight: "400" | "600" } {
	return {
		color: selected ? theme.primary : theme.foreground,
		fontSize: 16,
		fontWeight: selected ? "600" : "400",
	};
}

export function amPmOption(theme: KalaTheme, selected: boolean): ViewStyle {
	return {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 6,
		backgroundColor: selected ? theme.primary : "transparent",
		alignItems: "center",
	};
}

export function amPmText(
	theme: KalaTheme,
	selected: boolean,
): { color: string; fontSize: number; fontWeight: "600" } {
	return {
		color: selected ? theme.primaryForeground : theme.foreground,
		fontSize: 12,
		fontWeight: "600",
	};
}
