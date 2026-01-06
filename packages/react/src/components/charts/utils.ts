/**
 * Chart Utilities
 * Helper functions and default configurations for charts
 */

import type { ApexOptions } from 'apexcharts';

/**
 * Get default chart options that match our design system
 */
export function getDefaultChartOptions(): ApexOptions {
  return {
    chart: {
      fontFamily: 'inherit',
      foreColor: 'hsl(var(--muted-foreground))',
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    },
    legend: {
      labels: {
        colors: 'hsl(var(--foreground))',
      },
    },
  };
}

/**
 * Default color palette matching design tokens
 */
export const defaultColors = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  destructive: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  info: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
  mixed: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
};

/**
 * Format number with appropriate units
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Generate gradient colors for area charts
 */
export function createGradient(
  _color: string,
  opacity = 0.7,
): {
  type: 'gradient';
  gradient: {
    shadeIntensity: number;
    opacityFrom: number;
    opacityTo: number;
    stops: number[];
  };
} {
  return {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: opacity,
      opacityTo: opacity * 0.3,
      stops: [0, 90, 100],
    },
  };
}

/**
 * Get responsive breakpoints for charts
 */
export function getResponsiveOptions(): ApexResponsive[] {
  return [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          show: false,
        },
      },
    },
  ];
}

interface ApexResponsive {
  breakpoint: number;
  options: ApexOptions;
}
