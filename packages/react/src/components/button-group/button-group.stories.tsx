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
			<Button variant="secondary">General</Button>
			<Button variant="secondary">Privacy</Button>
			<Button variant="secondary">Account</Button>
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
				<Button variant="secondary">1</Button>
				<Button variant="secondary">2</Button>
				<Button variant="secondary">3</Button>
				<Button variant="secondary">4</Button>
			</ButtonGroup>
			<ButtonGroup role="group" aria-label="Second group">
				<Button variant="secondary">5</Button>
				<Button variant="secondary">6</Button>
				<Button variant="secondary">7</Button>
			</ButtonGroup>
			<ButtonGroup role="group" aria-label="Third group">
				<Button variant="secondary">8</Button>
			</ButtonGroup>
		</div>
	),
};

// Sizing (Dashforge)
export const Sizing: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup>
				<Button variant="secondary" size="lg">
					1
				</Button>
				<Button variant="secondary" size="lg">
					2
				</Button>
				<Button variant="secondary" size="lg">
					3
				</Button>
				<Button variant="secondary" size="lg">
					4
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="secondary">1</Button>
				<Button variant="secondary">2</Button>
				<Button variant="secondary">3</Button>
				<Button variant="secondary">4</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="secondary" size="sm">
					1
				</Button>
				<Button variant="secondary" size="sm">
					2
				</Button>
				<Button variant="secondary" size="sm">
					3
				</Button>
				<Button variant="secondary" size="sm">
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
			<Button variant="secondary">Top</Button>
			<Button variant="secondary">Middle</Button>
			<Button variant="secondary">Bottom</Button>
		</ButtonGroup>
	),
};

// Separated Variation
export const Separated: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup separated aria-label="Horizontal separated">
				<Button variant="secondary">First</Button>
				<Button variant="secondary">Second</Button>
				<Button variant="secondary">Third</Button>
			</ButtonGroup>

			<ButtonGroup
				separated
				orientation="vertical"
				aria-label="Vertical separated"
			>
				<Button variant="secondary">Top</Button>
				<Button variant="secondary">Middle</Button>
				<Button variant="secondary">Bottom</Button>
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
			<Button variant="secondary" size="sm">
				Copy
			</Button>
			<ButtonGroupSeparator />
			<Button variant="secondary" size="sm">
				Paste
			</Button>
		</ButtonGroup>
	),
};

// Split Button
export const SplitButton: Story = {
	render: () => (
		<ButtonGroup>
			<Button variant="secondary">Button</Button>
			<ButtonGroupSeparator />
			<Button size="icon" variant="secondary">
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
				<Button variant="primary">Save</Button>
				<Button variant="primary">Save & Close</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="success">Approve</Button>
				<Button variant="success">Approve All</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="danger">Delete</Button>
				<Button variant="danger">Delete All</Button>
			</ButtonGroup>
		</div>
	),
};

// All Variants Showcase
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4 items-start">
			<ButtonGroup>
				<Button variant="primary">Primary</Button>
				<Button variant="primary">Button</Button>
				<Button variant="primary">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="secondary">Secondary</Button>
				<Button variant="secondary">Button</Button>
				<Button variant="secondary">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">Outline</Button>
				<Button variant="outline">Button</Button>
				<Button variant="outline">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="success">Success</Button>
				<Button variant="success">Button</Button>
				<Button variant="success">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="warning">Warning</Button>
				<Button variant="warning">Button</Button>
				<Button variant="warning">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="danger">Danger</Button>
				<Button variant="danger">Button</Button>
				<Button variant="danger">Group</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="info">Info</Button>
				<Button variant="info">Button</Button>
				<Button variant="info">Group</Button>
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
