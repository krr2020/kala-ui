import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipToContent } from "./skip-to-content";

describe("SkipToContent", () => {
	it("should render with default props", () => {
		render(<SkipToContent />);
		const link = screen.getByText("Skip to main content");
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "#main-content");
	});

	it("should use custom targetId", () => {
		render(<SkipToContent targetId="custom-main" />);
		const link = screen.getByText("Skip to main content");
		expect(link).toHaveAttribute("href", "#custom-main");
	});

	it("should use custom text", () => {
		render(<SkipToContent text="Skip navigation" />);
		expect(screen.getByText("Skip navigation")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<SkipToContent className="custom-skip-link" />,
		);
		const link = container.querySelector("a");
		expect(link).toHaveClass("custom-skip-link");
	});

	it("should have sr-only class by default", () => {
		const { container } = render(<SkipToContent />);
		const link = container.querySelector("a");
		expect(link).toHaveClass("sr-only");
	});

	it("should be keyboard accessible", () => {
		render(<SkipToContent />);
		const link = screen.getByText("Skip to main content");
		expect(link.tagName).toBe("A");
		expect(link).toHaveAttribute("href");
	});
});
