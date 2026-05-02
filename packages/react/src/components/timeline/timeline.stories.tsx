import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle, Clock, ShoppingBag, Truck, XCircle } from "lucide-react";
import { Timeline, TimelineItem } from "./timeline";

const meta: Meta<typeof Timeline> = {
	title: "Display/Timeline",
	component: Timeline,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
	render: () => (
		<Timeline className="w-[350px]">
			<TimelineItem
				title="Order placed"
				description="Your order has been confirmed"
				timestamp="Jan 1, 10:00 AM"
				status="success"
				icon={<CheckCircle />}
			/>
			<TimelineItem
				title="Processing"
				description="We're preparing your items"
				timestamp="Jan 1, 11:30 AM"
				status="default"
				icon={<ShoppingBag />}
			/>
			<TimelineItem
				title="Shipped"
				description="Package is on its way"
				timestamp="Jan 2, 9:00 AM"
				icon={<Truck />}
			/>
			<TimelineItem
				title="Estimated delivery"
				description="Expected between 2–5 PM"
				timestamp="Jan 3"
				status="pending"
				icon={<Clock />}
			/>
		</Timeline>
	),
};

export const WithStatuses: Story = {
	render: () => (
		<Timeline className="w-[320px]">
			<TimelineItem
				title="Completed"
				status="success"
				icon={<CheckCircle />}
				timestamp="Done"
			/>
			<TimelineItem
				title="Failed"
				status="error"
				icon={<XCircle />}
				timestamp="2h ago"
			/>
			<TimelineItem title="Warning" status="warning" timestamp="1h ago" />
			<TimelineItem title="Pending" status="pending" timestamp="Now" />
		</Timeline>
	),
};

export const Simple: Story = {
	render: () => (
		<Timeline className="w-[300px]">
			<TimelineItem title="Account created" timestamp="March 2024" />
			<TimelineItem title="First purchase" timestamp="April 2024" />
			<TimelineItem title="Premium member" timestamp="May 2024" />
		</Timeline>
	),
};
