import type { Meta, StoryObj } from "@storybook/react";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info as InfoIcon,
} from "lucide-react";
import { Skeleton } from "../skeleton/skeleton";
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
		<div className="flex flex-col gap-4 w-[600px]">
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
		</div>
	),
};

// Outline Style
export const OutlineStyle: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[600px]">
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
		</div>
	),
};

// Solid Style
export const SolidStyle: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[600px]">
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
		</div>
	),
};

// With Icons
export const WithIcons: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[600px]">
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
		</div>
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
				<a href="/" className="font-semibold underline hover:no-underline">
					an example link
				</a>
				. Give it a click if you like.
			</AlertDescription>
		</Alert>
	),
};

// Dismissable Alerts
export const Dismissable: Story = {
	render: () => (
		<div className="flex flex-col gap-4 w-[600px]">
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
		</div>
	),
};

// Complex with Paragraphs
export const ComplexAlert: Story = {
	render: () => (
		<Alert variant="info" className="w-[600px]">
			<InfoIcon />
			<AlertTitle>Information</AlertTitle>
			<AlertDescription>
				<p className="mb-2">
					This is an informational message with multiple paragraphs. The first
					paragraph provides the main context.
				</p>
				<p>
					Whenever you need to, be sure to properly structure your content to
					keep things nice and tidy.
				</p>
			</AlertDescription>
		</Alert>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md space-y-4">
			<div className="flex gap-3 p-4 border rounded-lg">
				<Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for alerts while content is loading.",
			},
		},
	},
};