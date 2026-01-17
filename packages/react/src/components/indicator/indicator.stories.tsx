import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Indicator } from "./indicator";

const meta: Meta<typeof Indicator> = {
  title: "Components/Indicator",
  component: Indicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "danger",
        "success",
        "warning",
        "info",
      ],
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "middle-left",
        "middle-center",
        "middle-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
    size: {
      control: { type: "number", min: 6, max: 30, step: 2 },
    },
    offset: {
      control: { type: "number", min: -20, max: 20, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Indicator>;

export const Default: Story = {
  args: {
    children: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: "New",
    size: 16,
    children: (
      <div className="w-12 h-12 bg-gray-200 rounded-md" />
    ),
  },
};

export const Processing: Story = {
  args: {
    processing: true,
    children: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <Indicator position="top-left">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="top-center">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="top-right">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="middle-left">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="middle-center">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="middle-right">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="bottom-left">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="bottom-center">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
      <Indicator position="bottom-right">
        <div className="w-12 h-12 bg-gray-200" />
      </Indicator>
    </div>
  ),
};

export const Inline: Story = {
  args: {
    inline: true,
    label: "New",
    size: 16,
    children: <span>Label with indicator</span>,
    position: "middle-right",
  },
};
