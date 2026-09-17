import type { TextStyle, ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

/** shared option-row surface for the whole select family (Select/Combobox/
 * MultiSelect) — a selected row is a subtle accent wash, not a filled pill */
export function optionRow(theme: KalaTheme, isSelected: boolean): ViewStyle {
	return {
		minHeight: 44,
		justifyContent: "center",
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: isSelected ? theme.accent : "transparent",
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

/** shared search-field look for picker sheets (Combobox/MultiSelect) */
export function searchField(theme: KalaTheme): TextStyle {
	return {
		minHeight: 40,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: theme.border,
		fontSize: 14,
		color: theme.foreground,
	};
}

export function emptyLabel(theme: KalaTheme): {
	fontSize: number;
	color: string;
} {
	return { fontSize: 14, color: theme.mutedForeground };
}
