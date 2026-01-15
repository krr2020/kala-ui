import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { DatePicker, DateRangePicker } from "./date-picker";

const meta = {
	title: "Components/DatePicker",
	component: DatePicker,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A date picker component that combines a popover with a calendar, allowing users to select single dates or date ranges with a user-friendly interface.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Disable the date picker",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text when no date is selected",
		},
	},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return <DatePicker date={date} onDateChange={setDate} />;
	},
};

export const WithDefaultDate: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return <DatePicker date={date} onDateChange={setDate} />;
	},
};

export const CustomPlaceholder: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<DatePicker
				date={date}
				onDateChange={setDate}
				placeholder="Select a date"
			/>
		);
	},
};

export const CustomFormat: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return (
			<div className="space-y-4">
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Default format (PPP):
					</p>
					<DatePicker date={date} onDateChange={setDate} />
				</div>
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Short format (P):
					</p>
					<DatePicker date={date} onDateChange={setDate} formatStr="P" />
				</div>
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Custom format (yyyy-MM-dd):
					</p>
					<DatePicker
						date={date}
						onDateChange={setDate}
						formatStr="yyyy-MM-dd"
					/>
				</div>
			</div>
		);
	},
};

export const DisabledState: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return <DatePicker date={date} onDateChange={setDate} disabled />;
	},
};

export const DisabledDates: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		const disabledDates = (date: Date) => {
			const day = date.getDay();
			// Disable weekends
			return day === 0 || day === 6;
		};

		return (
			<div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					disabled={disabledDates}
				/>
				<p className="mt-4 text-sm text-muted-foreground">
					Weekends are disabled
				</p>
			</div>
		);
	},
};

export const DateRangeLimit: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		const today = new Date();
		const thirtyDaysFromNow = new Date(today);
		thirtyDaysFromNow.setDate(today.getDate() + 30);

		return (
			<div>
				<DatePicker
					date={date}
					onDateChange={setDate}
					disabled={{ before: today, after: thirtyDaysFromNow }}
				/>
				<p className="mt-4 text-sm text-muted-foreground">
					Only the next 30 days are selectable
				</p>
			</div>
		);
	},
};

export const CustomButtonStyle: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<DatePicker
				date={date}
				onDateChange={setDate}
				buttonClassName="w-full"
				placeholder="Full width button"
			/>
		);
	},
};

export const WithCallback: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();
		const [message, setMessage] = useState<string>("");

		const handleDateChange = (newDate: Date | undefined) => {
			setDate(newDate);
			if (newDate) {
				setMessage(`Selected: ${newDate.toLocaleDateString()}`);
			} else {
				setMessage("Date cleared");
			}
		};

		return (
			<div>
				<DatePicker date={date} onDateChange={handleDateChange} />
				{message && (
					<p className="mt-4 text-sm text-muted-foreground">{message}</p>
				)}
			</div>
		);
	},
};

export const DateRange: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<
			DayPickerDateRange | undefined
		>();

		return (
			<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
		);
	},
};

export const DateRangeWithDefault: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>({
			from: new Date(),
			to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
		});

		return (
			<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
		);
	},
};

export const DateRangeCustomPlaceholder: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<
			DayPickerDateRange | undefined
		>();

		return (
			<DateRangePicker
				dateRange={dateRange}
				onDateRangeChange={setDateRange}
				placeholder="Select date range"
			/>
		);
	},
};

export const DateRangeCustomFormat: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>({
			from: new Date(),
			to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return (
			<div className="space-y-4">
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Default format (LLL dd, y):
					</p>
					<DateRangePicker
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
					/>
				</div>
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Short format (P):
					</p>
					<DateRangePicker
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
						formatStr="P"
					/>
				</div>
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Custom format (MM/dd/yyyy):
					</p>
					<DateRangePicker
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
						formatStr="MM/dd/yyyy"
					/>
				</div>
			</div>
		);
	},
};

export const DateRangeDisabled: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>({
			from: new Date(),
			to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return (
			<DateRangePicker
				dateRange={dateRange}
				onDateRangeChange={setDateRange}
				buttonDisabled
			/>
		);
	},
};

export const DateRangeWithCallback: Story = {
	render: () => {
		const [dateRange, setDateRange] = useState<
			DayPickerDateRange | undefined
		>();
		const [message, setMessage] = useState<string>("");

		const handleRangeChange = (range: DayPickerDateRange | undefined) => {
			setDateRange(range);
			if (range?.from && range?.to) {
				setMessage(
					`Selected: ${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`,
				);
			} else if (range?.from) {
				setMessage(`Start date: ${range.from.toLocaleDateString()}`);
			} else {
				setMessage("Range cleared");
			}
		};

		return (
			<div>
				<DateRangePicker
					dateRange={dateRange}
					onDateRangeChange={handleRangeChange}
				/>
				{message && (
					<p className="mt-4 text-sm text-muted-foreground">{message}</p>
				)}
			</div>
		);
	},
};

export const Comparison: Story = {
	render: () => {
		const [singleDate, setSingleDate] = useState<Date | undefined>();
		const [dateRange, setDateRange] = useState<
			DayPickerDateRange | undefined
		>();

		return (
			<div className="space-y-6">
				<div>
					<h3 className="mb-2 text-sm font-medium">Single Date Picker</h3>
					<DatePicker date={singleDate} onDateChange={setSingleDate} />
				</div>
				<div>
					<h3 className="mb-2 text-sm font-medium">Date Range Picker</h3>
					<DateRangePicker
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
					/>
				</div>
			</div>
		);
	},
};
