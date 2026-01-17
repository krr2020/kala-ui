import type { Meta, StoryObj } from "@storybook/react";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info as InfoIcon,
} from "lucide-react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Stack } from "../stack";
import { Text } from "../text";
import { Skeleton } from "../skeleton";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = {
	title: "Feedback/Alert",
	component: Alert,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Style (light background)
export const DefaultStyle: Story = {
	render: () => (
		<Flex direction="column" gap={4} className="w-[600px]">
			<Alert variant="primary">
				<AlertDescription>
					A simple primary alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="secondary">
				<AlertDescription>
					A simple secondary alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="success">
				<AlertDescription>
					A simple success alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="danger">
				<AlertDescription>A simple danger alert—check it out!</AlertDescription>
			</Alert>
			<Alert variant="warning">
				<AlertDescription>
					A simple warning alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="info">
				<AlertDescription>A simple info alert—check it out!</AlertDescription>
			</Alert>
		</Flex>
	),
};

// Outline Style
export const OutlineStyle: Story = {
	render: () => (
		<Flex direction="column" gap={4} className="w-[600px]">
			<Alert variant="primary" style="outline">
				<AlertDescription>
					An outline primary alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="secondary" style="outline">
				<AlertDescription>
					An outline secondary alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="success" style="outline">
				<AlertDescription>
					An outline success alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="danger" style="outline">
				<AlertDescription>
					An outline danger alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="warning" style="outline">
				<AlertDescription>
					An outline warning alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="info" style="outline">
				<AlertDescription>An outline info alert—check it out!</AlertDescription>
			</Alert>
		</Flex>
	),
};

// Solid Style
export const SolidStyle: Story = {
	render: () => (
		<Flex direction="column" gap={4} className="w-[600px]">
			<Alert variant="primary" style="solid">
				<AlertDescription>A solid primary alert—check it out!</AlertDescription>
			</Alert>
			<Alert variant="secondary" style="solid">
				<AlertDescription>
					A solid secondary alert—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="success" style="solid">
				<AlertDescription>A solid success alert—check it out!</AlertDescription>
			</Alert>
			<Alert variant="danger" style="solid">
				<AlertDescription>A solid danger alert—check it out!</AlertDescription>
			</Alert>
			<Alert variant="warning" style="solid">
				<AlertDescription>A solid warning alert—check it out!</AlertDescription>
			</Alert>
			<Alert variant="info" style="solid">
				<AlertDescription>A solid info alert—check it out!</AlertDescription>
			</Alert>
		</Flex>
	),
};

// With Icons
export const WithIcons: Story = {
	render: () => (
		<Flex direction="column" gap={4} className="w-[600px]">
			<Alert variant="primary">
				<InfoIcon />
				<AlertDescription>
					A primary alert with icon—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="success">
				<CheckCircle2 />
				<AlertDescription>
					A success alert with icon—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="warning">
				<AlertTriangle />
				<AlertDescription>
					A warning alert with icon—check it out!
				</AlertDescription>
			</Alert>
			<Alert variant="danger">
				<AlertCircle />
				<AlertDescription>
					A danger alert with icon—check it out!
				</AlertDescription>
			</Alert>
		</Flex>
	),
};

// With Title and Description
export const WithTitleAndDescription: Story = {
	render: () => (
		<Alert variant="success" className="w-[600px]">
			<CheckCircle2 />
			<AlertTitle>Well done!</AlertTitle>
			<AlertDescription>
				Aww yeah, you successfully read this important alert message. This
				example text is going to run a bit longer so that you can see how
				spacing within an alert works with this kind of content.
			</AlertDescription>
		</Alert>
	),
};

// With Link
export const WithLink: Story = {
	render: () => (
		<Alert variant="primary" className="w-[600px]">
			<AlertDescription>
				A simple primary alert with{" "}
				<Box
					as="a"
					href="/"
					className="font-semibold underline hover:no-underline"
				>
					an example link
				</Box>
				. Give it a click if you like.
			</AlertDescription>
		</Alert>
	),
};

// Dismissable Alerts
export const Dismissable: Story = {
	render: () => (
		<Flex direction="column" gap={4} className="w-[600px]">
			<Alert variant="success" dismissable>
				<CheckCircle2 />
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>
					Your changes have been saved successfully.
				</AlertDescription>
			</Alert>
			<Alert variant="info" dismissable>
				<InfoIcon />
				<AlertTitle>Information</AlertTitle>
				<AlertDescription>
					This alert can be dismissed by clicking the X button.
				</AlertDescription>
			</Alert>
			<Alert
				variant="warning"
				dismissable
				onDismiss={() => console.log("Warning dismissed")}
			>
				<AlertTriangle />
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>
					Please review your settings before continuing. This will trigger a
					callback when dismissed.
				</AlertDescription>
			</Alert>
			<Alert variant="danger" dismissable>
				<AlertCircle />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					There was a problem processing your request.
				</AlertDescription>
			</Alert>
		</Flex>
	),
};

// Complex with Paragraphs
export const ComplexAlert: Story = {
	render: () => (
		<Alert variant="info" className="w-[600px]">
			<InfoIcon />
			<AlertTitle>Information</AlertTitle>
			<AlertDescription>
				<Stack gap={2}>
					<Text>
						This is an informational message with multiple paragraphs. The first
						paragraph provides the main context.
					</Text>
					<Text>
						Whenever you need to, be sure to properly structure your content to
						keep things nice and tidy.
					</Text>
				</Stack>
			</AlertDescription>
		</Alert>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<Stack gap={4} className="w-full max-w-md">
			<Flex gap={3} className="p-4 border rounded-lg">
				<Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
				<Stack gap={2} className="flex-1">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Stack>
			</Flex>
		</Stack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for alerts while content is loading.",
			},
		},
	},
};
