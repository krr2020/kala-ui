import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Collapse } from "./collapse";

const meta: Meta<typeof Collapse> = {
	title: "Data Display/Collapse",
	component: Collapse,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		transitionDuration: { control: "number" },
		animateOpacity: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Collapse>;

function CollapseDemo({
	transitionDuration,
	animateOpacity,
}: {
	transitionDuration?: number;
	animateOpacity?: boolean;
}) {
	const [opened, setOpened] = useState(true);
	return (
		<div className="w-[350px] space-y-2">
			<Button variant="outline" onClick={() => setOpened((o) => !o)}>
				{opened ? "Collapse" : "Expand"}
			</Button>
			<Collapse
				in={opened}
				id="collapse-story-region"
				transitionDuration={transitionDuration}
				animateOpacity={animateOpacity}
			>
				<div className="rounded-md border px-4 py-3 text-sm">
					The collapsible region animates its height (and optionally opacity)
					between 0 and auto, keeping content in the DOM flow for
					aria-controls-aware consumers.
				</div>
			</Collapse>
		</div>
	);
}

export const Default: Story = {
	render: () => <CollapseDemo />,
};

export const SlowFade: Story = {
	render: () => (
		<CollapseDemo transitionDuration={0.6} animateOpacity={true} />
	),
};

export const HeightOnly: Story = {
	render: () => (
		<CollapseDemo transitionDuration={0.4} animateOpacity={false} />
	),
};
