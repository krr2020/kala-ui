import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";
import { Skeleton } from "../skeleton/skeleton";
import { Textarea } from "../textarea";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSeparator,
} from "./field";

const meta = {
	title: "Forms/Field",
	component: Field,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	render: () => (
		<Field className="w-80">
			<FieldLabel>Username</FieldLabel>
			<Input placeholder="Enter your username" />
			<FieldDescription>This is your public display name.</FieldDescription>
		</Field>
	),
};

export const WithError: Story = {
	args: {},
	render: () => (
		<Field className="w-80">
			<FieldLabel>Email</FieldLabel>
			<Input type="email" placeholder="Enter your email" aria-invalid />
			<FieldError>Please enter a valid email address</FieldError>
		</Field>
	),
};

export const WithMultipleErrors: Story = {
	args: {},
	render: () => (
		<Field className="w-80">
			<FieldLabel>Password</FieldLabel>
			<Input type="password" placeholder="Enter password" aria-invalid />
			<FieldError>
				{[
					"Password must be at least 8 characters",
					"Password must contain at least one number",
					"Password must contain at least one special character",
				]}
			</FieldError>
		</Field>
	),
};

export const WithSeparator: Story = {
	args: {},
	render: () => (
		<Field className="w-80">
			<FieldLabel>Bio</FieldLabel>
			<FieldSeparator />
			<Textarea placeholder="Tell us about yourself" />
			<FieldDescription>
				Brief description for your profile. Max 280 characters.
			</FieldDescription>
		</Field>
	),
};

export const Horizontal: Story = {
	args: {},
	render: () => (
		<Field orientation="horizontal" className="w-full max-w-md">
			<FieldLabel>Full Name</FieldLabel>
			<div className="flex-1">
				<Input placeholder="John Doe" />
				<FieldDescription>Enter your full legal name.</FieldDescription>
			</div>
		</Field>
	),
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md space-y-2">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-3 w-48" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for form fields while loading.",
			},
		},
	},
};
