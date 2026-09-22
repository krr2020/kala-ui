import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import {
	skeletonBarStyle,
	skeletonIconBone,
	skeletonLabelBone,
	skeletonTabChipStyle,
} from "./tab-bar.styles";

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
		<View testID={testID} style={[skeletonBarStyle, style, styles?.root]}>
			{Array.from({ length: 3 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows, never reordered
				<View key={`tab-${i}`} style={skeletonTabChipStyle}>
					<Skeleton style={skeletonIconBone} />
					<Skeleton style={skeletonLabelBone} />
				</View>
			))}
		</View>
	);
}
