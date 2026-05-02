import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TimePicker } from "./time-picker";

const meta: Meta<typeof TimePicker> = {
	title: "Forms/TimePicker",
	component: TimePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onChange: fn(),
	},
	argTypes: {
		hourCycle: {
			control: "select",
			options: [12, 24],
		},
		showSeconds: { control: "boolean" },
		disabled: { control: "boolean" },
		hasError: { control: "boolean" },
		isLoading: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
	args: {
		defaultValue: { hours: 9, minutes: 30 },
	},
};

export const TwelveHour: Story = {
	args: {
		defaultValue: { hours: 14, minutes: 45 },
		hourCycle: 12,
	},
};

export const WithSeconds: Story = {
	args: {
		defaultValue: { hours: 8, minutes: 0, seconds: 30 },
		showSeconds: true,
	},
};

export const TwelveHourWithSeconds: Story = {
	args: {
		defaultValue: { hours: 14, minutes: 30, seconds: 0 },
		hourCycle: 12,
		showSeconds: true,
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: { hours: 12, minutes: 0 },
		disabled: true,
	},
};

export const ErrorState: Story = {
	args: {
		defaultValue: { hours: 0, minutes: 0 },
		hasError: true,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
