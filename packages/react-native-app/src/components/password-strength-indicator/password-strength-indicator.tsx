import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	calculatePasswordStrength,
	PASSWORD_MAX_STRENGTH,
	PASSWORD_MIN_LENGTH,
	STRENGTH_LABELS,
} from "../../lib/password-strength.utils";
import { applySlot } from "@kala-ui/react-native";
import {
	barColor as barColorFor,
	barRowStyle,
	hintStyle,
	labelRowStyle,
	labelStyle,
	rootStyle,
	segmentStyle,
} from "./password-strength-indicator.styles";
import type { PasswordStrengthIndicatorProps } from "./password-strength-indicator.types";

/**
 * PasswordStrengthIndicator: segmented strength meter. Bars carry the
 * theme ramp (destructive → warning → success); the root mirrors the
 * web role=meter contract via accessibilityValue {min,max,now}.
 */
export function PasswordStrengthIndicator({
	password,
	style,
	slotStyles,
	testID = "k-password-strength-indicator",
}: PasswordStrengthIndicatorProps): ReactElement | null {
	const { theme } = useUnistyles();

	if (!password) {
		return null;
	}

	const strength = calculatePasswordStrength(password);
	const barColor = barColorFor(strength, theme);

	return (
		<View
			testID={testID}
			accessibilityRole="adjustable"
			accessibilityLabel={`Password strength: ${STRENGTH_LABELS[strength]}`}
			accessibilityValue={{ min: 0, max: PASSWORD_MAX_STRENGTH, now: strength }}
			style={[
				rootStyle,
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<View style={labelRowStyle}>
				<RNText style={labelStyle(theme)}>Password Strength</RNText>
				<RNText style={labelStyle(theme)}>
					{STRENGTH_LABELS[strength]}
				</RNText>
			</View>
			<View style={barRowStyle}>
				{Array.from({ length: PASSWORD_MAX_STRENGTH }, (_, level) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: segment position is the identity
						key={level}
						testID="k-password-strength-segment"
						style={[
							segmentStyle(level < strength, barColor, theme),
							applySlot({}, slotStyles?.segment),
						]}
					/>
				))}
			</View>
			<RNText style={hintStyle(theme)}>
				Use {PASSWORD_MIN_LENGTH}+ characters with uppercase, lowercase,
				numbers, and symbols
			</RNText>
		</View>
	);
}
