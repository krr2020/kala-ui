"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import type * as React from "react";
import { useIsMobile } from "../../lib/use-mobile";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./navigation-menu";

const meta = {
	title: "Navigation/NavigationMenu",
	component: NavigationMenu,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<a href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
}

// Main Demo Story - Full Featured Navigation Menu
export const NavigationMenuDemo: Story = {
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const isMobile = useIsMobile();

		return (
			<NavigationMenu viewport={isMobile}>
				<NavigationMenuList className="flex-wrap">
					<NavigationMenuItem>
						<NavigationMenuTrigger>Home</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<a
											className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
											href="/"
										>
											<div className="mb-2 text-lg font-medium sm:mt-4">
												Kala UI
											</div>
											<p className="text-muted-foreground text-sm leading-tight">
												Beautifully designed components built with Tailwind CSS.
											</p>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/docs" title="Introduction">
									Re-usable components built using Radix UI and Tailwind CSS.
								</ListItem>
								<ListItem href="/docs/installation" title="Installation">
									How to install dependencies and structure your app.
								</ListItem>
								<ListItem href="/docs/primitives/typography" title="Typography">
									Styles for headings, paragraphs, lists...etc
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Components</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								{components.map((component) => (
									<ListItem
										key={component.title}
										title={component.title}
										href={component.href}
									>
										{component.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<a href="/docs">Docs</a>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>List</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[300px] gap-4">
								<li>
									<NavigationMenuLink asChild>
										<a href="https://example.com">
											<div className="font-medium">Components</div>
											<div className="text-muted-foreground">
												Browse all components in the library.
											</div>
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a href="https://example.com">
											<div className="font-medium">Documentation</div>
											<div className="text-muted-foreground">
												Learn how to use the library.
											</div>
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a href="https://example.com">
											<div className="font-medium">Blog</div>
											<div className="text-muted-foreground">
												Read our latest blog posts.
											</div>
										</a>
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Simple</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[200px] gap-4">
								<li>
									<NavigationMenuLink asChild>
										<a href="https://example.com">Components</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a href="https://example.com">Documentation</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a href="https://example.com">Blocks</a>
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[200px] gap-4">
								<li>
									<NavigationMenuLink asChild>
										<a
											href="https://example.com"
											className="flex-row items-center gap-2"
										>
											<CircleHelpIcon />
											Backlog
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a
											href="https://example.com"
											className="flex-row items-center gap-2"
										>
											<CircleIcon />
											To Do
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<a
											href="https://example.com"
											className="flex-row items-center gap-2"
										>
											<CircleCheckIcon />
											Done
										</a>
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		);
	},
};

// Getting Started Example
export const GettingStarted: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<a
										className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
										href="/"
									>
										<div className="mt-4 mb-2 text-lg font-medium">Kala UI</div>
										<p className="text-muted-foreground text-sm leading-tight">
											Beautifully designed components built with Tailwind CSS.
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem href="/docs" title="Introduction">
								Re-usable components built using Radix UI and Tailwind CSS.
							</ListItem>
							<ListItem href="/docs/installation" title="Installation">
								How to install dependencies and structure your app.
							</ListItem>
							<ListItem href="/docs/primitives/typography" title="Typography">
								Styles for headings, paragraphs, lists...etc
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Components</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{components.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
								>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/docs">Documentation</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Without Viewport Example
export const WithoutViewport: Story = {
	render: () => (
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/docs">Documentation</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>List</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[300px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">Components</div>
										<div className="text-muted-foreground">
											Browse all components in the library.
										</div>
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">Documentation</div>
										<div className="text-muted-foreground">
											Learn how to use the library.
										</div>
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">Blog</div>
										<div className="text-muted-foreground">
											Read our latest blog posts.
										</div>
									</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Simple List</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Components</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Documentation</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Blocks</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleHelpIcon />
										Backlog
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleIcon />
										To Do
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleCheckIcon />
										Done
									</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Simple Link Navigation
export const SimpleLinkNavigation: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/">Home</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/docs">Docs</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/blog">Blog</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Simple Dropdown List
export const SimpleDropdownList: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Components</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Buttons</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Forms</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">Cards</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Dropdown with Icons
export const DropdownWithIcons: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Status</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleHelpIcon />
										Backlog
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleIcon />
										To Do
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a
										href="https://example.com"
										className="flex-row items-center gap-2"
									>
										<CircleCheckIcon />
										Done
									</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Grid Layout
export const GridLayout: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Components</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{components.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
								>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Complex Layout with Featured Item
export const ComplexLayoutWithFeatured: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Products</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<a
										className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
										href="/"
									>
										<div className="mb-2 text-lg font-medium sm:mt-4">
											Featured Product
										</div>
										<p className="text-muted-foreground text-sm leading-tight">
											Our flagship product that makes development easier.
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem href="/products/analytics" title="Analytics">
								Track and analyze your application's performance.
							</ListItem>
							<ListItem href="/products/monitoring" title="Monitoring">
								Real-time monitoring and alerting.
							</ListItem>
							<ListItem href="/products/security" title="Security">
								Advanced security features for your application.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Active State Example
export const ActiveState: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/">Home</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
						data-active="true"
					>
						<a href="/docs">Docs</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<a href="/blog">Blog</a>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};

// Nested Lists Example
export const NestedLists: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Resources</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[300px] gap-4">
							<li>
								<div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
									Documentation
								</div>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">Getting Started</div>
										<div className="text-muted-foreground">
											Quick start guide for new users
										</div>
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">API Reference</div>
										<div className="text-muted-foreground">
											Complete API documentation
										</div>
									</a>
								</NavigationMenuLink>
							</li>
							<li>
								<div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
									Community
								</div>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">GitHub</div>
										<div className="text-muted-foreground">
											Open source repository
										</div>
									</a>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<a href="https://example.com">
										<div className="font-medium">Support</div>
										<div className="text-muted-foreground">
											Get help from the community
										</div>
									</a>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};
