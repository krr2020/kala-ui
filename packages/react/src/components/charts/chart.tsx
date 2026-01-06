/**
 * Base Chart Component
 * React component for ApexCharts
 */

import type { Props } from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { cn } from '../../lib/utils';

export interface ChartProps extends Props {
  className?: string;
}

/**
 * Base Chart Component - use this as the foundation for all charts
 * Provides consistent styling
 */
export function Chart({ className, ...props }: ChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ReactApexChart {...props} />
    </div>
  );
}
