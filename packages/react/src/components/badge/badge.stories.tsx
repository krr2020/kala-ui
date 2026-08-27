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
			<Badge>Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge color="success">Success</Badge>
			<Badge color="destructive">Danger</Badge>
			<Badge color="warning">Warning</Badge>
			<Badge color="info">Info</Badge>
			<Badge color="muted">Light</Badge>
			<Badge color="muted">Dark</Badge>
		</div>
	),
};

// Pill Badges
export const PillBadges: Story = {
	render: () => (
		<div className="flex gap-2 flex-wrap items-center">
			<Badgeshape="pill">
				Primary
			</Badge>
			<Badge color="secondary" shape="pill">
				Secondary
			</Badge>
			<Badge color="success" shape="pill">
				Success
			</Badge>
			<Badge color="destructive" shape="pill">
				Danger
			</Badge>
			<Badge color="warning" shape="pill">
				Warning
			</Badge>
			<Badge color="info" shape="pill">
				Info
			</Badge>
			<Badge color="muted" shape="pill">
				Light
			</Badge>
			<Badge color="muted" shape="pill">
				Dark
			</Badge>
		</div>
	),
};

// Link Badges
export const LinkBadges: Story = {
	render: () => (
		<div className="flex gap-2 flex-wrap items-center">
			<BadgeasChild>
				<a href="/">Primary</a>
			</Badge>
			<Badge color="secondary" asChild>
				<a href="/">Secondary</a>
			</Badge>
			<Badge color="success" asChild>
				<a href="/">Success</a>
			</Badge>
			<Badge color="destructive" asChild>
				<a href="/">Danger</a>
			</Badge>
			<Badge color="warning" asChild>
				<a href="/">Warning</a>
			</Badge>
			<Badge color="info" asChild>
				<a href="/">Info</a>
			</Badge>
			<Badge color="muted" asChild>
				<a href="/">Light</a>
			</Badge>
			<Badge color="muted" asChild>
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
