/**
 * Shared style tables for the error surfaces — used by ErrorFallback
 * and EmptyState so both share one MIN_HEIGHT scale.
 */
import type { ViewStyle } from "react-native";
import type { KalaTheme } from "@kala-ui/react-native/types";

export const MIN_HEIGHT = { page: 400, section: 200 } as const;

export const fallbackRoot = (variant: keyof typeof MIN_HEIGHT): ViewStyle => ({
	minHeight: MIN_HEIGHT[variant],
	alignItems: "center",
	justifyContent: "center",
	padding: 32,
	gap: 12,
});

export const fallbackTitle = (theme: KalaTheme) => ({
	fontSize: 20,
	fontWeight: "600" as const,
	color: theme.destructive,
});

export const fallbackDescription = (theme: KalaTheme) => ({
	fontSize: 14,
	color: theme.mutedForeground,
	textAlign: "center" as const,
});
