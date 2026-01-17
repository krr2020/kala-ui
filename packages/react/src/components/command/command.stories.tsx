import { useDisclosure, useHotkeys } from "@kala-ui/react-hooks";
import type { Meta, StoryObj } from "@storybook/react";
import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";
import { useState } from "react";
import { Box } from "../box";
import { Stack } from "../stack";
import { Text } from "../text";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./command";

const meta = {
	title: "Components/Command",
	component: Command,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A command menu component built on top of cmdk, providing fast, composable, and accessible command palette functionality with keyboard navigation and fuzzy search.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<Calendar className="mr-2 h-4 w-4" />
						<Text as="span">Calendar</Text>
					</CommandItem>
					<CommandItem>
						<Smile className="mr-2 h-4 w-4" />
						<Text as="span">Search Emoji</Text>
					</CommandItem>
					<CommandItem>
						<Calculator className="mr-2 h-4 w-4" />
						<Text as="span">Calculator</Text>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem>
						<User className="mr-2 h-4 w-4" />
						<Text as="span">Profile</Text>
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CreditCard className="mr-2 h-4 w-4" />
						<Text as="span">Billing</Text>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings className="mr-2 h-4 w-4" />
						<Text as="span">Settings</Text>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const WithDialog: Story = {
	render: () => {
		const [open, { toggle, set: setOpen }] = useDisclosure(false);

		useHotkeys([["mod+K", toggle, { preventDefault: true }]]);

		return (
			<Stack gap={2}>
				<Text size="sm" className="text-muted-foreground">
					Press{" "}
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<Text as="span" className="text-xs">⌘</Text>K
					</kbd>
				</Text>
				<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<Calendar className="mr-2 h-4 w-4" />
								<Text as="span">Calendar</Text>
							</CommandItem>
							<CommandItem>
								<Smile className="mr-2 h-4 w-4" />
								<Text as="span">Search Emoji</Text>
							</CommandItem>
							<CommandItem>
								<Calculator className="mr-2 h-4 w-4" />
								<Text as="span">Calculator</Text>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Settings">
							<CommandItem>
								<User className="mr-2 h-4 w-4" />
								<Text as="span">Profile</Text>
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<CreditCard className="mr-2 h-4 w-4" />
								<Text as="span">Billing</Text>
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Settings className="mr-2 h-4 w-4" />
								<Text as="span">Settings</Text>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</Stack>
		);
	},
};

export const WithSearch: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Search for fruits..." />
			<CommandList>
				<CommandEmpty>No fruits found.</CommandEmpty>
				<CommandGroup heading="Fruits">
					<CommandItem value="apple">🍎 Apple</CommandItem>
					<CommandItem value="banana">🍌 Banana</CommandItem>
					<CommandItem value="cherry">🍒 Cherry</CommandItem>
					<CommandItem value="grape">🍇 Grape</CommandItem>
					<CommandItem value="orange">🍊 Orange</CommandItem>
					<CommandItem value="strawberry">🍓 Strawberry</CommandItem>
					<CommandItem value="watermelon">🍉 Watermelon</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const MultipleGroups: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Files">
					<CommandItem>
						<Text as="span">Document.pdf</Text>
					</CommandItem>
					<CommandItem>
						<Text as="span">Presentation.pptx</Text>
					</CommandItem>
					<CommandItem>
						<Text as="span">Spreadsheet.xlsx</Text>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Folders">
					<CommandItem>
						<Text as="span">Downloads</Text>
					</CommandItem>
					<CommandItem>
						<Text as="span">Documents</Text>
					</CommandItem>
					<CommandItem>
						<Text as="span">Pictures</Text>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Actions">
					<CommandItem>
						<Text as="span">New File</Text>
						<CommandShortcut>⌘N</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Text as="span">New Folder</Text>
						<CommandShortcut>⇧⌘N</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const WithOnSelect: Story = {
	render: () => {
		const [value, setValue] = useState("");

		return (
			<Box>
				<Command className="rounded-lg border shadow-md">
					<CommandInput placeholder="Select an option..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Options">
							<CommandItem value="option1" onSelect={() => setValue("option1")}>
								Option 1
							</CommandItem>
							<CommandItem value="option2" onSelect={() => setValue("option2")}>
								Option 2
							</CommandItem>
							<CommandItem value="option3" onSelect={() => setValue("option3")}>
								Option 3
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
				{value && (
					<Text className="mt-4 text-sm text-muted-foreground">
						Selected: {value}
					</Text>
				)}
			</Box>
		);
	},
};

export const DisabledItems: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Type a command..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Actions">
					<CommandItem>Available Action</CommandItem>
					<CommandItem disabled>Disabled Action</CommandItem>
					<CommandItem>Another Available Action</CommandItem>
					<CommandItem disabled>Another Disabled Action</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const Loading: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Searching..." />
			<CommandList>
				<CommandEmpty>Loading...</CommandEmpty>
			</CommandList>
		</Command>
	),
};

export const EmptyState: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>
					<Box className="py-6 text-center">
						<Text className="text-sm text-muted-foreground">No results found.</Text>
						<Text className="mt-2 text-xs text-muted-foreground">
							Try searching for something else.
						</Text>
					</Box>
				</CommandEmpty>
			</CommandList>
		</Command>
	),
};

export const WithIcons: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Search apps..." />
			<CommandList>
				<CommandEmpty>No apps found.</CommandEmpty>
				<CommandGroup heading="Applications">
					<CommandItem>
						<Calendar className="mr-2 h-4 w-4" />
						<Text as="span">Calendar</Text>
						<CommandShortcut>⌘1</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Calculator className="mr-2 h-4 w-4" />
						<Text as="span">Calculator</Text>
						<CommandShortcut>⌘2</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings className="mr-2 h-4 w-4" />
						<Text as="span">Settings</Text>
						<CommandShortcut>⌘3</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<User className="mr-2 h-4 w-4" />
						<Text as="span">Profile</Text>
						<CommandShortcut>⌘4</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const LongList: Story = {
	render: () => (
		<Command className="rounded-lg border shadow-md">
			<CommandInput placeholder="Search countries..." />
			<CommandList>
				<CommandEmpty>No country found.</CommandEmpty>
				<CommandGroup heading="Countries">
					{[
						"Argentina",
						"Australia",
						"Brazil",
						"Canada",
						"China",
						"France",
						"Germany",
						"India",
						"Italy",
						"Japan",
						"Mexico",
						"Netherlands",
						"Russia",
						"South Korea",
						"Spain",
						"Sweden",
						"Switzerland",
						"United Kingdom",
						"United States",
					].map((country) => (
						<CommandItem key={country} value={country}>
							{country}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	),
};
