import type { Meta, StoryObj } from "@storybook/react";
import {
	Bold,
	Check,
	ChevronRight,
	Clipboard,
	Copy,
	FileText,
	Italic,
	Mail,
	MessageSquare,
	Redo,
	Save,
	Scissors,
	Settings,
	Underline,
	Undo,
	User,
} from "lucide-react";
import { useState } from "react";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "./menubar";

const meta = {
	title: "Overlay/Menubar",
	component: Menubar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Complete Application Menubar Example
export const ApplicationMenubar: Story = {
	render: () => (
		<Menubar className="w-full max-w-4xl">
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<FileText className="mr-2" />
						New File
						<MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						<FileText className="mr-2" />
						New Window
						<MenubarShortcut>⇧⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem disabled>
						Open...
						<MenubarShortcut>⌘O</MenubarShortcut>
					</MenubarItem>
					<MenubarSub>
						<MenubarSubTrigger>
							<FileText className="mr-2" />
							Open Recent
						</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>project-alpha.tsx</MenubarItem>
							<MenubarItem>dashboard.tsx</MenubarItem>
							<MenubarItem>settings.tsx</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>Clear Recently Opened</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem>
						<Save className="mr-2" />
						Save
						<MenubarShortcut>⌘S</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Save As...
						<MenubarShortcut>⇧⌘S</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem variant="destructive">
						Close Window
						<MenubarShortcut>⌘W</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Undo className="mr-2" />
						Undo
						<MenubarShortcut>⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						<Redo className="mr-2" />
						Redo
						<MenubarShortcut>⇧⌘Z</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Scissors className="mr-2" />
						Cut
						<MenubarShortcut>⌘X</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						<Copy className="mr-2" />
						Copy
						<MenubarShortcut>⌘C</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						<Clipboard className="mr-2" />
						Paste
						<MenubarShortcut>⌘V</MenubarShortcut>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						Find
						<MenubarShortcut>⌘F</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>
						Replace
						<MenubarShortcut>⌥⌘F</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem checked>
						<Check className="mr-2" />
						Show Toolbar
					</MenubarCheckboxItem>
					<MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
					<MenubarCheckboxItem>Show Status Bar</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarItem>
						Toggle Full Screen
						<MenubarShortcut>⌃⌘F</MenubarShortcut>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>

			<MenubarMenu>
				<MenubarTrigger>Help</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Documentation</MenubarItem>
					<MenubarItem>Release Notes</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Report Issue</MenubarItem>
					<MenubarItem>About</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Text Editor Menubar
export const TextEditorMenubar: Story = {
	render: () => {
		const [formatting, setFormatting] = useState({
			bold: false,
			italic: false,
			underline: false,
		});

		return (
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Format</MenubarTrigger>
					<MenubarContent>
						<MenubarCheckboxItem
							checked={formatting.bold}
							onCheckedChange={(checked) =>
								setFormatting({ ...formatting, bold: checked })
							}
						>
							<Bold className="mr-2" size={16} />
							Bold
							<MenubarShortcut>⌘B</MenubarShortcut>
						</MenubarCheckboxItem>
						<MenubarCheckboxItem
							checked={formatting.italic}
							onCheckedChange={(checked) =>
								setFormatting({ ...formatting, italic: checked })
							}
						>
							<Italic className="mr-2" size={16} />
							Italic
							<MenubarShortcut>⌘I</MenubarShortcut>
						</MenubarCheckboxItem>
						<MenubarCheckboxItem
							checked={formatting.underline}
							onCheckedChange={(checked) =>
								setFormatting({ ...formatting, underline: checked })
							}
						>
							<Underline className="mr-2" size={16} />
							Underline
							<MenubarShortcut>⌘U</MenubarShortcut>
						</MenubarCheckboxItem>
						<MenubarSeparator />
						<MenubarSub>
							<MenubarSubTrigger>Text Alignment</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>Align Left</MenubarItem>
								<MenubarItem>Align Center</MenubarItem>
								<MenubarItem>Align Right</MenubarItem>
								<MenubarItem>Justify</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		);
	},
};

// With Radio Groups
export const WithRadioGroups: Story = {
	render: () => {
		const [fontSize, setFontSize] = useState("medium");
		const [theme, setTheme] = useState("light");

		return (
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Preferences</MenubarTrigger>
					<MenubarContent>
						<MenubarLabel>Font Size</MenubarLabel>
						<MenubarRadioGroup value={fontSize} onValueChange={setFontSize}>
							<MenubarRadioItem value="small">Small</MenubarRadioItem>
							<MenubarRadioItem value="medium">Medium</MenubarRadioItem>
							<MenubarRadioItem value="large">Large</MenubarRadioItem>
						</MenubarRadioGroup>
						<MenubarSeparator />
						<MenubarLabel>Theme</MenubarLabel>
						<MenubarRadioGroup value={theme} onValueChange={setTheme}>
							<MenubarRadioItem value="light">Light</MenubarRadioItem>
							<MenubarRadioItem value="dark">Dark</MenubarRadioItem>
							<MenubarRadioItem value="system">System</MenubarRadioItem>
						</MenubarRadioGroup>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		);
	},
};

// With Icons and Groups
export const WithIconsAndGroups: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Communication</MenubarTrigger>
				<MenubarContent>
					<MenubarLabel>Send Message</MenubarLabel>
					<MenubarGroup>
						<MenubarItem>
							<Mail className="mr-2" />
							Email
						</MenubarItem>
						<MenubarItem>
							<MessageSquare className="mr-2" />
							Chat
						</MenubarItem>
					</MenubarGroup>
					<MenubarSeparator />
					<MenubarLabel>Settings</MenubarLabel>
					<MenubarGroup>
						<MenubarItem>
							<Settings className="mr-2" />
							Notification Preferences
						</MenubarItem>
						<MenubarItem>
							<User className="mr-2" />
							Profile Settings
						</MenubarItem>
					</MenubarGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Simple Menubar
export const SimpleMenubar: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>New</MenubarItem>
					<MenubarItem>Open</MenubarItem>
					<MenubarItem>Save</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Exit</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Undo</MenubarItem>
					<MenubarItem>Redo</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Zoom In</MenubarItem>
					<MenubarItem>Zoom Out</MenubarItem>
					<MenubarItem>Reset Zoom</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// With Nested Submenus
export const NestedSubmenus: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Insert</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Text</MenubarItem>
					<MenubarItem>Image</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>
							<FileText className="mr-2" />
							Table
						</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Insert Table</MenubarItem>
							<MenubarItem>Draw Table</MenubarItem>
							<MenubarSeparator />
							<MenubarSub>
								<MenubarSubTrigger>
									<ChevronRight className="mr-2" />
									Quick Tables
								</MenubarSubTrigger>
								<MenubarSubContent>
									<MenubarItem>Calendar</MenubarItem>
									<MenubarItem>Tabular List</MenubarItem>
									<MenubarItem>Matrix</MenubarItem>
								</MenubarSubContent>
							</MenubarSub>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarItem>Chart</MenubarItem>
					<MenubarItem>Symbol</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// With Inset Items
export const WithInsetItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Tools</MenubarTrigger>
				<MenubarContent>
					<MenubarLabel>Developer Tools</MenubarLabel>
					<MenubarItem inset>Console</MenubarItem>
					<MenubarItem inset>Debugger</MenubarItem>
					<MenubarItem inset>Network</MenubarItem>
					<MenubarSeparator />
					<MenubarLabel>Extensions</MenubarLabel>
					<MenubarItem inset>Manage Extensions</MenubarItem>
					<MenubarItem inset>Extension Marketplace</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Disabled Items
export const DisabledItems: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Actions</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Available Action</MenubarItem>
					<MenubarItem disabled>Disabled Action</MenubarItem>
					<MenubarItem>Another Available Action</MenubarItem>
					<MenubarSeparator />
					<MenubarItem disabled variant="destructive">
						Disabled Destructive Action
					</MenubarItem>
					<MenubarItem variant="destructive">Delete</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

// Compact Menubar
export const CompactMenubar: Story = {
	render: () => (
		<Menubar className="h-8">
			<MenubarMenu>
				<MenubarTrigger className="text-xs">File</MenubarTrigger>
				<MenubarContent>
					<MenubarItem className="text-xs">New</MenubarItem>
					<MenubarItem className="text-xs">Open</MenubarItem>
					<MenubarItem className="text-xs">Save</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger className="text-xs">Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem className="text-xs">Cut</MenubarItem>
					<MenubarItem className="text-xs">Copy</MenubarItem>
					<MenubarItem className="text-xs">Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};
