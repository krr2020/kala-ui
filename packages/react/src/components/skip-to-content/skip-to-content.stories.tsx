import type { Meta, StoryObj } from "@storybook/react";
import { SkipToContent } from "./skip-to-content";

const meta = {
	title: "Accessibility/SkipToContent",
	component: SkipToContent,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"A skip navigation link that allows keyboard users to bypass repetitive navigation and jump directly to the main content. This component is visible only when focused (usually by pressing Tab), meeting WCAG 2.1 AA Criterion 2.4.1 - Bypass Blocks.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		targetId: {
			control: "text",
			description: "ID of the main content element to skip to",
		},
		text: {
			control: "text",
			description: "Custom text for the skip link",
		},
	},
} satisfies Meta<typeof SkipToContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div>
			<SkipToContent />
			<nav className="bg-muted p-4 mb-4">
				<div className="text-sm text-muted-foreground mb-2">
					Press{" "}
					<kbd className="px-2 py-1 bg-background border rounded">Tab</kbd> to
					see the skip link
				</div>
				<ul className="flex gap-4">
					<li>
						<a href="/home" className="hover:underline">
							Home
						</a>
					</li>
					<li>
						<a href="/about" className="hover:underline">
							About
						</a>
					</li>
					<li>
						<a href="/services" className="hover:underline">
							Services
						</a>
					</li>
					<li>
						<a href="/contact" className="hover:underline">
							Contact
						</a>
					</li>
				</ul>
			</nav>
			<main id="main-content" className="p-4">
				<h1 className="text-2xl font-bold mb-4">Main Content</h1>
				<p className="text-muted-foreground">
					This is the main content area that users can skip to using the skip
					link.
				</p>
			</main>
		</div>
	),
};

export const CustomText: Story = {
	render: () => (
		<div>
			<SkipToContent text="Jump to content" />
			<nav className="bg-muted p-4 mb-4">
				<div className="text-sm text-muted-foreground mb-2">
					Press{" "}
					<kbd className="px-2 py-1 bg-background border rounded">Tab</kbd> to
					see the skip link with custom text
				</div>
				<ul className="flex gap-4">
					<li>
						<a href="/nav1" className="hover:underline">
							Navigation Link 1
						</a>
					</li>
					<li>
						<a href="/nav2" className="hover:underline">
							Navigation Link 2
						</a>
					</li>
				</ul>
			</nav>
			<main id="main-content" className="p-4">
				<h1 className="text-2xl font-bold">Main Content</h1>
			</main>
		</div>
	),
};

export const CustomTarget: Story = {
	render: () => (
		<div>
			<SkipToContent targetId="article-content" text="Skip to article" />
			<header className="bg-muted p-4 mb-4">
				<h1 className="text-xl font-bold mb-2">Site Header</h1>
				<nav>
					<ul className="flex gap-4 text-sm">
						<li>
							<a href="/home" className="hover:underline">
								Home
							</a>
						</li>
						<li>
							<a href="/blog" className="hover:underline">
								Blog
							</a>
						</li>
						<li>
							<a href="/about" className="hover:underline">
								About
							</a>
						</li>
					</ul>
				</nav>
			</header>
			<aside className="bg-muted/50 p-4 mb-4">
				<h2 className="font-semibold mb-2">Sidebar</h2>
				<ul className="text-sm space-y-1">
					<li>
						<a href="/category/1" className="hover:underline">
							Category 1
						</a>
					</li>
					<li>
						<a href="/category/2" className="hover:underline">
							Category 2
						</a>
					</li>
				</ul>
			</aside>
			<article id="article-content" className="p-4">
				<h1 className="text-2xl font-bold mb-4">Article Title</h1>
				<p className="text-muted-foreground">
					This is the main article content that users can skip directly to.
				</p>
			</article>
		</div>
	),
};

export const WithComplexNavigation: Story = {
	render: () => (
		<div>
			<SkipToContent />
			<header className="border-b">
				<div className="bg-muted px-4 py-2 text-sm">
					<div className="flex justify-between items-center">
						<span>Welcome!</span>
						<div className="flex gap-4">
							<a href="/signin" className="hover:underline">
								Sign In
							</a>
							<a href="/register" className="hover:underline">
								Register
							</a>
						</div>
					</div>
				</div>
				<nav className="p-4">
					<div className="flex justify-between items-center">
						<div className="font-bold text-lg">Logo</div>
						<ul className="flex gap-6">
							<li>
								<a href="/products" className="hover:underline">
									Products
								</a>
							</li>
							<li>
								<a href="/solutions" className="hover:underline">
									Solutions
								</a>
							</li>
							<li>
								<a href="/pricing" className="hover:underline">
									Pricing
								</a>
							</li>
							<li>
								<a href="/resources" className="hover:underline">
									Resources
								</a>
							</li>
							<li>
								<a href="/company" className="hover:underline">
									Company
								</a>
							</li>
						</ul>
					</div>
				</nav>
				<div className="bg-muted/50 px-4 py-2">
					<div className="flex gap-4 text-sm">
						<a href="/docs" className="hover:underline">
							Documentation
						</a>
						<a href="/api" className="hover:underline">
							API Reference
						</a>
						<a href="/guides" className="hover:underline">
							Guides
						</a>
						<a href="/blog" className="hover:underline">
							Blog
						</a>
					</div>
				</div>
			</header>
			<div className="p-4 bg-info/10 border-b border-info">
				<p className="text-sm">
					🎉 New feature released!{" "}
					<a href="/new-feature" className="underline font-medium">
						Learn more
					</a>
				</p>
			</div>
			<main id="main-content" className="p-8">
				<h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
				<p className="text-lg text-muted-foreground mb-4">
					Press Tab at the top of the page to see how the skip link helps
					keyboard users bypass all the navigation and announcements above.
				</p>
				<p className="text-muted-foreground">
					This demonstrates the value of skip links on pages with complex
					navigation structures.
				</p>
			</main>
		</div>
	),
};

export const MultipleSkipLinks: Story = {
	render: () => (
		<div>
			<SkipToContent targetId="main-content" text="Skip to main content" />
			<SkipToContent
				targetId="nav"
				text="Skip to navigation"
				className="focus:left-auto focus:right-4"
			/>
			<header className="bg-muted p-4 mb-4">
				<h1 className="text-xl font-bold">Header</h1>
				<p className="text-sm text-muted-foreground">
					Press Tab multiple times to see both skip links
				</p>
			</header>
			<nav id="nav" className="bg-muted/50 p-4 mb-4">
				<h2 className="font-semibold mb-2">Navigation</h2>
				<ul className="flex gap-4">
					<li>
						<a href="/link1" className="hover:underline">
							Link 1
						</a>
					</li>
					<li>
						<a href="/link2" className="hover:underline">
							Link 2
						</a>
					</li>
				</ul>
			</nav>
			<main id="main-content" className="p-4">
				<h1 className="text-2xl font-bold mb-4">Main Content</h1>
				<p className="text-muted-foreground">Main content area</p>
			</main>
		</div>
	),
};
