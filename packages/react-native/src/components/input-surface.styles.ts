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
	disabled?: boolean;
	focused?: boolean;
}

export const SURFACE_HEIGHTS = { sm: 36, md: 44 } as const;

export function surfaceBorder(
	theme: KalaTheme,
	{ hasError = false, focused = false }: InputSurfaceOptions = {},
): string {
	if (hasError) return theme.destructive;
	if (focused) return theme.ring;
	return theme.border;
}

export function trigger(theme: KalaTheme, options: InputSurfaceOptions = {}): ViewStyle {
	const { size = "md", hasError = false, disabled = false } = options;
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
		backgroundColor: theme.input,
		opacity: disabled ? 0.5 : 1,
	};
}
