import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("Container", () => {
	it("renders children correctly", () => {
		render(<Container>Content</Container>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies default variant classes", () => {
		render(<Container data-testid="container">Content</Container>);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("mx-auto");
		expect(container).toHaveClass("max-w-screen-xl");
	});

	it("applies custom size class", () => {
		render(
			<Container data-testid="container" size="sm">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("max-w-screen-sm");
	});

	it("applies centered class", () => {
		render(
			<Container data-testid="container" centered>
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("flex");
		expect(container).toHaveClass("items-center");
		expect(container).toHaveClass("justify-center");
	});

	it("renders as div by default", () => {
		const { container } = render(<Container data-testid="container">Test</Container>);
		expect(container.querySelector("div")).toBeInTheDocument();
	});

	it("renders as child element when asChild is true", () => {
		render(
			<Container asChild data-testid="container">
				<section>As child</section>
			</Container>,
		);
		const el = screen.getByTestId("container");
		expect(el.tagName).toBe("SECTION");
	});

	it("applies md size class", () => {
		render(
			<Container data-testid="container" size="md">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("max-w-screen-md");
	});

	it("applies lg size class", () => {
		render(
			<Container data-testid="container" size="lg">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("max-w-screen-lg");
	});

	it("applies 2xl size class", () => {
		render(
			<Container data-testid="container" size="2xl">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("max-w-screen-2xl");
	});

	it("applies full size class", () => {
		render(
			<Container data-testid="container" size="full">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("max-w-none");
	});

	it("applies custom className", () => {
		render(
			<Container data-testid="container" className="my-container">
				Content
			</Container>,
		);
		const container = screen.getByTestId("container");
		expect(container).toHaveClass("my-container");
	});
});
