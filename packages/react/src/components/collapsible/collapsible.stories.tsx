import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown } from "lucide-react";
import { Button } from "../button/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";

const meta: Meta<typeof Collapsible> = {
	title: "Layout/Collapsible",
	component: Collapsible,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
	render: () => (
		<Collapsible className="w-[350px] space-y-2">
			<div className="flex items-center justify-between space-x-4 px-4">
				<h4 className="text-sm font-semibold">3 repositories starred</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="icon">
						<ChevronDown className="h-4 w-4" />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<div className="rounded-md border px-4 py-3 font-mono text-sm">
				@radix-ui/primitives
			</div>
			<CollapsibleContent className="space-y-2">
				<div className="rounded-md border px-4 py-3 font-mono text-sm">
					@radix-ui/colors
				</div>
				<div className="rounded-md border px-4 py-3 font-mono text-sm">
					@stitches/react
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Collapsible defaultOpen className="w-[350px] space-y-2">
			<div className="flex items-center justify-between space-x-4 px-4">
				<h4 className="text-sm font-semibold">Open by default</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="icon">
						<ChevronDown className="h-4 w-4" />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2">
				<div className="rounded-md border px-4 py-3 text-sm">
					This content is visible by default.
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};
