/**
 * SparklineChart Stories
 * Demonstrates various sparkline chart configurations for cards and dashboards
 */

import type { Meta, StoryObj } from "@storybook/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../card";
import { SparklineChart } from "./sparkline-chart";

const meta: Meta<typeof SparklineChart> = {
	title: "Data Display/SparklineChart",
	component: SparklineChart,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Compact charts perfect for cards, dashboards, and inline metrics visualization.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["line", "area", "bar"],
			description: "Type of sparkline chart",
		},
		color: {
			control: "color",
			description: "Primary color for the chart",
		},
		height: {
			control: "number",
			description: "Height in pixels",
		},
		width: {
			control: "text",
			description: "Width (accepts CSS values)",
		},
		tooltip: {
			control: "boolean",
			description: "Show tooltip on hover",
		},
		animated: {
			control: "boolean",
			description: "Enable animations",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [23, 45, 56, 78, 32, 67, 89, 45, 23, 67, 89, 76];
const growthData = [10, 15, 12, 25, 30, 28, 35, 40, 45, 52, 48, 55];
const volatileData = [25, 15, 35, 20, 45, 10, 55, 30, 40, 20, 50, 25];

export const LineSparkline: Story = {
	args: {
		data: sampleData,
		type: "line",
		color: "#3B82F6",
		height: 64,
		width: 200,
		tooltip: false,
		animated: true,
	},
};

export const AreaSparkline: Story = {
	args: {
		data: growthData,
		type: "area",
		color: "#10B981",
		gradientFrom: "#10B981",
		gradientTo: "#34D399",
		height: 64,
		width: 200,
		tooltip: false,
		animated: true,
	},
};

export const BarSparkline: Story = {
	args: {
		data: volatileData,
		type: "bar",
		color: "#F59E0B",
		height: 64,
		width: 200,
		tooltip: false,
		animated: true,
	},
};

export const CompactLine: Story = {
	args: {
		data: sampleData,
		type: "line",
		color: "#8B5CF6",
		height: 40,
		width: 120,
		tooltip: false,
		animated: false,
	},
};

export const InCard: Story = {
	args: {
		data: growthData,
		type: "area",
		color: "#EF4444",
		gradientFrom: "#EF4444",
		gradientTo: "#FCA5A5",
		height: 48,
		width: "100%",
		tooltip: false,
		animated: true,
	},
	decorators: [
		(Story) => (
			<Card className="max-w-sm">
				<CardHeader>
					<CardTitle>Revenue</CardTitle>
					<div className="text-2xl font-bold text-success">$12,459</div>
					<CardDescription>+12.5% from last month</CardDescription>
				</CardHeader>
				<CardContent>
					<Story />
				</CardContent>
			</Card>
		),
	],
};

export const MultipleInDashboard: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
			<Card>
				<CardHeader>
					<CardDescription>Total Sales</CardDescription>
					<CardTitle className="text-2xl font-bold">$45,231</CardTitle>
					<div className="text-sm text-success">+20.1% from last month</div>
				</CardHeader>
				<CardContent>
					<SparklineChart
						data={growthData}
						type="area"
						color="#10B981"
						gradientFrom="#10B981"
						gradientTo="#34D399"
						height={60}
						width="100%"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Active Users</CardDescription>
					<CardTitle className="text-2xl font-bold">2,350</CardTitle>
					<div className="text-sm text-info">+5.4% from last week</div>
				</CardHeader>
				<CardContent>
					<SparklineChart
						data={sampleData}
						type="line"
						color="#3B82F6"
						height={60}
						width="100%"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardDescription>Page Views</CardDescription>
					<CardTitle className="text-2xl font-bold">98,230</CardTitle>
					<div className="text-sm text-error">-2.1% from yesterday</div>
				</CardHeader>
				<CardContent>
					<SparklineChart
						data={volatileData}
						type="bar"
						color="#EF4444"
						height={60}
						width="100%"
					/>
				</CardContent>
			</Card>
		</div>
	),
};
