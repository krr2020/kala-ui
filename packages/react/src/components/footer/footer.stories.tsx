import type { Meta, StoryObj } from "@storybook/react";
import { siGithub, siX, siYoutube } from "simple-icons";

// Brand icons (removed from lucide-react v1; LinkedIn removed from simple-icons
// for legal reasons — path kept in sync with social-login-button.tsx)
const brandIcon = (path: string, title: string, className = "w-5 h-5") => (
	<svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
		<title>{title}</title>
		<path d={path} />
	</svg>
);
const GithubIcon = () => brandIcon(siGithub.path, "GitHub");
const TwitterIcon = () => brandIcon(siX.path, "X");
const YoutubeIcon = () => brandIcon(siYoutube.path, "YouTube");
const LinkedinIcon = () =>
	brandIcon(
		"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.22 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
		"LinkedIn",
	);
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
		icon: <TwitterIcon />,
	},
	{
		name: "GitHub",
		href: "https://github.com",
		icon: <GithubIcon />,
	},
	{
		name: "LinkedIn",
		href: "https://linkedin.com",
		icon: <LinkedinIcon />,
	},
	{
		name: "YouTube",
		href: "https://youtube.com",
		icon: <YoutubeIcon />,
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
