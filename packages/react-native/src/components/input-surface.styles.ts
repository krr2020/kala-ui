import type { ViewStyle } from "react-native";
import type { KalaTheme } from "../types";

/**
 * Shared input surface: one border/error/disabled/focus treatment for every
 * field-like control (TextInput, Textarea, NumberInput and the picker
 * triggers). Focus is a themed ring border — RN has no :focus-within.
 */
export interface InputSurfaceOptions {
	size?: "sm" | "md";
	hasError?: boolean;
	hasSuccess?: boolean;
	disabled?: boolean;
	focused?: boolean;
}

export const SURFACE_HEIGHTS = { sm: 36, md: 44 } as const;

export function surfaceBorder(
	theme: KalaTheme,
	{
		hasError = false,
		hasSuccess = false,
		focused = false,
	}: InputSurfaceOptions = {},
): string {
	if (hasError) return theme.destructive;
	if (hasSuccess) return theme.success;
	if (focused) return theme.ring;
	return theme.border;
}

// The input token is the muted disabled fill; resting fields sit on card
// so the idle state never reads as disabled (web parity: bg-card /
// disabled:bg-input).
export function surfaceFill(
	theme: KalaTheme,
	{ disabled = false }: InputSurfaceOptions = {},
): string {
	return disabled ? theme.input : theme.card;
}

export function trigger(theme: KalaTheme, options: InputSurfaceOptions = {}): ViewStyle {
	const { size = "md", disabled = false } = options;
	return {
		minHeight: SURFACE_HEIGHTS[size],
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: surfaceBorder(theme, options),
		backgroundColor: surfaceFill(theme, options),
		opacity: disabled ? 0.5 : 1,
	};
}
