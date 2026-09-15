/**
 * ComboboxSkeleton: loading placeholder matching the trigger shape —
 * a bordered pill with a label-width bone and chevron.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { Skeleton } from "../skeleton";
import { applySlot } from "../slot-styles";

export function ComboboxSkeleton({
	style,
	testID = "k-combobox-skeleton",
}: {
	style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
	testID?: string;
}): ReactElement {
	const { theme } = useUnistyles() as unknown as {
		theme: Record<string, string>;
	};
	return (
		<View
			testID={testID}
			style={applySlot(
				{
					minHeight: 44,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 12,
					borderWidth: 1,
					borderRadius: 8,
					borderColor: theme.border,
					backgroundColor: theme.input,
				},
				style,
			)}
		>
			<Skeleton style={{ width: 120, height: 14 }} />
			<RNText style={{ fontSize: 12, color: theme.mutedForeground }}>▾</RNText>
		</View>
	);
}
