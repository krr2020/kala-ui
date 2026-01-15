/**
 * Chart Component Stories
 * Based on Doar React ApexCharts examples
 * @see https://doar-react-components.netlify.app/?path=/docs/charts-apexcharts--bar-chart
 */

import type { Meta, StoryObj } from "@storybook/react";
import type { ApexOptions } from "apexcharts";
import { AreaChart } from "./area-chart";
import { BarChart as BarChartComponent } from "./bar-chart";
import { Chart } from "./chart";
import {
	DonutChart as DonutChartComponent,
	PieChart as PieChartComponent,
} from "./donut-chart";
import { LineChart as LineChartComponent } from "./line-chart";
import { RadialBarChart as RadialBarChartComponent } from "./radial-bar-chart";

const meta = {
	title: "Data Display/Chart",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"ApexCharts-based chart components for beautiful data visualization. Supports area, line, bar, donut, and radial charts with full customization.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for charts
const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/**
 * Bar Chart Component - Vertical bars for comparing categories
 */
export const BarChart: Story = {
	render: () => (
		<div className="space-y-6">
			<BarChartComponent
				series={[
					{
						name: "Revenue",
						data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 38],
					},
				]}
				categories={months}
				title="Monthly Revenue"
				subtitle="Sales data for 2024"
				height={400}
				colors={["#3b82f6"]}
			/>
		</div>
	),
};

/**
 * Stacked bar chart with multiple series
 */
export const StackedChart: Story = {
	render: () => {
		const options: ApexOptions = {
			chart: {
				type: "bar",
				stacked: true,
				toolbar: { show: false },
				fontFamily: "inherit",
			},
			colors: ["#3b82f6", "#10b981", "#f59e0b"],
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: "55%",
					borderRadius: 4,
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				categories: months,
				labels: {
					style: {
						colors: "hsl(var(--muted-foreground))",
						fontSize: "12px",
					},
				},
			},
			yaxis: {
				title: {
					text: "Sales",
					style: {
						color: "hsl(var(--muted-foreground))",
					},
				},
				labels: {
					style: {
						colors: "hsl(var(--muted-foreground))",
					},
				},
			},
			legend: {
				position: "top",
				horizontalAlign: "left",
				labels: {
					colors: "hsl(var(--foreground))",
				},
			},
			fill: {
				opacity: 1,
			},
			grid: {
				borderColor: "hsl(var(--border))",
				strokeDashArray: 3,
			},
		};

		const series = [
			{
				name: "Product A",
				data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 35],
			},
			{
				name: "Product B",
				data: [13, 23, 20, 8, 13, 27, 33, 12, 15, 30, 25, 22],
			},
			{
				name: "Product C",
				data: [11, 17, 15, 15, 21, 14, 15, 13, 18, 25, 20, 18],
			},
		];

		return (
			<div className="max-w-4xl">
				<Chart options={options} series={series} type="bar" height={350} />
			</div>
		);
	},
};

/**
 * Line Chart Component - Clean lines for trends
 */
export const LineChart: Story = {
	render: () => (
		<div className="space-y-6">
			<LineChartComponent
				series={[
					{
						name: "Sales",
						data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 110, 130],
					},
					{
						name: "Orders",
						data: [20, 30, 25, 40, 39, 50, 60, 71, 95, 80, 90, 100],
					},
				]}
				categories={months}
				title="Sales & Orders Trend"
				yAxisLabel="Amount"
				height={400}
				curve="smooth"
				markers={true}
			/>
		</div>
	),
};

/**
 * Area chart with gradient fill
 */
export const AreaChartStory: Story = {
	name: "Area Chart",
	render: () => {
		const series = [
			{
				name: "Revenue",
				data: [31, 40, 28, 51, 42, 109, 100, 120, 140, 155, 170, 180],
				color: "#3b82f6",
			},
			{
				name: "Profit",
				data: [11, 32, 45, 32, 34, 52, 41, 55, 65, 75, 85, 95],
				color: "#10b981",
			},
		];

		return (
			<div className="max-w-4xl">
				<AreaChart
					series={series}
					categories={months}
					height={350}
					yAxisLabel="Amount ($k)"
					curve="smooth"
				/>
			</div>
		);
	},
};

/**
 * Area chart with reference line for thresholds
 */
export const Thresholds: Story = {
	render: () => {
		const series = [
			{
				name: "Usage",
				data: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
				color: "#3b82f6",
			},
		];

		return (
			<div className="max-w-4xl">
				<AreaChart
					series={series}
					categories={months}
					height={350}
					yAxisLabel="Usage"
					referenceLines={[
						{
							value: 100,
							label: "Limit: 100",
							color: "#ef4444",
						},
					]}
				/>
			</div>
		);
	},
};

