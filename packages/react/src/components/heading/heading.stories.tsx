import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
	title: "Components/Heading",
	component: Heading,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		align: {
			control: "select",
			options: ["left", "center", "right"],
		},
		weight: {
			control: "select",
			options: ["default", "medium", "semibold", "extrabold"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
	args: {
		children: "Heading Level 2",
		size: "h2",
	},
};

export const Heading1: Story = {
	args: {
		children: "Heading Level 1",
		size: "h1",
	},
};

export const Centered: Story = {
	args: {
		children: "Centered Heading",
		align: "center",
	},
};

export const ExtraBold: Story = {
	args: {
		children: "Extra Bold Heading",
		weight: "extrabold",
	},
};
