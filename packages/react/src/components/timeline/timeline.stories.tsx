import type { Meta, StoryObj } from "@storybook/react";
import { Check, GitCommit, GitPullRequest, MessageSquare } from "lucide-react";
import { Timeline, TimelineItem } from "./timeline";

const meta: Meta<typeof Timeline> = {
	title: "Components/Timeline",
	component: Timeline,
	tags: ["autodocs"],
	argTypes: {
		active: { control: "number" },
		bulletSize: { control: "number" },
		lineWidth: { control: "number" },
		reverseActive: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
	render: (args) => (
		<Timeline active={1} {...args}>
			<TimelineItem bullet={<GitCommit size={12} />} title="New Branch">
				You created a new branch <b>fix/timeline</b>
			</TimelineItem>
			<TimelineItem bullet={<GitPullRequest size={12} />} title="Pull Request">
				You created a pull request
			</TimelineItem>
			<TimelineItem bullet={<MessageSquare size={12} />} title="Code Review">
				<b>Robert</b> commented on your changes
			</TimelineItem>
			<TimelineItem bullet={<Check size={12} />} title="Merged">
				Pull request merged
			</TimelineItem>
		</Timeline>
	),
};

export const CustomBullets: Story = {
	render: () => (
		<Timeline active={2} bulletSize={24} lineWidth={2}>
			<TimelineItem title="Ordered 1">Order placed</TimelineItem>
			<TimelineItem title="Ordered 2">Order shipped</TimelineItem>
			<TimelineItem title="Ordered 3">Order delivered</TimelineItem>
		</Timeline>
	),
};
