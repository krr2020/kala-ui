import type { Meta, StoryObj } from "@storybook/react";
import { Center } from "./center";

const meta: Meta<typeof Center> = {
	title: "Components/Center",
	component: Center,
	tags: ["autodocs"],
	argTypes: {
		inline: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Center>;

export const Default: Story = {
	args: {
		className: "h-20 bg-primary/20 rounded",
		children: "Centered content",
	},
};

export const Inline: Story = {
	args: {
		inline: true,
		className: "h-10 w-20 bg-primary/20 rounded",
		children: "Inline",
	},
};
