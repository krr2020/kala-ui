import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
	SocialLoginButtons,
	type SocialLoginButtonsProps,
} from "./social-login-buttons";

const meta = {
	title: "Application/SocialLoginButtons",
	component: SocialLoginButtons,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onProviderClick: {
			action: "provider-clicked",
		},
	},
} satisfies Meta<typeof SocialLoginButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
	},
};

export const WithDivider: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		showDivider: true,
	},
};

export const WithoutDivider: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		showDivider: false,
	},
};

export const GoogleOnly: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		providers: ["google"],
		showDivider: true,
	},
};

export const GoogleAndGitHub: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		providers: ["google", "github"],
		showDivider: true,
	},
};

export const LoadingGoogle: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		loadingProvider: "google",
	},
};

export const Interactive: Story = {
	args: {
		onProviderClick: () => {},
	},
	render: () => {
		const [loadingProvider, setLoadingProvider] =
			useState<SocialLoginButtonsProps["loadingProvider"]>();

		const handleProviderClick = (
			provider: NonNullable<SocialLoginButtonsProps["providers"]>[0],
		) => {
			setLoadingProvider(provider);
			console.log("Provider clicked:", provider);
			// Simulate OAuth redirect delay
			setTimeout(() => setLoadingProvider(undefined), 2000);
		};

		return (
			<div className="w-96">
				<SocialLoginButtons
					onProviderClick={handleProviderClick}
					{...(loadingProvider && { loadingProvider })}
				/>
			</div>
		);
	},
};

export const CustomProviders: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		providers: ["github", "google", "linkedin"],
		showDivider: true,
	},
};

export const InForm: Story = {
	args: {
		onProviderClick: () => {},
	},
	render: () => (
		<div className="w-96 space-y-6 p-6 border rounded-lg bg-card text-card-foreground theme-card">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
				<p className="text-sm text-muted-foreground">
					Welcome back! Please sign in to continue.
				</p>
			</div>
			<SocialLoginButtons
				onProviderClick={(provider) =>
					console.log("Provider clicked:", provider)
				}
				showDivider={false}
			/>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-2 text-muted-foreground">
						Or continue with email
					</span>
				</div>
			</div>
			<div className="text-center text-sm text-muted-foreground">
				Email sign-in form would go here
			</div>
		</div>
	),
};

export const Registration: Story = {
	args: {
		onProviderClick: (provider) => console.log("Provider clicked:", provider),
		dividerText: "Or register with",
	},
	render: (args) => (
		<div className="w-96 space-y-6 p-6 border rounded-lg bg-card text-card-foreground theme-card">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">Create an account</h2>
				<p className="text-sm text-muted-foreground">
					Join us today to get started.
				</p>
			</div>
			<SocialLoginButtons {...args} />
			<div className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<span className="text-primary font-medium">Log in</span>
			</div>
		</div>
	),
};
