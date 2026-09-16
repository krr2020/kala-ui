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
import type { ProgressProps, ProgressSize } from "./progress.types";

const HEIGHT: Record<ProgressSize, number> = { sm: 4, md: 10, lg: 16 };

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
				{
					width: "100%",
					height: HEIGHT[size],
					borderRadius: 999,
					// 20% alpha ≈ "33" in #RRGGBBAA — web's bg-primary/20
					backgroundColor: `${String(theme.primary)}33`,
					overflow: "hidden",
					flexDirection: "row",
				},
				applySlot(applySlot([], style), slotStyles?.root),
			]}
		>
			<View
				testID="k-progress-indicator"
				style={[
					{
						width: `${pct}%`,
						height: "100%",
						backgroundColor: theme[color],
						alignItems: "center",
						justifyContent: "center",
					},
					slotStyles?.indicator,
				]}
			>
				{inner !== null && size !== "sm" ? (
					<RNText
						style={{
							color: theme[`${color}Foreground`],
							fontSize: size === "lg" ? 12 : 10,
							fontWeight: "500",
						}}
					>
						{inner}
					</RNText>
				) : null}
			</View>
		</View>
	);
}
