import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Overlay } from "./overlay";

const meta: Meta<typeof Overlay> = {
  title: "Components/Overlay",
  component: Overlay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
    backgroundOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    blur: { control: { type: "range", min: 0, max: 20, step: 1 } },
    zIndex: { control: { type: "number" } },
    radius: { control: { type: "number" } },
    fixed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Overlay>;

export const Default: Story = {
  render: (args) => (
    <div className="relative h-40 w-80 bg-gray-100 flex items-center justify-center">
      <div className="text-gray-700 font-medium">Content under overlay</div>
      <Overlay {...args} />
    </div>
  ),
  args: {
    backgroundOpacity: 0.6,
    blur: 0,
  },
};

export const WithBlur: Story = {
  render: (args) => (
    <div className="relative h-40 w-80 bg-gray-100 flex items-center justify-center">
      <div className="text-gray-700 font-medium">Content under blur</div>
      <Overlay {...args} />
    </div>
  ),
  args: {
    backgroundOpacity: 0.6,
    blur: 2,
  },
};

export const Gradient: Story = {
  render: (args) => (
    <div className="relative h-40 w-80 bg-gray-100 flex items-center justify-center">
      <div className="text-gray-700 font-medium">Content under gradient</div>
      <Overlay {...args} />
    </div>
  ),
  args: {
    gradient: "linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)",
  },
};

export const WithContent: Story = {
  render: (args) => (
    <div className="relative h-40 w-80 bg-gray-100">
      <div className="p-4 text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
      <Overlay {...args} className="flex items-center justify-center">
        <Button variant="secondary">Overlay Action</Button>
      </Overlay>
    </div>
  ),
  args: {
    backgroundOpacity: 0.8,
    color: "#000",
  },
};
