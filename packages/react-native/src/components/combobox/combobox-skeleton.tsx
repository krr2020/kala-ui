/**
 * ComboboxSkeleton: loading placeholder matching the trigger shape —
 * a bordered pill with a label-width bone and chevron.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";
import {
	skeletonBone,
	skeletonChevron,
	skeletonSurface,
} from "./combobox.styles";

export function ComboboxSkeleton({
	style,
	testID = "k-combobox-skeleton",
}: {
	style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
	testID?: string;
}): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={applySlot(skeletonSurface(theme), style)}
		>
			<Skeleton style={skeletonBone} />
			<RNText style={skeletonChevron(theme)}>▾</RNText>
		</View>
	);
}
