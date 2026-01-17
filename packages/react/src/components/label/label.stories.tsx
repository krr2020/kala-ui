import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
	title: "Forms/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
	args: {
		children: "Label text",
	},
};

export const Required: Story = {
	args: {
		children: "Required field",
		required: true,
	},
};

export const WithFor: Story = {
	args: {
		htmlFor: "input-id",
		children: "Associated label",
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="space-y-3">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-4 w-28" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for labels while loading.",
			},
		},
	},
};
