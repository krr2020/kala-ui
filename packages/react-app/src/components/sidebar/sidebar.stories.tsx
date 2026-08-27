import type { Meta, StoryObj } from "@storybook/react";
import {
	BarChart3,
	Bell,
	CheckSquare,
	FileText,
	Home,
	Image,
	Key,
	LayoutDashboard,
	Lock,
	Mail,
	MessageSquare,
	Settings,
	Shield,
	Users,
} from "lucide-react";
import { Sidebar } from "./sidebar";

const meta = {
	title: "Application/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockLogo = (
	<div className="flex items-center gap-2">
		<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
			<LayoutDashboard className="text-white size-5" />
		</div>
		<span className="font-bold text-lg">Admin</span>
	</div>
);

const mockNavSections = [
	{
		links: [
			{
				label: "Dashboard",
				href: "/dashboard",
				icon: <Home className="size-5" />,
			},
			{
				label: "Analytics",
				href: "/analytics",
				icon: <BarChart3 className="size-5" />,
				badge: "New",
			},
		],
	},
	{
		title: "Management",
		links: [
			{
				label: "Users",
				href: "/users",
				icon: <Users className="size-5" />,
				badge: 24,
			},
			{
				label: "Roles",
				href: "/roles",
				icon: <Shield className="size-5" />,
			},
			{
				label: "Permissions",
				href: "/permissions",
				icon: <Key className="size-5" />,
			},
		],
	},
	{
		title: "Content",
		collapsible: true,
		defaultOpen: true,
		links: [
			{
				label: "Posts",
				href: "/posts",
				icon: <FileText className="size-5" />,
			},
			{
				label: "Media",
				href: "/media",
				icon: <Image className="size-5" />,
			},
			{
				label: "Comments",
				href: "/comments",
				icon: <MessageSquare className="size-5" />,
				badge: 5,
			},
		],
	},
	{
		title: "Settings",
		collapsible: true,
		defaultOpen: false,
		links: [
			{
				label: "General",
				href: "/settings/general",
				icon: <Settings className="size-5" />,
			},
			{
				label: "Security",
				href: "/settings/security",
				icon: <Lock className="size-5" />,
			},
			{
				label: "Integrations",
				href: "/settings/integrations",
				icon: <div className="i-lucide-plug text-lg" />,
			},
		],
	},
];

const mockFooter = (
	<div className="flex items-center gap-3">
		<div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
			<div className="i-lucide-user text-muted-foreground text-sm" />
		</div>
		<div className="flex-1 min-w-0">
			<div className="text-sm font-medium truncate">John Doe</div>
			<div className="text-xs text-muted-foreground truncate">
				john@example.com
			</div>
		</div>
	</div>
);

export const Default: Story = {
	args: {
		logo: mockLogo,
		navSections: mockNavSections,
		pathname: "/dashboard",
		isOpen: true,
	},
};

export const WithFooter: Story = {
	args: {
		logo: mockLogo,
		navSections: mockNavSections,
		pathname: "/users",
		isOpen: true,
		footer: mockFooter,
	},
};

export const ActiveLink: Story = {
	args: {
		logo: mockLogo,
		navSections: mockNavSections,
		pathname: "/users",
		isOpen: true,
		footer: mockFooter,
	},
};

export const CollapsedSections: Story = {
	args: {
		logo: mockLogo,
		navSections: mockNavSections.map((section) => ({
			...section,
			defaultOpen: false,
		})),
		pathname: "/dashboard",
		isOpen: true,
	},
};

export const WithBadges: Story = {
	args: {
		logo: mockLogo,
		navSections: [
			{
				title: "Notifications",
				links: [
					{
						label: "Messages",
						href: "/messages",
						icon: <Mail className="size-5" />,
						badge: 12,
					},
					{
						label: "Alerts",
						href: "/alerts",
						icon: <Bell className="size-5" />,
						badge: 3,
					},
					{
						label: "Tasks",
						href: "/tasks",
						icon: <CheckSquare className="size-5" />,
						badge: "Hot",
					},
				],
			},
		],
		pathname: "/messages",
		isOpen: true,
	},
};

export const MobileClosed: Story = {
	args: {
		logo: mockLogo,
		navSections: mockNavSections,
		pathname: "/dashboard",
		isOpen: false,
	},
};
