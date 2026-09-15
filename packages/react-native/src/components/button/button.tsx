/**
 * Button: token-driven pressable with the web variant vocabulary
 * (solid/outline/ghost/subtle/link × color × size). The pressed state
 * runs the motion.spring.snappy spring on the UI thread; every size
 * enforces the 44dp touch floor from the design specs.
 */
import type { ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import { motion, tokens } from "../../tokens";
import { applySlot } from "../slot-styles";
import type {
	ButtonColor,
	ButtonProps,
	ButtonSize,
	ButtonVariant,
} from "./button.types";

export const BUTTON_SPRING = motion.spring.snappy;

const HEIGHT: Record<Exclude<ButtonSize, "icon">, number> = {
	xs: 28,
	sm: 36,
	md: tokens.size.controlH,
	lg: 44,
};

const PAD_X: Record<Exclude<ButtonSize, "icon">, number> = {
	xs: 8,
	sm: 12,
	md: tokens.space.controlPx,
	lg: 32,
};

const FONT: Record<Exclude<ButtonSize, "icon">, number> = {
	xs: 12,
	sm: 14,
	md: 14,
	lg: 16,
};

interface VariantLook {
	bg?: string;
	border?: string;
	underline?: "underline";
}

interface KalaThemeShape {
	card: string;
	muted: string;
	[key: string]: string | number;
}

const ICON_BOX = 44;

/** 'muted' has no ramp of its own — it borrows accent and mutes the fg. */
const baseColor = (
	color: ButtonColor,
): "primary" | "secondary" | "destructive" | "accent" =>
	color === "muted" ? "accent" : color;

function foregroundKey(variant: ButtonVariant, color: ButtonColor): string {
	const base = baseColor(color);
	if (variant === "solid") return `${base}Foreground`;
	if (variant === "subtle" || color === "muted") return "mutedForeground";
	return base;
}

function variantLook(
	variant: ButtonVariant,
	color: ButtonColor,
	theme: KalaThemeShape,
): VariantLook {
	const base = baseColor(color);
	const tint = String(theme[base]);
	switch (variant) {
		case "outline":
			return { bg: theme.card, border: tint };
		case "ghost":
			return { bg: "transparent" };
		case "subtle":
			return { bg: theme.muted };
		case "link":
			return { underline: "underline" };
		default:
			return { bg: tint };
	}
}

function baseStyle(
	size: ButtonSize,
	fullWidth: boolean,
	rounded: boolean,
	look: VariantLook,
	dimmed: boolean,
): Record<string, unknown> {
	const isIcon = size === "icon";
	const height = isIcon ? ICON_BOX : (HEIGHT[size] ?? ICON_BOX);
	return {
		// 44dp touch floor: minHeight/minWidth beat the smaller visual
		// heights, so xs/sm keep their compact look without shrinking
		// the tappable area.
		minHeight: 44,
		minWidth: 44,
		height: isIcon ? ICON_BOX : undefined,
		width: isIcon ? ICON_BOX : undefined,
		paddingHorizontal: isIcon ? 0 : PAD_X[size],
		paddingVertical: isIcon ? 0 : Math.max(0, (44 - height) / 2),
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 8,
		alignSelf: fullWidth ? "stretch" : "flex-start",
		borderRadius: rounded ? 999 : tokens.radius.control,
		backgroundColor: look.bg,
		borderWidth: look.border !== undefined ? 1 : 0,
		borderColor: look.border,
		opacity: dimmed ? 0.5 : 1,
		overflow: "hidden",
	};
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
						textDecorationLine: look.underline,
					}}
				>
					{children}
				</Text>
			) : (
				<View style={{ alignItems: "center", justifyContent: "center" }}>
					{children}
				</View>
			)}
		</AnimatedPressable>
	);
}
