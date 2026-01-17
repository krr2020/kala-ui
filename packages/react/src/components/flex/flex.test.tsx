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
});
