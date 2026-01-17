import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  title: "Components/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["column", "columnReverse"],
    },
    gap: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "baseline", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="w-20 h-20 bg-primary rounded" />
        <div className="w-20 h-20 bg-secondary rounded" />
        <div className="w-20 h-20 bg-accent rounded" />
      </>
    ),
    gap: 4,
  },
};

export const Reverse: Story = {
  args: {
    ...Default.args,
    direction: "columnReverse",
  },
};

export const Vertical: Story = {
  args: {
    ...Default.args,
    direction: "column",
  },
};
