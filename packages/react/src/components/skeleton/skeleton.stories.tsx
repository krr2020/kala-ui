import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../button";
import { CardContent, Card as UICard } from "../card";
import {
	Skeleton,
	SkeletonAvatar,
	SkeletonButton,
	SkeletonCardContent,
	SkeletonCircle,
	SkeletonHeader,
	SkeletonParagraph,
	SkeletonRectangle,
	SkeletonText,
	SkeletonWrapper,
} from "./index";

const meta: Meta = {
	title: "Layout/Skeleton",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Comprehensive skeleton loading system for preventing CLS and providing excellent loading experiences.",
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Base Skeleton
// ============================================================================

export const Default: Story = {
	render: () => <Skeleton className="w-20 h-20" />,
};

export const FadeMode: Story = {
	render: () => (
		<Skeleton fade={true} fadeDuration={500} className="w-32 h-8" />
	),
};

export const CustomSizes: Story = {
	render: () => (
		<div className="space-y-4">
			<Skeleton className="w-16 h-16" />
			<Skeleton className="w-32 h-8" />
			<Skeleton className="w-48 h-6" />
		</div>
	),
};

// ============================================================================
// Skeleton Patterns
// ============================================================================

export const PatternsLibrary: Story = {
	render: () => (
		<div className="space-y-8 max-w-2xl">
			{/* SkeletonText */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonText</h3>
				<SkeletonText />
				<SkeletonText lines={5} lastLineWidth="40%" />
				<SkeletonText lines={2} lastLineWidth="90%" />
			</div>

			{/* SkeletonCircle */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonCircle</h3>
				<div className="flex items-center gap-4">
					<SkeletonCircle size="2rem" />
					<SkeletonCircle size="3rem" />
					<SkeletonCircle size="4rem" />
				</div>
			</div>

			{/* SkeletonRectangle */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonRectangle</h3>
				<div className="space-y-4">
					<SkeletonRectangle width="100%" height="150px" />
					<SkeletonRectangle width="200px" height="100px" rounded="lg" />
				</div>
			</div>

			{/* SkeletonAvatar */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonAvatar</h3>
				<div className="flex items-center gap-4">
					<SkeletonAvatar size="sm" />
					<SkeletonAvatar size="md" />
					<SkeletonAvatar size="lg" />
				</div>
			</div>

			{/* SkeletonParagraph */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonParagraph</h3>
				<SkeletonParagraph />
				<SkeletonParagraph paragraphs={3} />
			</div>

			{/* SkeletonHeader */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonHeader</h3>
				<SkeletonHeader showSubtitle />
				<SkeletonHeader showSubtitle={false} />
				<SkeletonHeader titleWidth="40%" subtitleWidth="60%" />
			</div>

			{/* SkeletonButton */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonButton</h3>
				<div className="flex items-center gap-4">
					<SkeletonButton width="6rem" size="sm" />
					<SkeletonButton width="8rem" size="md" />
					<SkeletonButton width="10rem" size="lg" />
				</div>
			</div>

			{/* SkeletonCardContent */}
			<div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
				<h3 className="font-semibold mb-4">SkeletonCardContent</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<SkeletonCardContent />
					<SkeletonCardContent showHeader={false} contentLines={2} />
				</div>
			</div>
		</div>
	),
};

// ============================================================================
// Composed Patterns
// ============================================================================

export const Card: Story = {
	name: "Card Pattern",
	render: () => (
		<div className="flex flex-col gap-3 max-w-sm">
			<SkeletonRectangle width="100%" height="200px" rounded="lg" />
			<SkeletonHeader showSubtitle />
			<SkeletonText lines={3} />
		</div>
	),
};

export const List: Story = {
	render: () => (
		<div className="flex flex-col gap-3 max-w-md w-full">
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={`skeleton-item-${i}`}
					className="flex items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground theme-card"
				>
					<SkeletonAvatar size="md" />
					<div className="flex-1 space-y-2">
						<SkeletonHeader showSubtitle={false} />
						<SkeletonText lines={1} lastLineWidth="60%" />
					</div>
				</div>
			))}
		</div>
	),
};

export const UserProfile: Story = {
	render: () => (
		<div className="flex items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
			<SkeletonAvatar size="lg" />
			<div className="space-y-2 flex-1">
				<SkeletonHeader showSubtitle />
				<SkeletonText lines={2} />
			</div>
		</div>
	),
};

export const DataGrid: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<UICard key={i} className="h-full">
					<CardContent className="p-6">
						<SkeletonCardContent
							showHeader={false}
							contentLines={3}
							showFooter={false}
						/>
					</CardContent>
				</UICard>
			))}
		</div>
	),
};

