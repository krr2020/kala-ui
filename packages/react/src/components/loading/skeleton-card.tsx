import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonCardProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show image skeleton at top
   */
  showImage?: boolean;
  /**
   * Number of text lines
   */
  textLines?: number;
}

/**
 * Card content placeholder component
 *
 * Displays an animated skeleton card with optional image and text lines.
 * Used as a loading placeholder for card-based content.
 */
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, showImage = true, textLines = 3, ...props }, ref) => {
    const lineElements = Array.from({ length: textLines }, (_, index) => ({
      id: `skeleton-card-line-${index}`,
      isLast: index === textLines - 1,
    }));

    return (
      // biome-ignore lint/a11y/useSemanticElements: keep div for correct ref typing and layout
      <div
        ref={ref}
        data-slot="skeleton-card"
        className={cn('overflow-hidden rounded-lg border bg-card text-card-foreground theme-card', className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading content"
        {...props}
      >
        {showImage && <div className="h-48 w-full animate-pulse bg-muted" aria-hidden="true" />}
        <div className="space-y-3 p-4">
          {lineElements.map((line) => (
            <div
              key={line.id}
              className={cn('h-4 animate-pulse rounded bg-muted', line.isLast ? 'w-3/5' : 'w-full')}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    );
  },
);
SkeletonCard.displayName = 'SkeletonCard';

export { SkeletonCard };
