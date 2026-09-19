/**
 * Indicator: status dot anchored over its target's corners/edges. The
 * nine web translate-(-50%, -50%) anchors become negative half-size
 * offsets (percentage + negative margin for centered axes). Processing
 * pulses opacity on a core-Animated loop that stops in cleanup; there
 * is no gradient arm — solid theme-ramp fills only, matching the
 * deferred-gradient precedent in Progress.
 */

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { Animated, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { anchorStyle } from "./indicator.styles";
import type { IndicatorProps } from "./indicator.types";

export function Indicator({
	children,
	position = "top-right",
	color = "primary",
	offset = 0,
	size = 10,
	withBorder = false,
	disabled = false,
	processing = false,
	label,
	inline = false,
	style,
	slotStyles,
	testID = "k-indicator",
}: IndicatorProps): ReactElement {
	const { theme } = useUnistyles();
	const pulse = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// disabled renders no dot — running the pulse anyway would leak a
		// looping animation with no surface to drive
		if (!processing || disabled) return;
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 0.5,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(pulse, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => {
			loop.stop();
			pulse.setValue(1);
		};
	}, [processing, disabled, pulse]);

	const hasLabel = label !== undefined && label !== null && label !== "";

	return (
		<View
			testID={testID}
			style={applySlot(
				[{ position: "relative" }],
				[inline ? { alignSelf: "flex-start" } : null, slotStyles?.root],
			)}
		>
			{!disabled && (
				<Animated.View
					testID="k-indicator-dot"
					style={applySlot(
						[
							{
								position: "absolute",
								height: size,
								minWidth: size,
								borderRadius: size / 2,
								backgroundColor: theme[color],
								alignItems: "center",
								justifyContent: "center",
								zIndex: 50,
								overflow: "hidden",
							},
							hasLabel ? { paddingHorizontal: size / 3 } : { width: size },
							withBorder
								? { borderWidth: 2, borderColor: theme.background }
								: { borderWidth: 0 },
							anchorStyle(position, offset, size / 2),
							// legacy style targets the DOT at web parity (web spreads
							// it onto the dot div, not the wrapper); the pulse rides
							// after it so the animation beats user opacity like CSS
							style,
							processing ? { opacity: pulse } : null,
						],
						slotStyles?.dot,
					)}
				>
					{hasLabel ? (
						<RNText
							style={{
								color: theme[`${color}Foreground`],
								fontSize: size * 0.7,
								fontWeight: "700",
							}}
						>
							{label}
						</RNText>
					) : null}
				</Animated.View>
			)}
			{children}
		</View>
	);
}
