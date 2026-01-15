import type { Meta, StoryObj } from "@storybook/react";
import { ErrorFallback } from "./error-fallback";

const meta = {
	title: "Application/ErrorBoundary",
	component: ErrorFallback,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "Something went wrong",
		description: "An unexpected error occurred. Please try again.",
		reset: () => alert("Reset clicked"),
	},
};

export const WithErrorDetails: Story = {
	args: {
		title: "Application Error",
		description: "We encountered a problem while loading this page.",
		error: new Error("Failed to fetch user data: 500 Internal Server Error"),
		reset: () => alert("Reset clicked"),
	},
};

export const SectionVariant: Story = {
	args: {
		variant: "section",
		title: "Section Error",
		description: "Could not load this section.",
		reset: () => alert("Retry clicked"),
	},
};
