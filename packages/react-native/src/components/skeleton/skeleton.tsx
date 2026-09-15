/**
 * Skeleton: themed loading block. Pulse is a core-Animated opacity loop
 * (1 → 0.5 → 1) — the loop is stateless and reanimated's jest mock has
 * no withRepeat, the same tradeoff Spinner makes. Sizing is the
 * consumer's job via `style` (width / height / flex).
 */
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { Animated, Easing } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import type { SkeletonProps, SkeletonVariant } from "./skeleton.types";

const RADIUS: Record<SkeletonVariant, number> = { rect: 8, circle: 999 };

export function Skeleton({
	variant = "rect",
	animated = true,
	style,
	testID = "k-skeleton",
}: SkeletonProps): ReactElement {
	const { theme } = useUnistyles();
	const pulse = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (!animated) return;
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 0.5,
					duration: 700,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(pulse, {
					toValue: 1,
					duration: 700,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => {
			loop.stop();
			pulse.setValue(1);
		};
	}, [animated, pulse]);

	return (
		<Animated.View
			testID={testID}
			style={[
				{
					backgroundColor: theme.muted,
					borderRadius: RADIUS[variant],
					opacity: animated ? pulse : 1,
				},
				style,
			]}
		/>
	);
}
