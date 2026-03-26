import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Rating } from "./rating";

const meta = {
	title: "Forms/Rating",
	component: Rating,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = React.useState(3);
		return (
			<div className="flex flex-col items-center gap-2">
				<Rating value={value} onChange={setValue} aria-label="Product rating" />
				<span className="text-sm text-muted-foreground">Rating: {value}</span>
			</div>
		);
	},
};

export const ReadOnly: Story = {
	render: () => <Rating value={4} readOnly aria-label="Average rating" />,
};

export const HalfStars: Story = {
	render: () => {
		const [value, setValue] = React.useState(2.5);
		return (
			<div className="flex flex-col items-center gap-2">
				<Rating
					value={value}
					onChange={setValue}
					allowHalf
					aria-label="Half-star rating"
				/>
				<span className="text-sm text-muted-foreground">Rating: {value}</span>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => <Rating value={3} disabled aria-label="Disabled rating" />,
};

export const DifferentSizes: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4">
			<Rating defaultValue={3} size="sm" aria-label="Small rating" />
			<Rating defaultValue={3} size="default" aria-label="Default rating" />
			<Rating defaultValue={3} size="lg" aria-label="Large rating" />
		</div>
	),
};
