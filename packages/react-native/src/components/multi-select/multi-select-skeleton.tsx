/**
 * MultiSelectSkeleton: loading placeholder matching the trigger shape —
 * a bordered pill with chip-width bones inside.
 */
import type { ReactElement } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";

export function MultiSelectSkeleton({
	style,
	testID = "k-multi-select-skeleton",
}: {
	style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
	testID?: string;
}): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={applySlot(
				{
					minHeight: 44,
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
					paddingHorizontal: 12,
					borderWidth: 1,
					borderRadius: 8,
					borderColor: theme.border,
					backgroundColor: theme.input,
				},
				style,
			)}
		>
			<Skeleton style={{ width: 48, height: 14 }} />
			<Skeleton style={{ width: 64, height: 14 }} />
			<Skeleton style={{ width: 40, height: 14 }} />
		</View>
	);
}
