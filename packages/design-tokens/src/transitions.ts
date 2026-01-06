/**
 * Transition Design Tokens
 *
 * Animation durations, timing functions, and transition presets.
 */

export const transitions = {
  // Duration values
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Timing functions (easing)
  timingFunction: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom easing
    snappy: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Transition delays
  delay: {
    none: '0ms',
    short: '75ms',
    base: '100ms',
    medium: '150ms',
    long: '300ms',
  },

  // Common transition properties
  property: {
    all: 'all',
    colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    opacity: 'opacity',
    shadow: 'box-shadow',
    transform: 'transform',
  },

  // Preset transitions for common use cases
  preset: {
    // Hover states
    hover: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Focus states
    focus: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Color changes
    colors: 'color, background-color, border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Opacity changes
    fade: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Transform animations
    transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Shadow changes
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Component-specific
    modal:
      'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    dropdown:
      'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    tooltip: 'opacity 150ms cubic-bezier(0.4, 0, 1, 1)',
  },

  // Animation keyframes (for more complex animations)
  keyframes: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    slideInFromTop: {
      from: { transform: 'translateY(-100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInFromBottom: {
      from: { transform: 'translateY(100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInFromLeft: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    slideInFromRight: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: '1' },
      to: { transform: 'scale(0.95)', opacity: '0' },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
      },
      '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
    },
  },
} as const;

export type TransitionDuration = keyof typeof transitions.duration;
export type TransitionTimingFunction = keyof typeof transitions.timingFunction;
export type TransitionPreset = keyof typeof transitions.preset;
