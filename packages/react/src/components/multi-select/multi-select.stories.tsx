import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Skeleton } from "../skeleton";
import { MultiSelect, type MultiSelectOption } from "./multi-select";

const meta = {
	title: "Forms/MultiSelect",
	component: MultiSelect,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
		},
		showActions: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: MultiSelectOption[] = [
	{ value: "next.js", label: "Next.js" },
	{ value: "sveltekit", label: "SvelteKit" },
	{ value: "nuxt.js", label: "Nuxt.js" },
	{ value: "remix", label: "Remix" },
	{ value: "astro", label: "Astro" },
	{ value: "gatsby", label: "Gatsby" },
	{ value: "vue", label: "Vue.js" },
	{ value: "angular", label: "Angular" },
];

export const Default: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);

		return (
			<div className="w-[400px] space-y-2">
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
				/>
				{value.length > 0 && (
					<p className="text-sm text-muted-foreground">
						Selected {value.length} framework{value.length !== 1 ? "s" : ""}
					</p>
				)}
			</div>
		);
	},
};

export const WithPreselectedValues: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState<string[]>(["next.js", "remix"]);

		return (
			<div className="w-[400px]">
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
					placeholder="Select frameworks..."
				/>
			</div>
		);
	},
};

export const MaxSelections: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState<string[]>(["next.js"]);

		return (
			<div className="w-[400px] space-y-2">
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
					maxSelected={3}
					placeholder="Select up to 3 frameworks..."
				/>
				<p className="text-sm text-muted-foreground">
					{value.length}/3 selected
				</p>
			</div>
		);
	},
};

export const WithDisabledOptions: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = [
			{ value: "next.js", label: "Next.js" },
			{ value: "sveltekit", label: "SvelteKit", disabled: true },
			{ value: "nuxt.js", label: "Nuxt.js" },
			{ value: "remix", label: "Remix", disabled: true },
			{ value: "astro", label: "Astro" },
		];

		return (
			<div className="w-[400px]">
				<MultiSelect options={options} value={value} onValueChange={setValue} />
			</div>
		);
	},
};

export const WithoutActions: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState<string[]>(["next.js"]);

		return (
			<div className="w-[400px]">
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
					showActions={false}
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
		const [value, setValue] = useState<string[]>(["next.js", "remix"]);

		return (
			<div className="w-[400px]">
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
					disabled
				/>
			</div>
		);
	},
};

const tags: MultiSelectOption[] = [
	{ value: "react", label: "React" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "tailwind", label: "Tailwind CSS" },
	{ value: "nextjs", label: "Next.js" },
	{ value: "nodejs", label: "Node.js" },
	{ value: "postgresql", label: "PostgreSQL" },
	{ value: "docker", label: "Docker" },
	{ value: "kubernetes", label: "Kubernetes" },
	{ value: "aws", label: "AWS" },
	{ value: "vercel", label: "Vercel" },
];

export const Tags: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([
			"react",
			"typescript",
			"tailwind",
		]);

		return (
			<div className="w-[500px] space-y-2">
				<div className="text-sm font-medium">Tech Stack</div>
				<MultiSelect
					options={tags}
					value={value}
					onValueChange={setValue}
					placeholder="Select technologies..."
					searchPlaceholder="Search technologies..."
				/>
			</div>
		);
	},
};

const categories: MultiSelectOption[] = [
	{ value: "electronics", label: "Electronics" },
	{ value: "clothing", label: "Clothing" },
	{ value: "books", label: "Books" },
	{ value: "home", label: "Home & Garden" },
	{ value: "sports", label: "Sports & Outdoors" },
	{ value: "toys", label: "Toys & Games" },
	{ value: "automotive", label: "Automotive" },
	{ value: "beauty", label: "Beauty & Personal Care" },
	{ value: "food", label: "Food & Grocery" },
	{ value: "health", label: "Health & Wellness" },
];

export const Filters: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);

		return (
			<div className="w-[450px] space-y-2">
				<div className="text-sm font-medium">Filter by Categories</div>
				<MultiSelect
					options={categories}
					value={value}
					onValueChange={setValue}
					placeholder="Select categories..."
					searchPlaceholder="Search categories..."
				/>
				{value.length > 0 && (
					<div className="text-sm text-muted-foreground">
						Filtering by: {value.join(", ")}
					</div>
				)}
			</div>
		);
	},
};

