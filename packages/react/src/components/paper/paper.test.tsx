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
});
