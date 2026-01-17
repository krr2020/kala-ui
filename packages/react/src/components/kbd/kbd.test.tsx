import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

describe("Kbd", () => {
	it("renders correctly", () => {
		render(<Kbd>Ctrl</Kbd>);
		const kbd = screen.getByText("Ctrl");
		expect(kbd.tagName).toBe("KBD");
		expect(kbd).toHaveClass("font-mono");
	});

	it("applies size classes", () => {
		render(<Kbd size="lg">Large</Kbd>);
		const kbd = screen.getByText("Large");
		expect(kbd).toHaveClass("text-base");
	});
});
