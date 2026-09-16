/**
 * ListItemAction: trailing slot for row-level affordances.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import type { ListItemActionProps } from "./list.types";

export function ListItemAction({
	style,
	testID = "k-list-item-action",
	children,
}: ListItemActionProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[{ flexDirection: "row", alignItems: "center", gap: 8 }, style]}
		>
			{children}
		</View>
	);
}
