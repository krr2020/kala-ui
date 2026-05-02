import type { Meta, StoryObj } from "@storybook/react";
import { TagIcon } from "lucide-react";
import { Tag } from "./tag";

const meta = {
	title: "Display/Tag",
	component: Tag,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Tag>Default</Tag>,
};

export const Filled: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag variant="filled" color="default">
				Default
			</Tag>
			<Tag variant="filled" color="primary">
				Primary
			</Tag>
			<Tag variant="filled" color="secondary">
				Secondary
			</Tag>
			<Tag variant="filled" color="success">
				Success
			</Tag>
			<Tag variant="filled" color="warning">
				Warning
			</Tag>
			<Tag variant="filled" color="error">
				Error
			</Tag>
			<Tag variant="filled" color="info">
				Info
			</Tag>
		</div>
	),
};

export const Outline: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag variant="outline" color="default">
				Default
			</Tag>
			<Tag variant="outline" color="primary">
				Primary
			</Tag>
			<Tag variant="outline" color="secondary">
				Secondary
			</Tag>
			<Tag variant="outline" color="success">
				Success
			</Tag>
			<Tag variant="outline" color="warning">
				Warning
			</Tag>
			<Tag variant="outline" color="error">
				Error
			</Tag>
			<Tag variant="outline" color="info">
				Info
			</Tag>
		</div>
	),
};

export const Soft: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag variant="soft" color="default">
				Default
			</Tag>
			<Tag variant="soft" color="primary">
				Primary
			</Tag>
			<Tag variant="soft" color="secondary">
				Secondary
			</Tag>
			<Tag variant="soft" color="success">
				Success
			</Tag>
			<Tag variant="soft" color="warning">
				Warning
			</Tag>
			<Tag variant="soft" color="error">
				Error
			</Tag>
			<Tag variant="soft" color="info">
				Info
			</Tag>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Tag size="sm">Small</Tag>
			<Tag size="default">Default</Tag>
			<Tag size="lg">Large</Tag>
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag icon={<TagIcon />} color="primary">
				Primary
			</Tag>
			<Tag icon={<TagIcon />} variant="outline" color="success">
				Success
			</Tag>
			<Tag icon={<TagIcon />} variant="filled" color="info">
				Info
			</Tag>
		</div>
	),
};

export const Removable: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag onRemove={() => {}}>Default</Tag>
			<Tag variant="outline" color="primary" onRemove={() => {}}>
				Primary
			</Tag>
			<Tag variant="filled" color="success" onRemove={() => {}}>
				Success
			</Tag>
		</div>
	),
};

export const WithIconAndRemove: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Tag icon={<TagIcon />} onRemove={() => {}}>
				With Icon
			</Tag>
			<Tag
				variant="outline"
				color="primary"
				icon={<TagIcon />}
				onRemove={() => {}}
			>
				Primary
			</Tag>
			<Tag
				variant="filled"
				color="error"
				icon={<TagIcon />}
				onRemove={() => {}}
			>
				Error
			</Tag>
		</div>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{(["filled", "outline", "soft"] as const).map((variant) => (
				<div key={variant} className="flex flex-col gap-2">
					<span className="text-sm font-medium capitalize text-muted-foreground">
						{variant}
					</span>
					<div className="flex flex-wrap gap-2">
						{(
							[
								"default",
								"primary",
								"secondary",
								"success",
								"warning",
								"error",
								"info",
							] as const
						).map((color) => (
							<Tag
								key={color}
								variant={variant}
								color={color}
								icon={<TagIcon />}
								onRemove={() => {}}
							>
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</Tag>
						))}
					</div>
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"All variant, color, and feature combinations of the Tag component.",
			},
		},
	},
};
