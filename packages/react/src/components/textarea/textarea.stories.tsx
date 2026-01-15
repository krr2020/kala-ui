import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../label";
import { Skeleton } from "../skeleton/skeleton";
import { Textarea } from "./textarea";

const meta = {
	title: "Forms/Textarea",
	component: Textarea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
		},
		placeholder: {
			control: "text",
		},
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Type your message here.",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "Disabled textarea",
		disabled: true,
	},
};

export const WithValue: Story = {
	args: {
		value: "This is a textarea with some content.",
		readOnly: true,
	},
};

export const WithLabel: Story = {
	args: {},
	render: () => (
		<div className="grid w-full gap-1.5">
			<Label htmlFor="message">Your message</Label>
			<Textarea id="message" placeholder="Type your message here." />
			<p className="text-sm text-muted-foreground">
				Your message will be copied to the support team.
			</p>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-24 w-full rounded-md" />
			<Skeleton className="h-3 w-48" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for textarea fields while loading.",
			},
		},
	},
};