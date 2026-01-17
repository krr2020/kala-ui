import type { Meta, StoryObj } from "@storybook/react";
import { Spoiler } from "./spoiler";
import { Stack } from "../stack";
import { Text } from "../text";

const meta: Meta<typeof Spoiler> = {
	title: "Components/Spoiler",
	component: Spoiler,
	tags: ["autodocs"],
	argTypes: {
		maxHeight: { control: "number" },
		transitionDuration: { control: "number" },
	},
};

export default meta;
type Story = StoryObj<typeof Spoiler>;

const longContent = (
	<Stack gap={4}>
		<Text>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
			veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat.
		</Text>
		<Text>
			Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
			dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
			proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</Text>
		<Text>
			Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
			doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
			inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
		</Text>
	</Stack>
);

export const Default: Story = {
	args: {
		maxHeight: 60,
		children: longContent,
	},
};

export const CustomLabels: Story = {
	args: {
		maxHeight: 50,
		showLabel: "Read full article",
		hideLabel: "Hide article",
		children: longContent,
	},
};

export const NoButtonIfNeeded: Story = {
	args: {
		maxHeight: 500, // Large enough to fit content
		children: <Text>Short content that fits within max height.</Text>,
	},
};
