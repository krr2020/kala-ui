/**
 * SkipToContent Component
 * Allows keyboard users to bypass navigation and jump directly to main content
 * WCAG 2.1 AA Criterion 2.4.1 - Bypass Blocks
 */

import { cn } from '../../lib/utils';

export interface SkipToContentProps {
  /** ID of the main content element to skip to */
  targetId?: string;
  /** Custom text for the skip link */
  text?: string;
  /** Additional CSS classes */
  className?: string;
}

export function SkipToContent({
  targetId = 'main-content',
  text = 'Skip to main content',
  className,
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Screen reader only by default
        'sr-only',
        // When focused, become visible
        'focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]',
        'focus:px-4 focus:py-2 focus:rounded-md',
        'focus:bg-primary focus:text-primary-foreground',
        'focus-ring',
        'focus:font-medium focus:text-sm',
        'transition-colors',
        className,
      )}
    >
      {text}
    </a>
  );
}
