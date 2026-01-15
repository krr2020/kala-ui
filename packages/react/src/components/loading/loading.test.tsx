import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoader } from "./page-loader";
import { SectionLoader } from "./section-loader";

describe("PageLoader", () => {
	it("renders with default message", () => {
		render(<PageLoader />);
		expect(screen.getAllByText("Loading...")[0]).toBeInTheDocument();
	});

	it("renders with custom message", () => {
		render(<PageLoader message="Loading page content..." />);
		expect(
			screen.getAllByText("Loading page content...")[0],
		).toBeInTheDocument();
	});

	it("has proper accessibility attributes", () => {
		const { container } = render(<PageLoader />);
		const loader = container.querySelector('[data-slot="page-loader"]');
		expect(loader).toHaveAttribute("role", "status");
		expect(loader).toHaveAttribute("aria-live", "polite");
		expect(loader).toHaveAttribute("aria-busy", "true");
	});

	it("applies custom className", () => {
		const { container } = render(<PageLoader className="custom-class" />);
		const loader = container.querySelector('[data-slot="page-loader"]');
		expect(loader).toHaveClass("custom-class");
	});

	it("forwards ref correctly", () => {
		const ref = { current: null };
		render(<PageLoader ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});

describe("SectionLoader", () => {
	it("renders with default message", () => {
		render(<SectionLoader />);
		expect(screen.getAllByText("Loading...")[0]).toBeInTheDocument();
	});

	it("renders with custom message", () => {
		render(<SectionLoader message="Loading section data..." />);
		expect(
			screen.getAllByText("Loading section data...")[0],
		).toBeInTheDocument();
	});

	it("has proper accessibility attributes", () => {
		const { container } = render(<SectionLoader />);
		const loader = container.querySelector('[data-slot="section-loader"]');
		expect(loader).toHaveAttribute("role", "status");
		expect(loader).toHaveAttribute("aria-live", "polite");
		expect(loader).toHaveAttribute("aria-busy", "true");
	});

	it("applies custom minHeight", () => {
		const { container } = render(<SectionLoader minHeight="400px" />);
		const loader = container.querySelector('[data-slot="section-loader"]');
		expect(loader).toHaveStyle({ minHeight: "400px" });
	});

	it("applies default minHeight", () => {
		const { container } = render(<SectionLoader />);
		const loader = container.querySelector('[data-slot="section-loader"]');
		expect(loader).toHaveStyle({ minHeight: "200px" });
	});

	it("forwards ref correctly", () => {
		const ref = { current: null };
		render(<SectionLoader ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
