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
				<DialogContent size="md">
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
						<p key={crypto.randomUUID()}>
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

// 100 rows: the footer stays pinned while DialogBody scrolls
export const PinnedFooter: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Layout contract: DialogBody is the only scrollable region — header and footer stay pinned no matter how tall the body gets.",
			},
		},
	},
	render: () => (
		<Dialog defaultOpen>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select items</DialogTitle>
					<DialogDescription>
						Scroll the body — the footer never moves.
					</DialogDescription>
				</DialogHeader>
				<DialogBody>
					{Array.from({ length: 100 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2 py-2">
							<span className="w-8 text-right text-sm text-muted-foreground">
								{i + 1}.
							</span>
							<span className="text-sm">Item row {i + 1}</span>
						</div>
					))}
				</DialogBody>
				<DialogFooter>
					<Button variant="outline">Cancel</Button>
					<Button>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

// Single form child owning its own scroll region — the pre-contract workaround
export const FormComposition: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Backward compatible: a single form child with its own overflow-y-auto region and a footer pinned inside the form keeps working unchanged.",
			},
		},
	},
	render: () => (
		<Dialog defaultOpen>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit account</DialogTitle>
					<DialogDescription>
						The form owns the scroll region; the footer stays inside it.
					</DialogDescription>
				</DialogHeader>
				<form className="flex min-h-0 flex-1 flex-col">
					<div
						data-testid="form-scroll-region"
						className="min-h-0 flex-1 overflow-y-auto px-6 py-4"
					>
						<div className="grid gap-4">
							{Array.from({ length: 40 }).map((_, i) => (
								<div key={i} className="grid gap-2">
									<Label htmlFor={`field-${i}`}>Field {i + 1}</Label>
									<Input id={`field-${i}`} defaultValue={`Value ${i + 1}`} />
								</div>
							))}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline">
							Cancel
						</Button>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	),
};

// Short content: no scrollbar, no visual change
export const ShortContent: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Short content never shows a scrollbar — the scroll region only engages when the 90vh cap is hit.",
			},
		},
	},
	render: () => (
		<Dialog defaultOpen>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Short dialog</DialogTitle>
					<DialogDescription>Nothing here to scroll.</DialogDescription>
				</DialogHeader>
				<DialogBody>
					<p>Two short rows of content.</p>
					<p>No scrollbar appears.</p>
				</DialogBody>
				<DialogFooter>
					<Button>Got it</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
