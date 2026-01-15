import type { Meta, StoryObj } from "@storybook/react";
import {
	Activity,
	Database,
	FolderOpen,
	Key,
	Lock,
	Search,
	Users,
} from "lucide-react";
import { EmptyState } from "./empty-state";

const meta = {
	title: "Application/EmptyState",
	component: EmptyState,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Example
export const Basic: Story = {
	args: {
		title: "No items found",
		description: "There are no items to display at this time.",
	},
};

// With Action
export const WithAction: Story = {
	args: {
		title: "No projects",
		description:
			"You haven't created any projects yet. Start by creating your first project.",
		icon: FolderOpen,
		action: {
			label: "Create Project",
			onClick: () => alert("Create clicked"),
		},
	},
};

// Showcase
export const Showcase: Story = {
	args: {
		title: "Empty state",
	},
	render: () => (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<EmptyState
				title="No data available"
				description="We couldn't find any data for this period."
				icon={Database}
			/>
			<EmptyState
				title="No search results"
				description="We couldn't find any results matching your search criteria."
				icon={Search}
			/>
			<EmptyState
				title="Access denied"
				description="You don't have permission to view this content."
				icon={Lock}
				variant="destructive"
			/>
			<EmptyState
				title="No users found"
				description="There are no users in your organization yet."
				icon={Users}
				action={{
					label: "Invite User",
					onClick: () => {},
					variant: "outline",
				}}
			/>
			<EmptyState
				title="No API Keys"
				description="You haven't generated any API keys yet."
				icon={Key}
				action={{
					label: "Generate Key",
					onClick: () => {},
				}}
			/>
			<EmptyState
				title="No Activity"
				description="There has been no recent activity on your account."
				icon={Activity}
			/>
		</div>
	),
};
