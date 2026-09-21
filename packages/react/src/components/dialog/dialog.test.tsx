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

	it("should render size full without the centered-panel clamps", () => {
		const { unmount } = render(
			<Dialog open>
				<DialogContent size="full">
					<DialogHeader>
						<DialogTitle>Full Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		const full = document.body.querySelector('[data-slot="dialog-content"]');
		expect(full?.className).not.toContain("sm:max-w-");
		expect(full?.className).not.toContain("sm:top-");
		unmount();

		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Default Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		const def = document.body.querySelector('[data-slot="dialog-content"]');
		expect(def?.className).toContain("sm:max-w-lg");
	});

	it("should keep the card radius token on the centered panel", () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Radius</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		const content = document.body.querySelector('[data-slot="dialog-content"]');
		expect(content).toHaveClass("sm:rounded-[var(--kala-radius-card)]");
	});

	it("should use closeLabel for the close button's accessible name", () => {
		const { rerender } = render(
			<Dialog open>
				<DialogContent closeLabel="Cerrar">
					<DialogHeader>
						<DialogTitle>Diálogo</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();

		rerender(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Diálogo</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
	});
});
