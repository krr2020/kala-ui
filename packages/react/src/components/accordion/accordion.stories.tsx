import type { Meta, StoryObj } from "@storybook/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

const meta = {
	title: "Data Display/Accordion",
	component: Accordion,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		type: "single",
	},
	render: () => (
		<Accordion type="single" collapsible className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>
					Yes. It adheres to the WAI-ARIA design pattern.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that match the other
					components&apos; aesthetic.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&apos;s animated by default, but you can disable it if you
					prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Multiple: Story = {
	args: {
		type: "multiple",
	},
	render: () => (
		<Accordion type="multiple" className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Section 1</AccordionTrigger>
				<AccordionContent>
					Content for section 1. Multiple items can be open at once.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Section 2</AccordionTrigger>
				<AccordionContent>
					Content for section 2. Try opening both sections.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const DefaultOpen: Story = {
	args: {
		type: "single",
	},
	render: () => (
		<Accordion type="single" collapsible defaultValue="item-2" className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Closed by default</AccordionTrigger>
				<AccordionContent>This item starts closed.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Open by default</AccordionTrigger>
				<AccordionContent>This item starts open.</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Disabled: Story = {
	args: {
		type: "single",
	},
	render: () => (
		<Accordion type="single" collapsible className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Enabled item</AccordionTrigger>
				<AccordionContent>This item can be toggled.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger disabled>Disabled item</AccordionTrigger>
				<AccordionContent>This content cannot be accessed.</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Bordered: Story = {
	args: {
		type: "single",
		variant: "bordered",
		collapsible: true,
	},
	render: (args) => (
		<Accordion {...args} className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>
					Yes. It adheres to the WAI-ARIA design pattern.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that match the other
					components&apos; aesthetic.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&apos;s animated by default, but you can disable it if you
					prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Filled: Story = {
	args: {
		type: "single",
		variant: "filled",
		collapsible: true,
	},
	render: (args) => (
		<Accordion {...args} className="w-96">
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>
					Yes. It adheres to the WAI-ARIA design pattern.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that match the other
					components&apos; aesthetic.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&apos;s animated by default, but you can disable it if you
					prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};
