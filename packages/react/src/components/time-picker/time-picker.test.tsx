import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "./time-picker";

describe("TimePicker", () => {
	it("should render with column headers", () => {
		render(<TimePicker />);
		expect(screen.getByText("HH")).toBeInTheDocument();
		expect(screen.getByText("MM")).toBeInTheDocument();
	});

	it("should render 24 hour values in 24-hour mode", () => {
		render(<TimePicker hourCycle={24} />);
		// 24 hours (00-23) should be present
		expect(
			screen.getAllByRole("button").some((b) => b.textContent === "00"),
		).toBe(true);
		expect(
			screen.getAllByRole("button").some((b) => b.textContent === "23"),
		).toBe(true);
	});

	it("should render AM/PM buttons in 12-hour mode", () => {
		render(<TimePicker hourCycle={12} />);
		expect(screen.getByText("AM")).toBeInTheDocument();
		expect(screen.getByText("PM")).toBeInTheDocument();
	});

	it("should show seconds column when showSeconds is true", () => {
		render(<TimePicker showSeconds />);
		expect(screen.getByText("SS")).toBeInTheDocument();
	});

	it("should not show seconds column by default", () => {
		render(<TimePicker />);
		expect(screen.queryByText("SS")).not.toBeInTheDocument();
	});

	it("should call onChange when a minute is selected", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<TimePicker onChange={handleChange} />);

		// "30" exists only in the minutes column (hours are 0–23)
		const minuteButton = screen
			.getAllByRole("button")
			.find((b) => b.textContent === "30");
		if (!minuteButton) throw new Error("Minute button 30 not found");
		await user.click(minuteButton);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ minutes: 30 }),
		);
	});

	it("should call onChange when an hour is selected", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<TimePicker hourCycle={24} onChange={handleChange} />);

		const hourButtons = screen
			.getAllByRole("button")
			.filter((b) => b.textContent === "10");
		await user.click(hourButtons[0]);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 10 }),
		);
	});

	it("should display controlled value", () => {
		render(
			<TimePicker value={{ hours: 14, minutes: 30 }} onChange={vi.fn()} />,
		);
		expect(screen.getByText("14:30")).toBeInTheDocument();
	});

	it("should display 12h controlled value with period", () => {
		render(
			<TimePicker
				value={{ hours: 14, minutes: 30 }}
				hourCycle={12}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText(/02:30 PM/)).toBeInTheDocument();
	});

	it("should render loading skeleton when isLoading is true", () => {
		const { container } = render(<TimePicker isLoading />);
		expect(container.querySelector('[data-slot="time-picker"]')).toBeNull();
		expect(
			document.querySelector('[data-slot="skeleton"]'),
		).toBeInTheDocument();
	});

	it("should render as disabled", () => {
		render(<TimePicker disabled />);
		const buttons = screen.getAllByRole("button");
		expect(buttons.every((b) => b.hasAttribute("disabled"))).toBe(true);
	});

	it("should apply error styling when hasError is true", () => {
		const { container } = render(<TimePicker hasError />);
		const wrapper = container.querySelector('[data-slot="time-picker"]');
		expect(wrapper).toHaveClass("border-destructive");
	});

	it("should toggle period when AM/PM is clicked in 12-hour mode", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 9, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Initially AM, click PM
		const pmButton = screen.getByText("PM");
		await user.click(pmButton);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 21 }), // 9 AM → 9 PM = 21:00
		);
	});

	it("should apply custom className", () => {
		const { container } = render(<TimePicker className="custom-class" />);
		const wrapper = container.querySelector('[data-slot="time-picker"]');
		expect(wrapper).toHaveClass("custom-class");
	});
});
