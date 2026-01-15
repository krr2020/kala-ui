import type { Meta, StoryObj } from "@storybook/react";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
	title: "Application/Footer",
	component: Footer,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Footer>;

const productLinks = {
	title: "Product",
	links: [
		{ label: "Features", href: "/features" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "FAQ", href: "/faq" },
		{ label: "Roadmap", href: "/roadmap" },
	],
};

const companyLinks = {
	title: "Company",
	links: [
		{ label: "About", href: "/about" },
		{ label: "Blog", href: "/blog" },
		{ label: "Careers", href: "/careers" },
		{ label: "Contact", href: "/contact" },
	],
};

const resourcesLinks = {
	title: "Resources",
	links: [
		{ label: "Documentation", href: "/docs" },
		{ label: "API Reference", href: "/api" },
		{ label: "Community", href: "/community" },
		{ label: "Support", href: "/support" },
	],
};

const legalLinks = {
	title: "Legal",
	links: [
		{ label: "Privacy Policy", href: "/privacy" },
		{ label: "Terms of Service", href: "/terms" },
		{ label: "Cookie Policy", href: "/cookies" },
	],
};

const socialLinks = [
	{
		name: "X",
		href: "https://x.com",
		icon: <Twitter className="w-5 h-5" />,
	},
	{
		name: "GitHub",
		href: "https://github.com",
		icon: <Github className="w-5 h-5" />,
	},
	{
		name: "LinkedIn",
		href: "https://linkedin.com",
		icon: <Linkedin className="w-5 h-5" />,
	},
	{
		name: "YouTube",
		href: "https://youtube.com",
		icon: <Youtube className="w-5 h-5" />,
	},
];

export const Default: Story = {
	args: {
		linkSections: [productLinks, companyLinks],
		socialLinks: socialLinks.slice(0, 2),
		copyright: "© 2025 Your Company. All rights reserved.",
	},
};

export const FourColumns: Story = {
	args: {
		linkSections: [productLinks, companyLinks, resourcesLinks, legalLinks],
		socialLinks,
		copyright: "© 2025 Your Company. All rights reserved.",
	},
};

export const WithNewsletter: Story = {
	args: {
		linkSections: [productLinks, companyLinks, resourcesLinks],
		socialLinks,
		copyright: "© 2025 Your Company. All rights reserved.",
		children: (
			<div>
				<h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
					Newsletter
				</h3>
				<p className="text-muted-foreground text-sm mb-4">
					Subscribe to our newsletter for updates and exclusive content.
				</p>
				<div className="flex flex-col sm:flex-row gap-2">
					<Input
						type="email"
						placeholder="Enter your email"
						className="flex-1"
					/>
					<Button type="button" className="whitespace-nowrap">
						Subscribe
					</Button>
				</div>
			</div>
		),
	},
};

export const Centered: Story = {
	args: {
		centered: true,
		linkSections: [productLinks, companyLinks, resourcesLinks],
		socialLinks,
		copyright: "© 2025 Your Company. All rights reserved.",
		children: (
			<div className="flex flex-col items-center w-full max-w-2xl mx-auto">
				<h3 className="text-foreground font-semibold text-xl mb-4">
					Subscribe to our newsletter
				</h3>
				<p className="text-muted-foreground text-base mb-6 text-center max-w-md">
					Stay updated with our latest news and products. No spam, unsubscribe
					at any time.
				</p>
				<div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
					<Input
						type="email"
						placeholder="Enter your email"
						className="flex-1"
					/>
					<Button type="button" className="whitespace-nowrap">
						Subscribe
					</Button>
				</div>
			</div>
		),
	},
};

export const MinimalFooter: Story = {
	args: {
		linkSections: [
			{
				title: "Quick Links",
				links: [
					{ label: "About", href: "/about" },
					{ label: "Contact", href: "/contact" },
					{ label: "Privacy", href: "/privacy" },
				],
			},
		],
		copyright: "© 2025 Minimal Company",
	},
};

export const NoLinks: Story = {
	args: {
		socialLinks,
		copyright: "© 2025 Simple Footer. All rights reserved.",
	},
};

export const CustomCopyright: Story = {
	args: {
		linkSections: [productLinks, companyLinks],
		socialLinks,
		copyright: "© 2025 MyApp Inc. • Made with ❤️ • All rights reserved.",
	},
};

export const DarkThemeVariant: Story = {
	render: (args) => (
		<div className="dark">
			<Footer {...args} />
		</div>
	),
	args: {
		linkSections: [productLinks, companyLinks, resourcesLinks],
		socialLinks,
		copyright: "© 2025 Your Company. All rights reserved.",
	},
};
