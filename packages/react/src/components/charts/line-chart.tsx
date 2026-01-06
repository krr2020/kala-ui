/**
 * Line Chart Component
 * Clean line charts for trends and time series data
 */

'use client';

import type { ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Chart } from './chart';
import type { LineChartProps } from './types';
import { getDefaultChartOptions } from './utils';

export function LineChart({
  series,
  categories,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  height = 350,
  width = '100%',
  className,
  title,
  subtitle,
  toolbar = false,
  animations = true,
  curve = 'smooth',
  strokeWidth = 2,
  markers = true,
  yAxisLabel,
  options: customOptions,
}: LineChartProps) {
  const chartOptions: ApexOptions = useMemo(() => {
    const baseOptions = getDefaultChartOptions();

    const options: ApexOptions = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'line',
        toolbar: {
          show: toolbar,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        animations: {
          enabled: animations,
          speed: 800,
        },
      },
      colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve,
        width: strokeWidth,
      },
      markers: {
        size: markers ? 4 : 0,
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeColors: colors,
        fillOpacity: 1,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories,
        labels: {
          style: {
            colors: 'hsl(var(--muted-foreground))',
            fontSize: '12px',
          },
        },
        axisBorder: {
          color: 'hsl(var(--border))',
        },
        axisTicks: {
          color: 'hsl(var(--border))',
        },
      },
      yaxis: {
        ...(yAxisLabel && {
          title: {
            text: yAxisLabel,
            style: {
              color: 'hsl(var(--muted-foreground))',
              fontSize: '12px',
            },
          },
        }),
        labels: {
          style: {
            colors: 'hsl(var(--muted-foreground))',
            fontSize: '12px',
          },
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      grid: {
        borderColor: 'hsl(var(--border))',
        strokeDashArray: 3,
      },
      tooltip: {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        x: {
          show: true,
        },
        y: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
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
  }, [
    categories,
    colors,
    curve,
    strokeWidth,
    markers,
    yAxisLabel,
    toolbar,
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
      type="line"
      height={height}
      width={width}
    />
  );
}
