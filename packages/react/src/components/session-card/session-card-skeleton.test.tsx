import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SessionCardSkeleton } from "./session-card-skeleton";

describe("SessionCardSkeleton", () => {
	it("renders with default props", () => {
		render(<SessionCardSkeleton />);
		expect(screen.getByTestId("session-card-skeleton")).toBeInTheDocument();
	});

	it("renders with custom data-testid", () => {
		render(<SessionCardSkeleton data-testid="custom-session-skel" />);
		expect(screen.getByTestId("custom-session-skel")).toBeInTheDocument();
	});

	it("renders revoke button by default (showRevokeButton=true)", () => {
		render(<SessionCardSkeleton />);
		expect(screen.getByTestId("session-card-skeleton")).toBeInTheDocument();
	});

	it("renders with showBadge=true", () => {
		render(<SessionCardSkeleton showBadge={true} />);
		expect(screen.getByTestId("session-card-skeleton")).toBeInTheDocument();
	});

	it("renders with showRevokeButton=false", () => {
		render(<SessionCardSkeleton showBadge={false} showRevokeButton={false} />);
		expect(screen.getByTestId("session-card-skeleton")).toBeInTheDocument();
	});

	it("renders with showBadge=true and showRevokeButton=false (badge takes precedence)", () => {
		render(<SessionCardSkeleton showBadge={true} showRevokeButton={false} />);
		expect(screen.getByTestId("session-card-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<SessionCardSkeleton className="extra-class" />,
		);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("has compound component SessionCardSkeleton.Skeleton", () => {
		expect(SessionCardSkeleton.Skeleton).toBe(SessionCardSkeleton);
	});
});