export const LargeDataset: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
			value: `option-${i + 1}`,
			label: `Option ${i + 1}`,
		}));

		return (
			<div className="w-[400px] space-y-2">
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					placeholder="Select options..."
					searchPlaceholder="Search 50 options..."
				/>
				<p className="text-sm text-muted-foreground">
					{value.length} of 50 selected
				</p>
			</div>
		);
	},
};

export const OptionGroups: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = [
			{ value: "react", label: "React", group: "Frontend" },
			{ value: "vue", label: "Vue", group: "Frontend" },
			{ value: "angular", label: "Angular", group: "Frontend" },
			{ value: "node", label: "Node.js", group: "Backend" },
			{ value: "python", label: "Python", group: "Backend" },
			{ value: "go", label: "Go", group: "Backend" },
			{ value: "postgres", label: "PostgreSQL", group: "Database" },
			{ value: "mysql", label: "MySQL", group: "Database" },
			{ value: "redis", label: "Redis", group: "Database" },
		];

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">Grouped Options</div>
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					placeholder="Select stack..."
				/>
			</div>
		);
	},
};

export const WithIcons: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = [
			{
				value: "todo",
				label: "Todo",
				icon: <span className="text-primary">📝</span>,
			},
			{
				value: "inprogress",
				label: "In Progress",
				icon: <span className="text-warning">🚧</span>,
			},
			{
				value: "done",
				label: "Done",
				icon: <span className="text-success">✅</span>,
			},
			{
				value: "bug",
				label: "Bug",
				icon: <span className="text-error">🐛</span>,
			},
		];

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">With Icons</div>
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					placeholder="Select status..."
				/>
			</div>
		);
	},
};

export const WithAvatars: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = [
			{
				value: "user1",
				label: "Alice",
				icon: (
					<img
						src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
						className="size-4 rounded-full"
						alt="Alice"
					/>
				),
			},
			{
				value: "user2",
				label: "Bob",
				icon: (
					<img
						src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
						className="size-4 rounded-full"
						alt="Bob"
					/>
				),
			},
			{
				value: "user3",
				label: "Charlie",
				icon: (
					<img
						src="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
						className="size-4 rounded-full"
						alt="Charlie"
					/>
				),
			},
		];

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">With Avatars</div>
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					placeholder="Select users..."
				/>
			</div>
		);
	},
};

export const PreserveOrder: Story = {
	args: {
		options: frameworks,
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">Preserve Selection Order</div>
				<p className="text-xs text-muted-foreground">
					Selected items will appear in the order they were selected.
				</p>
				<MultiSelect
					options={frameworks}
					value={value}
					onValueChange={setValue}
					preserveSelectionOrder
				/>
			</div>
		);
	},
};

export const WithSeparators: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([]);
		const options: MultiSelectOption[] = [
			{ value: "item1", label: "Item 1" },
			{ value: "item2", label: "Item 2" },
			{ value: "item3", label: "Item 3" },
			{ value: "item4", label: "Item 4" },
		];

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">With Separators</div>
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					showSeparators
					placeholder="Select items..."
				/>
			</div>
		);
	},
};

export const MaxDisplay: Story = {
	args: {
		options: [],
	},
	render: () => {
		const [value, setValue] = useState<string[]>([
			"react",
			"vue",
			"angular",
			"node",
			"python",
		]);
		const options: MultiSelectOption[] = [
			{ value: "react", label: "React" },
			{ value: "vue", label: "Vue" },
			{ value: "angular", label: "Angular" },
			{ value: "node", label: "Node.js" },
			{ value: "python", label: "Python" },
			{ value: "go", label: "Go" },
			{ value: "rust", label: "Rust" },
			{ value: "java", label: "Java" },
		];

		return (
			<div className="w-[400px] space-y-2">
				<div className="text-sm font-medium">Max Display (3 items)</div>
				<p className="text-xs text-muted-foreground">
					Shows up to 3 items, then collapses the rest.
				</p>
				<MultiSelect
					options={options}
					value={value}
					onValueChange={setValue}
					maxVisibleSelections={3}
					placeholder="Select languages..."
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
				story:
					"Loading skeleton placeholder for multi-select fields while loading.",
			},
		},
	},
};
