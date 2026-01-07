/**
 * Animation Utilities
 *
 * Reusable CSS-based animation utilities with support for prefers-reduced-motion.
 * Uses design tokens from @repo/design-tokens for consistency.
 */

/**
 * CSS Animation Presets
 *
 * Ready-to-use animation classes that can be applied via className.
 * Automatically respects user's prefers-reduced-motion preference.
 */
export const animationPresets = {
	// Fade transitions
	fadeIn: "animate-fade-in",
	fadeOut: "animate-fade-out",

	// Slide transitions
	slideInFromTop: "animate-slide-in-from-top",
	slideInFromBottom: "animate-slide-in-from-bottom",
	slideInFromLeft: "animate-slide-in-from-left",
	slideInFromRight: "animate-slide-in-from-right",
	slideOutToTop: "animate-slide-out-to-top",
	slideOutToBottom: "animate-slide-out-to-bottom",
	slideOutToLeft: "animate-slide-out-to-left",
	slideOutToRight: "animate-slide-out-to-right",

	// Scale transitions
	scaleIn: "animate-scale-in",
	scaleOut: "animate-scale-out",

	// Expand/collapse
	expandVertical: "animate-expand-vertical",
	collapseVertical: "animate-collapse-vertical",

	// Utility animations
	spin: "animate-spin",
	pulse: "animate-pulse",
	bounce: "animate-bounce",
} as const;

/**
 * Transition Duration Classes
 *
 * Duration utilities from design tokens
 */
export const transitionDurations = {
	instant: "duration-0",
	fast: "duration-150",
	base: "duration-200",
	medium: "duration-300",
	slow: "duration-500",
	slower: "duration-700",
	slowest: "duration-1000",
} as const;

/**
 * Transition Timing Function Classes
 *
 * Easing utilities from design tokens
 */
export const transitionTimings = {
	linear: "ease-linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	snappy: "ease-[cubic-bezier(0.4,0,0.2,1)]",
	smooth: "ease-[cubic-bezier(0.25,0.1,0.25,1)]",
	bounce: "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
} as const;

/**
 * Common Transition Properties
 *
 * Ready-to-use transition combinations
 */
export const transitionClasses = {
	// Hover state transitions
	hover: "transition-all duration-200 ease-in-out",

	// Color transitions
	colors:
		"transition-[color,background-color,border-color] duration-200 ease-in-out",

	// Opacity transitions
	fade: "transition-opacity duration-300 ease-in-out",

	// Transform transitions
	transform: "transition-transform duration-300 ease-in-out",

	// Shadow transitions
	shadow: "transition-shadow duration-200 ease-in-out",

	// Combined transitions for interactive elements
	interactive:
		"transition-[color,background-color,border-color,box-shadow] duration-200 ease-in-out",

	// Modal/Dialog transitions
	modal: "transition-[opacity,transform] duration-300 ease-in-out",

	// Dropdown transitions
	dropdown: "transition-[opacity,transform] duration-150 ease-in-out",

	// Tooltip transitions
	tooltip: "transition-opacity duration-150 ease-in",
} as const;

/**
 * CSS Keyframes for Animations
 *
 * Define the actual CSS keyframes in your global styles or Tailwind config.
 * These values match the keyframes from design tokens.
 */
