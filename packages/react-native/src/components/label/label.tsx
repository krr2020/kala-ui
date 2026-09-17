/**
 * Label: text-sm font-medium themed foreground, web parity. Native forms
 * pair labels with controls through the control's accessibilityLabel, so
 * there is no htmlFor arm here — Label is the visible affordance.
 */
import type { ReactElement } from "react";
import { Text as RNText } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import * as labelStyle from "./label.styles";
import type { LabelProps } from "./label.types";

export function Label({
	children,
	required = false,
	style,
	slotStyles,
	testID = "k-label",
}: LabelProps): ReactElement {
	const { theme } = useUnistyles();
	return (
		<RNText
			testID={testID}
			style={[
				labelStyle.label(theme),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			{children}
			{required ? (
				<RNText style={labelStyle.required(theme)}> *</RNText>
			) : null}
		</RNText>
	);
}
