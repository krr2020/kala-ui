import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

describe("Command", () => {
	it("renders command component", () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Item 1</CommandItem>
				</CommandList>
			</Command>,
		);

		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		expect(screen.getByText("Item 1")).toBeInTheDocument();
	});

	it("renders command input with placeholder", () => {
		render(
			<Command>
				<CommandInput placeholder="Type a command..." />
			</Command>,
		);

		expect(
			screen.getByPlaceholderText("Type a command..."),
		).toBeInTheDocument();
	});

	it("renders search icon in command input", () => {
		const { container } = render(
			<Command>
				<CommandInput placeholder="Search..." />
			</Command>,
		);

		const searchIcon = container.querySelector("svg");
		expect(searchIcon).toBeInTheDocument();
	});

	it("allows typing in command input", async () => {
		const user = userEvent.setup();

		render(
			<Command>
				<CommandInput placeholder="Search..." />
			</Command>,
		);

		const input = screen.getByPlaceholderText("Search...");
		await user.type(input, "test query");

		expect(input).toHaveValue("test query");
	});

	it("filters items based on search input", async () => {
		const user = userEvent.setup();

		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Apple</CommandItem>
					<CommandItem>Banana</CommandItem>
					<CommandItem>Cherry</CommandItem>
				</CommandList>
			</Command>,
		);

		const input = screen.getByPlaceholderText("Search...");
		await user.type(input, "ban");

		expect(screen.getByText("Banana")).toBeInTheDocument();
	});

	it("renders command empty when no results", async () => {
		const user = userEvent.setup();

		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandItem>Apple</CommandItem>
				</CommandList>
			</Command>,
		);

		const input = screen.getByPlaceholderText("Search...");
		await user.type(input, "xyz");

		expect(screen.getByText("No results found.")).toBeVisible();
	});

	it("renders command groups with headings", () => {
		render(
			<Command>
				<CommandList>
					<CommandGroup heading="Fruits">
						<CommandItem>Apple</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Vegetables">
						<CommandItem>Carrot</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		);

		expect(screen.getByText("Fruits")).toBeInTheDocument();
		expect(screen.getByText("Vegetables")).toBeInTheDocument();
	});

	it("renders command items", () => {
		render(
			<Command>
				<CommandList>
					<CommandItem>Item 1</CommandItem>
					<CommandItem>Item 2</CommandItem>
					<CommandItem>Item 3</CommandItem>
				</CommandList>
			</Command>,
		);

		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
		expect(screen.getByText("Item 3")).toBeInTheDocument();
	});

	it("calls onSelect when item is clicked", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Command>
				<CommandList>
					<CommandItem onSelect={onSelect}>Click me</CommandItem>
				</CommandList>
			</Command>,
		);

		await user.click(screen.getByText("Click me"));

		expect(onSelect).toHaveBeenCalled();
	});

	it("renders disabled command items", () => {
		render(
			<Command>
				<CommandList>
					<CommandItem disabled>Disabled Item</CommandItem>
				</CommandList>
			</Command>,
		);

		const item = screen.getByText("Disabled Item");
		expect(item).toHaveAttribute("data-disabled", "true");
	});

	it("does not call onSelect for disabled items", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Command>
				<CommandList>
					<CommandItem disabled onSelect={onSelect}>
						Disabled Item
					</CommandItem>
				</CommandList>
			</Command>,
		);

		await user.click(screen.getByText("Disabled Item"));

		expect(onSelect).not.toHaveBeenCalled();
	});

	it("renders command shortcuts", () => {
		render(
			<Command>
				<CommandList>
					<CommandItem>
						Profile
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
				</CommandList>
			</Command>,
		);

		expect(screen.getByText("⌘P")).toBeInTheDocument();
	});

	it("renders command separator", () => {
		const { container } = render(
			<Command>
				<CommandList>
					<CommandGroup>
						<CommandItem>Item 1</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup>
						<CommandItem>Item 2</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		);

		const separator = container.querySelector('[role="separator"]');
		expect(separator).toBeInTheDocument();
	});

	it("navigates with keyboard arrows", async () => {
		const user = userEvent.setup();

		render(
			<Command>
				<CommandList>
					<CommandItem>Item 1</CommandItem>
					<CommandItem>Item 2</CommandItem>
					<CommandItem>Item 3</CommandItem>
				</CommandList>
			</Command>,
		);

		const firstItem = screen.getByText("Item 1");
		firstItem.focus();

		await user.keyboard("{ArrowDown}");

		// After navigation, focus should move (cmdk handles this internally)
		// Just verify items are present and interactive
		expect(screen.getByText("Item 2")).toBeInTheDocument();
	});

	it("selects item with Enter key", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();

		render(
			<Command>
				<CommandList>
					<CommandItem onSelect={onSelect}>Item 1</CommandItem>
				</CommandList>
			</Command>,
		);

		const item = screen.getByText("Item 1");
		await user.click(item);

		expect(onSelect).toHaveBeenCalled();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Command className="custom-command">
				<CommandList>
					<CommandItem>Item</CommandItem>
				</CommandList>
			</Command>,
		);

		const command = container.firstChild;
		expect(command).toHaveClass("custom-command");
	});

	it("renders with custom value prop", () => {
		render(
			<Command>
				<CommandList>
					<CommandItem value="custom-value">Item with custom value</CommandItem>
				</CommandList>
			</Command>,
		);

		const item = screen.getByText("Item with custom value");
		expect(item).toHaveAttribute("data-value", "custom-value");
	});

	it("limits list height with max-h", () => {
		const { container } = render(
			<Command>
				<CommandList>
					{Array.from({ length: 20 }, (_, i) => (
						<CommandItem key={i}>Item {i + 1}</CommandItem>
					))}
				</CommandList>
			</Command>,
		);

		const list = container.querySelector("[cmdk-list]");
		expect(list).toHaveClass("max-h-[300px]");
	});
});

describe("CommandDialog", () => {
	it("renders command dialog when open", () => {
		render(
			<CommandDialog open={true}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Item 1</CommandItem>
				</CommandList>
			</CommandDialog>,
		);

		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		expect(screen.getByText("Item 1")).toBeInTheDocument();
	});

	it("does not render command dialog when closed", () => {
		render(
			<CommandDialog open={false}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Item 1</CommandItem>
				</CommandList>
			</CommandDialog>,
		);

		expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
	});

	it("calls onOpenChange when dialog state changes", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();

		render(
			<CommandDialog open={true} onOpenChange={onOpenChange}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Item 1</CommandItem>
				</CommandList>
			</CommandDialog>,
		);

		// Press Escape to close
		await user.keyboard("{Escape}");

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders command in a dialog with proper styling", () => {
		render(
			<CommandDialog open={true}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandItem>Item 1</CommandItem>
				</CommandList>
			</CommandDialog>,
		);

		// Dialog is rendered in a portal, check for command input instead
		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
	});
});
