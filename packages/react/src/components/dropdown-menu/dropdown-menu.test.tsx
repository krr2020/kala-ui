import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
	it("should render dropdown menu trigger", () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);
		expect(screen.getByText("Open Menu")).toBeInTheDocument();
	});

	it("should open dropdown menu when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>Open Menu</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
					<DropdownMenuItem>Item 2</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
	});

	it("should render menu label", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuItem>Profile</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("My Account")).toBeInTheDocument();
	});

	it("should render menu separator", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Item 2</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		// DropdownMenu renders in portal, query document.body
		const separator = document.body.querySelector(
			'[data-slot="dropdown-menu-separator"]',
		);
		expect(separator).toBeInTheDocument();
	});

	it("should render checkbox items", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem checked>
						Show Toolbar
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Show Toolbar")).toBeInTheDocument();
	});

	it("should render radio group items", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup value="top">
						<DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Top")).toBeInTheDocument();
		expect(screen.getByText("Bottom")).toBeInTheDocument();
	});

	it("should render menu group", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuItem>Group Item 1</DropdownMenuItem>
						<DropdownMenuItem>Group Item 2</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(
			document.querySelector('[data-slot="dropdown-menu-group"]'),
		).toBeInTheDocument();
		expect(screen.getByText("Group Item 1")).toBeInTheDocument();
	});

	it("should render menu shortcut", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Save</DropdownMenuItem>
					<DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Ctrl+S")).toBeInTheDocument();
		expect(
			document.querySelector('[data-slot="dropdown-menu-shortcut"]'),
		).toBeInTheDocument();
	});

	it("should render menu item with inset prop", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem inset>Inset Item</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(
			document.querySelector('[data-inset="true"]'),
		).toBeInTheDocument();
	});

	it("should render menu item with destructive variant", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(
			document.querySelector('[data-variant="destructive"]'),
		).toBeInTheDocument();
	});

	it("should render label with inset prop", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		const label = document.querySelector('[data-slot="dropdown-menu-label"]');
		expect(label?.getAttribute("data-inset")).toBe("true");
	});

	it("should render content with custom sideOffset", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent sideOffset={8}>
					<DropdownMenuItem>Item</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Item")).toBeInTheDocument();
	});

	it("should render sub menu", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Sub Item</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(
			document.querySelector('[data-slot="dropdown-menu-sub-trigger"]'),
		).toBeInTheDocument();
	});

	it("should render portal within dropdown menu", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem>Portaled Item</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Portaled Item")).toBeInTheDocument();
	});

	it("should render menu item with custom className", async () => {
		const user = userEvent.setup();

		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem className="custom-item">Styled</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		await user.click(screen.getByText("Open Menu"));
		expect(document.querySelector(".custom-item")).toBeInTheDocument();
	});
});
