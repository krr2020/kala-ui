import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Burger } from "./burger";

describe("Burger", () => {
	it("renders correctly", () => {
		render(<Burger />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("handles click events", () => {
		const handleClick = vi.fn();
		render(<Burger onClick={handleClick} />);
		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("has correct aria attributes", () => {
		const { rerender } = render(<Burger opened={false} />);
		let button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "false");
		expect(button).toHaveAttribute("aria-label", "Open navigation");

		rerender(<Burger opened={true} />);
		button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "true");
		expect(button).toHaveAttribute("aria-label", "Close navigation");
	});
});
