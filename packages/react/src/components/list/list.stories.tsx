import type { Meta, StoryObj } from "@storybook/react";
import {
	CheckCircle,
	ChevronRight,
	Home,
	Info,
	Mail,
	MessageCircle,
	Settings,
	Trash2,
	User,
	UserPlus,
} from "lucide-react";
import { Skeleton } from "../skeleton/skeleton";
import { Button } from "../button";
import {
	List,
	ListItem,
	ListItemAction,
	ListItemAvatar,
	ListItemBadge,
	ListItemContent,
	ListItemIcon,
	ListItemText,
	ListItemTitle,
} from "./list";

const meta = {
	title: "Data Display/List",
	component: List,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<List className="w-96">
			<ListItem>
				<ListItemContent>
					<ListItemTitle>First item</ListItemTitle>
					<ListItemText>This is the first item in the list</ListItemText>
				</ListItemContent>
			</ListItem>
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Second item</ListItemTitle>
					<ListItemText>This is the second item</ListItemText>
				</ListItemContent>
			</ListItem>
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Third item</ListItemTitle>
					<ListItemText>This is the third item</ListItemText>
				</ListItemContent>
			</ListItem>
		</List>
	),
};

export const ContactsList: Story = {
	render: () => (
		<div className="w-96">
			<h3 className="text-lg font-semibold mb-3">Contacts</h3>
			<List>
				<ListItem interactive>
					<ListItemAvatar
						src="https://i.pravatar.cc/150?img=1"
						alt="Katherine Lumaad"
						fallback="KL"
					/>
					<ListItemContent>
						<ListItemTitle>Katherine Lumaad</ListItemTitle>
						<ListItemText>katherine@example.com</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem interactive>
					<ListItemAvatar fallback="MR" />
					<ListItemContent>
						<ListItemTitle>Marie Recamadas</ListItemTitle>
						<ListItemText>(0929) 1234 567</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem interactive>
					<ListItemAvatar
						src="https://i.pravatar.cc/150?img=5"
						alt="Rose Faye Orcullo"
						fallback="RO"
					/>
					<ListItemContent>
						<ListItemTitle>Rose Faye Orcullo</ListItemTitle>
						<ListItemText>(0929) 0098 765</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem interactive>
					<ListItemAvatar fallback="GP" />
					<ListItemContent>
						<ListItemTitle>George Patinos</ListItemTitle>
						<ListItemText>(0929) 0987 654</ListItemText>
					</ListItemContent>
				</ListItem>
			</List>
		</div>
	),
};

export const EventsList: Story = {
	render: () => (
		<div className="w-96">
			<h3 className="text-lg font-semibold mb-3">Events</h3>
			<List>
				<ListItem>
					<div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
						<div className="text-xs font-semibold text-primary">SAT</div>
						<div className="text-lg font-bold text-primary">03</div>
					</div>
					<ListItemContent>
						<ListItemTitle>Web Design Workshop</ListItemTitle>
						<ListItemText>8:00am - 10:30am</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem>
					<div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
						<div className="text-xs font-semibold text-success">WED</div>
						<div className="text-lg font-bold text-success">07</div>
					</div>
					<ListItemContent>
						<ListItemTitle>Personal Religious Event</ListItemTitle>
						<ListItemText>10:00am - 11:00am</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem>
					<div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
						<div className="text-xs font-semibold text-accent-foreground">
							THU
						</div>
						<div className="text-lg font-bold text-accent-foreground">08</div>
					</div>
					<ListItemContent>
						<ListItemTitle>Batch 2012 Grand Reunion</ListItemTitle>
						<ListItemText>1:00pm - 2:00am</ListItemText>
					</ListItemContent>
				</ListItem>
			</List>
		</div>
	),
};

export const TasksList: Story = {
	render: () => (
		<div className="w-96">
			<h3 className="text-lg font-semibold mb-3">To Do</h3>
			<List>
				<ListItem>
					<ListItemContent>
						<div className="flex items-center justify-between mb-1">
							<ListItemTitle>JavaScript countdown timer</ListItemTitle>
							<ListItemBadge variant="primary">JAVASCRIPT</ListItemBadge>
						</div>
						<ListItemText className="mb-2">
							Today, December 15, 2025
						</ListItemText>
						<div className="w-full bg-muted rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full"
								style={{ width: "75%" }}
							/>
						</div>
						<div className="text-xs text-muted-foreground mt-1">
							PROGRESS: 75%
						</div>
					</ListItemContent>
				</ListItem>
				<ListItem>
					<ListItemContent>
						<div className="flex items-center justify-between mb-1">
							<ListItemTitle>Track in HTML 5</ListItemTitle>
							<ListItemBadge variant="warning">HTML</ListItemBadge>
						</div>
						<ListItemText className="mb-2">
							Today, December 15, 2025
						</ListItemText>
						<div className="w-full bg-muted rounded-full h-2">
							<div
								className="bg-warning h-2 rounded-full"
								style={{ width: "40%" }}
							/>
						</div>
						<div className="text-xs text-muted-foreground mt-1">
							PROGRESS: 40%
						</div>
					</ListItemContent>
				</ListItem>
			</List>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<List className="w-80">
			<ListItem interactive>
				<ListItemIcon>
					<Home className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Home</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem interactive active>
				<ListItemIcon>
					<User className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Profile</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem interactive>
				<ListItemIcon>
					<Settings className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Settings</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem interactive disabled>
				<ListItemIcon>
					<Trash2 className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Disabled Item</ListItemTitle>
				</ListItemContent>
			</ListItem>
		</List>
	),
};

