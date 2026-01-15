import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "./input-otp";

const meta: Meta<typeof InputOTP> = {
	title: "Forms/InputOtp",
	component: InputOTP,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		maxLength: 6,
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
	render: (args) => (
		<InputOTP {...args}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
};

export const WithSeparator: Story = {
	render: (args) => (
		<InputOTP {...args}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
};

export const Pattern: Story = {
	args: {
		maxLength: 6,
		pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
	},
	render: (args) => (
		<InputOTP {...args}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
};

export const Disabled: Story = {
	args: {
		maxLength: 6,
		disabled: true,
		value: "123456",
	},
	render: (args) => (
		<InputOTP {...args}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
};
