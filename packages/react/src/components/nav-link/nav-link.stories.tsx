import type { Meta, StoryObj } from "@storybook/react";
import { Activity, Home, Settings, User } from "lucide-react";
import { NavLink } from "./nav-link";

const meta: Meta<typeof NavLink> = {
	title: "Components/NavLink",
	component: NavLink,
	tags: ["autodocs"],
	argTypes: {
		active: { control: "boolean" },
		disabled: { control: "boolean" },
		indent: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
	args: {
		label: "Dashboard",
		icon: <Home className="h-4 w-4" />,
	},
};

export const Active: Story = {
	args: {
		label: "Settings",
		icon: <Settings className="h-4 w-4" />,
		active: true,
	},
};

export const WithDescription: Story = {
	args: {
		label: "Profile",
		description: "Manage your personal information",
		icon: <User className="h-4 w-4" />,
	},
};

export const Nested: Story = {
	render: () => (
		<div className="w-64 border rounded-md p-2">
			<NavLink label="Main" icon={<Home className="h-4 w-4" />} />
			<NavLink
				label="Settings"
				icon={<Settings className="h-4 w-4" />}
				defaultOpened
			>
				<NavLink label="Account" indent />
				<NavLink label="Security" indent active />
				<NavLink label="Notifications" indent />
			</NavLink>
			<NavLink
				label="Activity"
				icon={<Activity className="h-4 w-4" />}
				rightSection={<span className="text-xs font-bold">New</span>}
			/>
		</div>
	),
};
