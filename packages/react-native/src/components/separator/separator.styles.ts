/**
 * Non-component wiring for Separator: the themed one-pixel divider in
 * either orientation.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../../types";

export function separatorStyle(theme: KalaTheme, vertical: boolean): ViewStyle {
	return {
		backgroundColor: theme.separator,
		width: vertical ? 1 : "100%",
		height: vertical ? "100%" : 1,
	};
}