/**
 * Donut & Pie Chart Component - Proportional data visualization
 */
export const DonutChart: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<DonutChartComponent
				series={[44, 55, 13, 43, 22]}
				labels={["Desktop", "Mobile", "Tablet", "Smart TV", "Other"]}
				title="Traffic Source"
				height={350}
				donut={true}
				donutSize={70}
			/>
			<PieChartComponent
				series={[44, 55, 13, 43]}
				labels={["Product A", "Product B", "Product C", "Product D"]}
				title="Product Distribution"
				height={350}
			/>
		</div>
	),
};

/**
 * Radial Bar Chart Component - Progress and completion rates
 */
export const RadialChart: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<RadialBarChartComponent
				series={[76]}
				labels={["Progress"]}
				title="Project Completion"
				height={300}
				colors={["#10b981"]}
			/>
			<RadialBarChartComponent
				series={[76, 67, 61, 90]}
				labels={["Q1", "Q2", "Q3", "Q4"]}
				title="Quarterly Goals"
				height={300}
			/>
		</div>
	),
};

/**
 * Multiple chart types in one view
 */
export const MixedCharts: Story = {
	name: "Mixed Charts",
	render: () => {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
				{/* Bar Chart */}
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Bar Chart</h3>
					<Chart
						options={{
							chart: {
								type: "bar",
								toolbar: { show: false },
								fontFamily: "inherit",
							},
							colors: ["#3b82f6"],
							plotOptions: {
								bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 },
							},
							dataLabels: { enabled: false },
							xaxis: {
								categories: ["Q1", "Q2", "Q3", "Q4"],
								labels: { style: { colors: "hsl(var(--muted-foreground))" } },
							},
							yaxis: {
								labels: { style: { colors: "hsl(var(--muted-foreground))" } },
							},
							grid: { borderColor: "hsl(var(--border))", strokeDashArray: 3 },
						}}
						series={[{ name: "Sales", data: [44, 55, 57, 56] }]}
						type="bar"
						height={250}
					/>
				</div>

				{/* Line Chart */}
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Line Chart</h3>
					<Chart
						options={{
							chart: {
								type: "line",
								toolbar: { show: false },
								fontFamily: "inherit",
							},
							colors: ["#10b981"],
							stroke: { width: 3, curve: "smooth" },
							dataLabels: { enabled: false },
							xaxis: {
								categories: ["Q1", "Q2", "Q3", "Q4"],
								labels: { style: { colors: "hsl(var(--muted-foreground))" } },
							},
							yaxis: {
								labels: { style: { colors: "hsl(var(--muted-foreground))" } },
							},
							grid: { borderColor: "hsl(var(--border))", strokeDashArray: 3 },
							markers: { size: 0, hover: { size: 5 } },
						}}
						series={[{ name: "Growth", data: [28, 35, 42, 48] }]}
						type="line"
						height={250}
					/>
				</div>

				{/* Donut Chart */}
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Donut Chart</h3>
					<Chart
						options={{
							chart: { type: "donut", fontFamily: "inherit" },
							colors: ["#3b82f6", "#10b981", "#f59e0b"],
							labels: ["A", "B", "C"],
							legend: {
								position: "bottom",
								labels: { colors: "hsl(var(--foreground))" },
							},
							plotOptions: {
								pie: {
									donut: {
										size: "65%",
										labels: {
											show: true,
											total: {
												show: true,
												label: "Total",
												color: "hsl(var(--foreground))",
												formatter: () => "100",
											},
										},
									},
								},
							},
						}}
						series={[44, 35, 21]}
						type="donut"
						height={250}
					/>
				</div>

				{/* Radial Bar */}
				<div className="space-y-2">
					<h3 className="text-lg font-semibold">Radial Bar</h3>
					<Chart
						options={{
							chart: { type: "radialBar", fontFamily: "inherit" },
							colors: ["#8b5cf6"],
							plotOptions: {
								radialBar: {
									hollow: { size: "60%" },
									dataLabels: {
										show: true,
										value: {
											fontSize: "24px",
											fontWeight: 700,
											color: "hsl(var(--foreground))",
											formatter: (val: number) => `${val}%`,
										},
									},
								},
							},
							labels: ["Progress"],
						}}
						series={[75]}
						type="radialBar"
						height={250}
					/>
				</div>
			</div>
		);
	},
};

/**
 * Dark theme demonstration
 */
