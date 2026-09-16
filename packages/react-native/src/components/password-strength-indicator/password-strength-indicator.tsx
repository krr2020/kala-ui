import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { PasswordStrengthIndicatorProps } from "./password-strength-indicator.types";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_STRONG_LENGTH = 12;
const PASSWORD_MAX_STRENGTH = 4;

const STRENGTH_LABELS = [
	"Very Weak",
	"Weak",
	"Fair",
	"Good",
	"Strong",
] as const;

export function calculatePasswordStrength(pwd: string): number {
	if (!pwd) {
		return 0;
	}

	let strength = 0;
	if (pwd.length >= PASSWORD_MIN_LENGTH) strength++;
	if (pwd.length >= PASSWORD_STRONG_LENGTH) strength++;
	if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
	if (/\d/.test(pwd)) strength++;
	if (/[@$!%*?&]/.test(pwd)) strength++;

	return Math.min(strength, PASSWORD_MAX_STRENGTH);
}

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
