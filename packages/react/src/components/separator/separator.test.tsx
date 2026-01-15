import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
	it("should render horizontal separator by default", () => {
		const { container } = render(<Separator />);
		const separator = container.querySelector('[data-slot="separator"]');
		expect(separator).toBeInTheDocument();
		expect(separator).toHaveAttribute("data-orientation", "horizontal");
	});

	it("should render vertical separator", () => {
		const { container } = render(<Separator orientation="vertical" />);
		const separator = container.querySelector('[data-slot="separator"]');
		expect(separator).toHaveAttribute("data-orientation", "vertical");
	});

	it("should apply custom className", () => {
		const { container } = render(<Separator className="custom-separator" />);
		const separator = container.querySelector('[data-slot="separator"]');
		expect(separator).toHaveClass("custom-separator");
	});

	it("should be decorative by default", () => {
		const { container } = render(<Separator />);
		const separator = container.querySelector('[data-slot="separator"]');
		expect(separator).toHaveAttribute("data-orientation");
	});

	it("should render as non-decorative", () => {
		const { container } = render(<Separator decorative={false} />);
		const separator = container.querySelector('[data-slot="separator"]');
		expect(separator).toBeInTheDocument();
	});
});
