import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./kbd";

const meta: Meta<typeof Kbd> = {
	title: "Components/Kbd",
	component: Kbd,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["xs", "sm", "md", "lg"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
	args: {
		children: "Ctrl",
	},
};

export const Combination: Story = {
	render: () => (
		<div className="flex items-center gap-1">
			<Kbd>⌘</Kbd>
			<span>+</span>
			<Kbd>Shift</Kbd>
			<span>+</span>
			<Kbd>M</Kbd>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-2">
			<Kbd size="xs">xs</Kbd>
			<Kbd size="sm">sm</Kbd>
			<Kbd size="md">md</Kbd>
			<Kbd size="lg">lg</Kbd>
		</div>
	),
};

export const InContext: Story = {
	render: () => (
		<div className="text-sm">
			Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to copy
		</div>
	),
};
