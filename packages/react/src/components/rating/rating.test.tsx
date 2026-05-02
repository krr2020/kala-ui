import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "./rating";

describe("Rating", () => {
	it("should render 5 stars by default", () => {
		render(<Rating />);
		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBe(5);
	});

	it("should render custom count of stars", () => {
		render(<Rating count={3} />);
		expect(screen.getAllByRole("button").length).toBe(3);
	});

	it("should call onChange when star is clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Rating onChange={handleChange} />);

		await user.click(screen.getByLabelText("3 stars"));
		expect(handleChange).toHaveBeenCalledWith(3);
	});

	it("should toggle off when same star is clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Rating defaultValue={3} onChange={handleChange} />);

		await user.click(screen.getByLabelText("3 stars"));
		expect(handleChange).toHaveBeenCalledWith(0);
	});

	it("should mark stars as pressed based on value", () => {
		render(<Rating value={3} onChange={vi.fn()} />);
		expect(screen.getByLabelText("1 star")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByLabelText("3 stars")).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByLabelText("4 stars")).toHaveAttribute(
			"aria-pressed",
			"false",
		);
	});

	it("should not call onChange in readOnly mode", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Rating readOnly value={3} onChange={handleChange} />);

		await user.click(screen.getByLabelText("1 star"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should render all buttons as disabled in readOnly", () => {
		render(<Rating readOnly />);
		expect(
			screen.getAllByRole("button").every((b) => b.hasAttribute("disabled")),
		).toBe(true);
	});

	it("should render as disabled", () => {
		render(<Rating disabled />);
		expect(
			screen.getAllByRole("button").every((b) => b.hasAttribute("disabled")),
		).toBe(true);
	});

	it("should apply data-slot", () => {
		const { container } = render(<Rating />);
		expect(container.querySelector('[data-slot="rating"]')).toBeInTheDocument();
	});

	it("should have correct aria-label on group", () => {
		render(<Rating aria-label="Product rating" />);
		expect(
			screen.getByRole("group", { name: "Product rating" }),
		).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(<Rating className="custom-rating" />);
		expect(container.querySelector('[data-slot="rating"]')).toHaveClass(
			"custom-rating",
		);
	});
});
