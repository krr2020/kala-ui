import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./number-input";

const meta: Meta<typeof NumberInput> = {
	title: "Components/NumberInput",
	component: NumberInput,
	tags: ["autodocs"],
	argTypes: {
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
		error: { control: "boolean" },
		success: { control: "boolean" },
		hideControls: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
	args: {
		placeholder: "Enter a number",
	},
};

export const WithMinMax: Story = {
	args: {
		placeholder: "Age (18-100)",
		min: 18,
		max: 100,
		defaultValue: 25,
	},
};

export const WithStep: Story = {
	args: {
		placeholder: "Step 0.5",
		step: 0.5,
		defaultValue: 1.5,
	},
};

export const HiddenControls: Story = {
	args: {
		placeholder: "No controls",
		hideControls: true,
		defaultValue: 10,
	},
};

export const WithError: Story = {
	args: {
		defaultValue: 100,
		error: true,
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: 50,
		disabled: true,
	},
};
