import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import {
	PASSWORD_MAX_STRENGTH,
	PASSWORD_MIN_LENGTH,
	STRENGTH_LABELS,
	calculatePasswordStrength,
} from "../../lib/password-strength.utils";
import { applySlot } from "../slot-styles";
import type { PasswordStrengthIndicatorProps } from "./password-strength-indicator.types";

/**
 * PasswordStrengthIndicator: segmented strength meter. Bars carry the
 * theme ramp (destructive → warning → success); the root mirrors the
 * web role=meter contract via accessibilityValue {min,max,now}.
 */
export function PasswordStrengthIndicator({
	password,
	style,
	styles,
	testID = "k-password-strength-indicator",
}: PasswordStrengthIndicatorProps): ReactElement | null {
	const { theme } = useUnistyles();

	if (!password) {
		return null;
	}

	const strength = calculatePasswordStrength(password);

	const barColor =
		strength === 0
			? theme.destructive
			: strength === 1
				? theme.destructive
				: strength === 2
					? theme.warning
					: theme.success;

	return (
		<View
			testID={testID}
			accessibilityRole="adjustable"
			accessibilityLabel={`Password strength: ${STRENGTH_LABELS[strength]}`}
			accessibilityValue={{ min: 0, max: PASSWORD_MAX_STRENGTH, now: strength }}
			style={[{ marginTop: 12 }, applySlot(applySlot({}, style), styles?.root)]}
		>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<RNText
					style={{
						fontSize: 12,
						fontWeight: "500",
						color: theme.mutedForeground,
					}}
				>
					Password Strength
				</RNText>
				<RNText
					style={{
						fontSize: 12,
						fontWeight: "500",
						color: theme.mutedForeground,
					}}
				>
					{STRENGTH_LABELS[strength]}
				</RNText>
			</View>
			<View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
				{Array.from({ length: PASSWORD_MAX_STRENGTH }, (_, level) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: segment position is the identity
						key={level}
						testID="k-password-strength-segment"
						style={[
							{
								flex: 1,
								height: 8,
								borderRadius: 999,
								backgroundColor: level < strength ? barColor : theme.muted,
							},
							applySlot({}, styles?.segment),
						]}
					/>
				))}
			</View>
			<RNText
				style={{ fontSize: 12, marginTop: 8, color: theme.mutedForeground }}
			>
				Use {PASSWORD_MIN_LENGTH}+ characters with uppercase, lowercase,
				numbers, and symbols
			</RNText>
		</View>
	);
}
