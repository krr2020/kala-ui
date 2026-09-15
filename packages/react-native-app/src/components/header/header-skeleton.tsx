import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

export interface HeaderSkeletonProps {
	style?: StyleProp<ViewStyle>;
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

/** Loading variant of the app bar: same chrome, placeholder shapes. */
export function HeaderSkeleton({
	style,
	styles,
	testID = "k-header",
}: HeaderSkeletonProps): ReactElement {
	return (
		<View
			testID={testID}
			accessibilityRole="header"
			style={[
				{
					height: 56,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 16,
					gap: 12,
				},
				style,
				styles?.root,
			]}
		>
			<Skeleton style={{ height: 22, width: 22, borderRadius: 999 }} />
			<Skeleton style={{ height: 16, width: 140 }} />
			<Skeleton style={{ height: 22, width: 22, borderRadius: 999 }} />
		</View>
	);
}
