/**
 * ListItemContent: flex-filling middle slot of a row.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import type { ListItemContentProps } from "./list.types";

export function ListItemContent({
	style,
	testID = "k-list-item-content",
	children,
}: ListItemContentProps): ReactElement {
	return (
		<View testID={testID} style={[{ flex: 1 }, style]}>
			{children}
		</View>
	);
}
