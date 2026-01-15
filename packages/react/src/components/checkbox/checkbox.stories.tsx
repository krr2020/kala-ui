import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Label } from "../label";
import { Skeleton } from "../skeleton/skeleton";
import { Checkbox } from "./checkbox";

const meta = {
	title: "Forms/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		checked: {
			control: "select",
			options: [true, false, "indeterminate"],
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// All States Showcase
export const AllStates: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Unchecked:</div>
				<Checkbox aria-label="Unchecked checkbox" />
			</div>
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Checked:</div>
				<Checkbox defaultChecked aria-label="Checked checkbox" />
			</div>
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Indeterminate:</div>
				<Checkbox checked="indeterminate" aria-label="Indeterminate checkbox" />
			</div>
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Disabled:</div>
				<Checkbox disabled aria-label="Disabled unchecked checkbox" />
			</div>
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Disabled Checked:</div>
				<Checkbox
					disabled
					defaultChecked
					aria-label="Disabled checked checkbox"
				/>
			</div>
			<div className="flex items-center gap-4">
				<div className="w-40 text-sm font-medium">Disabled Indeterminate:</div>
				<Checkbox
					disabled
					checked="indeterminate"
					aria-label="Disabled indeterminate checkbox"
				/>
			</div>
		</div>
	),
};

// With Labels and Descriptions
export const WithLabels: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<Checkbox id="simple-label" />
				<Label htmlFor="simple-label">Accept terms and conditions</Label>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox id="with-description" defaultChecked />
				<div className="grid gap-1.5">
					<Label htmlFor="with-description">Enable notifications</Label>
					<p className="text-sm text-muted-foreground">
						You can enable or disable notifications at any time in your
						settings.
					</p>
				</div>
			</div>
			<Label
				htmlFor="interactive-card"
				className="flex cursor-pointer items-start gap-3 rounded-lg border border-input p-4 transition-all hover:bg-accent hover:text-accent-foreground has-aria-checked:border-primary has-aria-checked:bg-primary/10 h-auto"
			>
				<Checkbox id="interactive-card" defaultChecked />
				<div className="grid gap-1.5">
					<p className="text-sm font-medium leading-none">Marketing emails</p>
					<p className="text-sm text-muted-foreground">
						Receive emails about new products, features, and updates.
					</p>
				</div>
			</Label>
		</div>
	),
};

// Multiple Options and Layouts
export const MultipleOptions: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			{/* Vertical List */}
			<div>
				<h4 className="mb-3 text-sm font-semibold">Vertical Layout</h4>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Checkbox id="option1" defaultChecked />
						<Label htmlFor="option1">Option 1</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="option3" defaultChecked />
						<Label htmlFor="option3">Option 3</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="option4" disabled />
						<Label htmlFor="option4" className="text-muted-foreground">
							Disabled option
						</Label>
					</div>
				</div>
			</div>

			{/* Inline Layout */}
			<div>
				<h4 className="mb-3 text-sm font-semibold">Inline Layout</h4>
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<Checkbox id="inline1" defaultChecked />
						<Label htmlFor="inline1">Option A</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="inline2" />
						<Label htmlFor="inline2">Option B</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="inline3" defaultChecked />
						<Label htmlFor="inline3">Option C</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="inline4" />
						<Label htmlFor="inline4">Option D</Label>
					</div>
				</div>
			</div>
		</div>
	),
};

// Form Examples
export const FormExamples: Story = {
	render: () => (
		<div className="flex gap-6">
			{/* Simple List */}
			<div className="w-72 rounded-md border p-4">
				<h4 className="mb-4 text-base font-semibold">
					Notification Preferences
				</h4>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Checkbox id="email-pref" defaultChecked />
						<Label htmlFor="email-pref">Email notifications</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="push-pref" defaultChecked />
						<Label htmlFor="push-pref">Push notifications</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="sms-pref" />
						<Label htmlFor="sms-pref">SMS notifications</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox id="marketing-pref" />
						<Label htmlFor="marketing-pref">Marketing emails</Label>
					</div>
				</div>
			</div>

			{/* Grouped Form */}
			<div className="w-80 space-y-6">
				<div>
					<h4 className="mb-3 text-sm font-semibold">Account Settings</h4>
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Checkbox id="public-profile" />
							<Label htmlFor="public-profile">Make profile public</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="show-email" />
							<Label htmlFor="show-email">Show email address</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="searchable" defaultChecked />
							<Label htmlFor="searchable">Searchable by others</Label>
						</div>
					</div>
				</div>
				<div>
					<h4 className="mb-3 text-sm font-semibold">Privacy</h4>
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Checkbox id="analytics" defaultChecked />
							<Label htmlFor="analytics">Analytics cookies</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="cookies" />
							<Label htmlFor="cookies">Marketing cookies</Label>
						</div>
					</div>
				</div>
			</div>
		</div>
	),
};

// Select All with Indeterminate (Interactive)
export const SelectAllInteractive: Story = {
	render: function SelectAllComponent() {
		const [items, setItems] = useState([
			{ id: 1, label: "Item 1", checked: false },
			{ id: 2, label: "Item 2", checked: false },
			{ id: 3, label: "Item 3", checked: false },
			{ id: 4, label: "Item 4", checked: false },
		]);

		const checkedCount = items.filter((item) => item.checked).length;
		const allChecked = checkedCount === items.length;
		const someChecked = checkedCount > 0 && checkedCount < items.length;

		const handleSelectAll = () => {
			setItems(items.map((item) => ({ ...item, checked: !allChecked })));
		};

		const handleItemChange = (id: number) => {
			setItems(
				items.map((item) =>
					item.id === id ? { ...item, checked: !item.checked } : item,
				),
			);
		};

		return (
			<div className="w-80 rounded-md border p-4">
				<div className="mb-4 flex items-center gap-2 border-b pb-3">
					<Checkbox
						id="select-all"
						checked={allChecked ? true : someChecked ? "indeterminate" : false}
						onCheckedChange={handleSelectAll}
						aria-label={
							allChecked
								? "Deselect all items"
								: someChecked
									? "Select all items (partial selection)"
									: "Select all items"
						}
					/>
					<Label htmlFor="select-all" className="font-semibold">
						Select All ({checkedCount}/{items.length})
					</Label>
				</div>
				<div className="flex flex-col gap-3">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-2">
							<Checkbox
								id={`item-${item.id}`}
								checked={item.checked}
								onCheckedChange={() => handleItemChange(item.id)}
								aria-label={`${item.checked ? "Deselect" : "Select"} ${item.label}`}
							/>
							<Label htmlFor={`item-${item.id}`}>{item.label}</Label>
						</div>
					))}
				</div>
			</div>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-40" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-36" />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Loading skeleton placeholders for checkbox options while loading.",
			},
		},
	},
};