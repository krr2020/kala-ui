'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../button';

const errorFallbackVariants = cva(
  'flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50',
  {
    variants: {
      variant: {
        page: 'min-h-[400px]',
        section: 'min-h-[200px]',
      },
    },
    defaultVariants: {
      variant: 'page',
    },
  },
);

export interface ErrorFallbackProps extends VariantProps<typeof errorFallbackVariants> {
  /**
   * The error that was caught
   */
  error?: Error;
  /**
   * Callback to reset the error boundary
   */
  reset?: () => void;
  /**
   * Optional custom title
   */
  title?: string;
  /**
   * Optional custom description
   */
  description?: string;
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Error Fallback UI Component
 *
 * Displays a user-friendly error message with a reset button.
 *
 * @example
 * ```tsx
 * <ErrorFallback
 *   error={error}
 *   reset={reset}
 *   title="Something went wrong"
 * />
 * ```
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  variant,
  className,
}: ErrorFallbackProps) {
  const showDetails = process.env.NODE_ENV === 'development' && error;

  return (
    <div data-comp="error-fallback" className={cn(errorFallbackVariants({ variant }), className)} role="alert">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>

      {showDetails && (
        <details className="mb-6 w-full max-w-2xl text-left">
          <summary className="cursor-pointer font-medium text-foreground hover:text-foreground/80">
            Error Details
          </summary>
          <pre className="mt-2 max-h-[300px] overflow-auto rounded-md bg-muted p-4 text-sm text-foreground">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {reset && (
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
}
