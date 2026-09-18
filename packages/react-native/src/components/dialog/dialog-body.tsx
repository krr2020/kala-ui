/**
 * DialogBody: scrollable content area. keyboardShouldPersistTaps keeps
 * button presses alive while the keyboard is open — without it, the
 * first tap closes the keyboard and swallows the press.
 */
import { Text as RNText, ScrollView } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { DialogPartProps } from "./dialog.types";

export function DialogBody({
	children,
	style,
	testID = "k-dialog-body",
}: DialogPartProps) {
	const { theme } = useUnistyles();
	return (
		<ScrollView
			testID={testID}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
			// yield to siblings so the body scrolls inside the card's maxHeight
			// instead of growing it or being clipped
			style={[{ flexGrow: 1, flexShrink: 1 }, style]}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<RNText style={{ color: theme.foreground, fontSize: 14 }}>
					{children}
				</RNText>
			) : (
				children
			)}
		</ScrollView>
	);
}
