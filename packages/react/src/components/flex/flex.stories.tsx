import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./flex";

const meta: Meta<typeof Flex> = {
  title: "Components/Flex",
  component: Flex,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "column", "rowReverse", "columnReverse"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "baseline", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    gap: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Flex>;

const items = [
  <div key="1" className="bg-primary text-primary-foreground p-4 rounded-md">Item 1</div>,
  <div key="2" className="bg-secondary text-secondary-foreground p-4 rounded-md">Item 2</div>,
  <div key="3" className="bg-accent text-accent-foreground p-4 rounded-md">Item 3</div>,
];

export const Default: Story = {
  args: {
    children: items,
    gap: 4,
  },
};

export const Column: Story = {
  args: {
    direction: "column",
    gap: 4,
    children: items,
  },
};

export const JustifyBetween: Story = {
  args: {
    justify: "between",
    children: items,
    className: "w-full border p-4",
  },
};
