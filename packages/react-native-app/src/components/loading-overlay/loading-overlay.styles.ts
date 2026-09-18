/**
 * Scrim style for LoadingOverlay. 50% ink over the foreground token so
 * the veil re-tints with dark mode instead of a hardcoded black.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "@kala-ui/react-native";

export const scrimStyle = (theme: KalaTheme): ViewStyle => ({
	position: "absolute",
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	alignItems: "center",
	justifyContent: "center",
	// "auto" (not "box-only") so the scrim absorbs touches instead of
	// letting them fall through to the content it covers
	pointerEvents: "auto",
	backgroundColor: `${String(theme.foreground)}80`,
});