export const Article: Story = {
	render: () => (
		<div className="max-w-2xl space-y-4 rounded-lg border bg-card p-6 text-card-foreground theme-card">
			<SkeletonHeader titleWidth="60%" />
			<SkeletonRectangle width="100%" height="250px" rounded="lg" />
			<SkeletonParagraph paragraphs={2} />
			<div className="flex gap-2">
				<SkeletonButton width="6rem" />
				<SkeletonButton width="6rem" />
			</div>
		</div>
	),
};

// ============================================================================
// SkeletonWrapper
// ============================================================================

export const WithWrapper: Story = {
	render: () => {
		const [isLoading, setIsLoading] = useState(true);

		return (
			<div className="space-y-4">
				<Button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</Button>

				<SkeletonWrapper
					isLoading={isLoading}
					skeleton={
						<div className="space-y-4">
							<SkeletonHeader />
							<SkeletonParagraph />
						</div>
					}
				>
					<div className="space-y-4">
						<h2 className="text-2xl font-bold">Article Title</h2>
						<p className="text-muted-foreground">
							This is the actual content that smoothly fades in after loading.
							The skeleton fades out with a smooth transition, and this content
							fades in.
						</p>
						<p className="text-muted-foreground">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
				</SkeletonWrapper>
			</div>
		);
	},
};

export const WrapperCustomDuration: Story = {
	render: () => {
		const [isLoading, setIsLoading] = useState(true);
		const [duration, setDuration] = useState(300);

		return (
			<div className="space-y-4">
				<div className="flex gap-2">
					<Button onClick={() => setIsLoading(!isLoading)}>
						Toggle Loading
					</Button>
					<Button onClick={() => setDuration(150)} variant="outline">
						Fast (150ms)
					</Button>
					<Button onClick={() => setDuration(300)} variant="outline">
						Normal (300ms)
					</Button>
					<Button onClick={() => setDuration(600)} variant="outline">
						Slow (600ms)
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					Current duration: {duration}ms
				</p>

				<SkeletonWrapper
					isLoading={isLoading}
					duration={duration}
					skeleton={<SkeletonHeader />}
				>
					<h2 className="text-2xl font-bold">Content with custom transition</h2>
				</SkeletonWrapper>
			</div>
		);
	},
};

export const WrapperMultipleCards: Story = {
	render: () => {
		const [isLoading, setIsLoading] = useState(true);

		return (
			<div className="space-y-4">
				<Button onClick={() => setIsLoading(!isLoading)}>
					Toggle All Loading
				</Button>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<UICard key={i}>
							<CardContent className="p-6">
								<SkeletonWrapper
									isLoading={isLoading}
									skeleton={
										<div className="space-y-3">
											<SkeletonHeader showSubtitle={false} />
											<SkeletonText lines={2} />
										</div>
									}
								>
									<div className="space-y-3">
										<h4 className="font-semibold">Card Title {i + 1}</h4>
										<p className="text-sm text-muted-foreground">
											Card description goes here.
										</p>
									</div>
								</SkeletonWrapper>
							</CardContent>
						</UICard>
					))}
				</div>
			</div>
		);
	},
};
