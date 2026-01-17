import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import { Separator } from "./separator";

const meta = {
	title: "Layout/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	args: {},
	render: () => (
		<div className="w-80">
			<div className="gap-1 flex flex-col">
				<h4 className="text-sm font-medium">Radix Primitives</h4>
				<p className="text-sm text-muted-foreground">
					An open-source UI component library.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<div>Blog</div>
				<Separator orientation="vertical" />
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	),
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: () => (
		<div className="flex h-10 items-center gap-4">
			<span>Item 1</span>
			<Separator orientation="vertical" />
			<span>Item 2</span>
			<Separator orientation="vertical" />
			<span>Item 3</span>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md space-y-4">
			<Skeleton className="h-4 w-full" />
			<Separator />
			<Skeleton className="h-4 w-full" />
			<Separator />
			<Skeleton className="h-4 w-full" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders with separators while content is loading.",
			},
		},
	},
};
