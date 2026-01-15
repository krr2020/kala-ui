import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
	Popover,
	PopoverBody,
	PopoverClose,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from "./popover";

describe("Popover", () => {
	it("should render popover trigger", () => {
		render(
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		);
		expect(screen.getByText("Open Popover")).toBeInTheDocument();
	});

	it("should open popover when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger asChild>
					<Button>Open Popover</Button>
				</PopoverTrigger>
				<PopoverContent>Popover content here</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open Popover"));
		expect(screen.getByText("Popover content here")).toBeInTheDocument();
	});

	it("should apply custom className to content", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent className="custom-popover">
					Popover content
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open Popover"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		expect(content).toHaveClass("custom-popover");
	});

	it("should render with header and body", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<PopoverHeader>Header Text</PopoverHeader>
					<PopoverBody>Body Text</PopoverBody>
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Header Text")).toBeInTheDocument();
		expect(screen.getByText("Body Text")).toBeInTheDocument();
	});

	it("should apply variant attribute", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent variant="header-primary">Content</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		expect(content).toHaveAttribute("data-variant", "header-primary");
	});

	it("should render close button", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<PopoverClose asChild>
						<Button variant="ghost">Close</Button>
					</PopoverClose>
					Content
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Close")).toBeInTheDocument();
	});

	it("should close when close button is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<PopoverClose asChild>
						<Button variant="ghost">Close</Button>
					</PopoverClose>
					Content Text
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Content Text")).toBeInTheDocument();

		await user.click(screen.getByText("Close"));
		expect(screen.queryByText("Content Text")).not.toBeInTheDocument();
	});

	it("should support different side positions", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent side="top">Content</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		expect(content).toBeInTheDocument();
	});

	it("should apply colored header variant styles", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent variant="header-success">
					<PopoverHeader>Success Header</PopoverHeader>
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		expect(screen.getByText("Success Header")).toBeInTheDocument();
	});

	it("should apply full color variant styles", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent variant="danger">
					<PopoverHeader>Danger</PopoverHeader>
				</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		expect(content).toHaveAttribute("data-variant", "danger");
	});

	it("should render arrow by default", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>Content</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		const arrow = content?.querySelector(".size-2\\.5");
		expect(arrow).toBeInTheDocument();
	});

	it("should not render arrow when showArrow is false", async () => {
		const user = userEvent.setup();

		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent showArrow={false}>Content</PopoverContent>
			</Popover>,
		);

		await user.click(screen.getByText("Open"));
		const content = document.body.querySelector(
			'[data-slot="popover-content"]',
		);
		const arrow = content?.querySelector(".size-2\\.5");
		expect(arrow).not.toBeInTheDocument();
	});
});
