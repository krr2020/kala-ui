import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "./avatar-group";

const avatars = [
	{ fallback: "AB", alt: "Alice Brown" },
	{ fallback: "CD", alt: "Carol Davis" },
	{ fallback: "EF", alt: "Eve Fisher" },
	{ fallback: "GH", alt: "Grace Hall" },
	{ fallback: "IJ", alt: "Iris Jones" },
	{ fallback: "KL", alt: "Kate Lee" },
];

const meta: Meta<typeof AvatarGroup> = {
	title: "Display/AvatarGroup",
	component: AvatarGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		max: { control: "number" },
		size: {
			control: "select",
			options: ["xs", "sm", "default", "md", "lg"],
		},
		showTooltip: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
	args: {
		avatars,
		max: 4,
	},
};

export const NoOverflow: Story = {
	args: {
		avatars: avatars.slice(0, 3),
	},
};

export const SmallSize: Story = {
	args: {
		avatars,
		max: 3,
		size: "sm",
	},
};

export const LargeSize: Story = {
	args: {
		avatars,
		max: 3,
		size: "lg",
	},
};

export const WithImages: Story = {
	args: {
		avatars: [
			{ src: "https://github.com/shadcn.png", alt: "shadcn", fallback: "SC" },
			{ src: "https://github.com/radix-ui.png", alt: "Radix", fallback: "RX" },
			{ fallback: "AB", alt: "Alice Brown" },
			{ fallback: "CD", alt: "Carol Davis" },
			{ fallback: "EF", alt: "Eve Fisher" },
		],
		max: 3,
	},
};
