/**
 * Size table and variant color mapping for Spinner — pure, theme-in,
 * token-out so the component stays JSX-only.
 */
import type { KalaTheme } from "../../types";
import type { SpinnerProps, SpinnerSize } from "./spinner.types";

export const SIZE: Record<SpinnerSize, number> = {
	sm: 16,
	md: 24,
	lg: 32,
	xl: 48,
};

export const variantColor = (
	variant: NonNullable<SpinnerProps["variant"]>,
	theme: KalaTheme,
): string =>
	variant === "white"
		? theme.primaryForeground
		: variant === "muted" || variant === "ghost"
			? theme.mutedForeground
			: theme.primary;

export const wrapperStyle = (variant: NonNullable<SpinnerProps["variant"]>) => ({
	alignItems: "center" as const,
	justifyContent: "center" as const,
	opacity: variant === "ghost" ? 0.6 : 1,
});
