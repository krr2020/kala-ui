/**
 * Non-component wiring for Icon: the size ramp (backed by the shape
 * token) and theme-token color resolution.
 */
import { tokens } from "../../tokens";
import type { KalaTheme } from "../../types";
import type { IconProps, IconSize } from "./icon.types";

export const ICON_SIZE_PX: Record<IconSize, number> = {
	xs: tokens.size.icon.xs,
	sm: tokens.size.icon.sm,
	md: tokens.size.icon.md,
	lg: tokens.size.icon.lg,
	xl: tokens.size.icon.xl,
};

/** Theme token key resolves to its value; raw strings pass through. */
export function iconColor(theme: KalaTheme, color: IconProps["color"]): string {
	const resolved = theme[color as keyof KalaTheme] ?? color;
	return String(resolved);
}
