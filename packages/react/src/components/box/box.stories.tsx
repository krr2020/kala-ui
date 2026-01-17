import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./box";

const meta: Meta<typeof Box> = {
	title: "Components/Box",
	component: Box,
	tags: ["autodocs"],
	argTypes: {
		asChild: {
			control: "boolean",
			description:
				"Change the default rendered element for the one passed as a child, merging their props and behavior.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
	args: {
		children: "This is a box",
		className: "p-4 bg-gray-100 rounded border border-gray-200",
	},
};

export const WithCustomStyles: Story = {
	args: {
		children: (
			<>
				<h3 className="font-bold mb-2">Box with custom styles</h3>
				<p>You can use any Tailwind utility classes on the Box component.</p>
			</>
		),
		className: "p-6 bg-blue-50 text-blue-900 rounded-lg shadow-sm",
	},
};

export const AsChild: Story = {
	args: {
		asChild: true,
		children: (
			<button
				type="button"
				className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
			>
				I am a button rendered via Box asChild
			</button>
		),
	},
};
