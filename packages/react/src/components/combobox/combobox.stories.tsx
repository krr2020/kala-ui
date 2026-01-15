import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Skeleton } from "../skeleton/skeleton";
import { Combobox, type ComboboxOption } from "./combobox";

const meta = {
	title: "Forms/Combobox",
	component: Combobox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: ["sm", "default"],
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: ComboboxOption[] = [
	{ value: "next.js", label: "Next.js" },
	{ value: "sveltekit", label: "SvelteKit" },
	{ value: "nuxt.js", label: "Nuxt.js" },
	{ value: "remix", label: "Remix" },
	{ value: "astro", label: "Astro" },
	{ value: "gatsby", label: "Gatsby" },
];

export const Default: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState("");

		return (
			<div className="w-[300px]">
				<Combobox options={frameworks} value={value} onValueChange={setValue} />
				{value && (
					<p className="mt-2 text-sm text-muted-foreground">
						Selected: {value}
					</p>
				)}
			</div>
		);
	},
};

export const WithPreselectedValue: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState("next.js");

		return (
			<div className="w-[300px]">
				<Combobox
					options={frameworks}
					value={value}
					onValueChange={setValue}
					placeholder="Select framework..."
				/>
			</div>
		);
	},
};

export const SmallSize: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState("");

		return (
			<div className="w-[250px]">
				<Combobox
					options={frameworks}
					value={value}
					onValueChange={setValue}
					size="sm"
					placeholder="Select framework..."
				/>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState("next.js");

		return (
			<div className="w-[300px]">
				<Combobox
					options={frameworks}
					value={value}
					onValueChange={setValue}
					disabled
				/>
			</div>
		);
	},
};

export const WithDisabledOptions: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState("");
		const options: ComboboxOption[] = [
			{ value: "next.js", label: "Next.js" },
			{ value: "sveltekit", label: "SvelteKit", disabled: true },
			{ value: "nuxt.js", label: "Nuxt.js" },
			{ value: "remix", label: "Remix", disabled: true },
			{ value: "astro", label: "Astro" },
		];

		return (
			<div className="w-[300px]">
				<Combobox options={options} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

const countries: ComboboxOption[] = [
	{ value: "us", label: "United States" },
	{ value: "gb", label: "United Kingdom" },
	{ value: "ca", label: "Canada" },
	{ value: "au", label: "Australia" },
	{ value: "de", label: "Germany" },
	{ value: "fr", label: "France" },
	{ value: "es", label: "Spain" },
	{ value: "it", label: "Italy" },
	{ value: "jp", label: "Japan" },
	{ value: "cn", label: "China" },
	{ value: "in", label: "India" },
	{ value: "br", label: "Brazil" },
	{ value: "mx", label: "Mexico" },
	{ value: "ru", label: "Russia" },
	{ value: "kr", label: "South Korea" },
];

export const Countries: Story = {
	args: {
		options: countries,
	},
	render: () => {
		const [value, setValue] = useState("");

		return (
			<div className="w-[300px]">
				<Combobox
					options={countries}
					value={value}
					onValueChange={setValue}
					placeholder="Select country..."
					searchPlaceholder="Search countries..."
				/>
			</div>
		);
	},
};

export const LargeDataset: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState("");
		const options: ComboboxOption[] = Array.from({ length: 100 }, (_, i) => ({
			value: `option-${i + 1}`,
			label: `Option ${i + 1}`,
		}));

		return (
			<div className="w-[300px]">
				<Combobox
					options={options}
					value={value}
					onValueChange={setValue}
					placeholder="Select option..."
					searchPlaceholder="Search options..."
				/>
			</div>
		);
	},
};

const timezones: ComboboxOption[] = [
	{ value: "Pacific/Midway", label: "(GMT-11:00) Midway Island, Samoa" },
	{ value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii" },
	{ value: "America/Anchorage", label: "(GMT-09:00) Alaska" },
	{ value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time" },
	{ value: "America/Denver", label: "(GMT-07:00) Mountain Time" },
	{ value: "America/Chicago", label: "(GMT-06:00) Central Time" },
	{ value: "America/New_York", label: "(GMT-05:00) Eastern Time" },
	{ value: "America/Caracas", label: "(GMT-04:30) Caracas" },
	{ value: "America/Halifax", label: "(GMT-04:00) Atlantic Time" },
	{ value: "America/St_Johns", label: "(GMT-03:30) Newfoundland" },
	{ value: "America/Sao_Paulo", label: "(GMT-03:00) Brasilia, Buenos Aires" },
	{ value: "Atlantic/South_Georgia", label: "(GMT-02:00) Mid-Atlantic" },
	{ value: "Atlantic/Azores", label: "(GMT-01:00) Azores, Cape Verde" },
	{ value: "Europe/London", label: "(GMT+00:00) London, Dublin, Lisbon" },
	{ value: "Europe/Paris", label: "(GMT+01:00) Paris, Berlin, Rome" },
	{ value: "Europe/Athens", label: "(GMT+02:00) Athens, Istanbul, Cairo" },
	{ value: "Europe/Moscow", label: "(GMT+03:00) Moscow, St. Petersburg" },
	{ value: "Asia/Dubai", label: "(GMT+04:00) Abu Dhabi, Muscat, Baku" },
	{ value: "Asia/Karachi", label: "(GMT+05:00) Islamabad, Karachi" },
	{ value: "Asia/Kolkata", label: "(GMT+05:30) Mumbai, Kolkata, New Delhi" },
	{ value: "Asia/Dhaka", label: "(GMT+06:00) Dhaka, Astana" },
	{ value: "Asia/Bangkok", label: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
	{
		value: "Asia/Hong_Kong",
		label: "(GMT+08:00) Beijing, Hong Kong, Singapore",
	},
	{ value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Seoul, Osaka" },
	{
		value: "Australia/Sydney",
		label: "(GMT+10:00) Sydney, Melbourne, Brisbane",
	},
	{
		value: "Pacific/Guadalcanal",
		label: "(GMT+11:00) Solomon Islands, New Caledonia",
	},
	{
		value: "Pacific/Auckland",
		label: "(GMT+12:00) Auckland, Wellington, Fiji",
	},
];

export const Timezones: Story = {
	args: {
		options: timezones,
	},
	render: () => {
		const [value, setValue] = useState("America/New_York");

		return (
			<div className="w-[450px]">
				<Combobox
					options={timezones}
					value={value}
					onValueChange={setValue}
					placeholder="Select timezone..."
					searchPlaceholder="Search timezones..."
				/>
			</div>
		);
	},
};

export const CustomText: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState("");

		return (
			<div className="w-[300px]">
				<Combobox
					options={frameworks}
					value={value}
					onValueChange={setValue}
					placeholder="Pick your framework..."
					searchPlaceholder="Type to search..."
					emptyText="No framework found. Try a different search."
				/>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	args: {
		options: [],
	},
	render: () => (
		<div className="w-full max-w-xs">
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholder for combobox fields while loading.",
			},
		},
	},
};