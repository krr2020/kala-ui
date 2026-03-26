import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
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
});
