import type { Meta, StoryObj } from "@storybook/react";
import { Info } from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Skeleton } from "../skeleton";
import {
	Popover,
	PopoverBody,
	PopoverClose,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from "./popover";

const meta = {
	title: "Overlay/Popover",
	component: Popover,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// With Arrow (Default and Variants)
// ============================================================================

export const WithArrow: Story = {
	render: () => (
		<div className="flex gap-4 flex-wrap">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline">Default with Arrow</Button>
				</PopoverTrigger>
				<PopoverContent className="w-60" showArrow={true}>
					<p className="text-sm">
						This popover shows an arrow pointing to the trigger.
					</p>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="success">Success Header Arrow</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="success" side="bottom">
					<PopoverHeader>Success Header</PopoverHeader>
					<PopoverBody>
						<p className="text-sm">The arrow matches the green header color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="destructive">Danger Full Arrow</Button>
				</PopoverTrigger>
				<PopoverContent color="destructive" side="right">
					<p className="text-sm text-white p-2">
						The arrow matches the full red background.
					</p>
				</PopoverContent>
			</Popover>
		</div>
	),
};

// ============================================================================
// Basic Example
// ============================================================================

export const Basic: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">Open popover</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Dimensions</h4>
						<p className="text-sm text-muted-foreground">
							Set the dimensions for the layer.
						</p>
					</div>
					<div className="grid gap-2">
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="width">Width</Label>
							<Input
								id="width"
								defaultValue="100%"
								className="col-span-2 h-8"
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="height">Height</Label>
							<Input
								id="height"
								defaultValue="25px"
								className="col-span-2 h-8"
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	),
};

// ============================================================================
// Four Directions
// ============================================================================

export const Directions: Story = {
	render: () => (
		<div className="flex gap-4 flex-wrap items-center justify-center">
			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Popover Top</Button>
				</PopoverTrigger>
				<PopoverContent side="top">
					<p className="text-sm">
						Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
					</p>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Popover Right</Button>
				</PopoverTrigger>
				<PopoverContent side="right">
					<p className="text-sm">
						Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
					</p>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Popover Bottom</Button>
				</PopoverTrigger>
				<PopoverContent side="bottom">
					<p className="text-sm">
						Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
					</p>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Popover Left</Button>
				</PopoverTrigger>
				<PopoverContent side="left">
					<p className="text-sm">
						Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
					</p>
				</PopoverContent>
			</Popover>
		</div>
	),
};

// ============================================================================
// Simple Text
// ============================================================================

export const SimpleText: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button>
					<Info className="mr-2 h-4 w-4" />
					Show info
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<p className="text-sm">This is a simple popover with text content.</p>
			</PopoverContent>
		</Popover>
	),
};

// ============================================================================
// With Header (Colored Header Variants)
// ============================================================================

export const ColoredHeaders: Story = {
	render: () => (
		<div className="flex gap-3 flex-wrap">
			<Popover>
				<PopoverTrigger asChild>
					<Button>Primary Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="primary">
					<PopoverHeader>Primary Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Secondary Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="secondary">
					<PopoverHeader>Secondary Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="success">Success Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="success">
					<PopoverHeader>Success Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="destructive">Danger Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="destructive">
					<PopoverHeader>Danger Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="warning">Warning Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="warning">
					<PopoverHeader>Warning Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="info">Info Header</Button>
				</PopoverTrigger>
				<PopoverContent headerColor="info">
					<PopoverHeader>Info Popover</PopoverHeader>
					<PopoverBody>
						<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</div>
	),
};

// ============================================================================
// Full Background Color Variants
// ============================================================================

export const FullColoredBackgrounds: Story = {
	render: () => (
		<div className="flex gap-3 flex-wrap">
			<Popover>
				<PopoverTrigger asChild>
					<Button>Primary Popover</Button>
				</PopoverTrigger>
				<PopoverContent>
					<PopoverHeader>Primary Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with primary color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="secondary">Secondary Popover</Button>
				</PopoverTrigger>
				<PopoverContent color="secondary">
					<PopoverHeader>Secondary Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with secondary color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="success">Success Popover</Button>
				</PopoverTrigger>
				<PopoverContent color="success">
					<PopoverHeader>Success Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with success color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="destructive">Danger Popover</Button>
				</PopoverTrigger>
				<PopoverContent color="destructive">
					<PopoverHeader>Danger Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with danger color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="warning">Warning Popover</Button>
				</PopoverTrigger>
				<PopoverContent color="warning">
					<PopoverHeader>Warning Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with warning color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger asChild>
					<Button color="info">Info Popover</Button>
				</PopoverTrigger>
				<PopoverContent color="info">
					<PopoverHeader>Info Popover</PopoverHeader>
					<PopoverBody>
						<p>Fully colored background with info color.</p>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</div>
	),
};

// ============================================================================
// Form in Popover
// ============================================================================

export const WithForm: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">Update profile</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Profile Settings</h4>
						<p className="text-sm text-muted-foreground">
							Update your profile information.
						</p>
					</div>
					<div className="grid gap-2">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Your name" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="your@email.com" />
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<PopoverClose asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</PopoverClose>
						<Button size="sm">Save</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	),
};

// ============================================================================
// Dismissible Focus (Closes on ANY click, including inside content)
// ============================================================================

export const DismissibleFocus: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);

		return (
			<div className="space-y-2">
				<p className="text-sm text-muted-foreground">
					Click to open, then click anywhere (even inside) to dismiss:
				</p>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button color="destructive">Dismissible Popover</Button>
					</PopoverTrigger>
					<PopoverContent
						headerColor="destructive"
						onClick={() => setOpen(false)}
						onPointerDownOutside={() => setOpen(false)}
					>
						<PopoverHeader>Dismissible popover</PopoverHeader>
						<PopoverBody>
							<p>Click anywhere to dismiss this popover - even on this text!</p>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => <Skeleton className="h-10 w-32 rounded-md" />,
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholder for popover trigger while loading.",
			},
		},
	},
};
