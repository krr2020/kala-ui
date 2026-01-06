/**
 * Breakpoint Design Tokens
 *
 * Responsive breakpoints for mobile-first design.
 */

export const breakpoints = {
  // Mobile-first breakpoint values
  xs: '320px', // Small phones
  sm: '640px', // Large phones
  md: '768px', // Tablets
  lg: '1024px', // Small laptops
  xl: '1280px', // Desktops
  '2xl': '1536px', // Large desktops

  // Semantic breakpoints
  mobile: '640px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',

  // Media query helpers
  screens: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container max widths
  container: {
    xs: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Breakpoint = keyof typeof breakpoints.screens;

// Helper function to generate media queries
export const mediaQuery = {
  up: (breakpoint: Breakpoint) => `@media (min-width: ${breakpoints.screens[breakpoint]})`,
  down: (breakpoint: Breakpoint) => {
    const value = Number.parseInt(breakpoints.screens[breakpoint], 10);
    return `@media (max-width: ${value - 0.02}px)`;
  },
  between: (min: Breakpoint, max: Breakpoint) =>
    `@media (min-width: ${breakpoints.screens[min]}) and (max-width: ${breakpoints.screens[max]})`,
  only: (breakpoint: Breakpoint) => {
    const breakpointKeys = Object.keys(breakpoints.screens) as Breakpoint[];
    const currentIndex = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[currentIndex + 1];
    if (!nextBreakpoint) {
      return mediaQuery.up(breakpoint);
    }
    return mediaQuery.between(breakpoint, nextBreakpoint);
  },
} as const;
