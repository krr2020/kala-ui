import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./select";

const meta = {
	title: "Forms/Select",
	component: Select,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	render: () => (
		<Select>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="blueberry">Blueberry</SelectItem>
				<SelectItem value="grapes">Grapes</SelectItem>
				<SelectItem value="pineapple">Pineapple</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const WithGroups: Story = {
	args: {},
	render: () => (
		<Select>
			<SelectTrigger className="w-[200px]">
				<SelectValue placeholder="Select food" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Fruits</SelectLabel>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="orange">Orange</SelectItem>
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>Vegetables</SelectLabel>
					<SelectItem value="carrot">Carrot</SelectItem>
					<SelectItem value="broccoli">Broccoli</SelectItem>
					<SelectItem value="spinach">Spinach</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
};

export const Disabled: Story = {
	args: {},
	render: () => (
		<Select disabled>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const SmallSize: Story = {
	args: {},
	render: () => (
		<Select defaultValue="apple">
			<SelectTrigger size="sm" className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="orange">Orange</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const Scrollable: Story = {
	args: {},
	render: () => (
		<Select defaultValue="option-5">
			<SelectTrigger className="w-[280px]">
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: 50 }, (_, i) => (
					<SelectItem key={i} value={`option-${i + 1}`}>
						Option {i + 1}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	),
};

const timezones = [
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
	args: {},
	render: () => (
		<Select defaultValue="America/New_York">
			<SelectTrigger className="w-[400px]">
				<SelectValue placeholder="Select your timezone" />
			</SelectTrigger>
			<SelectContent>
				{timezones.map((tz) => (
					<SelectItem key={tz.value} value={tz.value}>
						{tz.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	),
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="w-full max-w-xs space-y-2">
			<Skeleton className="h-10 w-full rounded-md" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for select fields while loading.",
			},
		},
	},
};
