/**
 * Non-component wiring for Combobox: trigger value text, the floating
 * clear affordance, empty-state text, and list sizing. The trigger
 * surface and search/option tables are shared (input-surface.styles,
 * select.styles).
 */
import type { TextStyle, ViewStyle } from "react-native";
import { SURFACE_HEIGHTS } from "../input-surface.styles";
import type { KalaTheme } from "../../types";

type SurfaceSize = keyof typeof SURFACE_HEIGHTS;

/** placeholder tone until a value/selectedLabel exists, then foreground */
export function valueTextStyle(
	theme: KalaTheme,
	hasSelection: boolean,
): TextStyle {
	return {
		flex: 1,
		fontSize: 14,
		color: hasSelection ? theme.foreground : theme.mutedForeground,
	};
}

/** clear X floats inside the trigger, vertically centered on its row */
export function clearStyle(size: SurfaceSize): ViewStyle {
	return {
		position: "absolute",
		right: 10,
		top: SURFACE_HEIGHTS[size] / 2 - 10,
	};
}

export function emptyTextStyle(theme: KalaTheme): TextStyle {
	return { paddingVertical: 12, fontSize: 14, color: theme.mutedForeground };
}

/** keeps a short option list pressable-looking instead of collapsed */
export const listContentStyle: ViewStyle = { minHeight: 44 };

export function skeletonStyle(size: SurfaceSize): ViewStyle {
	return { width: "100%", height: SURFACE_HEIGHTS[size] };
}

/** skeleton always reads as the disabled fill (web parity: bg-input) */
export function skeletonSurface(theme: KalaTheme): ViewStyle {
	return {
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: theme.border,
		backgroundColor: theme.input,
	};
}

export const skeletonBone: ViewStyle = { width: 120, height: 14 };

export const skeletonChevron = (theme: KalaTheme): TextStyle => ({
	fontSize: 12,
	color: theme.mutedForeground,
});
