import type { Meta, StoryObj } from "@storybook/react";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "./native-select";

const meta = {
	title: "Forms/NativeSelect",
	component: NativeSelect,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: ["sm", "default"],
		},
		error: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NativeSelect defaultValue="apple">
			<NativeSelectOption value="apple">Apple</NativeSelectOption>
			<NativeSelectOption value="banana">Banana</NativeSelectOption>
			<NativeSelectOption value="orange">Orange</NativeSelectOption>
			<NativeSelectOption value="grape">Grape</NativeSelectOption>
			<NativeSelectOption value="mango">Mango</NativeSelectOption>
		</NativeSelect>
	),
};

export const WithGroups: Story = {
	render: () => (
		<NativeSelect defaultValue="apple">
			<NativeSelectOptGroup label="Fruits">
				<NativeSelectOption value="apple">Apple</NativeSelectOption>
				<NativeSelectOption value="banana">Banana</NativeSelectOption>
				<NativeSelectOption value="orange">Orange</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Vegetables">
				<NativeSelectOption value="carrot">Carrot</NativeSelectOption>
				<NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
				<NativeSelectOption value="spinach">Spinach</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
	),
};

export const SmallSize: Story = {
	render: () => (
		<NativeSelect size="sm" defaultValue="apple">
			<NativeSelectOption value="apple">Apple</NativeSelectOption>
			<NativeSelectOption value="banana">Banana</NativeSelectOption>
			<NativeSelectOption value="orange">Orange</NativeSelectOption>
		</NativeSelect>
	),
};

export const Disabled: Story = {
	render: () => (
		<NativeSelect disabled defaultValue="apple">
			<NativeSelectOption value="apple">Apple</NativeSelectOption>
			<NativeSelectOption value="banana">Banana</NativeSelectOption>
			<NativeSelectOption value="orange">Orange</NativeSelectOption>
		</NativeSelect>
	),
};

export const WithError: Story = {
	render: () => (
		<div className="space-y-2">
			<NativeSelect error defaultValue="">
				<NativeSelectOption value="">
					Please select an option
				</NativeSelectOption>
				<NativeSelectOption value="apple">Apple</NativeSelectOption>
				<NativeSelectOption value="banana">Banana</NativeSelectOption>
				<NativeSelectOption value="orange">Orange</NativeSelectOption>
			</NativeSelect>
			<p className="text-destructive text-sm">This field is required</p>
		</div>
	),
};

export const Countries: Story = {
	render: () => (
		<NativeSelect defaultValue="us" className="w-[300px]">
			<NativeSelectOption value="">Select a country</NativeSelectOption>
			<NativeSelectOption value="us">United States</NativeSelectOption>
			<NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
			<NativeSelectOption value="ca">Canada</NativeSelectOption>
			<NativeSelectOption value="au">Australia</NativeSelectOption>
			<NativeSelectOption value="de">Germany</NativeSelectOption>
			<NativeSelectOption value="fr">France</NativeSelectOption>
			<NativeSelectOption value="es">Spain</NativeSelectOption>
			<NativeSelectOption value="it">Italy</NativeSelectOption>
			<NativeSelectOption value="jp">Japan</NativeSelectOption>
			<NativeSelectOption value="cn">China</NativeSelectOption>
			<NativeSelectOption value="in">India</NativeSelectOption>
			<NativeSelectOption value="br">Brazil</NativeSelectOption>
		</NativeSelect>
	),
};

export const LargeDataset: Story = {
	render: () => {
		// Generate 100 options
		const options = Array.from({ length: 100 }, (_, i) => ({
			value: `option-${i + 1}`,
			label: `Option ${i + 1}`,
		}));

		return (
			<NativeSelect defaultValue="option-1" className="w-[300px]">
				{options.map((option) => (
					<NativeSelectOption key={option.value} value={option.value}>
						{option.label}
					</NativeSelectOption>
				))}
			</NativeSelect>
		);
	},
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
	render: () => (
		<NativeSelect defaultValue="America/New_York" className="w-[400px]">
			{timezones.map((tz) => (
				<NativeSelectOption key={tz.value} value={tz.value}>
					{tz.label}
				</NativeSelectOption>
			))}
		</NativeSelect>
	),
};
