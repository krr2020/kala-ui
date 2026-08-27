/**
 * Design Tokens
 *
 * Centralized design system tokens for consistent UI implementation.
 * Export all design tokens from this barrel file.
 */

export type { Breakpoint } from "./breakpoints";
export { breakpoints, mediaQuery } from "./breakpoints";
export type { ColorName, ColorScale } from "./colors";
export { colors } from "./colors";
export type { BoxShadow, DropShadow, Elevation } from "./shadows";
export { shadows } from "./shadows";
export type { SpacingScale } from "./spacing";
export { spacing } from "./spacing";
export type {
	TransitionDuration,
	TransitionPreset,
	TransitionTimingFunction,
} from "./transitions";
export { transitions } from "./transitions";
export type { FontSize, FontWeight, LineHeight } from "./typography";
export { typography } from "./typography";

/*
 * Theme VALUES live in CSS (packages/react/src/styles/globals.css) as design
 * tokens — that stylesheet is the single source of truth for theming. This
 * package only ships the primitive scales (colors/spacing/typography/…).
 */
