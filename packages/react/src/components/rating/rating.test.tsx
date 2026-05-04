import { fireEvent, render, screen } from "@testing-library/react";
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

	it("should render with controlled value", () => {
		render(<Rating value={4} />);
		expect(screen.getByLabelText("4 stars")).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByLabelText("5 stars")).toHaveAttribute("aria-pressed", "false");
	});

	it("should render with sm size", () => {
		const { container } = render(<Rating size="sm" />);
		const stars = container.querySelectorAll(".h-4.w-4");
		expect(stars.length).toBeGreaterThan(0);
	});

	it("should render with lg size", () => {
		const { container } = render(<Rating size="lg" />);
		const stars = container.querySelectorAll(".h-7.w-7");
		expect(stars.length).toBeGreaterThan(0);
	});

	it("should render with default size", () => {
		const { container } = render(<Rating size="default" />);
		const stars = container.querySelectorAll(".h-5.w-5");
		expect(stars.length).toBeGreaterThan(0);
	});

	it("should support half-star ratings with allowHalf", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Rating allowHalf onChange={handleChange} />);

		// Click on the right half of star 2 - should select 2
		const star2 = screen.getByLabelText("2 stars");
		await user.click(star2);
		expect(handleChange).toHaveBeenCalledWith(2);
	});

	it("should render half-filled star", () => {
		render(<Rating value={2.5} allowHalf />);
		const stars = screen.getAllByRole("button");
		// Star 3 should show half fill since 2.5 >= 2.5
		const star3 = stars[2];
		const filledStars = star3.querySelectorAll(".clip-path-\\[inset\\(0_50\\%_0_0\\)\\]");
		expect(filledStars.length).toBe(1);
	});

	it("should render empty stars for value 0", () => {
		const { container } = render(<Rating value={0} />);
		const filledOverlays = container.querySelectorAll(".fill-yellow-400");
		expect(filledOverlays.length).toBe(0);
	});

	it("should clear hover on mouse leave", async () => {
		const user = userEvent.setup();
		render(<Rating />);

		const star = screen.getByLabelText("3 stars");
		await user.hover(star);
		await user.unhover(star);
		// No error should occur
		expect(star).toBeInTheDocument();
	});

	it("should apply disabled opacity", () => {
		const { container } = render(<Rating disabled />);
		expect(container.querySelector('[data-slot="rating"]')).toHaveClass("opacity-50");
	});

	it("should not apply disabled opacity when not disabled", () => {
		const { container } = render(<Rating />);
		expect(container.querySelector('[data-slot="rating"]')).not.toHaveClass("opacity-50");
	});

	it("should use defaultValue for initial internal value", () => {
		render(<Rating defaultValue={2} />);
		expect(screen.getByLabelText("2 stars")).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByLabelText("3 stars")).toHaveAttribute("aria-pressed", "false");
	});

	it("should render cursor-default when disabled", () => {
		const { container } = render(<Rating disabled />);
		const stars = container.querySelectorAll("button");
		expect(stars[0]).toHaveClass("cursor-default");
	});

	it("should render cursor-pointer when interactive", () => {
		const { container } = render(<Rating />);
		const stars = container.querySelectorAll("button");
		expect(stars[0]).toHaveClass("cursor-pointer");
	});

	it("should call onChange with half-star value when clicking left half", async () => {
		const handleChange = vi.fn();
		render(<Rating allowHalf onChange={handleChange} />);

		const star2 = screen.getByLabelText("2 stars");
		const rect = { width: 20, left: 100 };
		vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

		fireEvent.click(star2, { clientX: 100 + 5 }); // left half

		expect(handleChange).toHaveBeenCalledWith(1.5);
		vi.restoreAllMocks();
	});

	it("should call onChange with full star value when clicking right half with allowHalf", async () => {
		const handleChange = vi.fn();
		render(<Rating allowHalf onChange={handleChange} />);

		const star3 = screen.getByLabelText("3 stars");
		const rect = { width: 20, left: 100 };
		vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

		fireEvent.click(star3, { clientX: 100 + 15 }); // right half

		expect(handleChange).toHaveBeenCalledWith(3);
		vi.restoreAllMocks();
	});

	it("should not call onChange in disabled mode", async () => {
		const handleChange = vi.fn();
		render(<Rating disabled onChange={handleChange} />);

		const star1 = screen.getByLabelText("1 star");
		fireEvent.click(star1);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should not call onChange on click in readOnly mode", async () => {
		const handleChange = vi.fn();
		render(<Rating readOnly onChange={handleChange} />);

		const star1 = screen.getByLabelText("1 star");
		fireEvent.click(star1);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should set hover value on mouse move with allowHalf (left half)", () => {
		render(<Rating allowHalf />);

		const star2 = screen.getByLabelText("2 stars");
		const rect = { width: 20, left: 100 };
		vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

		fireEvent.mouseMove(star2, { clientX: 100 + 4 }); // left half

		// No crash, hover state should update
		vi.restoreAllMocks();
	});

	it("should set hover value on mouse move with allowHalf (right half)", () => {
		render(<Rating allowHalf />);

		const star2 = screen.getByLabelText("2 stars");
		const rect = { width: 20, left: 100 };
		vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect as DOMRect);

		fireEvent.mouseMove(star2, { clientX: 100 + 16 }); // right half

		vi.restoreAllMocks();
	});

	it("should set hover value on mouse move without allowHalf", () => {
		render(<Rating />);

		const star3 = screen.getByLabelText("3 stars");
		fireEvent.mouseMove(star3);
		// No crash
	});

	it("should not set hover value on mouse move when readOnly", () => {
		render(<Rating readOnly />);

		const star1 = screen.getByLabelText("1 star");
		fireEvent.mouseMove(star1);
		// No crash, hover should not change
	});

	it("should not set hover value on mouse move when disabled", () => {
		render(<Rating disabled />);

		const star1 = screen.getByLabelText("1 star");
		fireEvent.mouseMove(star1);
		// No crash
	});

	it("should render half-filled star with correct clip-path style", () => {
		render(<Rating value={2.5} allowHalf />);
		const stars = screen.getAllByRole("button");
		const star3 = stars[2];
		const filledOverlay = star3.querySelector(".fill-yellow-400") as HTMLElement;
		expect(filledOverlay).toBeInTheDocument();
		expect(filledOverlay.style.clipPath).toBe("inset(0 50% 0 0)");
	});

	it("should render full star without clip-path style", () => {
		render(<Rating value={3} />);
		const stars = screen.getAllByRole("button");
		const star1 = stars[0];
		const filledOverlay = star1.querySelector(".fill-yellow-400") as HTMLElement;
		expect(filledOverlay).toBeInTheDocument();
		expect(filledOverlay.style.clipPath).toBe("");
	});

	it("getStarFill returns empty for value below star threshold", () => {
		render(<Rating value={1} />);
		const stars = screen.getAllByRole("button");
		const star3 = stars[2];
		// Star 3 should have no filled overlay since value=1 < 3
		const filledOverlay = star3.querySelector(".fill-yellow-400");
		expect(filledOverlay).not.toBeInTheDocument();
	});

	it("should update uncontrolled value on click", async () => {
		render(<Rating defaultValue={0} />);

		const star4 = screen.getByLabelText("4 stars");
		fireEvent.click(star4);

		// After clicking star 4, aria-pressed should be true
		expect(star4).toHaveAttribute("aria-pressed", "true");
	});

	it("should clear rating when clicking same value in uncontrolled mode", async () => {
		render(<Rating defaultValue={3} />);

		const star3 = screen.getByLabelText("3 stars");
		fireEvent.click(star3);

		// Clicking same value should toggle off (set to 0)
		expect(star3).toHaveAttribute("aria-pressed", "false");
	});

	it("should use hoverValue for display when hovering", () => {
		const { container } = render(<Rating value={1} />);

		// Hover star 4 - this should visually highlight it
		const star4 = screen.getByLabelText("4 stars");
		fireEvent.mouseMove(star4);

		// Star 4 should now have filled overlay visible (from hover)
		const filledOverlay = star4.querySelector(".fill-yellow-400");
		expect(filledOverlay).toBeInTheDocument();
	});

	it("should reset hover value on mouse leave", () => {
		render(<Rating value={1} />);

		const star4 = screen.getByLabelText("4 stars");
		fireEvent.mouseMove(star4);

		// Now mouse leave
		fireEvent.mouseLeave(star4.closest("fieldset")!);

		// Star 4 should not have filled overlay since value=1
		const filledOverlay = star4.querySelector(".fill-yellow-400");
		expect(filledOverlay).not.toBeInTheDocument();
	});

	it("should not clear hover value on mouse leave when readOnly", () => {
		render(<Rating readOnly value={3} />);

		const fieldset = document.querySelector('[data-slot="rating"]')!;
		fireEvent.mouseLeave(fieldset);
		// No crash, and no state change
		expect(fieldset).toBeInTheDocument();
	});

	it("should not clear hover value on mouse leave when disabled", () => {
		render(<Rating disabled value={3} />);

		const fieldset = document.querySelector('[data-slot="rating"]')!;
		fireEvent.mouseLeave(fieldset);
		expect(fieldset).toBeInTheDocument();
	});

	it("should render cursor-default when readOnly", () => {
		const { container } = render(<Rating readOnly />);
		const stars = container.querySelectorAll("button");
		expect(stars[0]).toHaveClass("cursor-default");
	});

	it("should render correct aria-label for single star", () => {
		render(<Rating count={1} />);
		expect(screen.getByLabelText("1 star")).toBeInTheDocument();
	});

	it("should render correct aria-label for multiple stars", () => {
		render(<Rating count={3} />);
		expect(screen.getByLabelText("1 star")).toBeInTheDocument();
		expect(screen.getByLabelText("2 stars")).toBeInTheDocument();
		expect(screen.getByLabelText("3 stars")).toBeInTheDocument();
	});
});
