import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Box } from "../box";
import { Flex } from "../flex";
import { Stack } from "../stack";
import { Skeleton } from "../skeleton";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
	title: "Buttons/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onClick: fn(),
	},
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
				"info",
				"light",
				"dark",
				"link",
				"ghost",
				"outline",
				"outline-primary",
				"outline-secondary",
				"outline-success",
				"outline-warning",
				"outline-danger",
				"outline-info",
				"outline-light",
				"outline-dark",
			],
		},
		size: {
			control: "select",
			options: ["default", "xs", "sm", "lg", "icon"],
		},
		fullWidth: {
			control: "boolean",
		},
		rounded: {
			control: "boolean",
		},
		isLoading: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: "Button",
	},
};

export const Variants: Story = {
	render: (args) => (
		<Stack gap={4}>
			<Flex wrap="wrap" gap={2}>
				<Button {...args} variant="primary">
					Primary
				</Button>
				<Button {...args} variant="secondary">
					Secondary
				</Button>
				<Button {...args} variant="success">
					Success
				</Button>
				<Button {...args} variant="warning">
					Warning
				</Button>
				<Button {...args} variant="danger">
					Danger
				</Button>
				<Button {...args} variant="info">
					Info
				</Button>
				<Button {...args} variant="light">
					Light
				</Button>
				<Button {...args} variant="dark">
					Dark
				</Button>
				<Button {...args} variant="link">
					Link
				</Button>
				<Button {...args} variant="ghost">
					Ghost
				</Button>
			</Flex>
		</Stack>
	),
};

export const OutlineVariants: Story = {
	render: (args) => (
		<Stack gap={4}>
			<Flex wrap="wrap" gap={2}>
				<Button {...args} variant="outline">
					Default Outline
				</Button>
				<Button {...args} variant="outline-primary">
					Primary
				</Button>
				<Button {...args} variant="outline-secondary">
					Secondary
				</Button>
				<Button {...args} variant="outline-success">
					Success
				</Button>
				<Button {...args} variant="outline-warning">
					Warning
				</Button>
				<Button {...args} variant="outline-danger">
					Danger
				</Button>
				<Button {...args} variant="outline-info">
					Info
				</Button>
				<Button {...args} variant="outline-light">
					Light
				</Button>
				<Button {...args} variant="outline-dark">
					Dark
				</Button>
			</Flex>
		</Stack>
	),
};

export const Sizes: Story = {
	render: (args) => (
		<Flex align="center" gap={2}>
			<Button {...args} size="xs">
				Extra Small
			</Button>
			<Button {...args} size="sm">
				Small
			</Button>
			<Button {...args} size="default">
				Default
			</Button>
			<Button {...args} size="lg">
				Large
			</Button>
			<Button {...args} size="icon">
				<Box as="span" className="h-4 w-4">
					🚀
				</Box>
			</Button>
		</Flex>
	),
};

export const States: Story = {
	render: (args) => (
		<Flex wrap="wrap" gap={2}>
			<Button {...args}>Normal</Button>
			<Button {...args} disabled>
				Disabled
			</Button>
			<Button {...args} isLoading>
				Loading
			</Button>
		</Flex>
	),
};

export const Shapes: Story = {
	render: (args) => (
		<Flex wrap="wrap" gap={2}>
			<Button {...args}>Default</Button>
			<Button {...args} rounded>
				Rounded Pill
			</Button>
		</Flex>
	),
};

export const FullWidth: Story = {
	args: {
		fullWidth: true,
		children: "Full Width Button",
	},
	parameters: {
		layout: "padded",
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<Flex wrap="wrap" gap={2}>
			<Skeleton className="h-10 w-24 rounded-md" />
			<Skeleton className="h-10 w-32 rounded-md" />
			<Skeleton className="h-10 w-28 rounded-md" />
		</Flex>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for buttons while content is loading.",
			},
		},
	},
};
