import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Skeleton } from "../skeleton";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta = {
	title: "Overlay/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Example
export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Open Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modal Title</DialogTitle>
				</DialogHeader>
				<DialogBody>
					<p>
						It is a long established fact that a reader will be distracted by
						the readable content of a page when looking at its layout. The point
						of using Lorem Ipsum is that it has a more-or-less normal
						distribution of letters, as opposed to using &apos;Content here,
						content here&apos;, making it look like readable English.
					</p>
				</DialogBody>
				<DialogFooter>
					<Button variant="outline">Close</Button>
					<Button>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// With Description
export const WithDescription: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<DialogBody>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<Input id="username" defaultValue="@peduarte" />
						</div>
					</div>
				</DialogBody>
				<DialogFooter>
					<Button variant="outline">Cancel</Button>
					<Button>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Different Sizes
export const Sizes: Story = {
	render: () => (
		<div className="flex gap-4">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Small</Button>
				</DialogTrigger>
				<DialogContent size="sm">
					<DialogHeader>
						<DialogTitle>Small Modal</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p>This is a small modal dialog.</p>
					</DialogBody>
					<DialogFooter>
						<Button>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Default</Button>
				</DialogTrigger>
				<DialogContent size="default">
					<DialogHeader>
						<DialogTitle>Default Modal</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p>This is a default sized modal dialog.</p>
					</DialogBody>
					<DialogFooter>
						<Button>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Large</Button>
				</DialogTrigger>
				<DialogContent size="lg">
					<DialogHeader>
						<DialogTitle>Large Modal</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p>This is a large modal dialog.</p>
					</DialogBody>
					<DialogFooter>
						<Button>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Extra Large</Button>
				</DialogTrigger>
				<DialogContent size="xl">
					<DialogHeader>
						<DialogTitle>Extra Large Modal</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<p>This is an extra large modal dialog.</p>
					</DialogBody>
					<DialogFooter>
						<Button>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	),
};

// Scrolling Content
export const ScrollingContent: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Long Content</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Terms of Service</DialogTitle>
					<DialogDescription>
						Please read our terms of service carefully.
					</DialogDescription>
				</DialogHeader>
				<DialogBody>
					{Array.from({ length: 20 }).map(() => (
						<p key={crypto.randomUUID()} className="mb-4">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris.
						</p>
					))}
				</DialogBody>
				<DialogFooter>
					<Button variant="outline">Decline</Button>
					<Button>Accept</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
export const LoadingSkeleton: Story = {
	render: () => <Skeleton className="h-10 w-32 rounded-md" />,
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholder for dialog trigger while loading.",
			},
		},
	},
};
