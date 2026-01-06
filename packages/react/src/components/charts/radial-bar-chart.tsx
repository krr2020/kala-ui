/**
 * Radial Bar Chart Component
 * Circular progress bars for showing percentages and completion rates
 */

'use client';

import type { ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Chart } from './chart';
import type { RadialBarChartProps } from './types';
import { getDefaultChartOptions } from './utils';

export function RadialBarChart({
  series,
  labels,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  height = 350,
  width = '100%',
  className,
  title,
  subtitle,
  animations = true,
  dataLabels = true,
  hollowSize = '50%',
  options: customOptions,
}: RadialBarChartProps) {
  const chartOptions: ApexOptions = useMemo(() => {
    const baseOptions = getDefaultChartOptions();

    const options: ApexOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'radialBar',
        animations: {
          enabled: animations,
          speed: 800,
        },
      },
      colors,
      plotOptions: {
        radialBar: {
          hollow: {
            size: hollowSize,
          },
          track: {
            background: 'hsl(var(--muted))',
            strokeWidth: '100%',
          },
          dataLabels: {
            show: dataLabels,
            name: {
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))',
              offsetY: -10,
            },
            value: {
              fontSize: '24px',
              fontWeight: 700,
              color: 'hsl(var(--foreground))',
              offsetY: 5,
              formatter: (value: number) => `${value}%`,
            },
            total: {
              show: series.length > 1,
              label: 'Total',
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))',
              formatter: (w: { globals: { series: number[] } }) => {
                const total =
                  w.globals.series.reduce((a: number, b: number) => a + b, 0) /
                  w.globals.series.length;
                return `${Math.round(total)}%`;
              },
            },
          },
        },
      },
      labels,
      legend: {
        show: series.length > 1,
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: 'hsl(var(--foreground))',
        },
      },
      ...(title && {
        title: {
          text: title,
          style: {
            fontSize: '16px',
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
          },
        },
      }),
      ...(subtitle && {
        subtitle: {
          text: subtitle,
          style: {
            fontSize: '12px',
            color: 'hsl(var(--muted-foreground))',
          },
        },
      }),
      ...customOptions,
    };

    return options;
  }, [series, labels, colors, dataLabels, hollowSize, animations, title, subtitle, customOptions]);

  return (
    <Chart
      className={cn('w-full', className)}
      options={chartOptions}
      series={series}
      type="radialBar"
      height={height}
      width={width}
    />
  );
}
