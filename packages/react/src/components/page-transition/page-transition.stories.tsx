import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../button";
import { PageTransition } from "./page-transition";

const meta = {
	title: "Components/PageTransition",
	component: PageTransition,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"A page transition component that provides smooth fade-in animations when navigating between pages. Automatically handles transitions with configurable timing.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		duration: {
			control: { type: "number", min: 100, max: 1000, step: 50 },
			description: "Transition duration in milliseconds",
		},
		pageKey: {
			control: "text",
			description:
				"Unique key for the current page - changes trigger transition",
		},
	},
} satisfies Meta<typeof PageTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => (
		<PageTransition pageKey="default-page">
			<div className="p-8">
				<h1 className="text-3xl font-bold mb-4">Welcome</h1>
				<p className="text-muted-foreground">
					This content fades in smoothly when the page loads.
				</p>
			</div>
		</PageTransition>
	),
};

export const WithPageChange: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => {
		const [page, setPage] = useState("home");

		const pages = {
			home: {
				title: "Home Page",
				content:
					"Welcome to the home page. Click the buttons below to navigate.",
			},
			about: {
				title: "About Page",
				content: "Learn more about us on this page.",
			},
			contact: {
				title: "Contact Page",
				content: "Get in touch with us through this page.",
			},
		};

		return (
			<div>
				<nav className="border-b p-4 flex gap-2">
					<Button
						variant={page === "home" ? "default" : "outline"}
						onClick={() => setPage("home")}
					>
						Home
					</Button>
					<Button
						variant={page === "about" ? "default" : "outline"}
						onClick={() => setPage("about")}
					>
						About
					</Button>
					<Button
						variant={page === "contact" ? "default" : "outline"}
						onClick={() => setPage("contact")}
					>
						Contact
					</Button>
				</nav>
				<PageTransition pageKey={page}>
					<div className="p-8">
						<h1 className="text-3xl font-bold mb-4">
							{pages[page as keyof typeof pages].title}
						</h1>
						<p className="text-muted-foreground">
							{pages[page as keyof typeof pages].content}
						</p>
					</div>
				</PageTransition>
			</div>
		);
	},
};

export const CustomDuration: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => {
		const [page, setPage] = useState("fast");
		const [duration, setDuration] = useState(150);

		return (
			<div>
				<nav className="border-b p-4">
					<div className="flex gap-2 mb-4">
						<Button
							variant={page === "fast" ? "default" : "outline"}
							onClick={() => {
								setPage("fast");
								setDuration(150);
							}}
						>
							Fast (150ms)
						</Button>
						<Button
							variant={page === "normal" ? "default" : "outline"}
							onClick={() => {
								setPage("normal");
								setDuration(300);
							}}
						>
							Normal (300ms)
						</Button>
						<Button
							variant={page === "slow" ? "default" : "outline"}
							onClick={() => {
								setPage("slow");
								setDuration(600);
							}}
						>
							Slow (600ms)
						</Button>
					</div>
					<p className="text-sm text-muted-foreground">
						Current duration: {duration}ms
					</p>
				</nav>
				<PageTransition pageKey={page} duration={duration}>
					<div className="p-8">
						<h1 className="text-3xl font-bold mb-4">Transition Speed Demo</h1>
						<p className="text-muted-foreground">
							This page uses a {duration}ms transition duration.
						</p>
					</div>
				</PageTransition>
			</div>
		);
	},
};

export const WithComplexContent: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => {
		const [page, setPage] = useState(1);

		return (
			<div>
				<nav className="border-b p-4 flex gap-2">
					<Button
						variant={page === 1 ? "default" : "outline"}
						onClick={() => setPage(1)}
					>
						Page 1
					</Button>
					<Button
						variant={page === 2 ? "default" : "outline"}
						onClick={() => setPage(2)}
					>
						Page 2
					</Button>
					<Button
						variant={page === 3 ? "default" : "outline"}
						onClick={() => setPage(3)}
					>
						Page 3
					</Button>
				</nav>
				<PageTransition pageKey={`page-${page}`}>
					<div className="p-8">
						<h1 className="text-3xl font-bold mb-6">Content Page {page}</h1>
						<div className="grid gap-4">
							<div className="rounded-lg border p-4">
								<h3 className="font-semibold mb-2">Card 1</h3>
								<p className="text-sm text-muted-foreground">
									This is some content in card 1 of page {page}.
								</p>
							</div>
							<div className="rounded-lg border p-4">
								<h3 className="font-semibold mb-2">Card 2</h3>
								<p className="text-sm text-muted-foreground">
									This is some content in card 2 of page {page}.
								</p>
							</div>
							<div className="rounded-lg border p-4">
								<h3 className="font-semibold mb-2">Card 3</h3>
								<p className="text-sm text-muted-foreground">
									This is some content in card 3 of page {page}.
								</p>
							</div>
						</div>
					</div>
				</PageTransition>
			</div>
		);
	},
};

export const WithoutPageKey: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => (
		<PageTransition>
			<div className="p-8">
				<h1 className="text-3xl font-bold mb-4">Static Page</h1>
				<p className="text-muted-foreground">
					This page does not use a pageKey prop, so it won't re-transition on
					updates.
				</p>
			</div>
		</PageTransition>
	),
};

export const CustomClassName: Story = {
	args: { children: <div /> },
	parameters: { controls: { disable: true } },
	render: () => {
		const [page, setPage] = useState("page1");

		return (
			<div>
				<nav className="border-b p-4 flex gap-2">
					<Button
						variant={page === "page1" ? "default" : "outline"}
						onClick={() => setPage("page1")}
					>
						Page 1
					</Button>
					<Button
						variant={page === "page2" ? "default" : "outline"}
						onClick={() => setPage("page2")}
					>
						Page 2
					</Button>
				</nav>
				<PageTransition pageKey={page} className="bg-muted">
					<div className="p-8">
						<h1 className="text-3xl font-bold mb-4">Custom Styled Page</h1>
						<p className="text-muted-foreground">
							This page transition wrapper has a custom background color.
						</p>
					</div>
				</PageTransition>
			</div>
		);
	},
};
