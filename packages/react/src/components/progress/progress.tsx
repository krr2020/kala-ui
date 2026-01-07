'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from '../../lib/utils';

type ProgressColor = 'default' | 'success' | 'info' | 'warning' | 'destructive';
type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Color variant
   * @default "default"
   */
  color?: ProgressColor | 'danger';
  /**
   * Size variant
   * @default "md"
   */
  size?: ProgressSize;
  /**
   * Show striped pattern
   * @default false
   */
  striped?: boolean;
  /**
   * Animate striped pattern
   * @default false
   */
  animated?: boolean;
  /**
   * Label to display inside progress bar
   */
  label?: string;
  /**
   * Show value as percentage
   * @default false
   */
  showValue?: boolean;
}

export interface ProgressBarProps {
  value: number;
  color?: ProgressColor | 'danger';
  striped?: boolean;
  animated?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorClasses: Record<ProgressColor, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
};

const stripedGradient =
  'bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]';

const Progress = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      min = 0,
      color = 'default',
      size = 'md',
      striped = false,
      animated = false,
      label,
      showValue = false,
      ...props
    },
    ref,
  ) => {
    // Clamp value between min and max
    const clampedValue = Math.min(Math.max(value ?? 0, min), max);
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    const variantColor = color === 'danger' ? 'destructive' : color;

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-primary/20',
          sizeClasses[size],
          className,
        )}
        value={clampedValue}
        max={max}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all duration-500 ease-in-out',
            colorClasses[variantColor],
            striped && stripedGradient,
            striped && 'bg-size-[1rem_1rem]',
            animated && striped && 'animate-progress-stripes',
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        >
          {(label || showValue) && size !== 'sm' && (
            <span
              className={cn(
                'flex h-full items-center justify-center text-xs font-medium',
                variantColor === 'default' && 'text-primary-foreground',
                variantColor === 'success' && 'text-success-foreground',
                variantColor === 'info' && 'text-info-foreground',
                variantColor === 'warning' && 'text-warning-foreground',
                variantColor === 'destructive' && 'text-destructive-foreground',
                size === 'md' && 'text-[10px]',
                size === 'lg' && 'text-xs',
              )}
            >
              {label || (showValue && `${Math.round(percentage)}%`)}
            </span>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = 'Progress';

/**
 * ProgressBar for use in multiple bar scenarios
 */
const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, color = 'default', striped = false, animated = false, label, className }, ref) => {
    const variantColor = color === 'danger' ? 'destructive' : color;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'h-full transition-all duration-500 ease-in-out flex items-center justify-center',
          colorClasses[variantColor],
          striped && stripedGradient,
          striped && 'bg-size-[1rem_1rem]',
          animated && striped && 'animate-progress-stripes',
          className,
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      >
        {label && (
          <span
            className={cn(
              'text-xs font-medium px-2',
              variantColor === 'default' && 'text-primary-foreground',
              variantColor === 'success' && 'text-success-foreground',
              variantColor === 'info' && 'text-info-foreground',
              variantColor === 'warning' && 'text-warning-foreground',
              variantColor === 'destructive' && 'text-destructive-foreground',
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

/**
 * Container for multiple progress bars
 */
const ProgressGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: ProgressSize }
>(({ className, size = 'md', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="presentation"
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-primary/20 flex',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ProgressGroup.displayName = 'ProgressGroup';

export { Progress, ProgressBar, ProgressGroup };
