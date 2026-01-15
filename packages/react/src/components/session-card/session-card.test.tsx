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
});
