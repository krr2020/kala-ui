import type { Meta, StoryObj } from "@storybook/react";
import { Paper } from "./paper";

const meta: Meta<typeof Paper> = {
	title: "Components/Paper",
	component: Paper,
	tags: ["autodocs"],
	argTypes: {
		shadow: {
			control: "select",
			options: ["none", "xs", "sm", "md", "lg", "xl"],
		},
		radius: {
			control: "select",
			options: ["none", "sm", "md", "lg", "xl", "full"],
		},
		withBorder: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Paper>;

export const Default: Story = {
	args: {
		children: <div className="p-4">Paper content</div>,
		withBorder: true,
	},
};

export const Shadows: Story = {
	render: () => (
		<div className="flex flex-col gap-4 p-4 bg-gray-50">
			<Paper shadow="xs" className="p-4">
				Shadow XS
			</Paper>
			<Paper shadow="sm" className="p-4">
				Shadow SM
			</Paper>
			<Paper shadow="md" className="p-4">
				Shadow MD
			</Paper>
			<Paper shadow="lg" className="p-4">
				Shadow LG
			</Paper>
			<Paper shadow="xl" className="p-4">
				Shadow XL
			</Paper>
		</div>
	),
};
