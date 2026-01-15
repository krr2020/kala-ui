import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton/skeleton";
import { Banner } from "./banner";

const meta = {
	title: "Feedback/Banner",
	component: Banner,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "warning", "error", "success"],
		},
		onClose: {
			action: "close",
		},
		position: {
			control: "select",
			options: ["fixed", "static"],
		},
	},
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	args: {
		variant: "info",
		position: "static",
		children: "This is an informational banner message.",
		onClose: () => console.log("Banner closed"),
	},
};

export const Warning: Story = {
	args: {
		variant: "warning",
		position: "static",
		children: "Warning: Please review your account settings.",
		onClose: () => console.log("Banner closed"),
	},
};

export const ErrorBanner: Story = {
	args: {
		variant: "error",
		position: "static",
		children: "Error: Unable to process your request. Please try again.",
		onClose: () => console.log("Banner closed"),
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		position: "static",
		children: "Success! Your changes have been saved.",
		onClose: () => console.log("Banner closed"),
	},
};

export const WithoutCloseButton: Story = {
	args: {
		variant: "info",
		position: "static",
		children: "This banner cannot be dismissed.",
	},
};

export const LongMessage: Story = {
	args: {
		variant: "warning",
		position: "static",
		children:
			"This is a longer banner message that demonstrates how the banner handles multiple lines of text. The close button remains aligned to the top right while the content wraps naturally.",
		onClose: () => console.log("Banner closed"),
	},
};

export const AllVariants: Story = {
	args: {},
	render: () => (
		<div className="space-y-4 p-4">
			<Banner
				variant="info"
				position="static"
				onClose={() => console.log("Info closed")}
			>
				Info: System maintenance scheduled for tonight.
			</Banner>
			<Banner
				variant="warning"
				position="static"
				onClose={() => console.log("Warning closed")}
			>
				Warning: Your session will expire in 5 minutes.
			</Banner>
			<Banner
				variant="error"
				position="static"
				onClose={() => console.log("Error closed")}
			>
				Error: Unable to connect to the server.
			</Banner>
			<Banner
				variant="success"
				position="static"
				onClose={() => console.log("Success closed")}
			>
				Success: Profile updated successfully!
			</Banner>
		</div>
	),
};

export const Fixed: Story = {
	args: {
		variant: "info",
		position: "fixed",
		children: "This is a fixed banner at the top of the viewport.",
		onClose: () => console.log("Banner closed"),
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full">
			<Skeleton className="h-12 w-full rounded-none" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholder for banner content while loading.",
			},
		},
	},
};
