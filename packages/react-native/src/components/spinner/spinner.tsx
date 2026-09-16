/**
 * Spinner: lucide Loader icon on a core-Animated rotation loop. Core
 * Animated (not reanimated) because the loop is stateless — no shared
 * values, no gesture interplay — and reanimated's jest mock has no
 * withRepeat. The loop starts once per mount and stops in cleanup.
 * Ghost variant dims the whole wrapper to 0.6 (web's /60 alpha).
 */

import { Loader } from "lucide-react-native";
import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { SpinnerProps, SpinnerSize } from "./spinner.types";

const SIZE: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32, xl: 48 };

export function Spinner({
	size = "md",
	variant = "default",
	label = "Loading...",
	accessibilityLabel,
	style,
	styles,
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

	const color =
		variant === "white"
			? theme.primaryForeground
			: variant === "muted" || variant === "ghost"
				? theme.mutedForeground
				: theme.primary;

	return (
		<Animated.View
			testID={testID}
			accessibilityLabel={accessibilityLabel ?? label}
			style={[
				{
					alignItems: "center",
					justifyContent: "center",
					opacity: variant === "ghost" ? 0.6 : 1,
				},
				applySlot(applySlot({}, style), styles?.root),
			]}
		>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Loader size={SIZE[size]} color={color} />
			</Animated.View>
		</Animated.View>
	);
}
