import type { Meta, StoryObj } from "@storybook/react";
import {
	Activity,
	DollarSign,
	ShoppingCart,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { MetricCard } from "./metric-card";

const meta = {
	title: "Application/MetricCard",
	component: MetricCard,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "The metric title (usually uppercase)",
		},
		value: {
			control: "text",
			description: "The metric value (number or string)",
		},
		variant: {
			control: "select",
			options: [
				"default",
				"blue",
				"green",
				"purple",
				"orange",
				"teal",
				"indigo",
			],
			description: "Visual style variant",
		},
		change: {
			control: "number",
			description: "Percentage change (positive/negative/zero)",
		},
		changeLabel: {
			control: "text",
			description: "Custom label for change indicator",
		},
		subtitle: {
			control: "text",
			description: "Subtitle text (shown when change is not provided)",
		},
	},
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "Total Users",
		value: 3137,
	},
};

export const WithIcon: Story = {
	args: {
		title: "Total Users",
		value: 3137,
		icon: <Users className="w-5 h-5" />,
	},
};

export const WithPositiveChange: Story = {
	args: {
		title: "Conversion Rate",
		value: "0.81%",
		change: 1.2,
		icon: <TrendingUp className="w-5 h-5" />,
	},
};

export const WithNegativeChange: Story = {
	args: {
		title: "Bounce Rate",
		value: "45.2%",
		change: -3.5,
		icon: <Activity className="w-5 h-5" />,
	},
};

export const WithZeroChange: Story = {
	args: {
		title: "Active Sessions",
		value: 1234,
		change: 0,
		icon: <Users className="w-5 h-5" />,
	},
};

export const WithSubtitle: Story = {
	args: {
		title: "New Signups",
		value: 456,
		subtitle: "Last 7 days",
		icon: <Users className="w-5 h-5" />,
	},
};

export const WithCustomChangeLabel: Story = {
	args: {
		title: "Revenue",
		value: "$12,345",
		change: 8.3,
		changeLabel: "compared to last month",
		icon: <DollarSign className="w-5 h-5" />,
	},
};

export const BlueVariant: Story = {
	args: {
		title: "Total Revenue",
		value: "$620,076",
		change: 12.5,
		className:
			"bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none",
		icon: <DollarSign className="w-5 h-5" />,
	},
};

export const GreenVariant: Story = {
	args: {
		title: "Unique Purchases",
		value: 3137,
		change: 0.7,
		className:
			"bg-gradient-to-br from-green-600 to-green-500 text-white border-none",
		icon: <ShoppingCart className="w-5 h-5" />,
	},
};

export const PurpleVariant: Story = {
	args: {
		title: "Conversion Rate",
		value: "0.81%",
		change: 1.2,
		className:
			"bg-gradient-to-br from-purple-600 to-purple-500 text-white border-none",
		icon: <Target className="w-5 h-5" />,
	},
};

export const OrangeVariant: Story = {
	args: {
		title: "Avg Order Value",
		value: "$306.20",
		change: -0.3,
		className:
			"bg-gradient-to-br from-orange-600 to-orange-500 text-white border-none",
		icon: <DollarSign className="w-5 h-5" />,
	},
};

export const TealVariant: Story = {
	args: {
		title: "Active Users",
		value: 12543,
		change: 5.2,
		className:
			"bg-gradient-to-br from-teal-600 to-teal-500 text-white border-none",
		icon: <Users className="w-5 h-5" />,
	},
};

export const IndigoVariant: Story = {
	args: {
		title: "MRR Growth",
		value: "$1,200",
		change: 3.8,
		className:
			"bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-none",
		icon: <TrendingUp className="w-5 h-5" />,
	},
};

export const Dashboard: Story = {
	args: {
		title: "Metric",
		value: "0",
	},
	render: () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<MetricCard
				title="Conversion Rate"
				value="0.81%"
				change={1.2}
				className="bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none"
				icon={<Target className="w-5 h-5" />}
			/>
			<MetricCard
				title="Unique Purchases"
				value={3137}
				change={0.7}
				className="bg-gradient-to-br from-green-600 to-green-500 text-white border-none"
				icon={<ShoppingCart className="w-5 h-5" />}
			/>
			<MetricCard
				title="Avg Order Value"
				value="$306.20"
				change={-0.3}
				className="bg-gradient-to-br from-purple-600 to-purple-500 text-white border-none"
				icon={<DollarSign className="w-5 h-5" />}
			/>
			<MetricCard
				title="Total Revenue"
				value="$620,076"
				change={12.5}
				className="bg-gradient-to-br from-orange-600 to-orange-500 text-white border-none"
				icon={<TrendingUp className="w-5 h-5" />}
			/>
		</div>
	),
};

export const DashboardDefault: Story = {
	args: {
		title: "Metric",
		value: "0",
	},
	render: () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<MetricCard
				title="Total Users"
				value={12543}
				change={5.2}
				icon={<Users className="w-5 h-5" />}
			/>
			<MetricCard
				title="Active Sessions"
				value={3456}
				change={-2.1}
				icon={<Activity className="w-5 h-5" />}
			/>
			<MetricCard
				title="Monthly Revenue"
				value="$45,678"
				change={8.3}
				icon={<DollarSign className="w-5 h-5" />}
			/>
			<MetricCard
				title="New Signups"
				value={234}
				subtitle="Last 7 days"
				icon={<Users className="w-5 h-5" />}
			/>
			<MetricCard
				title="Conversion Rate"
				value="3.42%"
				change={0}
				icon={<Target className="w-5 h-5" />}
			/>
			<MetricCard
				title="Avg Order Value"
				value="$156.89"
				change={1.8}
				icon={<ShoppingCart className="w-5 h-5" />}
			/>
		</div>
	),
};

export const LargeValues: Story = {
	args: {
		title: "Metric",
		value: "0",
	},
	render: () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<MetricCard
				title="Total Revenue"
				value={1234567890}
				change={12.5}
				className="bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none"
				icon={<DollarSign className="w-5 h-5" />}
			/>
			<MetricCard
				title="Total Users"
				value={9876543}
				change={-3.2}
				className="bg-gradient-to-br from-green-600 to-green-500 text-white border-none"
				icon={<Users className="w-5 h-5" />}
			/>
		</div>
	),
};

export const MinimalCards: Story = {
	args: {
		title: "Metric",
		value: "0",
	},
	render: () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<MetricCard title="Users" value={1234} />
			<MetricCard title="Revenue" value="$5,678" />
			<MetricCard title="Orders" value={234} />
			<MetricCard title="Sessions" value={3456} />
		</div>
	),
};
