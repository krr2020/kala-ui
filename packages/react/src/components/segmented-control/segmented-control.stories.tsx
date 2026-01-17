import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./segmented-control";

const meta: Meta<typeof SegmentedControl> = {
	title: "Components/SegmentedControl",
	component: SegmentedControl,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["xs", "sm", "md", "lg", "xl"],
		},
		radius: {
			control: { type: "select" },
			options: ["xs", "sm", "md", "lg", "xl", "full"],
		},
		fullWidth: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
	args: {
		data: ["React", "Vue", "Angular", "Svelte"],
		defaultValue: "React",
	},
};

export const FullWidth: Story = {
	args: {
		data: ["Daily", "Weekly", "Monthly"],
		defaultValue: "Weekly",
		fullWidth: true,
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<SegmentedControl data={["xs", "sm", "md"]} size="xs" defaultValue="xs" />
			<SegmentedControl data={["xs", "sm", "md"]} size="sm" defaultValue="sm" />
			<SegmentedControl data={["xs", "sm", "md"]} size="md" defaultValue="md" />
			<SegmentedControl data={["xs", "sm", "md"]} size="lg" defaultValue="lg" />
			<SegmentedControl data={["xs", "sm", "md"]} size="xl" defaultValue="xl" />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		data: ["React", "Vue", "Angular"],
		defaultValue: "Vue",
		disabled: true,
	},
};

export const DisabledOption: Story = {
	args: {
		data: [
			{ label: "React", value: "react" },
			{ label: "Vue", value: "vue", disabled: true },
			{ label: "Angular", value: "angular" },
		],
		defaultValue: "react",
	},
};
