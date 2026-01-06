import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonTextProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /**
   * Number of lines to display
   */
  lines?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Width of the last line (percentage or fixed value)
   */
  lastLineWidth?: string;
}

/**
 * Text content placeholder component
 *
 * Displays animated skeleton lines for text content.
 * Used as a loading placeholder for text-based content.
 */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, lastLineWidth = '75%', ...props }, ref) => {
    const lineElements = Array.from({ length: lines }, (_, index) => ({
      id: `skeleton-line-${index}`,
      isLast: index === lines - 1,
    }));

    return (
      // biome-ignore lint/a11y/useSemanticElements: keep div for correct ref typing and layout
      <div
        ref={ref}
        data-slot="skeleton-text"
        className={cn('space-y-2', className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading text"
        {...props}
      >
        {lineElements.map((line) => (
          <div
            key={line.id}
            className="h-4 animate-pulse rounded bg-muted"
            style={{
              width: line.isLast ? lastLineWidth : '100%',
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  },
);
SkeletonText.displayName = 'SkeletonText';

export { SkeletonText };
