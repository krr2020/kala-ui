import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../card";
import { Spinner } from "./spinner";

const meta = {
	title: "Feedback/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg", "xl"],
		},
		variant: {
			control: "select",
			options: ["default", "muted", "white", "ghost"],
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-4">
			<div className="flex flex-col items-center gap-2">
				<Spinner size="sm" />
				<span className="text-xs text-muted-foreground">sm</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="md" />
				<span className="text-xs text-muted-foreground">md</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="lg" />
				<span className="text-xs text-muted-foreground">lg</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner size="xl" />
				<span className="text-xs text-muted-foreground">xl</span>
			</div>
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="flex items-center gap-4 bg-muted p-8 rounded-lg">
			<div className="flex flex-col items-center gap-2">
				<Spinner variant="default" />
				<span className="text-xs text-muted-foreground">Default</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner variant="muted" />
				<span className="text-xs text-muted-foreground">Muted</span>
			</div>
			<div className="flex flex-col items-center gap-2 p-2 bg-black rounded">
				<Spinner variant="white" />
				<span className="text-xs text-white/70">White</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Spinner variant="ghost" />
				<span className="text-xs text-muted-foreground">Ghost</span>
			</div>
		</div>
	),
};

export const WithLabel: Story = {
	args: {
		label: "Fetching data...",
	},
	render: (args) => (
		<div className="flex items-center gap-2">
			<Spinner {...args} />
			<span className="text-sm text-muted-foreground">Fetching data...</span>
		</div>
	),
};

export const InButton: Story = {
	render: () => (
		<div className="flex gap-4">
			<Button disabled>
				<Spinner variant="current" className="mr-2 h-4 w-4" />
				Please wait
			</Button>
			<Button variant="secondary" disabled>
				<Spinner variant="current" className="mr-2 h-4 w-4" />
				Saving...
			</Button>
			<Button variant="outline" disabled>
				<Spinner variant="current" className="mr-2 h-4 w-4" />
				Loading
			</Button>
			<Button variant="ghost" disabled>
				<Spinner variant="current" className="mr-2 h-4 w-4" />
			</Button>
		</div>
	),
};

export const InCard: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Account Status</CardTitle>
				<CardDescription>Checking your account status...</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-center py-6">
				<Spinner size="xl" />
			</CardContent>
			<CardFooter className="justify-center text-sm text-muted-foreground">
				This may take a moment
			</CardFooter>
		</Card>
	),
};

export const FullScreenLoading: Story = {
	parameters: {
		layout: "fullscreen",
	},
	render: () => (
		<div className="flex h-[300px] w-full items-center justify-center bg-muted/30">
			<div className="flex flex-col items-center gap-4">
				<Spinner size="xl" />
				<p className="text-sm text-muted-foreground font-medium">
					Initializing application...
				</p>
			</div>
		</div>
	),
};
