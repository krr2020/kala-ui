/**
 * Non-component wiring for Button: size tiers, variant color mapping,
 * the base style builder, and the animated pressable wrapper.
 */
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { motion, tokens } from "../../tokens";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./button.types";

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

export const FONT: Record<Exclude<ButtonSize, "icon">, number> = {
	xs: 12,
	sm: 14,
	md: 14,
	lg: 16,
};

interface VariantLook {
	bg?: string;
	border?: string;
}

export interface KalaThemeShape {
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

export function foregroundKey(
	variant: ButtonVariant,
	color: ButtonColor,
): string {
	const base = baseColor(color);
	if (variant === "solid") return `${base}Foreground`;
	if (variant === "subtle" || color === "muted") return "mutedForeground";
	return base;
}

export function variantLook(
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
		default:
			return { bg: tint };
	}
}

export function baseStyle(
	size: ButtonSize,
	fullWidth: boolean,
	rounded: boolean,
	look: VariantLook,
	dimmed: boolean,
): Record<string, unknown> {
	const isIcon = size === "icon";
	const height = isIcon ? ICON_BOX : (HEIGHT[size] ?? ICON_BOX);
	// visual height follows the size tier (minHeight, not height, so
	// accessibility font scales can still grow the button); hitSlop
	// restores the 44dp touch floor around the compact tiers.
	const hitSlop = Math.max(0, (44 - height) / 2);
	return {
		minHeight: height,
		minWidth: 44,
		height: isIcon ? ICON_BOX : undefined,
		width: isIcon ? ICON_BOX : undefined,
		paddingHorizontal: isIcon ? 0 : PAD_X[size],
		paddingVertical: 0,
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
		hitSlop:
			hitSlop > 0
				? { top: hitSlop, bottom: hitSlop, left: 0, right: 0 }
				: undefined,
	};
}

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
