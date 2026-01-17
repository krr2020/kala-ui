import type { Meta, StoryObj } from "@storybook/react";
import { Bold, BookmarkIcon, Italic, Underline } from "lucide-react";
import { Skeleton } from "../skeleton";
import { Toggle } from "./toggle";

const meta = {
	title: "Forms/Toggle",
	component: Toggle,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Toggle aria-label="Toggle bold">
			<Bold className="h-4 w-4" />
		</Toggle>
	),
};

export const Outline: Story = {
	render: () => (
		<Toggle variant="outline" aria-label="Toggle italic">
			<Italic className="h-4 w-4" />
		</Toggle>
	),
};

export const WithText: Story = {
	render: () => (
		<Toggle aria-label="Toggle italic">
			<Italic className="h-4 w-4" />
			Italic
		</Toggle>
	),
};

export const Small: Story = {
	render: () => (
		<Toggle size="sm" aria-label="Toggle italic">
			<Italic className="h-4 w-4" />
		</Toggle>
	),
};

export const Large: Story = {
	render: () => (
		<Toggle size="lg" aria-label="Toggle bold">
			<Bold className="h-4 w-4" />
		</Toggle>
	),
};

export const Disabled: Story = {
	render: () => (
		<Toggle aria-label="Toggle underline" disabled>
			<Underline className="h-4 w-4" />
		</Toggle>
	),
};

export const Bookmark: Story = {
	render: () => (
		<Toggle
			aria-label="Toggle bookmark"
			size="sm"
			variant="outline"
			className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-primary"
		>
			<BookmarkIcon className="h-4 w-4" />
			Bookmark
		</Toggle>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex gap-2">
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
			<Skeleton className="h-10 w-10 rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for toggle buttons while loading.",
			},
		},
	},
};
