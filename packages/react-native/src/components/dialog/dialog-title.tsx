/**
 * DialogTitle: 18/600 heading text, announced as a header.
 */
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { DialogTextProps } from "./dialog.types";

export function DialogTitle({
	children,
	style,
	slotStyles,
	testID = "k-dialog-title",
}: DialogTextProps) {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			accessibilityRole="header"
			style={applySlot(
				[
					{ color: theme.foreground, fontSize: 18, fontWeight: "600" },
					style,
				],
				slotStyles?.root,
			)}
		>
			{children}
		</RNText>
	);
}
