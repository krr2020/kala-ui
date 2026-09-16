/**
 * Button: token-driven pressable with a mobile-first variant set
 * (solid/outline/ghost/subtle × color × size). The pressed state
 * runs the motion.spring.snappy spring on the UI thread; every size
 * enforces the 44dp touch floor from the design specs.
 */
import type { ReactElement } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { applySlot } from "../slot-styles";
import type { ButtonProps } from "./button.types";
import {
	AnimatedPressable,
	BUTTON_SPRING,
	baseStyle,
	foregroundKey,
	FONT,
	variantLook,
} from "./button.styles";
import type { KalaThemeShape } from "./button.styles";

export function Button({
	children,
	variant = "solid",
	color = "primary",
	size = "md",
	fullWidth = false,
	rounded = false,
	isLoading = false,
	disabled = false,
	onPress,
	accessibilityLabel,
	accessibilityLiveRegion,
	style,
	styles,
	testID = "k-button-root",
}: ButtonProps): ReactElement {
	const { theme } = useUnistyles();
	const press = useSharedValue(1);

	const pressStyle = useAnimatedStyle(() => ({
		transform: [{ scale: press.value }],
	}));

	const themeShape = theme as unknown as KalaThemeShape;
	const fg = String(themeShape[foregroundKey(variant, color)]);
	const look = variantLook(variant, color, themeShape);
	const effectiveDisabled = disabled || isLoading;

	return (
		<AnimatedPressable
			testID={testID}
			onPress={() => {
				// guarded internally (not undefined) so disabled/loading buttons
				// can't fire even when the host still delivers the event
				if (!effectiveDisabled) onPress?.();
			}}
			onPressIn={() => {
				press.value = withSpring(0.96, BUTTON_SPRING);
			}}
			onPressOut={() => {
				press.value = withSpring(1, BUTTON_SPRING);
			}}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityLiveRegion={accessibilityLiveRegion}
			accessibilityState={{
				disabled: effectiveDisabled || undefined,
				busy: isLoading || undefined,
			}}
			style={[
				pressStyle,
				applySlot(
					applySlot(
						baseStyle(size, fullWidth, rounded, look, effectiveDisabled),
						style,
					),
					styles?.root,
				),
			]}
		>
			{isLoading ? (
				<ActivityIndicator size="small" color={fg} />
			) : typeof children === "string" || typeof children === "number" ? (
				<Text
					style={{
						color: fg,
						fontSize: size === "icon" ? 18 : FONT[size],
						fontWeight: "500",
					}}
				>
					{children}
				</Text>
			) : (
				// row container so composed icon+label children sit inline —
				// RN's default column stacks them vertically
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: size === "lg" ? 10 : size === "md" ? 8 : 6,
					}}
				>
					{children}
				</View>
			)}
		</AnimatedPressable>
	);
}
