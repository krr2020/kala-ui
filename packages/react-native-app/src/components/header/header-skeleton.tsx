import { Skeleton } from "@kala-ui/react-native";
import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import {
	skeletonBarStyle,
	skeletonCircleBone,
	skeletonTitleBone,
} from "./header.styles";

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
			style={[skeletonBarStyle, style, styles?.root]}
		>
			<Skeleton style={skeletonCircleBone} />
			<Skeleton style={skeletonTitleBone} />
			<Skeleton style={skeletonCircleBone} />
		</View>
	);
}
