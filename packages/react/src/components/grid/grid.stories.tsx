import type { Meta, StoryObj } from "@storybook/react";
import { Grid, GridItem } from "./grid";

const meta: Meta<typeof Grid> = {
	title: "Components/Grid",
	component: Grid,
	tags: ["autodocs"],
	argTypes: {
		cols: {
			control: "select",
			options: [1, 2, 3, 4, 5, 6, 12, "none"],
		},
		gap: {
			control: "select",
			options: [0, 1, 2, 4, 8, 16],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
	args: {
		cols: 3,
		gap: 4,
		children: (
			<>
				<div className="bg-primary/20 p-4 rounded text-center">1</div>
				<div className="bg-primary/20 p-4 rounded text-center">2</div>
				<div className="bg-primary/20 p-4 rounded text-center">3</div>
				<div className="bg-primary/20 p-4 rounded text-center">4</div>
				<div className="bg-primary/20 p-4 rounded text-center">5</div>
				<div className="bg-primary/20 p-4 rounded text-center">6</div>
			</>
		),
	},
};

export const WithSpans: Story = {
	render: () => (
		<Grid cols={12} gap={4}>
			<GridItem colSpan={12} className="bg-primary/20 p-4 rounded text-center">
				Header (12)
			</GridItem>
			<GridItem colSpan={4} className="bg-primary/20 p-4 rounded text-center">
				Sidebar (4)
			</GridItem>
			<GridItem colSpan={8} className="bg-primary/20 p-4 rounded text-center">
				Content (8)
			</GridItem>
			<GridItem colSpan={12} className="bg-primary/20 p-4 rounded text-center">
				Footer (12)
			</GridItem>
		</Grid>
	),
};

export const Responsive: Story = {
	render: () => (
		<Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" gap={4}>
			<div className="bg-primary/20 p-4 rounded text-center">1</div>
			<div className="bg-primary/20 p-4 rounded text-center">2</div>
			<div className="bg-primary/20 p-4 rounded text-center">3</div>
			<div className="bg-primary/20 p-4 rounded text-center">4</div>
		</Grid>
	),
};
