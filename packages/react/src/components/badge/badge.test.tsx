import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
	it("should render badge with text", () => {
		render(<Badge>Badge</Badge>);
		expect(screen.getByText("Badge")).toBeInTheDocument();
	});

	it("should render with default variant", () => {
		const { container } = render(<Badge>Default</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toBeInTheDocument();
	});

	it("should render with secondary variant", () => {
		render(<Badge variant="secondary">Secondary</Badge>);
		expect(screen.getByText("Secondary")).toBeInTheDocument();
	});

	it("should render with danger variant", () => {
		render(<Badge variant="danger">Danger</Badge>);
		expect(screen.getByText("Danger")).toBeInTheDocument();
	});

	it("should render with secondary variant", () => {
		render(<Badge variant="secondary">Secondary</Badge>);
		expect(screen.getByText("Secondary")).toBeInTheDocument();
	});

	it("should render with success variant", () => {
		const { container } = render(<Badge variant="success">Success</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("bg-success");
	});

	it("should render with warning variant", () => {
		const { container } = render(<Badge variant="warning">Warning</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("bg-warning");
	});

	it("should render with danger variant styling", () => {
		const { container } = render(<Badge variant="danger">Error</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("bg-destructive");
	});

	it("should render with error variant styling", () => {
		const { container } = render(<Badge variant="error">Error</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("bg-error");
	});

	it("should render with info variant", () => {
		const { container } = render(<Badge variant="info">Info</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("bg-info");
	});

	it("should apply custom className", () => {
		const { container } = render(<Badge className="custom-badge">Test</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toHaveClass("custom-badge");
	});

	it("should render as anchor when asChild is true", () => {
		render(
			<Badge asChild>
				<a href="/test">Link Badge</a>
			</Badge>,
		);
		const link = screen.getByRole("link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
	});

	it("should render with icon", () => {
		render(
			<Badge>
				<svg data-testid="badge-icon" />
				Badge with Icon
			</Badge>,
		);
		expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
	});

	it("should render loading skeleton when isLoading is true", () => {
		const { container } = render(<Badge isLoading>Loading</Badge>);
		expect(container.querySelector('[class*="animate-pulse"]')).toBeInTheDocument();
		expect(screen.queryByText("Loading")).not.toBeInTheDocument();
	});

	it("should render loading skeleton with custom className", () => {
		const { container } = render(
			<Badge isLoading className="custom-loading">Loading</Badge>,
		);
		const skeleton = container.querySelector('[class*="animate-pulse"]');
		expect(skeleton?.className).toContain("custom-loading");
	});

	it("should render outline variant", () => {
		const { container } = render(<Badge variant="outline">Outline</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toBeInTheDocument();
	});

	it("should render with default shape", () => {
		const { container } = render(<Badge>Default Shape</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toBeInTheDocument();
	});

	it("should render with custom shape", () => {
		const { container } = render(<Badge shape="square">Square</Badge>);
		const badge = container.querySelector('[data-slot="badge"]');
		expect(badge).toBeInTheDocument();
	});

	it("should render as span when asChild is false (default)", () => {
		const { container } = render(<Badge>Span Badge</Badge>);
		expect(container.querySelector("span[data-slot='badge']")).toBeInTheDocument();
	});

	it("should not render data-slot when isLoading", () => {
		const { container } = render(<Badge isLoading>Hidden</Badge>);
		expect(container.querySelector('[data-slot="badge"]')).toBeNull();
	});
});
