/**
 * DialogHeader: titled band above the body — border-bottom separated,
 * string children render as themed text.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { KalaTheme } from "../../types";
import { applySlot } from "../slot-styles";
import type { DialogPartProps } from "./dialog.types";

const headerStyle = (theme: KalaTheme) => ({
	paddingHorizontal: 24,
	paddingVertical: 16,
	borderBottomWidth: 1,
	borderColor: theme.border,
	gap: 6,
	// fixed chrome: never shrinks, the body below absorbs long content
	flexShrink: 0,
});

const partTextStyle = (theme: KalaTheme) => ({
	color: theme.foreground,
	fontSize: 14,
});

export function DialogHeader({
	children,
	style,
	slotStyles,
	testID = "k-dialog-header",
}: DialogPartProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={applySlot([headerStyle(theme), style], slotStyles?.root)}
			>
				{typeof children === "string" || typeof children === "number" ? (
				<RNText style={partTextStyle(theme)}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}
