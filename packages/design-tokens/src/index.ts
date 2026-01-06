/**
 * Design Tokens
 *
 * Centralized design system tokens for consistent UI implementation.
 * Export all design tokens from this barrel file.
 */

export type { Breakpoint } from './breakpoints';
export { breakpoints, mediaQuery } from './breakpoints';
export type { ColorName, ColorScale } from './colors';
export { colors } from './colors';
export type { BoxShadow, DropShadow, Elevation } from './shadows';
export { shadows } from './shadows';
export type { SpacingScale } from './spacing';
export { spacing } from './spacing';
export type {
  TransitionDuration,
  TransitionPreset,
  TransitionTimingFunction,
} from './transitions';
export { transitions } from './transitions';
export type { FontSize, FontWeight, LineHeight } from './typography';
export { typography } from './typography';
export type { Theme, ThemeKey } from './themes';
export { themes } from './themes';

// Re-export everything as a single object for convenience
export const designTokens = {
  colors: {} as typeof import('./colors').colors,
  spacing: {} as typeof import('./spacing').spacing,
  typography: {} as typeof import('./typography').typography,
  shadows: {} as typeof import('./shadows').shadows,
  breakpoints: {} as typeof import('./breakpoints').breakpoints,
  transitions: {} as typeof import('./transitions').transitions,
  themes: {} as typeof import('./themes').themes,
  version: '1.0.0',
} as const;
