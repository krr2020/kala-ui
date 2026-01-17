import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Mail, Search, User } from "lucide-react";
import { Skeleton } from "../skeleton";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
	title: "Forms/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		placeholder: "Enter text...",
	},
};

export const WithValue: Story = {
	args: {
		value: "Hello World",
		placeholder: "Enter text...",
	},
};

/**
 * Password input with visibility toggle button.
 * Click the eye icon to show/hide the password.
 */
export const Password: Story = {
	args: {
		type: "password",
		placeholder: "Enter password...",
		showPasswordToggle: true,
	},
};

/**
 * Password input without visibility toggle.
 */
export const PasswordNoToggle: Story = {
	args: {
		type: "password",
		placeholder: "Enter password...",
		showPasswordToggle: false,
	},
};

export const Email: Story = {
	args: {
		type: "email",
		placeholder: "Enter email...",
	},
};

/**
 * Input with a prefix icon.
 */
export const WithPrefixIcon: Story = {
	args: {
		placeholder: "Search...",
		prefixIcon: <Search className="h-4 w-4" />,
	},
};

/**
 * Input with a suffix icon.
 */
export const WithSuffixIcon: Story = {
	args: {
		type: "email",
		placeholder: "Enter email...",
		suffixIcon: <Mail className="h-4 w-4" />,
	},
};

/**
 * Input with both prefix and password toggle.
 */
export const PasswordWithIcon: Story = {
	args: {
		type: "password",
		placeholder: "Enter password...",
		showPasswordToggle: true,
		prefixIcon: <User className="h-4 w-4" />,
	},
};

/**
 * Input with error state styling.
 */
export const WithError: Story = {
	args: {
		placeholder: "Enter text...",
		hasError: true,
		value: "Invalid value",
	},
};

/**
 * Input with success state styling.
 */
export const WithSuccess: Story = {
	args: {
		placeholder: "Enter text...",
		hasSuccess: true,
		value: "Valid value",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: "Disabled input",
	},
};

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		value: "Read-only value",
	},
};

export const File: Story = {
	args: {
		type: "file",
	},
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for input fields while form is loading.",
			},
		},
	},
};
