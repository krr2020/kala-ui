/**
 * Progress: pill track at 20% primary alpha with a percentage-width fill.
 * Announces role=progressbar + accessibilityValue {min,max,now}. The web
 * striped/animated arms are deferred until a native gradient primitive
 * exists (same gate as the skeleton arms); ProgressBar/ProgressGroup
 * multi-bar composition waits for a real native consumer.
 */
import type { ReactElement } from "react";
import { Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { indicatorStyle, trackStyle, valueStyle } from "./progress.styles";
import type { ProgressProps } from "./progress.types";

export function Progress({
	value = 0,
	min = 0,
	max = 100,
	color = "primary",
	size = "md",
	label,
	showValue = false,
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-progress",
}: ProgressProps): ReactElement {
	const { theme } = useUnistyles();
	const clamped = Math.min(Math.max(value ?? 0, min), max);
	const pct = max === min ? 0 : ((clamped - min) / (max - min)) * 100;
	const inner =
		label !== undefined ? label : showValue ? `${Math.round(pct)}%` : null;

	return (
		<View
			testID={testID}
			// one a11y element so role=progressbar + value are announced
			accessible={true}
			accessibilityRole="progressbar"
			accessibilityLabel={accessibilityLabel}
			accessibilityValue={{ min, max, now: clamped }}
			style={[
				trackStyle(size, theme),
				applySlot(applySlot([], style), slotStyles?.root),
			]}
		>
			<View
				testID="k-progress-indicator"
				style={[
					indicatorStyle(pct, theme[color]),
					slotStyles?.indicator,
				]}
			>
				{inner !== null && size !== "sm" ? (
					<RNText
						style={valueStyle(theme[`${color}Foreground`], size)}
					>
						{inner}
					</RNText>
				) : null}
			</View>
		</View>
	);
}
