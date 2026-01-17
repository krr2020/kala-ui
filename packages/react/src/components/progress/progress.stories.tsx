import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import { Progress, ProgressBar, ProgressGroup } from "./progress";

const meta = {
	title: "Feedback/Progress",
	component: Progress,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Progress value (0-100)",
		},
		color: {
			control: "select",
			options: ["default", "success", "info", "warning", "danger"],
			description: "Color variant",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Size variant",
		},
		striped: {
			control: "boolean",
			description: "Show striped pattern",
		},
		animated: {
			control: "boolean",
			description: "Animate striped pattern (requires striped=true)",
		},
		showValue: {
			control: "boolean",
			description: "Show percentage value",
		},
	},
	args: {
		value: 40,
		color: "default",
		size: "md",
		striped: false,
		animated: false,
		showValue: false,
	},
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic progress bar with default styling
 */
export const Basic: Story = {
	args: {
		value: 40,
	},
	render: (args) => (
		<div className="w-96">
			<Progress {...args} />
		</div>
	),
};

/**
 * Progress bar with label text
 */
export const WithLabel: Story = {
	args: {
		value: 25,
		label: "25%",
		size: "lg",
	},
	render: (args) => (
		<div className="w-96">
			<Progress {...args} />
		</div>
	),
};

/**
 * Progress bar with percentage display
 */
export const WithPercentage: Story = {
	args: {
		value: 65,
		showValue: true,
		size: "lg",
	},
	render: (args) => (
		<div className="w-96">
			<Progress {...args} />
		</div>
	),
};

/**
 * Different height/size variants
 */
export const Sizes: Story = {
	render: () => (
		<div className="w-96 space-y-4">
			<div>
				<div className="text-sm font-medium mb-2">Small (sm)</div>
				<Progress value={40} size="sm" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Medium (md) - Default</div>
				<Progress value={50} size="md" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Large (lg)</div>
				<Progress value={60} size="lg" showValue />
			</div>
		</div>
	),
};

/**
 * Different color variants based on status
 */
export const Colors: Story = {
	render: () => (
		<div className="w-96 space-y-4">
			<div>
				<div className="text-sm font-medium mb-2">Default</div>
				<Progress value={40} color="default" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2 text-success">Success</div>
				<Progress value={100} color="success" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2 text-info">Info</div>
				<Progress value={50} color="info" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2 text-warning">Warning</div>
				<Progress value={75} color="warning" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2 text-destructive">Danger</div>
				<Progress value={30} color="danger" />
			</div>
		</div>
	),
};

/**
 * Striped pattern for visual emphasis
 */
export const Striped: Story = {
	render: () => (
		<div className="w-96 space-y-4">
			<div>
				<div className="text-sm font-medium mb-2">Success with Stripes</div>
				<Progress value={30} color="success" striped size="lg" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Warning with Stripes</div>
				<Progress value={60} color="warning" striped size="lg" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Danger with Stripes</div>
				<Progress value={85} color="danger" striped size="lg" />
			</div>
		</div>
	),
};

/**
 * Animated striped pattern for active operations
 */
export const Animated: Story = {
	render: () => (
		<div className="w-96 space-y-4">
			<div>
				<div className="text-sm font-medium mb-2">Uploading...</div>
				<Progress value={45} color="success" striped animated size="lg" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Processing...</div>
				<Progress value={65} color="info" striped animated size="lg" />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Loading...</div>
				<Progress value={30} color="default" striped animated size="lg" />
			</div>
		</div>
	),
};

/**
 * Multiple progress bars stacked in one container
 */
