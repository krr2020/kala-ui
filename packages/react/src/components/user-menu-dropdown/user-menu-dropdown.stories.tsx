import type { Meta, StoryObj } from "@storybook/react";
import { UserMenuDropdown } from "./user-menu-dropdown";

const meta: Meta<typeof UserMenuDropdown> = {
	title: "Application/UserMenuDropdown",
	component: UserMenuDropdown,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserMenuDropdown>;

export const Default: Story = {
	args: {
		user: {
			name: "John Doe",
			email: "john.doe@example.com",
		},
		onLogout: () => alert("Logout clicked"),
	},
};

export const WithAvatar: Story = {
	args: {
		user: {
			name: "Jane Smith",
			email: "jane.smith@example.com",
			avatar: "https://i.pravatar.cc/150?img=1",
		},
		onLogout: () => alert("Logout clicked"),
	},
};

export const LongName: Story = {
	args: {
		user: {
			name: "Alexander Christopher Wellington",
			email: "alexander.wellington@example.com",
		},
		onLogout: () => alert("Logout clicked"),
	},
};

export const EmailOnly: Story = {
	args: {
		user: {
			email: "user@example.com",
		},
		onLogout: () => alert("Logout clicked"),
	},
};

export const Controlled: Story = {
	args: {
		user: {
			name: "Controlled User",
			email: "controlled@example.com",
		},
		isOpen: true,
		onOpenChange: (open) => console.log("Open state:", open),
		onLogout: () => alert("Logout clicked"),
	},
};

export const CustomBaseUrl: Story = {
	args: {
		user: {
			name: "Custom User",
			email: "custom@example.com",
		},
		baseUrl: "/dashboard",
		onLogout: () => alert("Logout clicked"),
	},
};
