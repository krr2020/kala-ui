/**
 * Banner Component Tests
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "../banner";

describe("Banner", () => {
	it("should render children", () => {
		render(<Banner>Test banner content</Banner>);
		expect(screen.getByText("Test banner content")).toBeInTheDocument();
	});

	it("should render with info variant by default", () => {
		const { container } = render(<Banner>Info banner</Banner>);
		const banner = container.firstChild;
		expect(banner).toHaveClass("bg-info");
	});

	it("should render with warning variant", () => {
		const { container } = render(
			<Banner variant="warning">Warning banner</Banner>,
		);
		const banner = container.firstChild;
		expect(banner).toHaveClass("bg-warning");
	});

	it("should render with error variant", () => {
		const { container } = render(<Banner variant="error">Error banner</Banner>);
		const banner = container.firstChild;
		expect(banner).toHaveClass("bg-destructive");
	});

	it("should render with success variant", () => {
		const { container } = render(
			<Banner variant="success">Success banner</Banner>,
		);
		const banner = container.firstChild;
		expect(banner).toHaveClass("bg-success");
	});

	it("should render close button when onClose provided", () => {
		const handleClose = vi.fn();
		render(<Banner onClose={handleClose}>Closeable banner</Banner>);

		const closeButton = screen.getByRole("button", { name: /close banner/i });
		expect(closeButton).toBeInTheDocument();
	});

	it("should not render close button when onClose not provided", () => {
		render(<Banner>Non-closeable banner</Banner>);

		const closeButton = screen.queryByRole("button", { name: /close banner/i });
		expect(closeButton).not.toBeInTheDocument();
	});

	it("should call onClose when close button clicked", () => {
		const handleClose = vi.fn();
		render(<Banner onClose={handleClose}>Closeable banner</Banner>);

		const closeButton = screen.getByRole("button", { name: /close banner/i });
		fireEvent.click(closeButton);

		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Banner className="custom-class">Custom banner</Banner>,
		);
		const banner = container.firstChild;
		expect(banner).toHaveClass("custom-class");
	});

	it("should be fixed at top with high z-index", () => {
		const { container } = render(<Banner>Sticky banner</Banner>);
		const banner = container.firstChild;
		expect(banner).toHaveClass("fixed", "top-0", "z-50");
	});
});
