import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarPortal,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "./menubar";

describe("Menubar", () => {
	it("renders menubar with menu items", () => {
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		expect(screen.getByText("File")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Menubar className="custom-menubar">
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		const menubar = container.querySelector('[data-slot="menubar"]');
		expect(menubar).toHaveClass("custom-menubar");
	});

	it("renders with default styles", () => {
		const { container } = render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		const menubar = container.querySelector('[data-slot="menubar"]');
		expect(menubar).toHaveClass("rounded-md", "border", "bg-background");
	});
});

describe("MenubarMenu", () => {
	it("renders menu with trigger", () => {
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		expect(screen.getByText("Edit")).toBeInTheDocument();
	});
});

describe("MenubarTrigger", () => {
	it("renders trigger text", () => {
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Settings</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		expect(screen.getByText("Settings")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger className="custom-trigger">Help</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		const trigger = container.querySelector('[data-slot="menubar-trigger"]');
		expect(trigger).toHaveClass("custom-trigger");
	});

	it("has correct hover styles", () => {
		const { container } = render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
				</MenubarMenu>
			</Menubar>,
		);

		const trigger = container.querySelector('[data-slot="menubar-trigger"]');
		expect(trigger).toHaveClass("hover:bg-accent");
	});
});

describe("MenubarContent", () => {
	it("renders menu items inside content", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>New</MenubarItem>
						<MenubarItem>Open</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		const trigger = screen.getByText("File");
		await user.click(trigger);

		expect(screen.getByText("New")).toBeInTheDocument();
		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("applies custom className", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent className="custom-content">
						<MenubarItem>New</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		const trigger = screen.getByText("File");
		await user.click(trigger);

		const content = document.querySelector('[data-slot="menubar-content"]');
		expect(content).toHaveClass("custom-content");
	});
});

describe("MenubarItem", () => {
	it("renders item text", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>Copy</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Edit"));
		expect(screen.getByText("Copy")).toBeInTheDocument();
	});

	it("handles click events", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onSelect={handleClick}>Paste</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Edit"));
		await user.click(screen.getByText("Paste"));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("applies destructive variant styles", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem variant="destructive">Delete</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("File"));
		const item = document.querySelector('[data-variant="destructive"]');
		expect(item).toHaveClass("data-[variant=destructive]:text-destructive");
	});

	it("applies inset prop", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>View</MenubarTrigger>
					<MenubarContent>
						<MenubarItem inset>Console</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("View"));
		const item = document.querySelector('[data-inset="true"]');
		expect(item).toHaveClass("data-inset:pl-8");
	});

	it("respects disabled prop", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem disabled onSelect={handleClick}>
							Disabled Item
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("File"));
		const item = screen.getByText("Disabled Item");

		await user.click(item);
		expect(handleClick).not.toHaveBeenCalled();
	});
});

describe("MenubarCheckboxItem", () => {
	it("renders checkbox item", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>View</MenubarTrigger>
					<MenubarContent>
						<MenubarCheckboxItem>Show Toolbar</MenubarCheckboxItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("View"));
		expect(screen.getByText("Show Toolbar")).toBeInTheDocument();
	});

	it("handles checked state", async () => {
		const handleCheckedChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>View</MenubarTrigger>
					<MenubarContent>
						<MenubarCheckboxItem
							checked={false}
							onCheckedChange={handleCheckedChange}
						>
							Show Sidebar
						</MenubarCheckboxItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("View"));
		await user.click(screen.getByText("Show Sidebar"));

		expect(handleCheckedChange).toHaveBeenCalledWith(true);
	});

	it("applies custom className", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>View</MenubarTrigger>
					<MenubarContent>
						<MenubarCheckboxItem className="custom-checkbox">
							Show Status Bar
						</MenubarCheckboxItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("View"));
		const item = document.querySelector('[data-slot="menubar-checkbox-item"]');
		expect(item).toHaveClass("custom-checkbox");
	});
});

