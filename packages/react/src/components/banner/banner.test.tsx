import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "./banner";

describe("Banner", () => {
	it("should render banner with children", () => {
		render(<Banner>Test banner message</Banner>);
		expect(screen.getByText("Test banner message")).toBeInTheDocument();
	});

	it("should render with default variant (info)", () => {
		render(<Banner>Info message</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("bg-info", "text-info-foreground");
	});

	it("should render with warning variant", () => {
		render(<Banner variant="warning">Warning message</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("bg-warning", "text-warning-foreground");
	});

	it("should render with error variant", () => {
		render(<Banner variant="error">Error message</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("bg-destructive", "text-destructive-foreground");
	});

	it("should render with success variant", () => {
		render(<Banner variant="success">Success message</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("bg-success", "text-success-foreground");
	});

	it("should render with fixed position by default", () => {
		render(<Banner>Fixed banner</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("fixed", "top-0", "left-0", "right-0");
	});

	it("should render with static position", () => {
		render(<Banner position="static">Static banner</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("relative");
		expect(banner).not.toHaveClass("fixed");
	});

	it("should render close button when onClose is provided", () => {
		const onClose = vi.fn();
		render(<Banner onClose={onClose}>Closable banner</Banner>);

		const closeButton = screen.getByRole("button", { name: /close banner/i });
		expect(closeButton).toBeInTheDocument();
	});

	it("should not render close button when onClose is not provided", () => {
		render(<Banner>Non-closable banner</Banner>);

		const closeButton = screen.queryByRole("button", { name: /close banner/i });
		expect(closeButton).not.toBeInTheDocument();
	});

	it("should call onClose when close button is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(<Banner onClose={onClose}>Closable banner</Banner>);

		const closeButton = screen.getByRole("button", { name: /close banner/i });
		await user.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("should apply custom className", () => {
		render(<Banner className="custom-class">Custom banner</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveClass("custom-class");
	});

	it("should render with custom role", () => {
		render(<Banner role="alert">Alert banner</Banner>);
		const banner = screen.getByRole("alert");
		expect(banner).toBeInTheDocument();
	});

	it("should render with aria-live attribute", () => {
		render(<Banner aria-live="assertive">Live banner</Banner>);
		const banner = screen.getByRole("banner");
		expect(banner).toHaveAttribute("aria-live", "assertive");
	});

	it("should forward additional props to div element", () => {
		render(<Banner data-testid="custom-banner">Test</Banner>);
		expect(screen.getByTestId("custom-banner")).toBeInTheDocument();
	});

	it("should render with multiple children", () => {
		render(
			<Banner>
				<span>First</span>
				<span>Second</span>
			</Banner>,
		);
		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});
});