export const keyframesCSS = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slide-in-from-top {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }

  @keyframes slide-in-from-bottom {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slide-in-from-left {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes slide-in-from-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @keyframes slide-out-to-top {
    from { transform: translateY(0); }
    to { transform: translateY(-100%); }
  }

  @keyframes slide-out-to-bottom {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }

  @keyframes slide-out-to-left {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }

  @keyframes slide-out-to-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }

  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes scale-out {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.95); opacity: 0; }
  }

  @keyframes expand-vertical {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: var(--max-height, 1000px);
      opacity: 1;
    }
  }

  @keyframes collapse-vertical {
    from {
      max-height: var(--max-height, 1000px);
      opacity: 1;
    }
    to {
      max-height: 0;
      opacity: 0;
    }
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

/**
 * Utility function to build animation class string
 *
 * @param animation - The animation preset to use
 * @param duration - Duration of the animation (default: base)
 * @param timing - Timing function for the animation (default: easeInOut)
 * @param additionalClasses - Additional CSS classes to apply
 * @returns Combined class string
 */
export function buildAnimationClass(
	animation: keyof typeof animationPresets,
	options?: {
		duration?: keyof typeof transitionDurations;
		timing?: keyof typeof transitionTimings;
		additionalClasses?: string;
	},
): string {
	const {
		duration = "base",
		timing = "easeInOut",
		additionalClasses = "",
	} = options || {};

	return [
		animationPresets[animation],
		transitionDurations[duration],
		transitionTimings[timing],
		additionalClasses,
	]
		.filter(Boolean)
		.join(" ");
}

/**
 * Page Transition Utilities
 *
 * For Next.js route transitions
 */
export const pageTransitions = {
	enter: "animate-fade-in duration-300 ease-in-out",
	exit: "animate-fade-out duration-200 ease-in-out",
} as const;

/**
 * Modal/Dialog Transition Utilities
 */
export const modalTransitions = {
	overlay: {
		enter: "animate-fade-in duration-200 ease-out",
		exit: "animate-fade-out duration-150 ease-in",
	},
	content: {
		enter: "animate-scale-in duration-300 ease-out",
		exit: "animate-scale-out duration-200 ease-in",
	},
} as const;

/**
 * Drawer/Sheet Transition Utilities
 */
export const drawerTransitions = {
	left: {
		enter: "animate-slide-in-from-left duration-300 ease-out",
		exit: "animate-slide-out-to-left duration-250 ease-in",
	},
	right: {
		enter: "animate-slide-in-from-right duration-300 ease-out",
		exit: "animate-slide-out-to-right duration-250 ease-in",
	},
	top: {
		enter: "animate-slide-in-from-top duration-300 ease-out",
		exit: "animate-slide-out-to-top duration-250 ease-in",
	},
	bottom: {
		enter: "animate-slide-in-from-bottom duration-300 ease-out",
		exit: "animate-slide-out-to-bottom duration-250 ease-in",
	},
} as const;

/**
 * Accordion/Collapsible Transition Utilities
 */
export const accordionTransitions = {
	expand: "animate-expand-vertical duration-300 ease-out",
	collapse: "animate-collapse-vertical duration-250 ease-in",
} as const;

/**
 * Dropdown Menu Transition Utilities
 */
export const dropdownTransitions = {
	enter: "animate-scale-in duration-150 ease-out",
	exit: "animate-scale-out duration-100 ease-in",
} as const;

/**
 * Skeleton to Content Transition
 */
export const skeletonTransition = {
	// Apply to container wrapping skeleton and content
	container: "relative",
	skeleton: "animate-fade-out duration-200 ease-out absolute inset-0",
	content: "animate-fade-in duration-300 ease-in",
} as const;

/**
 * Hover Transition Utilities for Interactive Elements
 */
export const hoverTransitions = {
	// Button hover
	button:
		"transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]",

	// Link hover
	link: "transition-[color,text-decoration-color] duration-150 ease-in-out",

	// Card hover
	card: "transition-[box-shadow,transform] duration-300 ease-out hover:shadow-lg hover:scale-[1.01]",

	// Icon button hover
	iconButton:
		"transition-[color,background-color,transform] duration-200 ease-in-out hover:scale-110 active:scale-95",

	// Subtle hover (for nav items, etc.)
	subtle: "transition-[color,background-color] duration-150 ease-in-out",
} as const;

/**
 * Type exports
 */
export type AnimationPreset = keyof typeof animationPresets;
export type TransitionDuration = keyof typeof transitionDurations;
export type TransitionTiming = keyof typeof transitionTimings;
export type TransitionClass = keyof typeof transitionClasses;
