import type { Meta, StoryObj } from "@storybook/react";
import { SessionCard, type SessionData } from "./session-card";

const meta = {
	title: "Application/SessionCard",
	component: SessionCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onRevoke: {
			action: "revoke",
		},
	},
} satisfies Meta<typeof SessionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const currentSession: SessionData = {
	id: "1",
	device: "Desktop",
	browser: "Chrome 120",
	os: "macOS 14.1",
	location: "San Francisco, CA, USA",
	ip: "192.168.1.100",
	lastActiveAt: new Date().toISOString(),
	createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	isCurrent: true,
};

const mobileSession: SessionData = {
	id: "2",
	device: "Mobile",
	browser: "Safari 17",
	os: "iOS 17.2",
	location: "New York, NY, USA",
	ip: "10.0.0.50",
	lastActiveAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
	createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
	isCurrent: false,
};

const tabletSession: SessionData = {
	id: "3",
	device: "iPad",
	browser: "Safari 17",
	os: "iPadOS 17.1",
	location: "London, UK",
	ip: "172.16.0.25",
	lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
	createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
	isCurrent: false,
};

const oldSession: SessionData = {
	id: "4",
	device: "Desktop",
	browser: "Firefox 119",
	os: "Windows 11",
	ip: "203.0.113.45",
	lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
	createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
	isCurrent: false,
};

export const CurrentSession: Story = {
	args: {
		session: currentSession,
	},
};

export const MobileDevice: Story = {
	args: {
		session: mobileSession,
		onRevoke: (id) => console.log("Revoke session:", id),
	},
};

export const TabletDevice: Story = {
	args: {
		session: tabletSession,
		onRevoke: (id) => console.log("Revoke session:", id),
	},
};

export const OldSession: Story = {
	args: {
		session: oldSession,
		onRevoke: (id) => console.log("Revoke session:", id),
	},
};

export const NoLocation: Story = {
	args: {
		session: {
			...mobileSession,
		},
		onRevoke: (id) => console.log("Revoke session:", id),
	},
	render: (args) => {
		const { location: _location, ...sessionWithoutLocation } = args.session;
		return <SessionCard {...args} session={sessionWithoutLocation} />;
	},
};

export const Revoking: Story = {
	args: {
		session: mobileSession,
		onRevoke: (id) => console.log("Revoke session:", id),
		isRevoking: true,
	},
};

export const AllSessionTypes: Story = {
	args: {
		session: currentSession,
	},
	render: () => (
		<div className="w-full max-w-4xl">
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-rows-fr">
				<SessionCard session={currentSession} className="h-full" />
				<SessionCard
					session={mobileSession}
					onRevoke={(id) => console.log("Revoke session:", id)}
					className="h-full"
				/>
				<SessionCard
					session={tabletSession}
					onRevoke={(id) => console.log("Revoke session:", id)}
					className="h-full"
				/>
				<SessionCard
					session={oldSession}
					onRevoke={(id) => console.log("Revoke session:", id)}
					className="h-full"
				/>
			</div>
		</div>
	),
};
