import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

describe("HoverCard", () => {
	it("should render trigger", () => {
		render(
			<HoverCard>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent>Card content</HoverCardContent>
			</HoverCard>,
		);

		expect(screen.getByText("Hover me")).toBeInTheDocument();
	});

	it("should set data-slot on trigger", () => {
		const { container } = render(
			<HoverCard>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent>Card content</HoverCardContent>
			</HoverCard>,
		);

		expect(
			container.querySelector('[data-slot="hover-card-trigger"]'),
		).toBeInTheDocument();
	});

	it("should show content on hover", async () => {
		const user = userEvent.setup();

		render(
			<HoverCard openDelay={0}>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent>Card content</HoverCardContent>
			</HoverCard>,
		);

		await user.hover(screen.getByText("Hover me"));
		expect(await screen.findByText("Card content")).toBeInTheDocument();
	});

	it("should hide content when unhovered", async () => {
		const user = userEvent.setup();

		render(
			<HoverCard openDelay={0} closeDelay={0}>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent>Card content</HoverCardContent>
			</HoverCard>,
		);

		await user.hover(screen.getByText("Hover me"));
		await screen.findByText("Card content");

		await user.unhover(screen.getByText("Hover me"));

		// After close, either removed from DOM or data-state=closed
		const content = document.querySelector('[data-slot="hover-card-content"]');
		const isClosed =
			content === null || content.getAttribute("data-state") === "closed";
		expect(isClosed).toBe(true);
	});

	it("should apply custom className to content", async () => {
		const user = userEvent.setup();

		render(
			<HoverCard openDelay={0}>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent className="custom-card">
					Card content
				</HoverCardContent>
			</HoverCard>,
		);

		await user.hover(screen.getByText("Hover me"));
		await screen.findByText("Card content");

		expect(
			document.querySelector('[data-slot="hover-card-content"]'),
		).toHaveClass("custom-card");
	});

	it("should render content in portal", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<HoverCard openDelay={0}>
				<HoverCardTrigger>Hover me</HoverCardTrigger>
				<HoverCardContent>Card content</HoverCardContent>
			</HoverCard>,
		);

		await user.hover(screen.getByText("Hover me"));
		await screen.findByText("Card content");

		// Content is in portal, not in container
		expect(
			container.querySelector('[data-slot="hover-card-content"]'),
		).toBeNull();
		expect(
			document.querySelector('[data-slot="hover-card-content"]'),
		).toBeInTheDocument();
	});
});
