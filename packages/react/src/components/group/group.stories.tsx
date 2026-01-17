import type { Meta, StoryObj } from "@storybook/react";
import { Group } from "./group";

const meta: Meta<typeof Group> = {
	title: "Components/Group",
	component: Group,
	tags: ["autodocs"],
	argTypes: {
		direction: {
			control: "select",
			options: ["row", "rowReverse"],
		},
		gap: {
			control: "select",
			options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Group>;

const items = [
	<div key="1" className="bg-primary text-primary-foreground p-4 rounded-md">
		Item 1
	</div>,
	<div
		key="2"
		className="bg-secondary text-secondary-foreground p-4 rounded-md"
	>
		Item 2
	</div>,
	<div key="3" className="bg-accent text-accent-foreground p-4 rounded-md">
		Item 3
	</div>,
];

export const Default: Story = {
	args: {
		children: items,
	},
};

export const CustomGap: Story = {
	args: {
		gap: 8,
		children: items,
	},
};
