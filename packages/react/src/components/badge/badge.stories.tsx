import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import { Badge } from "./badge";

const meta = {
	title: "Data Display/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"success",
				"danger",
				"warning",
				"info",
				"light",
				"dark",
			],
		},
		shape: {
			control: "select",
			options: ["default", "pill"],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Contextual Variations
export const ContextualVariations: Story = {
	render: () => (
		<div className="flex gap-2 flex-wrap items-center">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="danger">Danger</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="light">Light</Badge>
			<Badge variant="dark">Dark</Badge>
		</div>
	),
};

// Pill Badges
export const PillBadges: Story = {
	render: () => (
		<div className="flex gap-2 flex-wrap items-center">
			<Badge variant="primary" shape="pill">
				Primary
			</Badge>
			<Badge variant="secondary" shape="pill">
				Secondary
			</Badge>
			<Badge variant="success" shape="pill">
				Success
			</Badge>
			<Badge variant="danger" shape="pill">
				Danger
			</Badge>
			<Badge variant="warning" shape="pill">
				Warning
			</Badge>
			<Badge variant="info" shape="pill">
				Info
			</Badge>
			<Badge variant="light" shape="pill">
				Light
			</Badge>
			<Badge variant="dark" shape="pill">
				Dark
			</Badge>
		</div>
	),
};

// Link Badges
export const LinkBadges: Story = {
	render: () => (
		<div className="flex gap-2 flex-wrap items-center">
			<Badge variant="primary" asChild>
				<a href="/">Primary</a>
			</Badge>
			<Badge variant="secondary" asChild>
				<a href="/">Secondary</a>
			</Badge>
			<Badge variant="success" asChild>
				<a href="/">Success</a>
			</Badge>
			<Badge variant="danger" asChild>
				<a href="/">Danger</a>
			</Badge>
			<Badge variant="warning" asChild>
				<a href="/">Warning</a>
			</Badge>
			<Badge variant="info" asChild>
				<a href="/">Info</a>
			</Badge>
			<Badge variant="light" asChild>
				<a href="/">Light</a>
			</Badge>
			<Badge variant="dark" asChild>
				<a href="/">Dark</a>
			</Badge>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Skeleton className="h-5 w-16 rounded-full" />
			<Skeleton className="h-5 w-20 rounded-full" />
			<Skeleton className="h-5 w-14 rounded-full" />
			<Skeleton className="h-5 w-24 rounded-full" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for badges while content is loading.",
			},
		},
	},
};
