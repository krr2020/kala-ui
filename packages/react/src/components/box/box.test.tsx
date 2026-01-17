import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Box } from "./box";

describe("Box", () => {
	it("renders children correctly", () => {
		render(<Box>Content</Box>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies className", () => {
		render(
			<Box data-testid="box" className="test-class">
				Content
			</Box>,
		);
		const box = screen.getByTestId("box");
		expect(box).toHaveClass("test-class");
	});

	it("renders as child", () => {
		render(
			<Box asChild>
				<button type="button">Button</button>
			</Box>,
		);
		const button = screen.getByText("Button");
		expect(button.tagName).toBe("BUTTON");
	});

	it("forwards ref", () => {
		const ref = { current: null };
		render(<Box ref={ref}>Content</Box>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
