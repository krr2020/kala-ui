/**
 * Chart Component Types
 * Type definitions for ApexCharts-based chart components
 */

import type { ApexOptions } from 'apexcharts';

/**
 * Base chart props shared across all chart types
 */
export interface BaseChartProps {
  /** Chart height in pixels */
  height?: number;
  /** Chart width (100% by default) */
  width?: string | number;
  /** Custom CSS classes */
  className?: string;
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Show/hide toolbar */
  toolbar?: boolean;
  /** Enable/disable animations */
  animations?: boolean;
  /** Custom ApexCharts options (merged with defaults) */
  options?: Partial<ApexOptions>;
}

/**
 * Series data point for single value charts
 */
export interface ChartDataPoint {
  /** X-axis value (date, category, etc.) */
  x: string | number;
  /** Y-axis value */
  y: number;
  /** Optional fill color for this point */
  fillColor?: string;
  /** Optional stroke color for this point */
  strokeColor?: string;
}

/**
 * Series configuration for charts
 */
export interface ChartSeries {
  /** Series name */
  name: string;
  /** Series data points */
  data: number[] | ChartDataPoint[];
  /** Series color (hex or CSS variable) */
  color?: string;
  /** Series type (for mixed charts) */
  type?: 'line' | 'area' | 'bar' | 'column';
}

/**
 * Area Chart specific props
 */
export interface AreaChartProps extends BaseChartProps {
  /** Chart series data */
  series: ChartSeries[];
  /** X-axis categories (if not using data points) */
  categories?: string[];
  /** Chart colors */
  colors?: string[];
  /** Curve style */
  curve?: 'smooth' | 'straight' | 'stepline';
  /** Enable stacked mode */
  stacked?: boolean;
  /** Show data labels */
  dataLabels?: boolean;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Reference lines (e.g., limits, targets) */
  referenceLines?: ReferenceLine[];
}

/**
 * Line Chart specific props
 */
export interface LineChartProps extends BaseChartProps {
  /** Chart series data */
  series: ChartSeries[];
  /** X-axis categories */
  categories?: string[];
  /** Chart colors */
  colors?: string[];
  /** Curve style */
  curve?: 'smooth' | 'straight' | 'stepline';
  /** Line width */
  strokeWidth?: number;
  /** Show markers on data points */
  markers?: boolean;
  /** Y-axis label */
  yAxisLabel?: string;
}

/**
 * Bar Chart specific props
 */
export interface BarChartProps extends BaseChartProps {
  /** Chart series data */
  series: ChartSeries[];
  /** X-axis categories */
  categories: string[];
  /** Chart colors */
  colors?: string[];
  /** Horizontal bars */
  horizontal?: boolean;
  /** Enable stacked mode */
  stacked?: boolean;
  /** Show data labels */
  dataLabels?: boolean;
  /** Bar width percentage */
  barWidth?: number;
}

/**
 * Donut/Pie Chart specific props
 */
export interface DonutChartProps extends BaseChartProps {
  /** Chart labels */
  labels: string[];
  /** Chart data values */
  series: number[];
  /** Chart colors */
  colors?: string[];
  /** Show as donut (true) or pie (false) */
  donut?: boolean;
  /** Donut hole size (10-90) */
  donutSize?: number;
  /** Show data labels */
  dataLabels?: boolean;
  /** Show legend */
  legend?: boolean;
}

/**
 * Radial Bar Chart specific props
 */
export interface RadialBarChartProps extends BaseChartProps {
  /** Series labels */
  labels: string[];
  /** Series values (percentages 0-100) */
  series: number[];
  /** Chart colors */
  colors?: string[];
  /** Show data labels */
  dataLabels?: boolean;
  /** Hollow size percentage */
  hollowSize?: string;
}

/**
 * Reference line configuration
 */
export interface ReferenceLine {
  /** Y-axis value for the line */
  value: number;
  /** Line color */
  color?: string;
  /** Line style */
  dashArray?: number;
  /** Line label */
  label?: string;
}

/**
 * Theme configuration for charts
 */
export interface ChartTheme {
  /** Color palette */
  palette: 'palette1' | 'palette2' | 'palette3' | 'palette4' | 'palette5';
  /** Light or dark mode */
  mode: 'light' | 'dark';
  /** Monochrome colors */
  monochrome?: {
    enabled: boolean;
    color: string;
    shadeTo: 'light' | 'dark';
    shadeIntensity: number;
  };
}
