/**
 * Donut/Pie Chart Component
 * Circular charts for showing proportions and percentages
 */

'use client';

import type { ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Chart } from './chart';
import type { DonutChartProps } from './types';
import { getDefaultChartOptions } from './utils';

export function DonutChart({
  series,
  labels,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  height = 350,
  width = '100%',
  className,
  title,
  subtitle,
  animations = true,
  donut = true,
  donutSize = 65,
  dataLabels = true,
  legend = true,
  options: customOptions,
}: DonutChartProps) {
  const chartOptions: ApexOptions = useMemo(() => {
    const baseOptions = getDefaultChartOptions();

    const options: ApexOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: donut ? 'donut' : 'pie',
        animations: {
          enabled: animations,
          speed: 800,
        },
      },
      colors,
      labels,
      dataLabels: {
        enabled: dataLabels,
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#fff'],
        },
        dropShadow: {
          enabled: false,
        },
      },
      plotOptions: {
        pie: {
          ...(donut && {
            donut: {
              size: `${donutSize}%`,
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'hsl(var(--foreground))',
                  formatter: (value: string) => parseInt(value, 10).toLocaleString(),
                },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '14px',
                  color: 'hsl(var(--muted-foreground))',
                  formatter: (w: { globals: { seriesTotals: number[] } }) => {
                    return w.globals.seriesTotals
                      .reduce((a: number, b: number) => a + b, 0)
                      .toLocaleString();
                  },
                },
              },
            },
          }),
        },
      },
      legend: {
        show: legend,
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: 'hsl(var(--foreground))',
        },
      },
      tooltip: {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        y: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
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
  }, [
    labels,
    colors,
    donut,
    donutSize,
    dataLabels,
    legend,
    animations,
    title,
    subtitle,
    customOptions,
  ]);

  return (
    <Chart
      className={cn('w-full', className)}
      options={chartOptions}
      series={series}
      type={donut ? 'donut' : 'pie'}
      height={height}
      width={width}
    />
  );
}

// Convenience alias for Pie charts
export function PieChart(props: DonutChartProps) {
  return <DonutChart {...props} donut={false} />;
}
