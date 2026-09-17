import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function optionRow(isSelected: boolean): ViewStyle {
	return {
		minHeight: 44,
		justifyContent: "center",
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: isSelected ? "transparent" : "transparent",
	};
}

/** hairline between option rows only — the last row carries no border */
export function optionSeparator(theme: KalaTheme): ViewStyle {
	return { height: 1, backgroundColor: theme.separator };
}

export function optionLabel(
	theme: KalaTheme,
	variant: { isSelected: boolean; disabled: boolean },
): { color: string; fontSize: number } {
	return {
		fontSize: 14,
		color: variant.isSelected
			? theme.primary
			: variant.disabled
				? theme.mutedForeground
				: theme.foreground,
	};
}

export function emptyLabel(theme: KalaTheme): {
	fontSize: number;
	color: string;
} {
	return { fontSize: 14, color: theme.mutedForeground };
}
