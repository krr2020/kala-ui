/**
 * ListItemTitle: primary row label — foreground at 14 medium.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { ListItemTitleProps } from "./list.types";

export function ListItemTitle({
	style,
	testID = "k-list-item-title",
	children,
	...rest
}: ListItemTitleProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				{ fontSize: 14, fontWeight: "500", color: String(theme.foreground) },
				style,
			]}
			{...rest}
		>
			{children}
		</RNText>
	);
}
