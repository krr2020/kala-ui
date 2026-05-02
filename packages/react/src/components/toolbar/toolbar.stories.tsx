import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
	Bold,
	Italic,
	Underline,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";
import {
	Toolbar,
	ToolbarButton,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
	ToolbarLink,
} from "./toolbar";

const meta = {
	title: "Components/Toolbar",
	component: Toolbar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [formatting, setFormatting] = React.useState<string[]>([]);
		return (
			<Toolbar aria-label="Text formatting">
				<ToolbarToggleGroup
					type="multiple"
					value={formatting}
					onValueChange={setFormatting}
				>
					<ToolbarToggleItem value="bold" aria-label="Toggle bold">
						<Bold className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="italic" aria-label="Toggle italic">
						<Italic className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="underline" aria-label="Toggle underline">
						<Underline className="h-4 w-4" />
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
				<ToolbarSeparator />
				<ToolbarButton aria-label="More options">More</ToolbarButton>
				<ToolbarLink href="#">Docs</ToolbarLink>
			</Toolbar>
		);
	},
};

export const TextAlignment: Story = {
	render: () => {
		const [alignment, setAlignment] = React.useState("left");
		return (
			<Toolbar aria-label="Text alignment">
				<ToolbarToggleGroup
					type="single"
					value={alignment}
					onValueChange={(val) => {
						if (val) setAlignment(val);
					}}
				>
					<ToolbarToggleItem value="left" aria-label="Align left">
						<AlignLeft className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="center" aria-label="Align center">
						<AlignCenter className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="right" aria-label="Align right">
						<AlignRight className="h-4 w-4" />
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>
		);
	},
};
