/**
 * Spinner: lucide Loader icon on a core-Animated rotation loop. Core
 * Animated (not reanimated) because the loop is stateless — no shared
 * values, no gesture interplay — and reanimated's jest mock has no
 * withRepeat. The loop starts once per mount and stops in cleanup.
 * Ghost variant dims the whole wrapper to 0.6 (web's /60 alpha). The
 * root is one accessible element announcing the loading label; no
 * synthetic role — an indeterminate spinner is not a progressbar/timer.
 */

import { Loader } from "lucide-react-native";
import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { SIZE, variantColor, wrapperStyle } from "./spinner.styles";
import type { SpinnerProps } from "./spinner.types";

export function Spinner({
	size = "md",
	variant = "default",
	label = "Loading...",
	accessibilityLabel,
	style,
	slotStyles,
	testID = "k-spinner",
}: SpinnerProps): ReactElement {
	const { theme } = useUnistyles();
	const spin = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.timing(spin, {
				toValue: 1,
				duration: 900,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		);
		loop.start();
		return () => {
			loop.stop();
			spin.setValue(0);
		};
	}, [spin]);

	const rotate = spin.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const color = variantColor(variant, theme);

	return (
		<Animated.View
			testID={testID}
			// one a11y element so the loading state announces
			accessible={true}
			accessibilityLabel={accessibilityLabel ?? label}
			style={[
				wrapperStyle(variant),
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Loader size={SIZE[size]} color={color} />
			</Animated.View>
		</Animated.View>
	);
}
