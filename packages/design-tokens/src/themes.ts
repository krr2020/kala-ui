/**
 * Theme Design Tokens
 *
 * Centralized theme definitions for the design system.
 * All themes defined here serve as single source of truth for styling.
 */

export interface Theme {
  name: string;
  className: string;
  colorScheme: 'light' | 'dark';
  colors: {
    background: string; // HSL format for CSS
    foreground: string;
    card: string;
    border: string; // HSL format
  };
  shadow?: {
    color: string; // HSL color
    alpha: number; // Transparency value (0-1)
    spread: string; // Spread radius
  };
}

export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    className: '',
    colorScheme: 'light',
    colors: {
      background: '0 0% 100%', // rgb(255, 255, 255)
      foreground: '220 100% 11%', // rgb(0, 23, 55)
      card: '0 0% 100%', // rgb(255, 255, 255)
      border: '211 27% 81%', // rgb(192, 204, 218)
    },
    shadow: {
      color: '0 0% 0%',
      alpha: 0,
      spread: '0px',
    },
  },

  neutral: {
    name: 'Neutral',
    className: 'neutral',
    colorScheme: 'light',
    colors: {
      background: '228 25% 97%', // rgb(245, 246, 250)
      foreground: '220 100% 11%', // rgb(0, 23, 55)
      card: '0 0% 100%', // rgb(255, 255, 255)
      border: '221 32% 43%', // rgba(72, 94, 144, 0.16) color
    },
    shadow: {
      color: '221 38% 15%', // rgba(28, 39, 60, 0.05) color
      alpha: 0.05,
      spread: '10px',
    },
  },

  accent: {
    name: 'Accent',
    className: 'accent',
    colorScheme: 'light',
    colors: {
      background: '219 81% 49%', // rgba(26, 108, 225, 0.03)
      foreground: '220 100% 11%', // rgb(0, 23, 55)
      card: '0 0% 100%', // rgb(255, 255, 255)
      border: '219 81% 49%', // rgba(26, 108, 225, 0) - transparent
    },
    shadow: {
      color: '219 81% 49%', // rgba(26, 108, 225, 0.1) color
      alpha: 0.1,
      spread: '25px',
    },
  },

  dark: {
    name: 'Dark',
    className: 'dark',
    colorScheme: 'dark',
    colors: {
      background: '219 33% 12%', // rgb(20, 28, 43)
      foreground: '215 18% 66%', // rgb(151, 163, 185)
      card: '219 31% 17%', // rgb(28, 39, 60)
      border: '221 32% 43%', // rgba(72, 94, 144, 0.16) color
    },
    shadow: {
      color: '221 38% 15%',
      alpha: 0.05,
      spread: '10px',
    },
  },

  'high-contrast-light': {
    name: 'High Contrast Light',
    className: 'high-contrast-light',
    colorScheme: 'light',
    colors: {
      // Use existing light theme variables
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      border: '214.3 31.8% 91.4%',
    },
    shadow: {
      color: '0 0% 0%',
      alpha: 0,
      spread: '0px',
    },
  },

  'high-contrast-dark': {
    name: 'High Contrast Dark',
    className: 'high-contrast-dark',
    colorScheme: 'dark',
    colors: {
      // Use existing dark theme variables
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      border: '217.2 32.6% 17.5%',
    },
    shadow: {
      color: '224.3 76.3% 48%',
      alpha: 0,
      spread: '0px',
    },
  },
} as const;

export type ThemeKey = keyof typeof themes;
