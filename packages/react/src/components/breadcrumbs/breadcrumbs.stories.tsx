import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import { Breadcrumbs } from "./breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
	title: "Navigation/Breadcrumbs",
	component: Breadcrumbs,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "style1", "style2", "style3"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// Basic Styling
export const BasicStyling: Story = {
	args: {
		items: [
			{ label: "Home", href: "#" },
			{ label: "Library", href: "#" },
			{ label: "Data" },
		],
		variant: "default",
	},
};

// Custom Styling (Style 1 - uppercase)
export const CustomStyling: Story = {
	args: {
		items: [
			{ label: "Home", href: "#" },
			{ label: "Library", href: "#" },
			{ label: "Data" },
		],
		variant: "style1",
	},
};

// Custom Divider (Style 2 - greater than)
export const CustomDividerStyle2: Story = {
	args: {
		items: [
			{ label: "Home", href: "#" },
			{ label: "Library", href: "#" },
			{ label: "Data" },
		],
		variant: "style2",
	},
};

// Custom Divider (Style 3 - bullet)
export const CustomDividerStyle3: Story = {
	args: {
		items: [
			{ label: "Home", href: "#" },
			{ label: "Library", href: "#" },
			{ label: "Data" },
		],
		variant: "style3",
	},
};

// Two Levels
export const TwoLevels: Story = {
	args: {
		items: [{ label: "Dashboard", href: "#" }, { label: "Settings" }],
		variant: "default",
	},
};

// Deep Nesting
export const DeepNesting: Story = {
	args: {
		items: [
			{ label: "Dashboard", href: "#" },
			{ label: "Settings", href: "#" },
			{ label: "Security", href: "#" },
			{ label: "Two-Factor Authentication" },
		],
		variant: "default",
	},
};

// Custom Separator
export const CustomSeparator: Story = {
	args: {
		items: [
			{ label: "Dashboard", href: "#" },
			{ label: "Users", href: "#" },
			{ label: "Edit User" },
		],
		separator: <span className="text-muted-foreground">/</span>,
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Skeleton className="h-4 w-16" />
			<span className="text-muted-foreground">/</span>
			<Skeleton className="h-4 w-20" />
			<span className="text-muted-foreground">/</span>
			<Skeleton className="h-4 w-24" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for breadcrumb items while loading.",
			},
		},
	},
};
