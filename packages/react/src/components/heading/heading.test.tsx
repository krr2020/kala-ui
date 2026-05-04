import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading, headingVariants } from "./heading";

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

	it("renders as h4 with size prop", () => {
		render(<Heading size="h4">H4 Text</Heading>);
		expect(screen.getByText("H4 Text").tagName).toBe("H4");
	});

	it("renders as h5 with size prop", () => {
		render(<Heading size="h5">H5 Text</Heading>);
		expect(screen.getByText("H5 Text").tagName).toBe("H5");
	});

	it("renders as h6 with size prop", () => {
		render(<Heading size="h6">H6 Text</Heading>);
		expect(screen.getByText("H6 Text").tagName).toBe("H6");
	});

	it("renders with right align", () => {
		render(<Heading align="right">Right</Heading>);
		expect(screen.getByText("Right")).toHaveClass("text-right");
	});

	it("renders with left align", () => {
		render(<Heading align="left">Left</Heading>);
		expect(screen.getByText("Left")).toHaveClass("text-left");
	});

	it("renders with medium weight", () => {
		render(<Heading weight="medium">Medium</Heading>);
		expect(screen.getByText("Medium")).toHaveClass("font-medium");
	});

	it("renders with semibold weight", () => {
		render(<Heading weight="semibold">Semibold</Heading>);
		expect(screen.getByText("Semibold")).toHaveClass("font-semibold");
	});

	it("renders as Slot when asChild is true", () => {
		render(
			<Heading asChild>
				<span>Slotted Heading</span>
			</Heading>,
		);
		const el = screen.getByText("Slotted Heading");
		expect(el.tagName).toBe("SPAN");
		expect(el).toHaveClass("font-bold");
	});

	it("renders with custom as element", () => {
		render(<Heading as="h3">Custom As</Heading>);
		expect(screen.getByText("Custom As").tagName).toBe("H3");
	});

	it("applies custom className", () => {
		render(<Heading className="custom-heading">Custom</Heading>);
		expect(screen.getByText("Custom")).toHaveClass("custom-heading");
	});

	it("exports headingVariants", () => {
		expect(headingVariants).toBeDefined();
	});
});
