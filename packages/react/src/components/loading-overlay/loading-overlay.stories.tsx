import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../button";
import { LoadingOverlay } from "./loading-overlay";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    visible: { control: "boolean" },
    zIndex: { control: "number" },
    transitionDuration: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

const LoadingOverlayDemo = (props: React.ComponentProps<typeof LoadingOverlay>) => {
  const [visible, setVisible] = React.useState(false);

  // Toggle visible state for demo
  const toggle = () => setVisible((v) => !v);

  return (
    <div className="relative w-80 h-40 border rounded p-4 flex flex-col items-center justify-center gap-4 overflow-hidden">
      <div className="text-center">
        <p className="font-medium mb-2">Form or Content</p>
        <p className="text-sm text-gray-500 mb-4">
          This content will be covered by the overlay
        </p>
        <Button onClick={toggle} size="sm">
          {visible ? "Hide Overlay" : "Show Overlay"}
        </Button>
      </div>
      <LoadingOverlay
        visible={visible}
        zIndex={10}
        {...props}
        // Override visible prop from story controls if needed, but allow story controls to work too
        // if user passes visible prop explicitly in story args, it will override local state in story render
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <LoadingOverlayDemo {...args} />,
  args: {
    overlayProps: { radius: "sm", blur: 2 },
  },
};

export const CustomLoader: Story = {
  render: (args) => <LoadingOverlayDemo {...args} />,
  args: {
    loaderProps: {
      children: (
        <div className="bg-white p-3 rounded shadow-lg text-sm font-medium">
          Loading custom content...
        </div>
      ),
    },
    overlayProps: { color: "rgba(0,0,0,0.4)", blur: 1 },
  },
};

export const WithTransition: Story = {
  render: (args) => <LoadingOverlayDemo {...args} />,
  args: {
    transitionDuration: 500,
    overlayProps: { radius: "sm", blur: 2 },
  },
};
