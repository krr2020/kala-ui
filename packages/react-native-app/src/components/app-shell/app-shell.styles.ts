/**
 * Non-component wiring for AppShell: the app frame and its content
 * regions — chrome never scrolls, only the content column does.
 */

import type { KalaTheme } from "@kala-ui/react-native/types";
import type { ViewStyle } from "react-native";

export const shellStyle = (theme: KalaTheme): ViewStyle => ({
	flex: 1,
	backgroundColor: theme.background,
});

export const contentStyle: ViewStyle = { flex: 1 };

export const scrollContentStyle: ViewStyle = { flexGrow: 1 };
