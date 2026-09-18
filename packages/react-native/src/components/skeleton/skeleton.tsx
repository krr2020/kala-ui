/**
 * Skeleton: themed loading block. Pulse is a core-Animated opacity loop
 * (1 → 0.5 → 1) — the loop is stateless and reanimated's jest mock has
 * no withRepeat, the same tradeoff Spinner makes. Sizing is the
 * consumer's job via `style` (width / height / flex). A labeled block
 * announces its loading state; unlabeled blocks stay decorative and are
 * hidden from the a11y tree so a grid of blocks never floods it.
 */

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import { RADIUS } from "./skeleton.styles";
import type { SkeletonProps } from "./skeleton.types";

export function Skeleton({
	variant = "rect",
	animated = true,
	accessibilityLabel,
	style,
	slotStyles,
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
			accessibilityLabel={accessibilityLabel}
			accessible={accessibilityLabel !== undefined}
			accessibilityElementsHidden={accessibilityLabel === undefined}
			importantForAccessibility={
				accessibilityLabel === undefined
					? "no-hide-descendants"
					: "auto"
			}
			style={[
				{
					backgroundColor: theme.muted,
					borderRadius: RADIUS[variant],
					opacity: animated ? pulse : 1,
				},
				applySlot(applySlot({}, style), slotStyles?.root),
			]}
		/>
	);
}
