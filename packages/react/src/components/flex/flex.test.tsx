import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flex } from "./flex";

describe("Flex", () => {
	it("renders children correctly", () => {
		render(<Flex>Content</Flex>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies default classes", () => {
		render(<Flex data-testid="flex">Content</Flex>);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex");
		expect(flex).toHaveClass("flex-row");
	});

	it("applies custom direction", () => {
		render(
			<Flex data-testid="flex" direction="column">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-col");
	});

	it("applies custom gap", () => {
		render(
			<Flex data-testid="flex" gap={4}>
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("gap-4");
	});

	it("renders as div by default", () => {
		const { container } = render(<Flex data-testid="flex">Test</Flex>);
		expect(container.querySelector("div")).toBeInTheDocument();
	});

	it("renders as child element when asChild is true", () => {
		render(
			<Flex asChild data-testid="flex">
				<nav>Navigation</nav>
			</Flex>,
		);
		const el = screen.getByTestId("flex");
		expect(el.tagName).toBe("NAV");
	});

	it("renders with custom as element", () => {
		render(
			<Flex as="section" data-testid="flex">
				Section Content
			</Flex>,
		);
		const el = screen.getByTestId("flex");
		expect(el.tagName).toBe("SECTION");
	});

	it("renders with as main element", () => {
		render(
			<Flex as="main" data-testid="flex">
				Main Content
			</Flex>,
		);
		const el = screen.getByTestId("flex");
		expect(el.tagName).toBe("MAIN");
	});

	it("applies row reverse direction", () => {
		render(
			<Flex data-testid="flex" direction="rowReverse">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-row-reverse");
	});

	it("applies column reverse direction", () => {
		render(
			<Flex data-testid="flex" direction="columnReverse">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-col-reverse");
	});

	it("applies wrap", () => {
		render(
			<Flex data-testid="flex" wrap="wrap">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-wrap");
	});

	it("applies wrap reverse", () => {
		render(
			<Flex data-testid="flex" wrap="wrapReverse">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-wrap-reverse");
	});

	it("applies align start", () => {
		render(
			<Flex data-testid="flex" align="start">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("items-start");
	});

	it("applies align center", () => {
		render(
			<Flex data-testid="flex" align="center">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("items-center");
	});

	it("applies align end", () => {
		render(
			<Flex data-testid="flex" align="end">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("items-end");
	});

	it("applies align baseline", () => {
		render(
			<Flex data-testid="flex" align="baseline">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("items-baseline");
	});

	it("applies justify center", () => {
		render(
			<Flex data-testid="flex" justify="center">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("justify-center");
	});

	it("applies justify end", () => {
		render(
			<Flex data-testid="flex" justify="end">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("justify-end");
	});

	it("applies justify between", () => {
		render(
			<Flex data-testid="flex" justify="between">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("justify-between");
	});

	it("applies justify around", () => {
		render(
			<Flex data-testid="flex" justify="around">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("justify-around");
	});

	it("applies justify evenly", () => {
		render(
			<Flex data-testid="flex" justify="evenly">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("justify-evenly");
	});

	it("applies grow true", () => {
		render(
			<Flex data-testid="flex" grow>
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-grow");
	});

	it("applies grow false", () => {
		render(
			<Flex data-testid="flex" grow={false}>
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-grow-0");
	});

	it("applies shrink true", () => {
		render(
			<Flex data-testid="flex" shrink>
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-shrink");
	});

	it("applies shrink false", () => {
		render(
			<Flex data-testid="flex" shrink={false}>
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("flex-shrink-0");
	});

	it("applies custom className", () => {
		render(
			<Flex data-testid="flex" className="my-flex">
				Content
			</Flex>,
		);
		const flex = screen.getByTestId("flex");
		expect(flex).toHaveClass("my-flex");
	});
});
