import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./container";

const meta: Meta<typeof Container> = {
    title: "Components/Container",
    component: Container,
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl", "2xl", "full"],
        },
        centered: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
    args: {
        children: (
            <div className="bg-accent p-4 rounded-md">
                This is inside a container with default (xl) size.
            </div>
        ),
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: (
            <div className="bg-accent p-4 rounded-md">
                This is a small container.
            </div>
        ),
    },
};

export const Centered: Story = {
    args: {
        centered: true,
        children: (
            <div className="bg-accent p-4 rounded-md text-center">
                This content is centered within the container.
            </div>
        ),
    },
};
