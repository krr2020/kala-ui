import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

describe("Heading", () => {
	it("renders children correctly", () => {
		render(<Heading>Heading Text</Heading>);
		expect(screen.getByText("Heading Text")).toBeInTheDocument();
	});

	it("renders as h2 by default", () => {
		render(<Heading>Heading Text</Heading>);
		const heading = screen.getByText("Heading Text");
		expect(heading.tagName).toBe("H2");
	});

	it("renders as different levels based on size", () => {
		const { rerender } = render(<Heading size="h1">Heading Text</Heading>);
		expect(screen.getByText("Heading Text").tagName).toBe("H1");

		rerender(<Heading size="h3">Heading Text</Heading>);
		expect(screen.getByText("Heading Text").tagName).toBe("H3");
	});

	it("applies variant classes", () => {
		render(
			<Heading align="center" weight="extrabold">
				Heading Text
			</Heading>,
		);
		const heading = screen.getByText("Heading Text");
		expect(heading).toHaveClass("text-center");
		expect(heading).toHaveClass("font-extrabold");
	});
});