export const MultipleBars: Story = {
	render: () => (
		<div className="w-96 space-y-6">
			<div>
				<div className="text-sm font-medium mb-2">Storage Usage Breakdown</div>
				<ProgressGroup size="lg">
					<ProgressBar value={15} color="danger" label="Docs" />
					<ProgressBar value={30} color="warning" label="Images" />
					<ProgressBar value={20} color="success" label="Videos" />
				</ProgressGroup>
				<div className="mt-2 flex gap-4 text-xs">
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-destructive rounded" />
						<span>Docs (15%)</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-warning rounded" />
						<span>Images (30%)</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="w-3 h-3 bg-success rounded" />
						<span>Videos (20%)</span>
					</div>
				</div>
			</div>

			<div>
				<div className="text-sm font-medium mb-2">Server Resources</div>
				<ProgressGroup size="md">
					<ProgressBar value={25} color="success" striped />
					<ProgressBar value={40} color="info" striped />
					<ProgressBar value={15} color="warning" striped />
				</ProgressGroup>
			</div>
		</div>
	),
};

/**
 * Interactive progress simulation
 */
export const Interactive: Story = {
	render: () => {
		const [progress, setProgress] = React.useState(13);

		React.useEffect(() => {
			const timer = setTimeout(() => setProgress(66), 500);
			return () => clearTimeout(timer);
		}, []);

		return (
			<div className="w-96 space-y-4">
				<div>
					<div className="flex justify-between text-sm mb-2">
						<span className="font-medium">Uploading file...</span>
						<span className="text-muted-foreground">{progress}%</span>
					</div>
					<Progress
						value={progress}
						color="success"
						striped
						animated
						size="lg"
					/>
				</div>
				<Button
					type="button"
					onClick={() => setProgress((p) => Math.min(100, p + 10))}
				>
					Increase Progress
				</Button>
			</div>
		);
	},
};

/**
 * Real-world example: File upload with status
 */
export const FileUpload: Story = {
	render: () => {
		const [uploadProgress, setUploadProgress] = React.useState(0);
		const [isUploading, setIsUploading] = React.useState(false);

		const startUpload = () => {
			setIsUploading(true);
			setUploadProgress(0);

			const interval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev >= 100) {
						clearInterval(interval);
						setIsUploading(false);
						return 100;
					}
					return prev + 10;
				});
			}, 200);
		};

		const getColor = () => {
			if (uploadProgress === 100) return "success";
			if (uploadProgress > 75) return "warning";
			return "info";
		};

		return (
			<div className="w-96 space-y-4">
				<div className="p-4 border rounded-lg">
					<div className="flex items-center justify-between mb-3">
						<div className="text-sm font-medium">document.pdf</div>
						<div className="text-xs text-muted-foreground">2.4 MB</div>
					</div>
					<Progress
						value={uploadProgress}
						color={getColor()}
						size="md"
						striped
						animated={isUploading}
					/>
					<div className="mt-2 text-xs text-muted-foreground">
						{uploadProgress === 0 && "Ready to upload"}
						{uploadProgress > 0 &&
							uploadProgress < 100 &&
							`Uploading... ${uploadProgress}%`}
						{uploadProgress === 100 && "Upload complete!"}
					</div>
				</div>
				<Button
					type="button"
					onClick={startUpload}
					disabled={isUploading}
					className="w-full"
				>
					{isUploading ? "Uploading..." : "Start Upload"}
				</Button>
			</div>
		);
	},
};

/**
 * Edge cases: min/max values and clamping
 */
export const EdgeCases: Story = {
	render: () => (
		<div className="w-96 space-y-4">
			<div>
				<div className="text-sm font-medium mb-2">Value: 0%</div>
				<Progress value={0} size="lg" showValue />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">Value: 100%</div>
				<Progress value={100} color="success" size="lg" showValue />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">
					Value exceeds max (clamped to 100)
				</div>
				<Progress value={150} color="warning" size="lg" showValue />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">
					Negative value (clamped to 0)
				</div>
				<Progress value={-20} color="danger" size="lg" showValue />
			</div>
			<div>
				<div className="text-sm font-medium mb-2">
					Custom range: 50-200, value 125
				</div>
				<Progress
					value={125}
					min={50}
					max={200}
					color="info"
					size="lg"
					label="75/150"
				/>
			</div>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md space-y-4">
			<Skeleton className="h-2 w-full rounded-full" />
			<Skeleton className="h-2 w-full rounded-full" />
			<Skeleton className="h-3 w-full rounded-full" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for progress bars while loading.",
			},
		},
	},
};
