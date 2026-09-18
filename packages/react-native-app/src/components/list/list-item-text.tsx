/**
 * ListItemText: secondary row body — muted at 14, clamped via
 * `lines` or single-line `truncate`.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { ListItemTextProps } from "./list.types";

export function ListItemText({
	lines,
	truncate = false,
	style,
	testID = "k-list-item-text",
	children,
	...rest
}: ListItemTextProps): ReactElement {
	const { theme } = useUnistyles();
	const clamp = lines ?? (truncate ? 1 : undefined);
	return (
		<RNText
			testID={testID}
			numberOfLines={clamp}
			style={[{ fontSize: 14, color: String(theme.mutedForeground) }, style]}
			{...rest}
		>
			{children}
		</RNText>
	);
}
