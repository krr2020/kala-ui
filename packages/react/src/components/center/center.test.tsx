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
});
