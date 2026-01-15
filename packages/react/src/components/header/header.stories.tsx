import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "../button";
import { Header } from "./header";

const meta: Meta<typeof Header> = {
	title: "Application/Header",
	component: Header,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		onMobileMenuToggle: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
	args: {
		logo: (
			<div className="flex items-center gap-2">
				<div className="w-8 h-8 bg-primary rounded-md" />
				<span className="text-lg font-bold">Logo</span>
			</div>
		),
		navLinks: [
			{ label: "Home", href: "/", active: true },
			{ label: "About", href: "/about" },
			{ label: "Services", href: "/services" },
			{ label: "Contact", href: "/contact" },
		],
	},
};

export const WithUserMenu: Story = {
	args: {
		logo: (
			<div className="flex items-center gap-2">
				<div className="w-8 h-8 bg-primary rounded-md" />
				<span className="text-lg font-bold">Logo</span>
			</div>
		),
		navLinks: [
			{ label: "Home", href: "/", active: true },
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Profile", href: "/profile" },
		],
		userMenu: (
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="sm">
					Sign In
				</Button>
				<Button size="sm">Register</Button>
			</div>
		),
	},
};

export const MobileMenuOpen: Story = {
	args: {
		logo: (
			<div className="flex items-center gap-2">
				<div className="w-8 h-8 bg-primary rounded-md" />
				<span className="text-lg font-bold">Logo</span>
			</div>
		),
		navLinks: [
			{ label: "Home", href: "/", active: true },
			{ label: "About", href: "/about" },
			{ label: "Services", href: "/services" },
			{ label: "Contact", href: "/contact" },
		],
		userMenu: (
			<div className="flex flex-col gap-2">
				<Button variant="ghost" size="sm">
					Sign In
				</Button>
				<Button size="sm">Register</Button>
			</div>
		),
		isMobileMenuOpen: true,
	},
};

export const MinimalLogo: Story = {
	args: {
		logo: <span className="text-2xl font-bold text-primary">Brand</span>,
		navLinks: [
			{ label: "Features", href: "/features" },
			{ label: "Pricing", href: "/pricing" },
			{ label: "Blog", href: "/blog" },
		],
	},
};
