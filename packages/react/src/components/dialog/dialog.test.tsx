import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

describe("Dialog", () => {
	it("should render dialog trigger", () => {
		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.getByText("Open Dialog")).toBeInTheDocument();
	});

	it("should open dialog when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>Dialog description</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);

		await user.click(screen.getByText("Open Dialog"));
		expect(screen.getByText("Dialog Title")).toBeInTheDocument();
		expect(screen.getByText("Dialog description")).toBeInTheDocument();
	});

	it("should close dialog when close button is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);

		await user.click(screen.getByText("Open Dialog"));
		expect(screen.getByText("Dialog Title")).toBeInTheDocument();

		const closeButton = screen.getByRole("button", { name: /close/i });
		await user.click(closeButton);

		await vi.waitFor(() => {
			expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
		});
	});

	it("should render dialog footer", async () => {
		const user = userEvent.setup();

		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>
					<DialogFooter>
						<Button>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>,
		);

		await user.click(screen.getByText("Open Dialog"));
		expect(screen.getByText("Save")).toBeInTheDocument();
	});

	it("should apply custom className to content", async () => {
		const user = userEvent.setup();

		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent className="custom-dialog">
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);

		await user.click(screen.getByText("Open Dialog"));
		// Dialog renders in portal, query document.body
		const content = document.body.querySelector('[data-slot="dialog-content"]');
		expect(content).toHaveClass("custom-dialog");
	});
});
