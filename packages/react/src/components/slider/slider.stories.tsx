import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton/skeleton";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
	title: "Forms/Slider",
	component: Slider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
	args: {
		defaultValue: [50],
		max: 100,
		step: 1,
		className: "w-[300px]",
	},
};

export const Range: Story = {
	args: {
		defaultValue: [25, 75],
		max: 100,
		step: 1,
		className: "w-[300px]",
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-[300px] space-y-4">
			<Skeleton className="h-2 w-full rounded-full" />
			<Skeleton className="h-2 w-full rounded-full" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for sliders while loading.",
			},
		},
	},
};
