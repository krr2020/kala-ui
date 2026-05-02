import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { NumberInput } from "./number-input";

const meta: Meta<typeof NumberInput> = {
	title: "Forms/NumberInput",
	component: NumberInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onChange: fn(),
	},
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
		hasError: { control: "boolean" },
		disabled: { control: "boolean" },
		isLoading: { control: "boolean" },
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
	},
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
	args: {
		defaultValue: 0,
		className: "w-40",
	},
};

export const WithMinMax: Story = {
	args: {
		defaultValue: 5,
		min: 0,
		max: 10,
		className: "w-40",
	},
};

export const WithStep: Story = {
	args: {
		defaultValue: 0,
		step: 5,
		min: 0,
		max: 100,
		className: "w-40",
	},
};

export const Small: Story = {
	args: {
		defaultValue: 1,
		size: "sm",
		className: "w-32",
	},
};

export const ErrorState: Story = {
	args: {
		defaultValue: 0,
		hasError: true,
		className: "w-40",
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: 5,
		disabled: true,
		className: "w-40",
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		className: "w-40",
	},
};
