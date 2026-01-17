import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { PasswordStrengthIndicator } from "./password-strength-indicator";

const meta = {
	title: "Application/PasswordStrengthIndicator",
	component: PasswordStrengthIndicator,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof PasswordStrengthIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VeryWeak: Story = {
	args: {
		password: "abc",
	},
};

export const Weak: Story = {
	args: {
		password: "password",
	},
};

export const Fair: Story = {
	args: {
		password: "password123",
	},
};

export const Good: Story = {
	args: {
		password: "Password123",
	},
};

export const Strong: Story = {
	args: {
		password: "P@ssw0rd123!",
	},
};

export const Empty: Story = {
	args: {
		password: "",
	},
};

export const Interactive: Story = {
	args: {
		password: "",
	},
	render: () => {
		const [password, setPassword] = useState("");
		return (
			<div className="w-80 space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Enter a password"
				/>
				<PasswordStrengthIndicator password={password} />
			</div>
		);
	},
};

export const AllStrengthLevels: Story = {
	args: {
		password: "",
	},
	render: () => (
		<div className="w-80 space-y-6">
			<div>
				<p className="text-sm font-medium mb-2">Very Weak (1 character)</p>
				<PasswordStrengthIndicator password="a" />
			</div>
			<div>
				<p className="text-sm font-medium mb-2">Weak (8+ characters)</p>
				<PasswordStrengthIndicator password="password" />
			</div>
			<div>
				<p className="text-sm font-medium mb-2">Fair (8+ chars, numbers)</p>
				<PasswordStrengthIndicator password="password123" />
			</div>
			<div>
				<p className="text-sm font-medium mb-2">
					Good (8+ chars, mixed case, numbers)
				</p>
				<PasswordStrengthIndicator password="Password123" />
			</div>
			<div>
				<p className="text-sm font-medium mb-2">
					Strong (12+ chars, mixed case, numbers, symbols)
				</p>
				<PasswordStrengthIndicator password="P@ssw0rd123!" />
			</div>
		</div>
	),
};
