import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Label } from "../label";
import { Skeleton } from "../skeleton/skeleton";
import { Switch } from "./switch";

const meta = {
	title: "Forms/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		checked: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onCheckedChange: fn(),
	},
};

export const Checked: Story = {
	args: {
		checked: true,
		onCheckedChange: fn(),
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		checked: true,
		disabled: true,
	},
};

export const WithLabel: Story = {
	args: {},
	render: () => (
		<div className="flex items-center gap-2">
			<Switch id="airplane-mode" onCheckedChange={fn()} />
			<Label htmlFor="airplane-mode">Airplane Mode</Label>
		</div>
	),
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Skeleton className="h-6 w-11 rounded-full" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-6 w-11 rounded-full" />
				<Skeleton className="h-4 w-40" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for switch toggles while loading.",
			},
		},
	},
};
