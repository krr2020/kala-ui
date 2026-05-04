import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Center } from "./center";

describe("Center", () => {
	it("renders content centered", () => {
		render(<Center data-testid="center">Content</Center>);
		const center = screen.getByTestId("center");
		expect(center).toHaveClass("flex");
		expect(center).toHaveClass("items-center");
		expect(center).toHaveClass("justify-center");
	});

	it("renders inline when prop is set", () => {
		render(
			<Center data-testid="center" inline>
				Content
			</Center>,
		);
		const center = screen.getByTestId("center");
		expect(center).toHaveClass("inline-flex");
	});

	it("renders as Slot when asChild is true", () => {
		const { container } = render(
			<Center asChild>
				<span data-testid="center-child">Child</span>
			</Center>,
		);
		const child = screen.getByTestId("center-child");
		expect(child).toHaveClass("flex", "items-center", "justify-center");
		expect(container.querySelector("div")).toBeNull();
	});

	it("applies custom className", () => {
		render(<Center className="custom-center">Content</Center>);
		expect(screen.getByText("Content")).toHaveClass("custom-center");
	});
});
