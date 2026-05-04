import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Paper } from "./paper";

describe("Paper", () => {
	it("renders correctly", () => {
		render(<Paper>Content</Paper>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies shadow class", () => {
		render(
			<Paper data-testid="paper" shadow="md">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow-md");
	});

	it("applies border class", () => {
		render(
			<Paper data-testid="paper" withBorder>
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("border");
	});

	it("renders as div by default", () => {
		const { container } = render(<Paper data-testid="paper">Test</Paper>);
		expect(container.querySelector("div")).toBeInTheDocument();
	});

	it("renders as child element when asChild is true", () => {
		render(
			<Paper asChild data-testid="paper">
				<article>Paper Article</article>
			</Paper>,
		);
		const el = screen.getByTestId("paper");
		expect(el.tagName).toBe("ARTICLE");
	});

	it("applies shadow none", () => {
		render(
			<Paper data-testid="paper" shadow="none">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow-none");
	});

	it("applies shadow xs", () => {
		render(
			<Paper data-testid="paper" shadow="xs">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow-sm");
	});

	it("applies shadow sm", () => {
		render(
			<Paper data-testid="paper" shadow="sm">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow");
	});

	it("applies shadow lg", () => {
		render(
			<Paper data-testid="paper" shadow="lg">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow-lg");
	});

	it("applies shadow xl", () => {
		render(
			<Paper data-testid="paper" shadow="xl">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("shadow-xl");
	});

	it("applies radius none", () => {
		render(
			<Paper data-testid="paper" radius="none">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("rounded-none");
	});

	it("applies radius md", () => {
		render(
			<Paper data-testid="paper" radius="md">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("rounded-md");
	});

	it("applies radius lg", () => {
		render(
			<Paper data-testid="paper" radius="lg">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("rounded-lg");
	});

	it("applies radius xl", () => {
		render(
			<Paper data-testid="paper" radius="xl">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("rounded-xl");
	});

	it("applies radius full", () => {
		render(
			<Paper data-testid="paper" radius="full">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("rounded-full");
	});

	it("applies custom className", () => {
		render(
			<Paper data-testid="paper" className="my-paper">
				Content
			</Paper>,
		);
		expect(screen.getByTestId("paper")).toHaveClass("my-paper");
	});
});