describe("MenubarRadioGroup and MenubarRadioItem", () => {
	it("renders radio group with items", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Options</MenubarTrigger>
					<MenubarContent>
						<MenubarRadioGroup value="option1">
							<MenubarRadioItem value="option1">Option 1</MenubarRadioItem>
							<MenubarRadioItem value="option2">Option 2</MenubarRadioItem>
						</MenubarRadioGroup>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Options"));
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	it("handles value changes", async () => {
		const handleValueChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Theme</MenubarTrigger>
					<MenubarContent>
						<MenubarRadioGroup value="light" onValueChange={handleValueChange}>
							<MenubarRadioItem value="light">Light</MenubarRadioItem>
							<MenubarRadioItem value="dark">Dark</MenubarRadioItem>
						</MenubarRadioGroup>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Theme"));
		await user.click(screen.getByText("Dark"));

		expect(handleValueChange).toHaveBeenCalledWith("dark");
	});
});

describe("MenubarSub", () => {
	it("renders submenu with trigger and content", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarSub>
							<MenubarSubTrigger>Open Recent</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>file1.txt</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("File"));
		expect(screen.getByText("Open Recent")).toBeInTheDocument();
	});

	it("applies inset to subtrigger", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Insert</MenubarTrigger>
					<MenubarContent>
						<MenubarSub>
							<MenubarSubTrigger inset>Table</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>Insert Table</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Insert"));
		const subtrigger = document.querySelector('[data-inset="true"]');
		expect(subtrigger).toHaveClass("data-inset:pl-8");
	});
});

describe("MenubarLabel", () => {
	it("renders label text", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Settings</MenubarTrigger>
					<MenubarContent>
						<MenubarLabel>Appearance</MenubarLabel>
						<MenubarItem>Theme</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Settings"));
		expect(screen.getByText("Appearance")).toBeInTheDocument();
	});

	it("applies inset prop", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Tools</MenubarTrigger>
					<MenubarContent>
						<MenubarLabel inset>Developer</MenubarLabel>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Tools"));
		const label = document.querySelector(
			'[data-slot="menubar-label"][data-inset="true"]',
		);
		expect(label).toHaveClass("data-inset:pl-8");
	});
});

describe("MenubarSeparator", () => {
	it("renders separator", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>New</MenubarItem>
						<MenubarSeparator />
						<MenubarItem>Exit</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("File"));
		const separator = document.querySelector('[data-slot="menubar-separator"]');
		expect(separator).toBeInTheDocument();
	});

	it("applies separator styles", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarSeparator />
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Edit"));
		const separator = document.querySelector('[data-slot="menubar-separator"]');
		expect(separator).toHaveClass("bg-separator");
	});
});

describe("MenubarShortcut", () => {
	it("renders shortcut text", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>
							Save
							<MenubarShortcut>⌘S</MenubarShortcut>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("File"));
		expect(screen.getByText("⌘S")).toBeInTheDocument();
	});

	it("applies shortcut styles", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>
							Copy
							<MenubarShortcut className="custom-shortcut">⌘C</MenubarShortcut>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Edit"));
		const shortcut = screen.getByText("⌘C");
		expect(shortcut).toHaveClass("ml-auto", "text-xs", "custom-shortcut");
	});
});

describe("MenubarGroup", () => {
	it("groups menu items", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Edit</MenubarTrigger>
					<MenubarContent>
						<MenubarGroup>
							<MenubarItem>Cut</MenubarItem>
							<MenubarItem>Copy</MenubarItem>
							<MenubarItem>Paste</MenubarItem>
						</MenubarGroup>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("Edit"));
		const group = document.querySelector('[data-slot="menubar-group"]');
		expect(group).toBeInTheDocument();
	});
});

describe("MenubarPortal", () => {
	it("renders portal content", async () => {
		const user = userEvent.setup();
		render(
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>View</MenubarTrigger>
					<MenubarContent>
						<MenubarPortal>
							<MenubarItem>Portal Item</MenubarItem>
						</MenubarPortal>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>,
		);

		await user.click(screen.getByText("View"));
		expect(screen.getByText("Portal Item")).toBeInTheDocument();
	});
});
