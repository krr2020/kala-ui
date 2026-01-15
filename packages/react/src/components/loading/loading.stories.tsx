import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonCardContent, SkeletonText } from "../skeleton";
import { PageLoader } from "./page-loader";
import { SectionLoader } from "./section-loader";

const meta: Meta = {
	title: "Feedback/Loading",
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

export const PageLoaderStory: StoryObj<typeof PageLoader> = {
	name: "Page Loader",
	render: () => <PageLoader message="Loading page..." />,
};

export const PageLoaderNoMessage: StoryObj<typeof PageLoader> = {
	name: "Page Loader (No Message)",
	render: () => <PageLoader message="" />,
};

export const SectionLoaderStory: StoryObj<typeof SectionLoader> = {
	name: "Section Loader",
	render: () => (
		<div className="p-8">
			<div className="rounded-lg border bg-card text-card-foreground theme-card">
				<SectionLoader message="Loading section..." />
			</div>
		</div>
	),
};

export const SectionLoaderCustomHeight: StoryObj<typeof SectionLoader> = {
	name: "Section Loader (Custom Height)",
	render: () => (
		<div className="p-8">
			<div className="rounded-lg border bg-card text-card-foreground theme-card">
				<SectionLoader message="Loading data..." minHeight="400px" />
			</div>
		</div>
	),
};

export const SkeletonCardStory: StoryObj = {
	name: "Skeleton Card",
	render: () => (
		<div className="p-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="rounded-lg border bg-card text-card-foreground theme-card"
					>
						<SkeletonCardContent showHeader showFooter />
					</div>
				))}
			</div>
		</div>
	),
};

export const SkeletonCardNoImage: StoryObj = {
	name: "Skeleton Card (No Image)",
	render: () => (
		<div className="p-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="rounded-lg border bg-card text-card-foreground theme-card"
					>
						<SkeletonCardContent showHeader showFooter />
					</div>
				))}
			</div>
		</div>
	),
};

export const SkeletonCardCustomLines: StoryObj = {
	name: "Skeleton Card (Custom Lines)",
	render: () => (
		<div className="p-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="rounded-lg border bg-card text-card-foreground theme-card"
					>
						<SkeletonCardContent
							showHeader
							showFooter
							contentLines={[1, 5, 8][i]}
						/>
					</div>
				))}
			</div>
		</div>
	),
};

export const SkeletonTextStory: StoryObj = {
	name: "Skeleton Text",
	render: () => (
		<div className="p-8">
			<div className="max-w-2xl space-y-8 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<div>
					<h3 className="mb-4 text-sm font-medium text-muted-foreground">
						Default (3 lines)
					</h3>
					<SkeletonText />
				</div>
				<div>
					<h3 className="mb-4 text-sm font-medium text-muted-foreground">
						5 lines
					</h3>
					<SkeletonText lines={5} />
				</div>
				<div>
					<h3 className="mb-4 text-sm font-medium text-muted-foreground">
						Custom last line width
					</h3>
					<SkeletonText lines={4} lastLineWidth="40%" />
				</div>
			</div>
		</div>
	),
};

export const CombinedExample: StoryObj = {
	name: "Combined Example",
	render: () => (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="rounded-lg border bg-card p-6 text-card-foreground theme-card">
					<h2 className="mb-4 text-lg font-semibold text-foreground">
						Article Header
					</h2>
					<SkeletonText lines={2} lastLineWidth="60%" />
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="rounded-lg border bg-card text-card-foreground theme-card"
						>
							<SkeletonCardContent showHeader showFooter />
						</div>
					))}
				</div>

				<div className="rounded-lg border bg-card text-card-foreground theme-card">
					<SectionLoader message="Loading more content..." />
				</div>
			</div>
		</div>
	),
};
