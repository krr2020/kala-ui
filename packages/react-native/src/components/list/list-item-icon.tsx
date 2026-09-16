/**
 * ListItemIcon: fixed-size leading slot; string children render as
 * muted-foreground text so glyph characters work without a wrapper.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ICON_SIZES } from "./list.styles";
import type { ListItemIconProps } from "./list.types";

export function ListItemIcon({
	size = "md",
	color,
	children,
	style,
	testID = "k-list-item-icon",
}: ListItemIconProps): ReactElement {
	const { theme } = useUnistyles();
	const dim = ICON_SIZES[size];
	return (
		<View
			testID={testID}
			style={[
				{
					width: dim,
					height: dim,
					alignItems: "center",
					justifyContent: "center",
				},
				style,
			]}
		>
			{typeof children === "string" ? (
				<RNText
					style={{
						fontSize: dim,
						color: color ?? String(theme.mutedForeground),
					}}
				>
					{children}
				</RNText>
			) : (
				children
			)}
		</View>
	);
}
