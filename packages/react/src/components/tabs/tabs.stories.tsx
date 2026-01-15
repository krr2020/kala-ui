import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Skeleton } from "../skeleton/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
	title: "Navigation/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="name">Name</Label>
							<Input id="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="username">Username</Label>
							<Input id="username" defaultValue="@peduarte" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save changes</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="current">Current password</Label>
							<Input id="current" type="password" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="new">New password</Label>
							<Input id="new" type="password" />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save password</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	),
};

export const Vertical: Story = {
	render: () => (
		<Tabs
			defaultValue="music"
			orientation="vertical"
			className="flex w-[500px] gap-4"
		>
			<TabsList variant="vertical" className="w-[120px]">
				<TabsTrigger value="music">Music</TabsTrigger>
				<TabsTrigger value="podcasts">Podcasts</TabsTrigger>
				<TabsTrigger value="live">Live</TabsTrigger>
			</TabsList>
			<div className="flex-1">
				<TabsContent value="music" className="mt-0 border-none p-0">
					<Card>
						<CardHeader>
							<CardTitle>Music</CardTitle>
							<CardDescription>Listen to your favorite music.</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Music content goes here.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="podcasts" className="mt-0 border-none p-0">
					<Card>
						<CardHeader>
							<CardTitle>Podcasts</CardTitle>
							<CardDescription>
								Listen to your favorite podcasts.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Podcast content goes here.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="live" className="mt-0 border-none p-0">
					<Card>
						<CardHeader>
							<CardTitle>Live</CardTitle>
							<CardDescription>Watch live streams.</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Live content goes here.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</div>
		</Tabs>
	),
};

export const Line: Story = {
	render: () => (
		<Tabs defaultValue="music" className="w-[400px]">
			<TabsList variant="line">
				<TabsTrigger value="music">Music</TabsTrigger>
				<TabsTrigger value="podcasts">Podcasts</TabsTrigger>
				<TabsTrigger value="live">Live</TabsTrigger>
			</TabsList>
			<TabsContent value="music" className="mt-4">
				<div className="rounded-md border p-4">
					<h3 className="mb-2 font-semibold">Music</h3>
					<p className="text-sm text-muted-foreground">
						Listen to your favorite music. The indicator slides to the active
						tab.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="podcasts" className="mt-4">
				<div className="rounded-md border p-4">
					<h3 className="mb-2 font-semibold">Podcasts</h3>
					<p className="text-sm text-muted-foreground">
						Listen to your favorite podcasts.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="live" className="mt-4">
				<div className="rounded-md border p-4">
					<h3 className="mb-2 font-semibold">Live</h3>
					<p className="text-sm text-muted-foreground">Watch live streams.</p>
				</div>
			</TabsContent>
		</Tabs>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md">
			<div className="flex gap-2 border-b pb-2">
				<Skeleton className="h-8 w-20 rounded-md" />
				<Skeleton className="h-8 w-24 rounded-md" />
				<Skeleton className="h-8 w-28 rounded-md" />
			</div>
			<div className="mt-4 space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for tabs content while loading.",
			},
		},
	},
};