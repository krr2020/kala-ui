import type { Meta, StoryObj } from "@storybook/react";
import { ColorInput } from "./color-input";

const meta: Meta<typeof ColorInput> = {
	title: "Components/ColorInput",
	component: ColorInput,
	tags: ["autodocs"],
	argTypes: {
		error: { control: "boolean" },
		success: { control: "boolean" },
		withPreview: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof ColorInput>;

export const Default: Story = {
	args: {
		placeholder: "Pick a color",
	},
};

export const WithValue: Story = {
	args: {
		defaultValue: "#3b82f6",
	},
};

export const NoPreview: Story = {
	args: {
		defaultValue: "#ef4444",
		withPreview: false,
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: "#22c55e",
		disabled: true,
	},
};

export const WithError: Story = {
	args: {
		defaultValue: "invalid-color",
		error: true,
	},
};
