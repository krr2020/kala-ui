import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./calendar";

const meta = {
	title: "Components/Calendar",
	component: Calendar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A calendar component built on top of React Day Picker, providing date selection with full keyboard navigation and ARIA attributes for accessibility.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		mode: {
			control: "select",
			options: ["single", "multiple", "range"],
			description: "The selection mode of the calendar",
		},
		disabled: {
			control: "boolean",
			description: "Disable all dates",
		},
	},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return (
			<div className="p-4">
				<Calendar mode="single" selected={date} onSelect={setDate} />
			</div>
		);
	},
};

export const WithoutDefaultSelection: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<div className="p-4">
				<Calendar mode="single" selected={date} onSelect={setDate} />
			</div>
		);
	},
};

export const RangeSelection: Story = {
	render: () => {
		const [range, setRange] = useState<DateRange | undefined>();

		return (
			<div className="p-4">
				<Calendar
					mode="range"
					selected={range}
					onSelect={setRange}
					numberOfMonths={2}
				/>
			</div>
		);
	},
};

export const MultipleSelection: Story = {
	render: () => {
		const [dates, setDates] = useState<Date[] | undefined>([]);

		return (
			<div className="p-4">
				<Calendar mode="multiple" selected={dates} onSelect={setDates} />
			</div>
		);
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
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
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
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					disabled={{ before: today, after: thirtyDaysFromNow }}
				/>
				<p className="mt-4 text-sm text-muted-foreground">
					Only the next 30 days are available
				</p>
			</div>
		);
	},
};

export const WithInitialMonth: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		const januaryNextYear = new Date();
		januaryNextYear.setFullYear(januaryNextYear.getFullYear() + 1);
		januaryNextYear.setMonth(0);

		return (
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					defaultMonth={januaryNextYear}
				/>
				<p className="mt-4 text-sm text-muted-foreground">
					Calendar opens to January next year
				</p>
			</div>
		);
	},
};

export const MultipleMonths: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					numberOfMonths={2}
				/>
			</div>
		);
	},
};

export const WithWeekNumbers: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					showWeekNumber
				/>
			</div>
		);
	},
};

export const DisabledState: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return (
			<div className="p-4">
				<Calendar mode="single" selected={date} onSelect={setDate} disabled />
				<p className="mt-4 text-sm text-muted-foreground">
					All dates are disabled
				</p>
			</div>
		);
	},
};

export const WithFooter: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<div className="p-4">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					footer={
						<div className="flex justify-between border-t pt-2 text-sm">
							<button
								type="button"
								onClick={() => setDate(new Date())}
								className="text-primary hover:underline"
							>
								Today
							</button>
							<button
								type="button"
								onClick={() => setDate(undefined)}
								className="text-muted-foreground hover:underline"
							>
								Clear
							</button>
						</div>
					}
				/>
			</div>
		);
	},
};

export const CustomButtonVariant: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());

		return (
			<div className="space-y-4 p-4">
				<div>
					<h3 className="mb-2 text-sm font-medium">Default (Ghost)</h3>
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						buttonVariant="ghost"
					/>
				</div>
				<div>
					<h3 className="mb-2 text-sm font-medium">Outline</h3>
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						buttonVariant="outline"
					/>
				</div>
			</div>
		);
	},
};
