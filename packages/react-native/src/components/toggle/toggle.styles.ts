import type { ViewStyle } from "react-native";
import { tokens } from "../../tokens";
import type { ToggleSize } from "./toggle.types";

export const TOGGLE_HEIGHT: Record<ToggleSize, number> = {
	sm: 36,
	md: tokens.size.controlH,
	lg: 44,
};

export const PAD_X: Record<ToggleSize, number> = { sm: 6, md: 8, lg: 10 };

export const TOGGLE_FONT: Record<ToggleSize, number> = {
	sm: 13,
	md: 14,
	lg: 16,
};

/** per-tier height over the shared 44dp floor */
export function baseSurface(size: ToggleSize): ViewStyle {
	return {
		minHeight: 44,
		minWidth: 44,
		height: TOGGLE_HEIGHT[size],
		paddingHorizontal: PAD_X[size],
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 8,
		borderRadius: tokens.radius.control,
	};
}
