import type { Meta, StoryObj } from "@storybook/react";
import { PageLoader } from "./page-loader";

const meta: Meta = {
	title: "Feedback/PageLoader",
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

export const PageLoaderStory: StoryObj<typeof PageLoader> = {
	name: "Page Loader",
	render: () => <PageLoader message="Loading page..." />,
};

export const PageLoaderNoMessage: StoryObj<typeof PageLoader> = {
	name: "Page Loader (No Message)",
	render: () => <PageLoader message="" />,
};
