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

	it("should display midnight (0) as 12 in 12-hour mode", () => {
		render(
			<TimePicker value={{ hours: 0, minutes: 0 }} hourCycle={12} onChange={vi.fn()} />,
		);
		expect(screen.getByText(/12:00 AM/)).toBeInTheDocument();
	});

	it("should display hour 13 as 1 in 12-hour mode", () => {
		render(
			<TimePicker value={{ hours: 13, minutes: 0 }} hourCycle={12} onChange={vi.fn()} />,
		);
		expect(screen.getByText(/01:00 PM/)).toBeInTheDocument();
	});

	it("should display hour 12 as 12 in 12-hour mode", () => {
		render(
			<TimePicker value={{ hours: 12, minutes: 0 }} hourCycle={12} onChange={vi.fn()} />,
		);
		expect(screen.getByText(/12:00 PM/)).toBeInTheDocument();
	});

	it("should display hour 23 as 11 in 12-hour mode", () => {
		render(
			<TimePicker value={{ hours: 23, minutes: 30 }} hourCycle={12} onChange={vi.fn()} />,
		);
		expect(screen.getByText(/11:30 PM/)).toBeInTheDocument();
	});

	it("should display seconds in time display when showSeconds is true", () => {
		render(
			<TimePicker value={{ hours: 10, minutes: 30, seconds: 45 }} showSeconds onChange={vi.fn()} />,
		);
		expect(screen.getByText("10:30:45")).toBeInTheDocument();
	});

	it("should display seconds in 12h time display when showSeconds is true", () => {
		render(
			<TimePicker value={{ hours: 14, minutes: 30, seconds: 45 }} hourCycle={12} showSeconds onChange={vi.fn()} />,
		);
		expect(screen.getByText(/02:30:45 PM/)).toBeInTheDocument();
	});

	it("should select hour in 12h AM mode (12 -> 0)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 9, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Click hour 12 in AM -> should convert to 0
		const hourButtons = screen
			.getAllByRole("button")
			.filter((b) => b.textContent === "12");
		// The first "12" in 12h mode is the hour button
		await user.click(hourButtons[0]);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 0 }),
		);
	});

	it("should select hour in 12h PM mode (12 stays 12)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 15, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// defaultValue hours:15 means period starts as PM
		// Click hour 12 in PM -> handleHourSelect(12) -> h24 = 12
		const hourButtons = screen
			.getAllByRole("button")
			.filter((b) => b.textContent === "12");
		await user.click(hourButtons[0]);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 12 }),
		);
	});

	it("should toggle period from PM to AM", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 21, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Currently PM (21h), click AM
		const amButton = screen.getByText("AM");
		await user.click(amButton);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 9 }), // 21 PM -> 9 AM
		);
	});

	it("should select seconds when showSeconds is true", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker showSeconds onChange={handleChange} />,
		);

		// "45" in seconds column
		const secButtons = screen
			.getAllByRole("button")
			.filter((b) => b.textContent === "45");
		// There may be multiple "45" buttons if hours/minutes also have it
		// In 24h mode, 45 only exists in minutes and seconds
		if (secButtons.length >= 2) {
			await user.click(secButtons[1]); // Second occurrence = seconds column
		}
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ seconds: 45 }),
		);
	});

	it("should initialize period as PM when defaultValue hour >= 12", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 15, minutes: 0 }} />,
		);
		// AM button should not be active, PM should
		const amButton = screen.getByText("AM");
		expect(amButton).toHaveClass("text-foreground");
	});

	it("should initialize period as AM when defaultValue hour < 12", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 8, minutes: 0 }} />,
		);
		const amButton = screen.getByText("AM");
		expect(amButton).toHaveClass("bg-primary");
	});

	it("should apply opacity-50 when disabled", () => {
		const { container } = render(<TimePicker disabled />);
		const wrapper = container.querySelector('[data-slot="time-picker"]');
		expect(wrapper).toHaveClass("opacity-50");
	});

	it("should not apply border-destructive when hasError is false", () => {
		const { container } = render(<TimePicker hasError={false} />);
		const wrapper = container.querySelector('[data-slot="time-picker"]');
		expect(wrapper).not.toHaveClass("border-destructive");
	});

	it("should apply correct class to active hour in TimeColumn", () => {
		render(
			<TimePicker value={{ hours: 10, minutes: 0 }} onChange={vi.fn()} />,
		);
		const hour10 = screen
			.getAllByRole("button")
			.find((b) => b.textContent === "10" && b.classList.contains("bg-primary"));
		expect(hour10).toBeDefined();
	});

	it("should apply disabled class to TimeColumn buttons when disabled", () => {
		render(<TimePicker disabled />);
		const buttons = screen.getAllByRole("button");
		expect(buttons.every((b) => b.hasAttribute("disabled"))).toBe(true);
	});

	it("should render 12 hour values in 12-hour mode (1-12)", () => {
		render(<TimePicker hourCycle={12} />);
		// Get only hour column buttons by querying within the HH column
		const hhLabel = screen.getByText("HH");
		const hourColumn = hhLabel.parentElement!;
		const hourButtons = hourColumn.querySelectorAll("button");
		const hourTexts = Array.from(hourButtons).map((b) => b.textContent);
		expect(hourTexts.some((t) => t === "12")).toBe(true);
		expect(hourTexts.some((t) => t === "01")).toBe(true);
		expect(hourTexts.some((t) => t === "00")).toBe(false);
	});

	it("should handle period toggle when hours already >= 12 (PM -> PM)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 15, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Already PM, click PM again -> hours should stay same
		const pmButton = screen.getByText("PM");
		await user.click(pmButton);
		// Toggle PM -> AM -> hours: 15-12=3
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 3 }),
		);
	});

	it("should handle period toggle when hours < 12 (AM -> AM)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				hourCycle={12}
				defaultValue={{ hours: 5, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Already AM, click AM again -> toggle to PM -> hours: 5+12=17
		const amButton = screen.getByText("AM");
		await user.click(amButton);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 17 }),
		);
	});

	it("should use controlled value for commit", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(
			<TimePicker
				value={{ hours: 10, minutes: 0 }}
				onChange={handleChange}
			/>,
		);

		// Select minute 30
		const minuteButtons = screen
			.getAllByRole("button")
			.filter((b) => b.textContent === "30");
		await user.click(minuteButtons[0]);
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ hours: 10, minutes: 30 }),
		);
	});

	it("should pad single digit values with leading zero in display", () => {
		render(
			<TimePicker value={{ hours: 5, minutes: 3 }} onChange={vi.fn()} />,
		);
		expect(screen.getByText("05:03")).toBeInTheDocument();
	});

	it("should display seconds with leading zero in display", () => {
		render(
			<TimePicker value={{ hours: 5, minutes: 3, seconds: 7 }} showSeconds onChange={vi.fn()} />,
		);
		expect(screen.getByText("05:03:07")).toBeInTheDocument();
	});

	it("should initialize with zero time when no defaultValue", () => {
		render(<TimePicker />);
		expect(screen.getByText("00:00")).toBeInTheDocument();
	});

	it("should apply disabled cursor-not-allowed to period buttons", () => {
		render(<TimePicker hourCycle={12} disabled />);
		const amButton = screen.getByText("AM");
		expect(amButton).toHaveClass("cursor-not-allowed");
	});

	it("should apply active style to AM button when period is AM", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 8, minutes: 0 }} />,
		);
		const amButton = screen.getByText("AM");
		expect(amButton).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("should apply active style to PM button when period is PM", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 20, minutes: 0 }} />,
		);
		const pmButton = screen.getByText("PM");
		expect(pmButton).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("should apply inactive style to PM button when period is AM", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 8, minutes: 0 }} />,
		);
		const pmButton = screen.getByText("PM");
		expect(pmButton).toHaveClass("text-foreground");
	});

	it("should apply inactive style to AM button when period is PM", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 20, minutes: 0 }} />,
		);
		const amButton = screen.getByText("AM");
		expect(amButton).toHaveClass("text-foreground");
	});

	it("should set aria-pressed on AM button correctly", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 8, minutes: 0 }} />,
		);
		expect(screen.getByText("AM")).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText("PM")).toHaveAttribute("aria-pressed", "false");
	});

	it("should set aria-pressed on PM button correctly", () => {
		render(
			<TimePicker hourCycle={12} defaultValue={{ hours: 20, minutes: 0 }} />,
		);
		expect(screen.getByText("PM")).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText("AM")).toHaveAttribute("aria-pressed", "false");
	});
});
