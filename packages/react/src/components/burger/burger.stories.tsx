import { useDisclosure } from "@kala-ui/react-hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "../flex";
import { Burger } from "./burger";

const meta: Meta<typeof Burger> = {
	title: "Components/Burger",
	component: Burger,
	tags: ["autodocs"],
	argTypes: {
		opened: { control: "boolean" },
		size: {
			control: { type: "select" },
			options: ["xs", "sm", "md", "lg", "xl"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Burger>;

export const Default: Story = {
	args: {
		opened: false,
	},
};

export const Interactive: Story = {
	render: () => {
		const [opened, { toggle }] = useDisclosure(false);
		return <Burger opened={opened} onClick={toggle} />;
	},
};

export const Sizes: Story = {
	render: () => (
		<Flex align="center" gap={4}>
			<Burger size="xs" />
			<Burger size="sm" />
			<Burger size="md" />
			<Burger size="lg" />
			<Burger size="xl" />
		</Flex>
	),
};
