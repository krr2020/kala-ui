import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
	title: "Data Display/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sizes
export const Sizes: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Avatar size="xs">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="sm">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
					alt="kala-ui"
				/>
				<AvatarFallback>RK</AvatarFallback>
			</Avatar>
		</div>
	),
};

// Shapes
export const Shapes: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Avatar shape="circle" size="xl">
				<AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Circle" />
				<AvatarFallback>CI</AvatarFallback>
			</Avatar>
			<Avatar shape="rounded" size="xl">
				<AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Rounded" />
				<AvatarFallback>RD</AvatarFallback>
			</Avatar>
			<Avatar shape="square" size="xl">
				<AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Square" />
				<AvatarFallback>SQ</AvatarFallback>
			</Avatar>
		</div>
	),
};

// Initials with Different Sizes
export const Initials: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Avatar size="xs">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
			<Avatar size="sm">
				<AvatarFallback variant="primary">DF</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
		</div>
	),
};

// Initials with Different Colors
export const InitialsVariants: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Avatar size="lg">
				<AvatarFallback>PR</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback color="secondary">SE</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback color="success">SU</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback color="destructive">DA</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback color="warning">WA</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback color="info">IN</AvatarFallback>
			</Avatar>
		</div>
	),
};

// Status Indicators
export const StatusIndicators: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Avatar size="xl" status="online">
				<AvatarImage src="https://i.pravatar.cc/150?img=65" alt="Online" />
				<AvatarFallback>ON</AvatarFallback>
			</Avatar>
			<Avatar size="xl" status="offline">
				<AvatarImage src="https://i.pravatar.cc/150?img=65" alt="Offline" />
				<AvatarFallback>OF</AvatarFallback>
			</Avatar>
			<Avatar size="xl" status="online">
				<AvatarFallback>DF</AvatarFallback>
			</Avatar>
		</div>
	),
};

// Combined Examples
export const Combined: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			{/* Basic combination with different shapes */}
			<div className="flex gap-4 items-center">
				<Avatar size="lg" shape="circle">
					<AvatarImage src="https://i.pravatar.cc/150?img=65" alt="kala-ui" />
					<AvatarFallback>RK</AvatarFallback>
				</Avatar>
				<Avatar size="lg" shape="rounded">
					<AvatarImage src="https://i.pravatar.cc/150?img=64" alt="kala-ui" />
					<AvatarFallback>ER</AvatarFallback>
				</Avatar>
			</div>

			{/* Avatar group (stacked/overlapping) */}
			<div className="flex -space-x-2">
				<Avatar className="ring-2 ring-background">
					<AvatarImage src="https://i.pravatar.cc/150?img=65" alt="kala-ui" />
					<AvatarFallback>RK</AvatarFallback>
				</Avatar>
				<Avatar className="ring-2 ring-background">
					<AvatarImage src="https://i.pravatar.cc/150?img=2" alt="kala-ui" />
					<AvatarFallback>ML</AvatarFallback>
				</Avatar>
				<Avatar className="ring-2 ring-background">
					<AvatarImage src="https://i.pravatar.cc/150?img=64" alt="kala-ui" />
					<AvatarFallback>ER</AvatarFallback>
				</Avatar>
			</div>

			{/* With status indicators */}
			<div className="flex gap-4 items-center">
				<Avatar size="lg" status="online">
					<AvatarImage
						src="https://i.pravatar.cc/150?img=65"
						alt="Online user"
					/>
					<AvatarFallback>ON</AvatarFallback>
				</Avatar>
				<Avatar size="lg" status="offline">
					<AvatarImage
						src="https://i.pravatar.cc/150?img=64"
						alt="Offline user"
					/>
					<AvatarFallback>OF</AvatarFallback>
				</Avatar>
			</div>
		</div>
	),
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<Skeleton className="h-8 w-8 rounded-full" />
			<Skeleton className="h-10 w-10 rounded-full" />
			<Skeleton className="h-12 w-12 rounded-full" />
			<Skeleton className="h-16 w-16 rounded-full" />
			<Skeleton className="h-20 w-20 rounded-full" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for avatars in various sizes while images are loading.",
			},
		},
	},
};
