import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
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
});
