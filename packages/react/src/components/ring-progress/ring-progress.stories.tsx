import type { Meta, StoryObj } from "@storybook/react";
import { Check } from "lucide-react";
import { RingProgress } from "./ring-progress";

const meta: Meta<typeof RingProgress> = {
	title: "Components/RingProgress",
	component: RingProgress,
	tags: ["autodocs"],
	argTypes: {
		value: { control: { type: "range", min: 0, max: 100 } },
		size: { control: "number" },
		thickness: { control: "number" },
		roundCaps: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof RingProgress>;

export const Default: Story = {
	args: {
		value: 40,
		label: <span className="font-bold">40%</span>,
	},
};

export const CustomSize: Story = {
	args: {
		size: 80,
		thickness: 8,
		value: 75,
		label: <span className="text-xs">75%</span>,
	},
};

export const WithIcon: Story = {
	args: {
		value: 100,
		color: "text-green-500",
		label: <Check className="h-8 w-8 text-green-500" />,
	},
};

export const Sections: Story = {
	args: {
		label: <span className="text-sm font-semibold">Usage</span>,
		sections: [
			{ value: 40, color: "text-blue-500" },
			{ value: 15, color: "text-orange-500" },
			{ value: 10, color: "text-red-500" },
		],
	},
};
