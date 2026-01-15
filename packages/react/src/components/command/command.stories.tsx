import type { Meta, StoryObj } from "@storybook/react";
import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
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
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<Smile className="mr-2 h-4 w-4" />
						<span>Search Emoji</span>
					</CommandItem>
					<CommandItem>
						<Calculator className="mr-2 h-4 w-4" />
						<span>Calculator</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Billing</span>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
};

export const WithDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		useEffect(() => {
			const down = (e: KeyboardEvent) => {
				if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					setOpen((open) => !open);
				}
			};

			document.addEventListener("keydown", down);
			return () => document.removeEventListener("keydown", down);
		}, []);

		return (
			<>
				<p className="text-sm text-muted-foreground mb-4">
					Press{" "}
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">⌘</span>K
					</kbd>
				</p>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
				>
					Open Command Menu
				</button>
				<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<Calendar className="mr-2 h-4 w-4" />
								<span>Calendar</span>
							</CommandItem>
							<CommandItem>
								<Smile className="mr-2 h-4 w-4" />
								<span>Search Emoji</span>
							</CommandItem>
							<CommandItem>
								<Calculator className="mr-2 h-4 w-4" />
								<span>Calculator</span>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Settings">
							<CommandItem>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Billing</span>
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</>
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
						<span>Document.pdf</span>
					</CommandItem>
					<CommandItem>
						<span>Presentation.pptx</span>
					</CommandItem>
					<CommandItem>
						<span>Spreadsheet.xlsx</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Folders">
					<CommandItem>
						<span>Downloads</span>
					</CommandItem>
					<CommandItem>
						<span>Documents</span>
					</CommandItem>
					<CommandItem>
						<span>Pictures</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Actions">
					<CommandItem>
						<span>New File</span>
						<CommandShortcut>⌘N</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<span>New Folder</span>
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
			<div>
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
					<p className="mt-4 text-sm text-muted-foreground">
						Selected: {value}
					</p>
				)}
			</div>
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
					<div className="py-6 text-center">
						<p className="text-sm text-muted-foreground">No results found.</p>
						<p className="mt-2 text-xs text-muted-foreground">
							Try searching for something else.
						</p>
					</div>
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
						<span>Calendar</span>
						<CommandShortcut>⌘1</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Calculator className="mr-2 h-4 w-4" />
						<span>Calculator</span>
						<CommandShortcut>⌘2</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
						<CommandShortcut>⌘3</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
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
