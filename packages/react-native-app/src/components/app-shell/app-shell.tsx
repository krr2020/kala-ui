/**
 * AppShell: the mobile application frame. Content sits between an
 * optional header bar (top) and tab bar (bottom); `scrollable` wraps
 * ONLY the content region in a ScrollView — the chrome never scrolls.
 */
import type { ReactElement } from "react";
import { ScrollView, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	contentStyle,
	scrollContentStyle,
	shellStyle,
} from "./app-shell.styles";
import type { AppShellProps } from "./app-shell.types";

export function AppShell({
	children,
	header,
	tabBar,
	scrollable = false,
	style,
	styles,
	testID = "k-app-shell",
}: AppShellProps): ReactElement {
	const { theme } = useUnistyles();

	const content = scrollable ? (
		<ScrollView
			testID="k-app-shell-content"
			contentContainerStyle={scrollContentStyle}
		>
			{children}
		</ScrollView>
	) : (
		<View testID="k-app-shell-content" style={contentStyle}>
			{children}
		</View>
	);

	return (
		<View testID={testID} style={[shellStyle(theme), style, styles?.root]}>
			{header ? <View>{header}</View> : null}
			{content}
			{tabBar ? <View>{tabBar}</View> : null}
		</View>
	);
}
