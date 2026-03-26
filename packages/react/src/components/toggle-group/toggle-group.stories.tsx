import type { Meta, StoryObj } from "@storybook/react";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	Underline,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
	title: "Forms/ToggleGroup",
	component: ToggleGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["single", "multiple"],
		},
		variant: {
			control: "select",
			options: ["default", "outline"],
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleSelection: Story = {
	args: {
		type: "single",
		defaultValue: "center",
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Left align">
				<AlignLeft className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Center align">
				<AlignCenter className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Right align">
				<AlignRight className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const MultipleSelection: Story = {
	args: {
		type: "multiple",
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="underline" aria-label="Underline">
				<Underline className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const WithText: Story = {
	args: {
		type: "single",
		defaultValue: "monthly",
	},
	render: (args) => (
		<ToggleGroup {...args} variant="outline">
			<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
			<ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Outline: Story = {
	args: {
		type: "single",
		variant: "outline",
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="left" aria-label="Left align">
				<AlignLeft className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="center" aria-label="Center align">
				<AlignCenter className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="right" aria-label="Right align">
				<AlignRight className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Small: Story = {
	args: {
		type: "single",
		size: "sm",
	},
	render: (args) => (
		<ToggleGroup {...args}>
			<ToggleGroupItem value="bold" aria-label="Bold">
				<Bold className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic" aria-label="Italic">
				<Italic className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
