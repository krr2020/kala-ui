/**
 * Shadow Design Tokens
 *
 * Elevation and shadow definitions for depth and hierarchy.
 */

export const shadows = {
  // Box shadows (elevation levels)
  boxShadow: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Drop shadows (for text and filters)
  dropShadow: {
    none: 'none',
    sm: '0 1px 1px rgb(0 0 0 / 0.05)',
    md: ['0 4px 3px rgb(0 0 0 / 0.07)', '0 2px 2px rgb(0 0 0 / 0.06)'],
    lg: ['0 10px 8px rgb(0 0 0 / 0.04)', '0 4px 3px rgb(0 0 0 / 0.1)'],
    xl: ['0 20px 13px rgb(0 0 0 / 0.03)', '0 8px 5px rgb(0 0 0 / 0.08)'],
    '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
  },

  // Semantic shadows for components
  component: {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    popover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    dropdown: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    tooltip: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    focus: '0 0 0 3px rgb(59 130 246 / 0.5)', // Primary color with transparency
  },

  // Elevation levels (z-index and shadow combinations)
  elevation: {
    0: {
      zIndex: 0,
      boxShadow: 'none',
    },
    1: {
      zIndex: 10,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    2: {
      zIndex: 20,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    3: {
      zIndex: 30,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    4: {
      zIndex: 40,
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    5: {
      zIndex: 50,
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    },
  },
} as const;

export type BoxShadow = keyof typeof shadows.boxShadow;
export type DropShadow = keyof typeof shadows.dropShadow;
export type Elevation = keyof typeof shadows.elevation;
