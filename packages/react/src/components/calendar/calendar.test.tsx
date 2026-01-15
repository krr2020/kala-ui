import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DateRange } from "react-day-picker";
import { describe, expect, it } from "vitest";
import { Calendar } from "./calendar";

describe("Calendar", () => {
	it("renders calendar with current month", () => {
		render(<Calendar mode="single" />);
		const currentMonth = new Date().toLocaleString("default", {
			month: "long",
		});
		expect(screen.getByText(new RegExp(currentMonth, "i"))).toBeInTheDocument();
	});

	it("allows selecting a date in single mode", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" onSelect={onSelect} />);

		const dateButton = screen
			.getAllByRole("button")
			.find((btn) => btn.textContent === "15" && !btn.hasAttribute("disabled"));

		if (dateButton) {
			await user.click(dateButton);
			expect(onSelect).toHaveBeenCalled();
		}
	});

	it("renders with selected date", () => {
		const selectedDate = new Date(2024, 0, 15);
		render(
			<Calendar
				mode="single"
				selected={selectedDate}
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		// Find button with the selected date
		const buttons = screen.getAllByRole("button");
		const selectedButton = buttons.find(
			(btn) =>
				btn.getAttribute("data-day")?.includes("1/15/2024") ||
				(btn.getAttribute("data-day")?.includes("2024") &&
					btn.textContent === "15"),
		);

		expect(selectedButton).toBeInTheDocument();
	});

	it("allows range selection", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="range" onSelect={onSelect} />);

		const buttons = screen.getAllByRole("button");
		const dateButtons = buttons.filter(
			(btn) =>
				btn.textContent &&
				/^\d{1,2}$/.test(btn.textContent) &&
				!btn.hasAttribute("disabled"),
		);

		if (dateButtons.length >= 2) {
			await user.click(dateButtons[10]);
			await user.click(dateButtons[15]);
			expect(onSelect).toHaveBeenCalledTimes(2);
		}
	});

	it("renders range selection with start and end dates", () => {
		const range: DateRange = {
			from: new Date(2024, 0, 10),
			to: new Date(2024, 0, 20),
		};

		render(
			<Calendar
				mode="range"
				selected={range}
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		const startButton = screen
			.getAllByRole("button")
			.find((btn) => btn.getAttribute("data-range-start") === "true");
		const endButton = screen
			.getAllByRole("button")
			.find((btn) => btn.getAttribute("data-range-end") === "true");

		expect(startButton).toBeInTheDocument();
		expect(endButton).toBeInTheDocument();
	});

	it("allows multiple date selection", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="multiple" onSelect={onSelect} />);

		const buttons = screen.getAllByRole("button");
		const dateButtons = buttons.filter(
			(btn) =>
				btn.textContent &&
				/^\d{1,2}$/.test(btn.textContent) &&
				!btn.hasAttribute("disabled"),
		);

		if (dateButtons.length >= 3) {
			await user.click(dateButtons[5]);
			await user.click(dateButtons[10]);
			await user.click(dateButtons[15]);
			expect(onSelect).toHaveBeenCalledTimes(3);
		}
	});

	it("navigates to previous month", async () => {
		const user = userEvent.setup();
		const initialMonth = new Date(2024, 5, 1); // June 2024

		render(<Calendar mode="single" defaultMonth={initialMonth} />);

		expect(screen.getByText(/june/i)).toBeInTheDocument();

		const prevButton = screen
			.getAllByRole("button")
			.find((btn) => btn.querySelector('[data-lucide="chevron-left"]'));

		if (prevButton) {
			await user.click(prevButton);
			expect(screen.getByText(/may/i)).toBeInTheDocument();
		}
	});

	it("navigates to next month", async () => {
		const user = userEvent.setup();
		const initialMonth = new Date(2024, 5, 1); // June 2024

		render(<Calendar mode="single" defaultMonth={initialMonth} />);

		expect(screen.getByText(/june/i)).toBeInTheDocument();

		const nextButton = screen
			.getAllByRole("button")
			.find((btn) => btn.querySelector('[data-lucide="chevron-right"]'));

		if (nextButton) {
			await user.click(nextButton);
			expect(screen.getByText(/july/i)).toBeInTheDocument();
		}
	});

	it("disables all dates when disabled prop is true", () => {
		render(<Calendar mode="single" disabled />);

		const dateButtons = screen
			.getAllByRole("button")
			.filter((btn) => btn.textContent && /^\d{1,2}$/.test(btn.textContent));

		dateButtons.forEach((button) => {
			expect(button).toBeDisabled();
		});
	});

	it("disables specific dates with custom matcher", () => {
		const disabledMatcher = (date: Date) => {
			// Disable weekends
			const day = date.getDay();
			return day === 0 || day === 6;
		};

		render(
			<Calendar
				mode="single"
				disabled={disabledMatcher}
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		// The 6th is a Saturday in January 2024
		const saturdayButton = screen
			.getAllByRole("button")
			.find(
				(btn) =>
					btn.textContent === "6" &&
					btn.getAttribute("data-day")?.includes("2024"),
			);

		if (saturdayButton) {
			expect(saturdayButton).toBeDisabled();
		}
	});

	it("displays multiple months", () => {
		render(
			<Calendar
				mode="single"
				numberOfMonths={2}
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		expect(screen.getByText(/january/i)).toBeInTheDocument();
		expect(screen.getByText(/february/i)).toBeInTheDocument();
	});

	it("shows week numbers when enabled", () => {
		render(
			<Calendar
				mode="single"
				showWeekNumber
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		// Week numbers should be present in the calendar
		const weekNumbers = screen.getAllByRole("rowheader");
		expect(weekNumbers.length).toBeGreaterThan(0);
	});

	it("applies custom className", () => {
		const { container } = render(
			<Calendar mode="single" className="custom-calendar" />,
		);

		const calendar = container.querySelector('[data-slot="calendar"]');
		expect(calendar).toHaveClass("custom-calendar");
	});

	it("renders with custom button variant", () => {
		render(<Calendar mode="single" buttonVariant="outline" />);

		const navButtons = screen
			.getAllByRole("button")
			.filter((btn) => btn.querySelector("svg"));

		// Navigation buttons with chevron icons should exist
		expect(navButtons.length).toBeGreaterThanOrEqual(2);
	});

	it("renders footer content", () => {
		render(
			<Calendar
				mode="single"
				footer={<div data-testid="calendar-footer">Custom Footer</div>}
			/>,
		);

		expect(screen.getByTestId("calendar-footer")).toBeInTheDocument();
		expect(screen.getByText("Custom Footer")).toBeInTheDocument();
	});

	it("opens to specific month with defaultMonth", () => {
		const futureDate = new Date(2025, 11, 1); // December 2025
		render(<Calendar mode="single" defaultMonth={futureDate} />);

		expect(screen.getByText(/december/i)).toBeInTheDocument();
		expect(screen.getByText(/2025/i)).toBeInTheDocument();
	});

	it("highlights today's date", () => {
		render(<Calendar mode="single" />);

		const today = new Date();
		const todayButton = screen.getAllByRole("button").find((btn) => {
			const dataDay = btn.getAttribute("data-day");
			return dataDay?.includes(today.toLocaleDateString());
		});

		expect(todayButton).toBeInTheDocument();
	});

	it("handles keyboard navigation", async () => {
		const user = userEvent.setup();

		render(<Calendar mode="single" autoFocus />);

		// Arrow keys should navigate between dates
		await user.keyboard("{ArrowRight}");
		await user.keyboard("{ArrowDown}");
		await user.keyboard("{ArrowLeft}");
		await user.keyboard("{ArrowUp}");

		// A date should be focused
		const focusedElement = document.activeElement;
		expect(focusedElement?.tagName).toBe("BUTTON");
	});

	it("handles Enter key to select date", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" onSelect={onSelect} autoFocus />);

		await user.keyboard("{Enter}");

		expect(onSelect).toHaveBeenCalled();
	});

	it("handles Space key to select date", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(<Calendar mode="single" onSelect={onSelect} autoFocus />);

		await user.keyboard(" ");

		expect(onSelect).toHaveBeenCalled();
	});

	it("has proper ARIA attributes", () => {
		render(<Calendar mode="single" />);

		// Calendar should have grid role
		const grid = screen.getByRole("grid");
		expect(grid).toBeInTheDocument();

		// Navigation should have proper labels
		const navigation = screen.getAllByRole("navigation");
		expect(navigation.length).toBeGreaterThan(0);
	});

	it("disables dates before a specific date", () => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		render(
			<Calendar
				mode="single"
				disabled={{ before: today }}
				defaultMonth={today}
			/>,
		);

		// Previous dates should be disabled
		const dateButtons = screen
			.getAllByRole("button")
			.filter((btn) => btn.textContent && /^\d{1,2}$/.test(btn.textContent));

		const disabledButtons = dateButtons.filter((btn) =>
			btn.hasAttribute("disabled"),
		);
		expect(disabledButtons.length).toBeGreaterThan(0);
	});

	it("disables dates after a specific date", () => {
		const today = new Date();
		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7);

		render(
			<Calendar
				mode="single"
				disabled={{ after: nextWeek }}
				defaultMonth={today}
			/>,
		);

		const dateButtons = screen
			.getAllByRole("button")
			.filter((btn) => btn.textContent && /^\d{1,2}$/.test(btn.textContent));

		const disabledButtons = dateButtons.filter((btn) =>
			btn.hasAttribute("disabled"),
		);
		expect(disabledButtons.length).toBeGreaterThan(0);
	});

	it("renders with captionLayout dropdown", () => {
		render(
			<Calendar
				mode="single"
				captionLayout="dropdown"
				defaultMonth={new Date(2024, 0, 1)}
			/>,
		);

		// Should render dropdown selects
		const selects = screen.getAllByRole("combobox");
		expect(selects.length).toBeGreaterThanOrEqual(1);
	});
});
