/**
 * Indicator: badge anchored to its target's corners (MUI anchorOrigin
 * + overlap model). rectangular centers the badge on the corner via
 * negative half-size offsets; circular insets it fully inside. Counts
 * cap at max (99+), zeros hide unless showZero, and dot renders a
 * contentless status dot. Processing pulses opacity on a core-Animated
 * loop that stops in cleanup; solid theme-ramp fills only.
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
	badgeContent,
	max = 99,
	showZero = false,
	dot = false,
	anchorOrigin = { vertical: "top", horizontal: "right" },
	overlap = "rectangular",
	offset = [0, 0],
	color = "primary",
	size,
	withBorder = false,
	invisible = false,
	processing = false,
	inline = false,
	style,
	slotStyles,
	testID = "k-indicator",
}: IndicatorProps): ReactElement {
	const { theme } = useUnistyles();
	const pulse = useRef(new Animated.Value(1)).current;

	const resolvedSize = size ?? (dot ? 10 : 16);
	const isDot = dot || badgeContent === undefined;
	// MUI model: no badgeContent means no badge — unless dot opts in;
	// numeric zero hides unless showZero (Ant model)
	const hideBadge =
		invisible ||
		(!dot &&
			(badgeContent === undefined ||
				(typeof badgeContent === "number" &&
					badgeContent === 0 &&
					!showZero)));

	useEffect(() => {
		// no badge, no pulse — a looping animation with no surface leaks
		if (!processing || hideBadge) return;
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
	}, [processing, hideBadge, pulse]);

	const text =
		!dot && typeof badgeContent === "number" && badgeContent > max
			? `${max}+`
			: badgeContent;

	return (
		<View
			testID={testID}
			style={applySlot(
				[{ position: "relative" }],
				[inline ? { alignSelf: "flex-start" } : null, slotStyles?.root],
			)}
		>
			{!hideBadge && (
				<Animated.View
					testID="k-indicator-dot"
					style={applySlot(
						[
							{
								position: "absolute",
								height: resolvedSize,
								borderRadius: resolvedSize / 2,
								backgroundColor: theme[color],
								alignItems: "center",
								justifyContent: "center",
								zIndex: 50,
								overflow: "hidden",
							},
							isDot
								? { width: resolvedSize }
								: { minWidth: resolvedSize },
							!isDot ? { paddingHorizontal: resolvedSize / 3 } : null,
							withBorder
								? { borderWidth: 2, borderColor: theme.background }
								: { borderWidth: 0 },
							anchorStyle(anchorOrigin, overlap, offset, resolvedSize),
							// legacy style targets the badge at web parity (web
							// spreads it onto the badge node, not the wrapper); the
							// pulse rides after it so the animation beats user
							// opacity like CSS
							style,
							processing ? { opacity: pulse } : null,
						],
						slotStyles?.badge,
					)}
				>
					{!isDot ? (
						<RNText
							style={{
								color: theme[`${color}Foreground`],
								fontSize: resolvedSize * 0.7,
								fontWeight: "700",
							}}
						>
							{text}
						</RNText>
					) : null}
				</Animated.View>
			)}
			{children}
		</View>
	);
}
