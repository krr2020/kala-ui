import type { ViewStyle } from "react-native";
import { SURFACE_HEIGHTS } from "../input-surface.styles";

export function triggerRow(size: "sm" | "md"): ViewStyle {
	return {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		minHeight: SURFACE_HEIGHTS[size],
	};
}

export function triggerLabel(): { fontSize: number; flex: number } {
	return { fontSize: 14, flex: 1 };
}
