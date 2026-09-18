/**
 * DialogFooter: action band below the body — muted fill, border-top
 * separated, trailing-aligned children.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { KalaTheme } from "../../types";
import { applySlot } from "../slot-styles";
import type { DialogPartProps } from "./dialog.types";

const footerStyle = (theme: KalaTheme) => ({
	flexDirection: "row" as const,
	justifyContent: "flex-end" as const,
	flexWrap: "wrap" as const,
	gap: 8,
	paddingHorizontal: 24,
	paddingVertical: 16,
	borderTopWidth: 1,
	borderColor: theme.border,
	backgroundColor: theme.muted,
	// fixed chrome: never shrinks, the body above absorbs long content
	flexShrink: 0,
});

const partTextStyle = (theme: KalaTheme) => ({
	color: theme.foreground,
	fontSize: 14,
});

export function DialogFooter({
	children,
	style,
	slotStyles,
	testID = "k-dialog-footer",
}: DialogPartProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<View
			testID={testID}
			style={applySlot([footerStyle(theme), style], slotStyles?.root)}
			>
				{typeof children === "string" || typeof children === "number" ? (
				<RNText style={partTextStyle(theme)}>{children}</RNText>
			) : (
				children
			)}
		</View>
	);
}
