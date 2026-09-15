import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

export interface TabBarSkeletonProps {
	style?: StyleProp<ViewStyle>;
	styles?: {
		root?: StyleProp<ViewStyle>;
	};
	testID?: string;
}

/** Loading variant of the bottom bar: three placeholder tabs. */
export function TabBarSkeleton({
	style,
	styles,
	testID = "k-tab-bar",
}: TabBarSkeletonProps): ReactElement {
	return (
		<View
			testID={testID}
			style={[
				{
					height: 56,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-around",
					paddingHorizontal: 16,
				},
				style,
				styles?.root,
			]}
		>
			{Array.from({ length: 3 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
				<View key={`tab-${i}`} style={{ alignItems: "center", gap: 4 }}>
					<Skeleton style={{ height: 22, width: 22, borderRadius: 999 }} />
					<Skeleton style={{ height: 10, width: 48 }} />
				</View>
			))}
		</View>
	);
}
