import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Group } from "./group";

describe("Group", () => {
	it("renders children correctly", () => {
		render(<Group>Content</Group>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies default classes (inheriting from Flex)", () => {
		render(<Group data-testid="group">Content</Group>);
		const group = screen.getByTestId("group");
		expect(group).toHaveClass("flex");
		expect(group).toHaveClass("flex-row");
		expect(group).toHaveClass("gap-4");
	});

	it("applies custom gap", () => {
		render(
			<Group data-testid="group" gap={8}>
				Content
			</Group>,
		);
		const group = screen.getByTestId("group");
		expect(group).toHaveClass("gap-8");
	});
});
