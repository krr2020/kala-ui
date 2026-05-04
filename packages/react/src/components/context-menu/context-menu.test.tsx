import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./context-menu";

describe("ContextMenu", () => {
	it("should render trigger", () => {
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Item</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		expect(screen.getByText("Right-click here")).toBeInTheDocument();
	});

	it("should open on right-click", async () => {
		const user = userEvent.setup();

		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Open</ContextMenuItem>
					<ContextMenuItem>Copy</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});

		expect(screen.getByText("Open")).toBeInTheDocument();
		expect(screen.getByText("Copy")).toBeInTheDocument();
	});

	it("should call onSelect when item is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onSelect={handleSelect}>Delete</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		await user.click(screen.getByText("Delete"));
		expect(handleSelect).toHaveBeenCalled();
	});

	it("should render label", async () => {
		const user = userEvent.setup();

		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuLabel>Actions</ContextMenuLabel>
					<ContextMenuItem>Item</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(screen.getByText("Actions")).toBeInTheDocument();
	});

	it("should render separator", async () => {
		const user = userEvent.setup();

		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Cut</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem>Paste</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		// Content rendered in portal — query from document
		expect(
			document.querySelector('[data-slot="context-menu-separator"]'),
		).toBeInTheDocument();
	});

	it("should render destructive item with correct data-variant", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem variant="destructive">Delete</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		// Content rendered in portal — query from document
		const item = document.querySelector('[data-variant="destructive"]');
		expect(item).toBeInTheDocument();
	});

	it("should set data-slot on trigger and content", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Item</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		expect(
			container.querySelector('[data-slot="context-menu-trigger"]'),
		).toBeInTheDocument();

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});

		expect(
			document.querySelector('[data-slot="context-menu-content"]'),
		).toBeInTheDocument();
	});

	it("should render item with inset prop", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem inset>Inset Item</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('[data-inset="true"]'),
		).toBeInTheDocument();
	});

	it("should render item with custom className", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem className="custom-class">Styled</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('.custom-class'),
		).toBeInTheDocument();
	});

	it("should render label with inset prop", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuLabel inset>Inset Label</ContextMenuLabel>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		const label = document.querySelector('[data-slot="context-menu-label"]');
		expect(label).toBeInTheDocument();
		expect(label?.getAttribute("data-inset")).toBe("true");
	});

	it("should render shortcut", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Copy</ContextMenuItem>
					<ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
		expect(
			document.querySelector('[data-slot="context-menu-shortcut"]'),
		).toBeInTheDocument();
	});

	it("should render group", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuGroup>
						<ContextMenuItem>Item A</ContextMenuItem>
						<ContextMenuItem>Item B</ContextMenuItem>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('[data-slot="context-menu-group"]'),
		).toBeInTheDocument();
		expect(screen.getByText("Item A")).toBeInTheDocument();
		expect(screen.getByText("Item B")).toBeInTheDocument();
	});

	it("should render checkbox item", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuCheckboxItem>Check me</ContextMenuCheckboxItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(screen.getByText("Check me")).toBeInTheDocument();
		expect(
			document.querySelector('[data-slot="context-menu-checkbox-item"]'),
		).toBeInTheDocument();
	});

	it("should render radio group and radio items", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuRadioGroup>
						<ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
						<ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
					</ContextMenuRadioGroup>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('[data-slot="context-menu-radio-group"]'),
		).toBeInTheDocument();
		expect(screen.getByText("Small")).toBeInTheDocument();
		expect(screen.getByText("Large")).toBeInTheDocument();
		expect(
			document.querySelector('[data-slot="context-menu-radio-item"]'),
		).toBeInTheDocument();
	});

	it("should render sub menu with trigger and content", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuSub>
						<ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuItem>Sub Item 1</ContextMenuItem>
							<ContextMenuItem>Sub Item 2</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('[data-slot="context-menu-sub-trigger"]'),
		).toBeInTheDocument();
		expect(screen.getByText("More Options")).toBeInTheDocument();
	});

	it("should render content with custom className", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent className="custom-content">
					<ContextMenuItem>Item</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(
			document.querySelector('.custom-content'),
		).toBeInTheDocument();
	});

	it("should render disabled item", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem disabled>Disabled</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(screen.getByText("Disabled")).toHaveAttribute("aria-disabled", "true");
	});

	it("should render portal within context menu", async () => {
		const user = userEvent.setup();
		render(
			<ContextMenu>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuPortal>
					<ContextMenuContent>
						<ContextMenuItem>Portaled Item</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenuPortal>
			</ContextMenu>,
		);

		await user.pointer({
			target: screen.getByText("Right-click here"),
			keys: "[MouseRight]",
		});
		expect(screen.getByText("Portaled Item")).toBeInTheDocument();
	});
});
