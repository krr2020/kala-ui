import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Label } from "../label";
import { Skeleton } from "../skeleton";
import { Stack } from "../stack";
import { Text } from "../text";
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
		<Stack gap={4}>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Unchecked:
				</Text>
				<Checkbox aria-label="Unchecked checkbox" />
			</Flex>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Checked:
				</Text>
				<Checkbox defaultChecked aria-label="Checked checkbox" />
			</Flex>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Indeterminate:
				</Text>
				<Checkbox checked="indeterminate" aria-label="Indeterminate checkbox" />
			</Flex>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Disabled:
				</Text>
				<Checkbox disabled aria-label="Disabled unchecked checkbox" />
			</Flex>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Disabled Checked:
				</Text>
				<Checkbox
					disabled
					defaultChecked
					aria-label="Disabled checked checkbox"
				/>
			</Flex>
			<Flex align="center" gap={4}>
				<Text size="sm" weight="medium" className="w-40">
					Disabled Indeterminate:
				</Text>
				<Checkbox
					disabled
					checked="indeterminate"
					aria-label="Disabled indeterminate checkbox"
				/>
			</Flex>
		</Stack>
	),
};

// With Labels and Descriptions
export const WithLabels: Story = {
	render: () => (
		<Stack gap={6}>
			<Flex align="center" gap={2}>
				<Checkbox id="simple-label" />
				<Label htmlFor="simple-label">Accept terms and conditions</Label>
			</Flex>
			<Flex align="start" gap={3}>
				<Checkbox id="with-description" defaultChecked />
				<Box className="grid gap-1.5">
					<Label htmlFor="with-description">Enable notifications</Label>
					<Text size="sm" className="text-muted-foreground">
						You can enable or disable notifications at any time in your
						settings.
					</Text>
				</Box>
			</Flex>
			<Label
				htmlFor="interactive-card"
				className="flex cursor-pointer items-start gap-3 rounded-lg border border-input p-4 transition-all hover:bg-accent hover:text-accent-foreground has-aria-checked:border-primary has-aria-checked:bg-primary/10 h-auto"
			>
				<Checkbox id="interactive-card" defaultChecked />
				<Box className="grid gap-1.5">
					<Text size="sm" weight="medium" className="leading-none">
						Marketing emails
					</Text>
					<Text size="sm" className="text-muted-foreground">
						Receive emails about new products, features, and updates.
					</Text>
				</Box>
			</Label>
		</Stack>
	),
};

// Multiple Options and Layouts
export const MultipleOptions: Story = {
	render: () => (
		<Stack gap={8}>
			{/* Vertical List */}
			<Box>
				<Text weight="semibold" size="sm" className="mb-3">
					Vertical Layout
				</Text>
				<Stack gap={3}>
					<Flex align="center" gap={2}>
						<Checkbox id="option1" defaultChecked />
						<Label htmlFor="option1">Option 1</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="option2" />
						<Label htmlFor="option2">Option 2</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="option3" defaultChecked />
						<Label htmlFor="option3">Option 3</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="option4" disabled />
						<Label htmlFor="option4" className="text-muted-foreground">
							Disabled option
						</Label>
					</Flex>
				</Stack>
			</Box>

			{/* Inline Layout */}
			<Box>
				<Text weight="semibold" size="sm" className="mb-3">
					Inline Layout
				</Text>
				<Flex wrap="wrap" align="center" gap={4}>
					<Flex align="center" gap={2}>
						<Checkbox id="inline1" defaultChecked />
						<Label htmlFor="inline1">Option A</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="inline2" />
						<Label htmlFor="inline2">Option B</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="inline3" defaultChecked />
						<Label htmlFor="inline3">Option C</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="inline4" />
						<Label htmlFor="inline4">Option D</Label>
					</Flex>
				</Flex>
			</Box>
		</Stack>
	),
};

// Form Examples
export const FormExamples: Story = {
	render: () => (
		<Flex gap={6}>
			{/* Simple List */}
			<Box className="w-72 rounded-md border p-4">
				<Text weight="semibold" className="mb-4 text-base">
					Notification Preferences
				</Text>
				<Stack gap={3}>
					<Flex align="center" gap={2}>
						<Checkbox id="email-pref" defaultChecked />
						<Label htmlFor="email-pref">Email notifications</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="push-pref" defaultChecked />
						<Label htmlFor="push-pref">Push notifications</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="sms-pref" />
						<Label htmlFor="sms-pref">SMS notifications</Label>
					</Flex>
					<Flex align="center" gap={2}>
						<Checkbox id="marketing-pref" />
						<Label htmlFor="marketing-pref">Marketing emails</Label>
					</Flex>
				</Stack>
			</Box>

			{/* Grouped Form */}
			<Stack gap={6} className="w-80">
				<Box>
					<Text weight="semibold" size="sm" className="mb-3">
						Account Settings
					</Text>
					<Stack gap={3}>
						<Flex align="center" gap={2}>
							<Checkbox id="public-profile" />
							<Label htmlFor="public-profile">Make profile public</Label>
						</Flex>
						<Flex align="center" gap={2}>
							<Checkbox id="show-email" />
							<Label htmlFor="show-email">Show email address</Label>
						</Flex>
						<Flex align="center" gap={2}>
							<Checkbox id="searchable" defaultChecked />
							<Label htmlFor="searchable">Searchable by others</Label>
						</Flex>
					</Stack>
				</Box>
				<Box>
					<Text weight="semibold" size="sm" className="mb-3">
						Privacy
					</Text>
					<Stack gap={3}>
						<Flex align="center" gap={2}>
							<Checkbox id="analytics" defaultChecked />
							<Label htmlFor="analytics">Analytics cookies</Label>
						</Flex>
						<Flex align="center" gap={2}>
							<Checkbox id="cookies" />
							<Label htmlFor="cookies">Marketing cookies</Label>
						</Flex>
					</Stack>
				</Box>
			</Stack>
		</Flex>
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
			<Box className="w-80 rounded-md border p-4">
				<Flex align="center" gap={2} className="mb-4 border-b pb-3">
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
				</Flex>
				<Stack gap={3}>
					{items.map((item) => (
						<Flex key={item.id} align="center" gap={2}>
							<Checkbox
								id={`item-${item.id}`}
								checked={item.checked}
								onCheckedChange={() => handleItemChange(item.id)}
								aria-label={`${item.checked ? "Deselect" : "Select"} ${item.label}`}
							/>
							<Label htmlFor={`item-${item.id}`}>{item.label}</Label>
						</Flex>
					))}
				</Stack>
			</Box>
		);
	},
};
export const LoadingSkeleton: Story = {
	render: () => (
		<Stack gap={3}>
			<Flex align="center" gap={2}>
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-32" />
			</Flex>
			<Flex align="center" gap={2}>
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-40" />
			</Flex>
			<Flex align="center" gap={2}>
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-36" />
			</Flex>
		</Stack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Loading skeleton placeholders for checkbox options while loading.",
			},
		},
	},
};
