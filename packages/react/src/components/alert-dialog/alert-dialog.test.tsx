import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";

describe("AlertDialog", () => {
	it("should render trigger button", () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
			</AlertDialog>,
		);

		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("should open dialog when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Dialog Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open Dialog"));
		expect(screen.getByText("Dialog Title")).toBeInTheDocument();
	});

	it("should render header, title, and description", async () => {
		const user = userEvent.setup();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogBody>
						<AlertDialogDescription>
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Are you sure?")).toBeInTheDocument();
		expect(
			screen.getByText("This action cannot be undone."),
		).toBeInTheDocument();
	});

	it("should call onClick when action is clicked", async () => {
		const user = userEvent.setup();
		const handleAction = vi.fn();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={handleAction}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open"));
		await user.click(screen.getByRole("button", { name: "Confirm" }));
		expect(handleAction).toHaveBeenCalledTimes(1);
	});

	it("should render cancel button", async () => {
		const user = userEvent.setup();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Cancel")).toBeInTheDocument();
	});

	it("should render footer with actions", async () => {
		const user = userEvent.setup();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Cancel")).toBeInTheDocument();
		expect(screen.getByText("Continue")).toBeInTheDocument();
	});

	it("should apply custom className to content", async () => {
		const user = userEvent.setup();

		render(
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent className="custom-content">
					<AlertDialogTitle>Title</AlertDialogTitle>
				</AlertDialogContent>
			</AlertDialog>,
		);

		await user.click(screen.getByText("Open"));
		const content = screen
			.getByText("Title")
			.closest('[data-slot="alert-dialog-content"]');
		expect(content).toHaveClass("custom-content");
	});
});
