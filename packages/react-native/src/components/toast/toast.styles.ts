/**
 * Style tables and pure mappers for Toast. Kept free of hooks/JSX so the
 * component file renders and the theme resolution stays testable.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const viewportStyle = (position: "top" | "bottom"): ViewStyle => ({
	position: "absolute",
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	zIndex: 200,
	justifyContent: position === "top" ? "flex-start" : "flex-end",
	padding: 16,
});

export const rootStyle = (theme: KalaTheme): ViewStyle => ({
	alignSelf: "stretch",
	backgroundColor: theme.card,
	borderWidth: 1,
	borderColor: theme.border,
	borderRadius: 10,
	padding: 14,
	gap: 2,
});

export const titleStyle = (theme: KalaTheme) => ({
	color: theme.foreground,
	fontSize: 15,
	fontWeight: "600" as const,
});

export const descriptionStyle = (theme: KalaTheme) => ({
	color: theme.mutedForeground,
	fontSize: 14,
});
