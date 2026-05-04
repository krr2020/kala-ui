import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SessionCard, type SessionData } from "./session-card";

const mockSession: SessionData = {
	id: "1",
	device: "Desktop",
	browser: "Chrome 120",
	os: "macOS 14.1",
	location: "San Francisco, CA, USA",
	ip: "192.168.1.100",
	lastActiveAt: new Date().toISOString(),
	createdAt: new Date().toISOString(),
	isCurrent: true,
};

describe("SessionCard", () => {
	it("renders session information correctly", () => {
		render(<SessionCard session={mockSession} />);

		expect(screen.getByText("Chrome 120")).toBeInTheDocument();
		expect(screen.getByText(/macOS 14.1/)).toBeInTheDocument();
		expect(screen.getByText(/Desktop/)).toBeInTheDocument();
		expect(screen.getByText("San Francisco, CA, USA")).toBeInTheDocument();
		expect(screen.getByText("192.168.1.100")).toBeInTheDocument();
		expect(screen.getByText(/Current Session/i)).toBeInTheDocument();
	});

	it("renders revoke button when onRevoke is provided and session is not current", () => {
		const onRevoke = vi.fn();
		const otherSession = { ...mockSession, isCurrent: false };

		render(<SessionCard session={otherSession} onRevoke={onRevoke} />);

		const revokeButton = screen.getByRole("button", { name: /revoke/i });
		expect(revokeButton).toBeInTheDocument();
	});

	it("does not render revoke button for current session", () => {
		const onRevoke = vi.fn();

		render(<SessionCard session={mockSession} onRevoke={onRevoke} />);

		expect(
			screen.queryByRole("button", { name: /revoke/i }),
		).not.toBeInTheDocument();
	});

	it("calls onRevoke when revoke button is clicked", async () => {
		const onRevoke = vi.fn();
		const otherSession = { ...mockSession, isCurrent: false };
		const user = userEvent.setup();

		render(<SessionCard session={otherSession} onRevoke={onRevoke} />);

		const revokeButton = screen.getByRole("button", { name: /revoke/i });
		await user.click(revokeButton);

		expect(onRevoke).toHaveBeenCalledWith(mockSession.id);
	});

	it("shows revoking state", () => {
		const onRevoke = vi.fn();
		const otherSession = { ...mockSession, isCurrent: false };

		render(
			<SessionCard
				session={otherSession}
				onRevoke={onRevoke}
				isRevoking={true}
			/>,
		);

		expect(screen.getByText("Revoking...")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /revoke/i })).toBeDisabled();
	});

	// NEW TESTS BELOW

	it("does not render revoke button when onRevoke is not provided and session is not current", () => {
		const otherSession = { ...mockSession, isCurrent: false };
		render(<SessionCard session={otherSession} />);
		expect(
			screen.queryByRole("button", { name: /revoke/i }),
		).not.toBeInTheDocument();
	});

	it("does not call onRevoke for current session even if clicked", () => {
		const onRevoke = vi.fn();
		render(<SessionCard session={mockSession} onRevoke={onRevoke} />);
		expect(onRevoke).not.toHaveBeenCalled();
	});

	it("renders without location when location is undefined", () => {
		const sessionNoLocation = { ...mockSession, location: undefined };
		render(<SessionCard session={sessionNoLocation} />);
		expect(screen.queryByText("San Francisco, CA, USA")).not.toBeInTheDocument();
	});

	it("renders with mobile device icon", () => {
		const mobileSession = { ...mockSession, device: "Mobile Phone", isCurrent: false };
		render(<SessionCard session={mobileSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/Mobile Phone/)).toBeInTheDocument();
	});

	it("renders with tablet device icon", () => {
		const tabletSession = { ...mockSession, device: "Tablet", isCurrent: false };
		render(<SessionCard session={tabletSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/Tablet/)).toBeInTheDocument();
	});

	it("renders with unknown device icon", () => {
		const unknownSession = { ...mockSession, device: "Unknown Device", isCurrent: false };
		render(<SessionCard session={unknownSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/Unknown Device/)).toBeInTheDocument();
	});

	it("renders with isLoading and custom skeleton", () => {
		render(
			<SessionCard
				session={mockSession}
				isLoading
				skeleton={<div data-testid="custom-skel">Loading</div>}
			/>,
		);
		expect(screen.getByTestId("custom-skel")).toBeInTheDocument();
		expect(screen.queryByText("Chrome 120")).not.toBeInTheDocument();
	});

	it("renders with isLoading and skeletonConfig (uses SessionCardSkeleton)", () => {
		render(
			<SessionCard session={mockSession} isLoading skeletonConfig={{ showBadge: true }} />,
		);
		expect(screen.queryByText("Chrome 120")).not.toBeInTheDocument();
	});

	it("renders with isLoading and no skeleton props (uses default SessionCardSkeleton)", () => {
		render(<SessionCard session={mockSession} isLoading />);
		expect(screen.queryByText("Chrome 120")).not.toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<SessionCard session={mockSession} className="extra-class" />,
		);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("renders with last active time formatted correctly", () => {
		render(<SessionCard session={mockSession} />);
		expect(screen.getByText(/Last active/i)).toBeInTheDocument();
	});

	it("renders with data-comp attribute", () => {
		const { container } = render(<SessionCard session={mockSession} />);
		expect(container.querySelector('[data-comp="session-card"]')).toBeInTheDocument();
	});

	it("renders 'Just now' for very recent timestamp", () => {
		const recentSession = {
			...mockSession,
			lastActiveAt: new Date().toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/Last active/i)).toBeInTheDocument();
		expect(screen.getByText(/just now/i)).toBeInTheDocument();
	});

	it("renders 'minutes ago' for timestamp within an hour", () => {
		const minutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: minutesAgo.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/5 minutes ago/i)).toBeInTheDocument();
	});

	it("renders '1 minute ago' for single minute", () => {
		const minuteAgo = new Date(Date.now() - 60 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: minuteAgo.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/1 minute ago/i)).toBeInTheDocument();
	});

	it("renders 'hours ago' for timestamp within a day", () => {
		const hoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: hoursAgo.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/3 hours ago/i)).toBeInTheDocument();
	});

	it("renders '1 hour ago' for single hour", () => {
		const hourAgo = new Date(Date.now() - 3600 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: hourAgo.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
	});

	it("renders 'Yesterday at ...' for timestamp one day ago", () => {
		const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: yesterday.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/Yesterday at/i)).toBeInTheDocument();
	});

	it("renders formatted date for timestamp older than one day", () => {
		const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000);
		const recentSession = {
			...mockSession,
			lastActiveAt: twoDaysAgo.toISOString(),
		};
		render(<SessionCard session={recentSession} />);
		expect(screen.getByText(/Last active/i)).toBeInTheDocument();
	});

	it("renders 'Unknown' for invalid timestamp", () => {
		const invalidSession = {
			...mockSession,
			lastActiveAt: "invalid-date",
		};
		render(<SessionCard session={invalidSession} />);
		expect(screen.getByText(/Unknown/i)).toBeInTheDocument();
	});

	it("renders with phone device icon", () => {
		const phoneSession = { ...mockSession, device: "Phone", isCurrent: false };
		render(<SessionCard session={phoneSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/Phone/)).toBeInTheDocument();
	});

	it("renders with computer device icon", () => {
		const computerSession = { ...mockSession, device: "Computer", isCurrent: false };
		render(<SessionCard session={computerSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/Computer/)).toBeInTheDocument();
	});

	it("renders revoke button as not disabled when not revoking", () => {
		const onRevoke = vi.fn();
		const otherSession = { ...mockSession, isCurrent: false };
		render(<SessionCard session={otherSession} onRevoke={onRevoke} />);
		expect(screen.getByRole("button", { name: /revoke/i })).toBeEnabled();
	});

	it("renders with iPad device icon", () => {
		const ipadSession = { ...mockSession, device: "iPad Pro", isCurrent: false };
		render(<SessionCard session={ipadSession} onRevoke={vi.fn()} />);
		expect(screen.getByText(/iPad Pro/)).toBeInTheDocument();
	});

	it("applies className to loading skeleton", () => {
		const { container } = render(
			<SessionCard session={mockSession} isLoading className="skeleton-wrap" />,
		);
		expect(container.firstChild).toHaveClass("skeleton-wrap");
	});

	it("applies className to loading state with custom skeleton", () => {
		const { container } = render(
			<SessionCard
				session={mockSession}
				isLoading
				className="custom-loading"
				skeleton={<div data-testid="skel">Loading</div>}
			/>,
		);
		expect(container.firstChild).toHaveClass("custom-loading");
	});

	it("renders data-comp attribute on loading state with custom skeleton", () => {
		const { container } = render(
			<SessionCard
				session={mockSession}
				isLoading
				skeleton={<div data-testid="skel">Loading</div>}
			/>,
		);
		expect(container.querySelector('[data-comp="session-card"]')).toBeInTheDocument();
	});

	it("renders IP address for non-current session", () => {
		const otherSession = { ...mockSession, isCurrent: false };
		render(<SessionCard session={otherSession} onRevoke={vi.fn()} />);
		expect(screen.getByText("192.168.1.100")).toBeInTheDocument();
	});

	it("renders with location for non-current session", () => {
		const otherSession = { ...mockSession, isCurrent: false };
		render(<SessionCard session={otherSession} onRevoke={vi.fn()} />);
		expect(screen.getByText("San Francisco, CA, USA")).toBeInTheDocument();
	});
});
