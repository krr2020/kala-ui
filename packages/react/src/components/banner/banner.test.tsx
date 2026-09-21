import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { bannerStyles } from "../../config/banner";
import { Banner } from "./banner";

describe("Banner", () => {
	it("should render banner with children", () => {
		render(<Banner>Test banner message</Banner>);
		expect(screen.getByText("Test banner message")).toBeInTheDocument();
	});

	it("should render with default variant (info)", () => {
		render(<Banner>Info message</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("bg-info", "text-info-foreground");
	});

	it("should render with warning variant", () => {
		render(<Banner color="warning">Warning message</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("bg-warning", "text-warning-foreground");
	});

	it("should render with error variant", () => {
		render(<Banner color="destructive">Error message</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("bg-destructive", "text-destructive-foreground");
	});

	it("should render with success variant", () => {
		render(<Banner color="success">Success message</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("bg-success", "text-success-foreground");
	});

	it("should render with fixed position by default", () => {
		render(<Banner>Fixed banner</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("fixed", "top-0", "left-0", "right-0");
	});

	it("should render with static position", () => {
		render(<Banner position="static">Static banner</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("relative");
		expect(banner).not.toHaveClass("fixed");
	});

	it("should render with variant axis arms", () => {
		render(
			<Banner variant="subtle" color="primary">
				Subtle
			</Banner>,
		);
		expect(screen.getByRole("status")).toHaveClass(
			"bg-primary/10",
			"text-primary",
		);
	});

	it("should render outline variant arms", () => {
		render(
			<Banner variant="outline" color="destructive">
				Outline
			</Banner>,
		);
		expect(screen.getByRole("status")).toHaveClass(
			"border-destructive",
			"text-destructive",
		);
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
		const banner = screen.getByRole("status");
		expect(banner).toHaveClass("custom-class");
	});

	it("should render with custom role", () => {
		render(<Banner role="alert">Alert banner</Banner>);
		const banner = screen.getByRole("alert");
		expect(banner).toBeInTheDocument();
	});

	it("should render with aria-live attribute", () => {
		render(<Banner aria-live="assertive">Live banner</Banner>);
		const banner = screen.getByRole("status");
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

	// NEW TESTS BELOW

	it("should render with role='status'", () => {
		render(<Banner role="status">Status banner</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toBeInTheDocument();
	});

	it("should render with aria-live='polite'", () => {
		render(<Banner aria-live="polite">Polite banner</Banner>);
		const banner = screen.getByRole("status");
		expect(banner).toHaveAttribute("aria-live", "polite");
	});

	it("should render with isLoading and custom skeleton", () => {
		render(
			<Banner isLoading skeleton={<div data-testid="custom-skel">Loading</div>}>
				Content
			</Banner>,
		);
		expect(screen.getByTestId("custom-skel")).toBeInTheDocument();
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("should render with isLoading and skeletonConfig (uses BannerSkeleton)", () => {
		render(
			<Banner isLoading skeletonConfig={{ color: "warning" }}>
				Content
			</Banner>,
		);
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("should render with isLoading and no skeleton props (uses default BannerSkeleton)", () => {
		render(<Banner isLoading>Content</Banner>);
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("should expose the bannerStyles config table", () => {
		expect(bannerStyles.base).toContain(
			"w-full z-50 px-4 py-3 text-sm font-medium flex items-center justify-between gap-4",
		);
		expect(bannerStyles.variants.position.static).toBe("relative");
		expect(bannerStyles.defaultVariants).toEqual({
			variant: "solid",
			color: "info",
			position: "fixed",
		});
	});

	it("should render as a consumer element via asChild", () => {
		render(
			<Banner asChild>
				<a href="/x">link banner</a>
			</Banner>,
		);
		// the banner role="status" is part of the merged props, so query by href
		const link = screen.getByRole("status");
		expect(link.tagName).toBe("A");
		expect(link).toHaveAttribute("href", "/x");
		expect(link).toHaveAttribute("data-kala-component", "banner");
		expect(link).toHaveClass("bg-info");
	});

	it("should use dismissLabel for the close button aria-label", () => {
		const { rerender } = render(
			<Banner onClose={vi.fn()} dismissLabel="Cerrar aviso">
				Closable banner
			</Banner>,
		);
		expect(
			screen.getByRole("button", { name: "Cerrar aviso" }),
		).toBeInTheDocument();

		rerender(<Banner onClose={vi.fn()}>Closable banner</Banner>);
		expect(
			screen.getByRole("button", { name: "Close banner" }),
		).toBeInTheDocument();
	});
});