export const WithActions: Story = {
	render: () => (
		<List className="w-96">
			<ListItem>
				<ListItemAvatar fallback="JD" />
				<ListItemContent>
					<ListItemTitle>John Doe</ListItemTitle>
					<ListItemText>Joined 2 days ago</ListItemText>
				</ListItemContent>
				<ListItemAction>
					<Button size="sm" variant="outline">
						Follow
					</Button>
				</ListItemAction>
			</ListItem>
			<ListItem>
				<ListItemAvatar fallback="JS" />
				<ListItemContent>
					<ListItemTitle>Jane Smith</ListItemTitle>
					<ListItemText>Joined 1 week ago</ListItemText>
				</ListItemContent>
				<ListItemAction>
					<Button size="sm" variant="outline">
						Follow
					</Button>
				</ListItemAction>
			</ListItem>
		</List>
	),
};

export const WithBadges: Story = {
	render: () => (
		<List className="w-80">
			<ListItem interactive>
				<ListItemContent>
					<ListItemTitle>Inbox</ListItemTitle>
				</ListItemContent>
				<ListItemBadge variant="primary">12</ListItemBadge>
			</ListItem>
			<ListItem interactive>
				<ListItemContent>
					<ListItemTitle>Drafts</ListItemTitle>
				</ListItemContent>
				<ListItemBadge variant="default">3</ListItemBadge>
			</ListItem>
			<ListItem interactive>
				<ListItemContent>
					<ListItemTitle>Urgent</ListItemTitle>
				</ListItemContent>
				<ListItemBadge variant="danger">5</ListItemBadge>
			</ListItem>
			<ListItem interactive>
				<ListItemContent>
					<ListItemTitle>Completed</ListItemTitle>
				</ListItemContent>
				<ListItemBadge variant="success">24</ListItemBadge>
			</ListItem>
		</List>
	),
};

export const ActivityFeed: Story = {
	render: () => (
		<div className="w-96">
			<h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
			<List>
				<ListItem>
					<ListItemAvatar
						fallback={<CheckCircle className="size-5 text-success" />}
					/>
					<ListItemContent>
						<ListItemTitle>Task completed</ListItemTitle>
						<ListItemText>You completed "Update user interface"</ListItemText>
						<ListItemText className="text-xs text-muted-foreground">
							2 hours ago
						</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem>
					<ListItemAvatar
						fallback={<MessageCircle className="size-5 text-primary" />}
					/>
					<ListItemContent>
						<ListItemTitle>New comment</ListItemTitle>
						<ListItemText>John Doe commented on your post</ListItemText>
						<ListItemText className="text-xs text-muted-foreground">
							4 hours ago
						</ListItemText>
					</ListItemContent>
				</ListItem>
				<ListItem>
					<ListItemAvatar
						fallback={<UserPlus className="size-5 text-primary" />}
					/>
					<ListItemContent>
						<ListItemTitle>New follower</ListItemTitle>
						<ListItemText>Jane Smith started following you</ListItemText>
						<ListItemText className="text-xs text-muted-foreground">
							Yesterday
						</ListItemText>
					</ListItemContent>
				</ListItem>
			</List>
		</div>
	),
};

export const DenseList: Story = {
	render: () => (
		<List dense className="w-80">
			<ListItem dense>
				<ListItemContent>
					<ListItemTitle>Compact item 1</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem dense>
				<ListItemContent>
					<ListItemTitle>Compact item 2</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem dense>
				<ListItemContent>
					<ListItemTitle>Compact item 3</ListItemTitle>
				</ListItemContent>
			</ListItem>
		</List>
	),
};

export const NoDividers: Story = {
	render: () => (
		<List divided={false} className="w-80">
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Item without dividers</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Another item</ListItemTitle>
				</ListItemContent>
			</ListItem>
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Last item</ListItemTitle>
				</ListItemContent>
			</ListItem>
		</List>
	),
};

export const LinkList: Story = {
	render: () => (
		<List className="w-80">
			<ListItem href="/" interactive>
				<ListItemIcon>
					<Home className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Home Page</ListItemTitle>
				</ListItemContent>
				<ListItemIcon>
					<ChevronRight className="size-5" />
				</ListItemIcon>
			</ListItem>
			<ListItem href="/about" interactive>
				<ListItemIcon>
					<Info className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>About Us</ListItemTitle>
				</ListItemContent>
				<ListItemIcon>
					<ChevronRight className="size-5" />
				</ListItemIcon>
			</ListItem>
			<ListItem href="/contact" interactive>
				<ListItemIcon>
					<Mail className="size-5" />
				</ListItemIcon>
				<ListItemContent>
					<ListItemTitle>Contact</ListItemTitle>
				</ListItemContent>
				<ListItemIcon>
					<ChevronRight className="size-5" />
				</ListItemIcon>
			</ListItem>
		</List>
	),
};

export const TruncatedText: Story = {
	render: () => (
		<List className="w-80">
			<ListItem>
				<ListItemContent truncate>
					<ListItemTitle truncate>
						This is a very long title that will be truncated with an ellipsis
					</ListItemTitle>
					<ListItemText truncate>
						This is a very long description that will also be truncated with an
						ellipsis when it exceeds the container width
					</ListItemText>
				</ListItemContent>
			</ListItem>
			<ListItem>
				<ListItemContent>
					<ListItemTitle>Multi-line text with line-clamp</ListItemTitle>
					<ListItemText lines={2}>
						This is a longer text that will be shown in multiple lines but will
						be clamped to 2 lines maximum. Any additional content beyond that
						will be hidden with an ellipsis at the end.
					</ListItemText>
				</ListItemContent>
			</ListItem>
		</List>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-md space-y-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center gap-3 p-3">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
					<Skeleton className="h-4 w-4" />
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for list items while data is loading.",
			},
		},
	},
};