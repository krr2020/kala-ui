/**
 * Label: text-sm font-medium themed foreground, web parity. Native forms
 * pair labels with controls through the control's accessibilityLabel, so
 * there is no htmlFor arm here — Label is the visible affordance.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { LabelProps } from "./label.types";

export function Label({
	children,
	required = false,
	style,
	styles,
	testID = "k-label",
}: LabelProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				{
					fontSize: 14,
					fontWeight: "500",
					color: theme.foreground,
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			{children}
			{required ? (
				<RNText style={{ color: theme.destructive }}> *</RNText>
			) : null}
		</RNText>
	);
}
