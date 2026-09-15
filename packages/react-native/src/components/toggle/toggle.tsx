/**
 * Toggle: the web toolbar-toggle on native — a pressable with a pressed
 * (on/off) state instead of a momentary tap. The same surface (sizes,
 * variants, active look) is shared with ToggleGroup items through
 * toggleSurface. Every size keeps the 44dp touch floor like Button.
 */
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import type { ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { applySlot } from "../slot-styles";
import type { ToggleProps, ToggleSize, ToggleVariant } from "./toggle.types";

export const TOGGLE_HEIGHT: Record<ToggleSize, number> = {
	sm: 36,
	md: tokens.size.controlH,
	lg: 44,
};

const PAD_X: Record<ToggleSize, number> = { sm: 6, md: 8, lg: 10 };
export const TOGGLE_FONT: Record<ToggleSize, number> = {
	sm: 13,
	md: 14,
	lg: 16,
};

interface SurfaceTheme {
	accent: string;
	accentForeground: string;
	foreground: string;
	border: string;
}

/** Shared visual surface for Toggle and ToggleGroupItem. */
export function toggleSurface({
	size,
	variant,
	active,
	disabled,
	theme,
}: {
	size: ToggleSize;
	variant: ToggleVariant;
	active: boolean;
	disabled: boolean;
	theme: SurfaceTheme;
}): { style: ViewStyle; fg: string } {
	return {
		style: {
			minHeight: 44,
			minWidth: 44,
			height: TOGGLE_HEIGHT[size],
			paddingHorizontal: PAD_X[size],
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "row",
			gap: 8,
			borderRadius: tokens.radius.control,
			backgroundColor: active ? theme.accent : "transparent",
			borderWidth: variant === "outline" ? 1 : 0,
			borderColor: theme.border,
			opacity: disabled ? 0.5 : 1,
		},
		fg: active ? theme.accentForeground : theme.foreground,
	};
}

function ToggleContent({
	children,
	fg,
	size,
}: {
	children: ReactNode;
	fg: string;
	size: ToggleSize;
}): ReactElement {
	return typeof children === "string" || typeof children === "number" ? (
		<RNText style={{ color: fg, fontSize: TOGGLE_FONT[size], fontWeight: "500" }}>
			{children}
		</RNText>
	) : (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			{children}
		</View>
	);
}

export function Toggle({
	children,
	pressed,
	defaultPressed = false,
	onPressedChange,
	variant = "default",
	size = "md",
	disabled = false,
	accessibilityLabel,
	style,
	styles,
	testID = "k-toggle",
}: ToggleProps): ReactElement {
	const { theme } = useUnistyles();
	// controlled lock: a provided pressed prop always wins over internal state
	const controlled = pressed !== undefined;
	const [internal, setInternal] = useState(defaultPressed);
	const active = controlled ? pressed : internal;

	const look = toggleSurface({ size, variant, active, disabled, theme });

	return (
		<Pressable
			testID={testID}
			onPress={() => {
				if (disabled) return;
				const next = !active;
				if (!controlled) setInternal(next);
				onPressedChange?.(next);
			}}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{
				checked: active,
				disabled: disabled || undefined,
			}}
			disabled={disabled}
			style={applySlot(applySlot(look.style, style), styles?.root)}
		>
			<ToggleContent fg={look.fg} size={size}>
				{children}
			</ToggleContent>
		</Pressable>
	);
}
