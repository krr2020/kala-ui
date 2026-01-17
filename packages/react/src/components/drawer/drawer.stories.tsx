import type { Meta, StoryObj } from "@storybook/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Skeleton } from "../skeleton";
import { Textarea } from "../textarea";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";

const meta = {
	title: "Overlay/Drawer",
	component: Drawer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Feature Showcase
export const FeatureShowcase: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{/* Basic Drawer */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="outline" className="w-full">
						Basic Drawer
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Basic Drawer</DrawerTitle>
							<DrawerDescription>
								This is a basic drawer example.
							</DrawerDescription>
						</DrawerHeader>
						<div className="p-6">
							<p className="text-sm text-muted-foreground">
								This is the content area of the drawer. You can put any content
								here.
							</p>
						</div>
						<DrawerFooter>
							<Button>Submit</Button>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>

			{/* With Form */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="outline" className="w-full">
						Profile Form
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Edit profile</DrawerTitle>
							<DrawerDescription>
								Make changes to your profile here. Click save when you're done.
							</DrawerDescription>
						</DrawerHeader>
						<div className="space-y-4 p-6">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="Enter your name"
									defaultValue="John Doe"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									defaultValue="john@example.com"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									placeholder="Tell us about yourself"
									rows={3}
								/>
							</div>
						</div>
						<DrawerFooter>
							<Button>Save changes</Button>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>

			{/* Interactive Goal Setter */}
			<GoalDrawer />

			{/* Confirmation Dialog */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="danger" className="w-full">
						Delete Account
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Are you absolutely sure?</DrawerTitle>
							<DrawerDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<Button variant="danger">Delete Account</Button>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>

			{/* Multiple Actions */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="secondary" className="w-full">
						Action Menu
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle>Choose an action</DrawerTitle>
							<DrawerDescription>
								Select what you'd like to do with this item.
							</DrawerDescription>
						</DrawerHeader>
						<div className="space-y-2 p-6">
							<Button variant="outline" className="w-full justify-start">
								Edit
							</Button>
							<Button variant="outline" className="w-full justify-start">
								Duplicate
							</Button>
							<Button variant="outline" className="w-full justify-start">
								Archive
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start text-destructive hover:text-destructive"
							>
								Delete
							</Button>
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	),
};

function GoalDrawer() {
	const [goal, setGoal] = useState(350);

	function onClick(adjustment: number) {
		setGoal(Math.max(200, Math.min(400, goal + adjustment)));
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-full">
					Goal Setter
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Move Goal</DrawerTitle>
						<DrawerDescription>Set your daily activity goal.</DrawerDescription>
					</DrawerHeader>
					<div className="p-6 pb-0">
						<div className="flex items-center justify-center space-x-4">
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 shrink-0 rounded-full"
								onClick={() => onClick(-10)}
								disabled={goal <= 200}
								aria-label="Decrease goal"
							>
								<Minus className="h-4 w-4" />
							</Button>
							<div className="flex-1 text-center">
								<div className="text-6xl font-bold tracking-tighter">
									{goal}
								</div>
								<div className="mt-2 text-sm uppercase text-muted-foreground">
									Calories/day
								</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 shrink-0 rounded-full"
								onClick={() => onClick(10)}
								disabled={goal >= 400}
								aria-label="Increase goal"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<div className="mt-6 h-[80px] rounded-md bg-muted" />
					</div>
					<DrawerFooter>
						<Button>Submit</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

// Position Examples
export const PositionExamples: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["bottom", "top", "left", "right"] as const).map((direction) => (
				<Drawer key={direction} direction={direction}>
					<DrawerTrigger asChild>
						<Button variant="outline" className="capitalize">
							{direction}
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className="mx-auto w-full max-w-sm h-full flex flex-col">
							<DrawerHeader>
								<DrawerTitle className="capitalize">
									{direction} Drawer
								</DrawerTitle>
								<DrawerDescription>
									This drawer slides from the {direction}.
								</DrawerDescription>
							</DrawerHeader>
							<div className="p-6 flex-1">
								<p className="text-sm text-muted-foreground">
									Content for the {direction} drawer.
								</p>
							</div>
							<DrawerFooter>
								<Button>Action</Button>
								<DrawerClose asChild>
									<Button variant="outline">Close</Button>
								</DrawerClose>
							</DrawerFooter>
						</div>
					</DrawerContent>
				</Drawer>
			))}
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => <Skeleton className="h-10 w-32 rounded-md" />,
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholder for drawer trigger while loading.",
			},
		},
	},
};
