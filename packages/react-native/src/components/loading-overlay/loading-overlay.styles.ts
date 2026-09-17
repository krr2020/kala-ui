/**
 * Scrim style for LoadingOverlay. 50% ink over the foreground token so
 * the veil re-tints with dark mode instead of a hardcoded black.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export const scrimStyle = (theme: KalaTheme): ViewStyle => ({
	position: "absolute",
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: `${String(theme.foreground)}80`,
});
