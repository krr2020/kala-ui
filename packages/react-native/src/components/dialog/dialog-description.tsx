/**
 * DialogDescription: 14 muted supporting text under the title.
 */
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { DialogTextProps } from "./dialog.types";

export function DialogDescription({
	children,
	style,
	slotStyles,
	testID = "k-dialog-description",
}: DialogTextProps) {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={applySlot(
				[{ color: theme.mutedForeground, fontSize: 14 }, style],
				slotStyles?.root,
			)}
		>
			{children}
		</RNText>
	);
}
