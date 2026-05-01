/**
 * Base Chart Component
 * React component for ApexCharts with built-in loading and empty states
 */

import type { Props } from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { cn } from '../../lib/utils';
import type { ChartSkeletonConfig } from './chart.types';
import { ChartSkeleton } from './chart-skeleton';

export interface ChartProps extends Props {
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  skeletonConfig?: ChartSkeletonConfig;
  skeleton?: React.ReactNode;
}

/**
 * Get tooltip theme from DOM safely (SSR-compatible)
 */
function getTooltipTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Base Chart Component - use this as the foundation for all charts
 * Provides consistent styling, loading skeleton, and empty state
 */
export function Chart({
  className,
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
  skeletonConfig,
  skeleton,
  ...props
}: ChartProps) {
  // Render skeleton if loading
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return <ChartSkeleton {...(skeletonConfig || {})} className={className} />;
  }

  // Render empty state when no data
  if (isEmpty) {
    return (
      <div
        className={cn(
          'w-full flex flex-col items-center justify-center text-center rounded-lg border bg-card text-muted-foreground',
          className,
        )}
        style={{ height: `${skeletonConfig?.height ?? props.height ?? 350}px` }}
      >
        <svg
          className="mb-3 h-10 w-10 opacity-40"
          fill="none"
          role="img"
          aria-label="Chart empty state"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>No chart data</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 13h2v8H3zM9 9h2v12H9zM15 5h2v16h-2zM21 1h2v20h-2z"
          />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <ReactApexChart {...props} />
    </div>
  );
}

export { ChartSkeleton } from './chart-skeleton';
export { getTooltipTheme };
