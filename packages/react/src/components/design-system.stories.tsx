import type { Meta, StoryObj } from "@storybook/react";
import { DesignSystemOverview } from "./design-system/overview";

const meta = {
	title: "Design System",
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Visual overview of all components in the design system.
 */
export const Overview: Story = {
	render: () => <DesignSystemOverview />,
};
