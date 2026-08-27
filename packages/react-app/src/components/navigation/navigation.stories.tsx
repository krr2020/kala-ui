import type { Meta, StoryObj } from "@storybook/react";
import { Navigation } from "./navigation";

const meta: Meta<typeof Navigation> = {
	title: "Application/Navigation",
	component: Navigation,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "Orientation of the navigation",
		},
		mobileLayout: {
			control: "select",
			options: ["dropdown", "vertical"],
			description: "Mobile layout style",
		},
		pathname: {
			control: "text",
			description: "Current pathname for active link detection",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Navigation>;

const publicLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Services", href: "/services" },
	{ label: "Contact", href: "/contact" },
];

const adminLinks = [
	{ label: "Dashboard", href: "/dashboard" },
	{ label: "Users", href: "/users" },
	{ label: "Roles", href: "/roles" },
	{ label: "Settings", href: "/settings" },
];

export const HorizontalDefault: Story = {
	args: {
		links: publicLinks,
		pathname: "/",
		orientation: "horizontal",
		mobileLayout: "dropdown",
	},
};

export const HorizontalWithActiveLink: Story = {
	args: {
		links: publicLinks,
		pathname: "/about",
		orientation: "horizontal",
		mobileLayout: "dropdown",
	},
};

export const VerticalSidebar: Story = {
	args: {
		links: adminLinks,
		pathname: "/dashboard",
		orientation: "vertical",
	},
};

export const MobileVerticalLayout: Story = {
	args: {
		links: publicLinks,
		pathname: "/services",
		mobileLayout: "vertical",
	},
};

export const ManyLinks: Story = {
	args: {
		links: [
			{ label: "Home", href: "/" },
			{ label: "About", href: "/about" },
			{ label: "Services", href: "/services" },
			{ label: "Portfolio", href: "/portfolio" },
			{ label: "Blog", href: "/blog" },
			{ label: "Contact", href: "/contact" },
			{ label: "FAQ", href: "/faq" },
			{ label: "Support", href: "/support" },
		],
		pathname: "/portfolio",
		orientation: "horizontal",
	},
};

export const CustomStyling: Story = {
	args: {
		links: publicLinks,
		pathname: "/",
		className: "bg-muted p-4 rounded-lg",
	},
};
