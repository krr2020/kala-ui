import type { Meta, StoryObj } from "@storybook/react";
import { SocialLoginButton } from "./social-login-button";

const meta = {
	title: "Application/SocialLoginButton",
	component: SocialLoginButton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		provider: {
			control: "select",
			options: ["google", "github", "facebook", "twitter", "linkedin"],
		},
		onClick: {
			action: "clicked",
		},
	},
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {
	args: {
		provider: "google",
	},
};

export const GitHub: Story = {
	args: {
		provider: "github",
	},
};

export const Facebook: Story = {
	args: {
		provider: "facebook",
	},
};

export const Twitter: Story = {
	args: {
		provider: "twitter",
	},
};

export const LinkedIn: Story = {
	args: {
		provider: "linkedin",
	},
};

export const GoogleLoading: Story = {
	args: {
		provider: "google",
		isLoading: true,
	},
};

export const CustomLabel: Story = {
	args: {
		provider: "github",
		label: "Sign in with GitHub",
	},
};

export const Disabled: Story = {
	args: {
		provider: "google",
		disabled: true,
	},
};

export const AllProviders: Story = {
	args: {
		provider: "google",
	},
	render: () => (
		<div className="flex flex-wrap gap-3 w-80">
			<SocialLoginButton
				provider="google"
				onClick={() => console.log("Google clicked")}
			/>
			<SocialLoginButton
				provider="github"
				onClick={() => console.log("GitHub clicked")}
			/>
			<SocialLoginButton
				provider="facebook"
				onClick={() => console.log("Facebook clicked")}
			/>
			<SocialLoginButton
				provider="twitter"
				onClick={() => console.log("Twitter clicked")}
			/>
			<SocialLoginButton
				provider="linkedin"
				onClick={() => console.log("LinkedIn clicked")}
			/>
		</div>
	),
};

export const LoadingStates: Story = {
	args: {
		provider: "google",
	},
	render: () => (
		<div className="flex flex-wrap gap-3 w-80">
			<SocialLoginButton provider="google" isLoading />
			<SocialLoginButton provider="github" isLoading />
			<SocialLoginButton provider="facebook" isLoading />
		</div>
	),
};
