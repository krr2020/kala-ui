import type { Meta, StoryObj } from "@storybook/react";
import { Code } from "./code";

const meta: Meta<typeof Code> = {
	title: "Components/Code",
	component: Code,
	tags: ["autodocs"],
	argTypes: {
		block: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof Code>;

export const Inline: Story = {
	args: {
		children: "npm install @kala-ui/react",
	},
};

export const Block: Story = {
	args: {
		block: true,
		children: `import { Button } from '@kala-ui/react';

function App() {
  return <Button>Click me</Button>;
}`,
	},
};

export const CustomColor: Story = {
	args: {
		children: "console.log('Hello world')",
		color: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100",
	},
};
