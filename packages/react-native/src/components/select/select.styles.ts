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

/** spacing between option rows only — dividers fight the rounded
 * accent-wash selected row, so the list separates with space instead */
export const optionGap = 2;

/** header row above a group of options (Select/MultiSelect shared look) */
export function groupHeader(theme: KalaTheme): TextStyle {
	return {
		marginTop: 8,
		fontSize: 12,
		fontWeight: "600",
		color: theme.mutedForeground,
	};
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

/** block wrapping the pinned search — separates the fixed controls from
 * the scrolling option list below with padding + a hairline */
export function searchBlock(theme: KalaTheme): ViewStyle {
	return {
		gap: 8,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: theme.separator,
	};
}

export function emptyLabel(theme: KalaTheme): {
	fontSize: number;
	color: string;
} {
	return { fontSize: 14, color: theme.mutedForeground };
}
