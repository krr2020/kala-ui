import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "./button-group";

const meta: Meta<typeof ButtonGroup> = {
	title: "Buttons/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// Basic Example (Dashforge style)
export const BasicExample: Story = {
	render: () => (
		<ButtonGroup role="group" aria-label="Basic example">
			<Button color="secondary">General</Button>
			<Button color="secondary">Privacy</Button>
			<Button color="secondary">Account</Button>
		</ButtonGroup>
	),
};

// Button Toolbar (Dashforge - multiple groups with spacing)
export const ButtonToolbar: Story = {
	render: () => (
		<div
			className="inline-flex gap-2"
			role="toolbar"
			aria-label="Toolbar with button groups"
		>
			<ButtonGroup role="group" aria-label="First group">
				<Button color="secondary">1</Button>
				<Button color="secondary">2</Button>
				<Button color="secondary">3</Button>
				<Button color="secondary">4</Button>
			</ButtonGroup>
			<ButtonGroup role="group" aria-label="Second group">
				<Button color="secondary">5</Button>
				<Button color="secondary">6</Button>
				<Button color="secondary">7</Button>
			</ButtonGroup>
			<ButtonGroup role="group" aria-label="Third group">
				<Button color="secondary">8</Button>
			</ButtonGroup>
		</div>
	),
};

// Sizing (Dashforge)
export const Sizing: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup>
				<Button color="secondary" size="lg">
					1
				</Button>
				<Button color="secondary" size="lg">
					2
				</Button>
				<Button color="secondary" size="lg">
					3
				</Button>
				<Button color="secondary" size="lg">
					4
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="secondary">1</Button>
				<Button color="secondary">2</Button>
				<Button color="secondary">3</Button>
				<Button color="secondary">4</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="secondary" size="sm">
					1
				</Button>
				<Button color="secondary" size="sm">
					2
				</Button>
				<Button color="secondary" size="sm">
					3
				</Button>
				<Button color="secondary" size="sm">
					4
				</Button>
			</ButtonGroup>
		</div>
	),
};

// Vertical Variation (Dashforge)
export const VerticalVariation: Story = {
	render: () => (
		<ButtonGroup orientation="vertical" aria-label="Vertical variation">
			<Button color="secondary">Top</Button>
			<Button color="secondary">Middle</Button>
			<Button color="secondary">Bottom</Button>
		</ButtonGroup>
	),
};

// Separated Variation
export const Separated: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup separated aria-label="Horizontal separated">
				<Button color="secondary">First</Button>
				<Button color="secondary">Second</Button>
				<Button color="secondary">Third</Button>
			</ButtonGroup>

			<ButtonGroup
				separated
				orientation="vertical"
				aria-label="Vertical separated"
			>
				<Button color="secondary">Top</Button>
				<Button color="secondary">Middle</Button>
				<Button color="secondary">Bottom</Button>
			</ButtonGroup>
		</div>
	),
};

// Outline Variant
export const OutlineVariant: Story = {
	render: () => (
		<ButtonGroup>
			<Button variant="outline">Left</Button>
			<Button variant="outline">Middle</Button>
			<Button variant="outline">Right</Button>
		</ButtonGroup>
	),
};

// With Icons
export const WithIcons: Story = {
	render: () => (
		<ButtonGroup
			orientation="vertical"
			aria-label="Media controls"
			className="h-fit"
		>
			<Button variant="outline" size="icon">
				<Plus className="size-4" />
			</Button>
			<Button variant="outline" size="icon">
				<Minus className="size-4" />
			</Button>
		</ButtonGroup>
	),
};

// With Separator
export const WithSeparator: Story = {
	render: () => (
		<ButtonGroup>
			<Button color="secondary" size="sm">
				Copy
			</Button>
			<ButtonGroupSeparator />
			<Button color="secondary" size="sm">
				Paste
			</Button>
		</ButtonGroup>
	),
};

// Split Button
export const SplitButton: Story = {
	render: () => (
		<ButtonGroup>
			<Button color="secondary">Button</Button>
			<ButtonGroupSeparator />
			<Button size="icon" color="secondary">
				<ChevronDown className="size-4" />
			</Button>
		</ButtonGroup>
	),
};

// Nested Groups
export const Nested: Story = {
	render: () => (
		<ButtonGroup className="gap-2">
			<ButtonGroup>
				<Button variant="outline" size="sm">
					1
				</Button>
				<Button variant="outline" size="sm">
					2
				</Button>
				<Button variant="outline" size="sm">
					3
				</Button>
				<Button variant="outline" size="sm">
					4
				</Button>
				<Button variant="outline" size="sm">
					5
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline" size="sm">
					Left
				</Button>
				<Button variant="outline" size="sm">
					Right
				</Button>
			</ButtonGroup>
		</ButtonGroup>
	),
};

// With Text Label
export const WithTextLabel: Story = {
	render: () => (
		<ButtonGroup>
			<ButtonGroupText>Options:</ButtonGroupText>
			<Button variant="outline">Edit</Button>
			<Button variant="outline">Delete</Button>
		</ButtonGroup>
	),
};

// Mixed Variants
export const MixedVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup>
				<Button>Save</Button>
				<Button>Save & Close</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="success">Approve</Button>
				<Button color="success">Approve All</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="destructive">Delete</Button>
				<Button color="destructive">Delete All</Button>
			</ButtonGroup>
		</div>
	),
};

// All Variants Showcase
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup>
				<Button>Primary</Button>
				<Button>Button</Button>
				<Button>Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="secondary">Secondary</Button>
				<Button color="secondary">Button</Button>
				<Button color="secondary">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">Outline</Button>
				<Button variant="outline">Button</Button>
				<Button variant="outline">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="success">Success</Button>
				<Button color="success">Button</Button>
				<Button color="success">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="warning">Warning</Button>
				<Button color="warning">Button</Button>
				<Button color="warning">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="destructive">Danger</Button>
				<Button color="destructive">Button</Button>
				<Button color="destructive">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="info">Info</Button>
				<Button color="info">Button</Button>
				<Button color="info">Group</Button>
			</ButtonGroup>
		</div>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="flex gap-2">
			<Skeleton className="h-10 w-24 rounded-md" />
			<Skeleton className="h-10 w-28 rounded-md" />
			<Skeleton className="h-10 w-32 rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for button groups while loading.",
			},
		},
	},
};