export const DarkTheme: Story = {
	parameters: {
		backgrounds: { default: "dark" },
	},
	render: () => {
		const series = [
			{
				name: "Revenue",
				data: [31, 40, 28, 51, 42, 109, 100, 120, 140, 155, 170, 180],
				color: "#3b82f6",
			},
		];

		return (
			<div className="max-w-4xl dark">
				<AreaChart
					series={series}
					categories={months}
					height={350}
					yAxisLabel="Revenue ($k)"
					className="bg-card border rounded-lg p-4"
					options={{
						chart: {
							background: "transparent",
						},
						xaxis: {
							labels: {
								style: {
									colors: "#9ca3af",
								},
							},
							axisBorder: {
								color: "#374151",
							},
							axisTicks: {
								color: "#374151",
							},
						},
						yaxis: {
							title: {
								text: "Revenue ($k)",
								style: {
									color: "#9ca3af",
								},
							},
							labels: {
								style: {
									colors: "#9ca3af",
								},
							},
						},
						grid: {
							borderColor: "#374151",
						},
						tooltip: {
							theme: "dark",
						},
						legend: {
							labels: {
								colors: "#f9fafb",
							},
						},
					}}
				/>
			</div>
		);
	},
};

/**
 * Small charts in cards - Dashboard style
 * Inspired by Doar React dashboard components
 */
export const CardCharts: Story = {
	name: "Charts in Cards",
	render: () => {
		const lineOptions: ApexOptions = {
			chart: {
				type: "line",
				sparkline: { enabled: true },
				fontFamily: "inherit",
			},
			colors: ["#3b82f6"],
			stroke: { width: 2, curve: "smooth" },
			tooltip: {
				enabled: false,
			},
		};

		const areaOptions: ApexOptions = {
			chart: {
				type: "area",
				sparkline: { enabled: true },
				fontFamily: "inherit",
			},
			colors: ["#10b981"],
			stroke: { width: 2, curve: "smooth" },
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.4,
					opacityTo: 0.1,
				},
			},
			tooltip: {
				enabled: false,
			},
		};

		const barOptions: ApexOptions = {
			chart: {
				type: "bar",
				sparkline: { enabled: true },
				fontFamily: "inherit",
			},
			colors: ["#f59e0b"],
			plotOptions: {
				bar: {
					columnWidth: "60%",
				},
			},
			tooltip: {
				enabled: false,
			},
		};

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">
				{/* Revenue Card */}
				<div className="rounded-lg border bg-card text-card-foreground p-6 theme-card">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm text-muted-foreground">Total Revenue</p>
							<h3 className="text-2xl font-bold mt-1">$54,239</h3>
							<p className="text-sm text-success mt-1">+12.5%</p>
						</div>
					</div>
					<Chart
						options={lineOptions}
						series={[
							{ name: "Revenue", data: [28, 35, 32, 42, 38, 45, 48, 52, 55] },
						]}
						type="line"
						height={80}
					/>
				</div>

				{/* Orders Card */}
				<div className="rounded-lg border bg-card text-card-foreground p-6 theme-card">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm text-muted-foreground">Total Orders</p>
							<h3 className="text-2xl font-bold mt-1">3,847</h3>
							<p className="text-sm text-success mt-1">+8.2%</p>
						</div>
					</div>
					<Chart
						options={areaOptions}
						series={[
							{ name: "Orders", data: [15, 22, 18, 28, 25, 32, 30, 38, 35] },
						]}
						type="area"
						height={80}
					/>
				</div>

				{/* Customers Card */}
				<div className="rounded-lg border bg-card text-card-foreground p-6 theme-card">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm text-muted-foreground">New Customers</p>
							<h3 className="text-2xl font-bold mt-1">1,284</h3>
							<p className="text-sm text-destructive mt-1">-3.1%</p>
						</div>
					</div>
					<Chart
						options={barOptions}
						series={[
							{ name: "Customers", data: [42, 38, 45, 40, 48, 42, 50, 45, 52] },
						]}
						type="bar"
						height={80}
					/>
				</div>

				{/* Conversion Rate Card */}
				<div className="rounded-lg border bg-card text-card-foreground p-6 theme-card">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm text-muted-foreground">Conversion Rate</p>
							<h3 className="text-2xl font-bold mt-1">3.24%</h3>
							<p className="text-sm text-success mt-1">+2.1%</p>
						</div>
					</div>
					<Chart
						options={{
							...lineOptions,
							colors: ["#8b5cf6"],
						}}
						series={[
							{
								name: "Rate",
								data: [2.8, 3.1, 2.9, 3.3, 3.0, 3.4, 3.2, 3.5, 3.24],
							},
						]}
						type="line"
						height={80}
					/>
				</div>
			</div>
		);
	},
};
