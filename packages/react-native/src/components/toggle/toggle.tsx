/**
 * Toggle: the web toolbar-toggle on native — a pressable with a pressed
 * (on/off) state instead of a momentary tap. The same surface (sizes,
 * variants, active look) is shared with ToggleGroup items through
 * toggleSurface. Every size keeps the 44dp touch floor like Button.
 */

import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import type { ViewStyle } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { tokens } from "../../tokens";
import { applySlot } from "../slot-styles";
import {
	baseSurface,
	PAD_X,
	TOGGLE_FONT,
	TOGGLE_HEIGHT,
} from "./toggle.styles";
import type { ToggleProps, ToggleSize, ToggleVariant } from "./toggle.types";

export { PAD_X, TOGGLE_FONT, TOGGLE_HEIGHT };

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
			...baseSurface(size),
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
		<RNText
			style={{ color: fg, fontSize: TOGGLE_FONT[size], fontWeight: "500" }}
		>
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
	slotStyles,
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
			style={applySlot(applySlot(look.style, style), slotStyles?.root)}
		>
			<ToggleContent fg={look.fg} size={size}>
				{children}
			</ToggleContent>
		</Pressable>
	);
}
