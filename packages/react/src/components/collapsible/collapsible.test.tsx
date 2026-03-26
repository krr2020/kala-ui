import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";

describe("Collapsible", () => {
	it("should render trigger and hidden content by default", () => {
		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		expect(screen.getByText("Toggle")).toBeInTheDocument();
	});

	it("should show content when defaultOpen is true", () => {
		render(
			<Collapsible defaultOpen>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("should expand content when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		await user.click(screen.getByText("Toggle"));
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("should collapse content when trigger is clicked again", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<Collapsible defaultOpen>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		const contentEl = container.querySelector(
			'[data-slot="collapsible-content"]',
		);
		expect(contentEl).toHaveAttribute("data-state", "open");

		await user.click(screen.getByText("Toggle"));
		expect(contentEl).toHaveAttribute("data-state", "closed");
	});

	it("should set correct data-slot attributes", () => {
		const { container } = render(
			<Collapsible defaultOpen>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		expect(
			container.querySelector('[data-slot="collapsible"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector('[data-slot="collapsible-trigger"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector('[data-slot="collapsible-content"]'),
		).toBeInTheDocument();
	});

	it("should be controlled with open prop", () => {
		const { container, rerender } = render(
			<Collapsible open={false}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		const content = container.querySelector(
			'[data-slot="collapsible-content"]',
		);
		expect(content).toHaveAttribute("data-state", "closed");

		rerender(
			<Collapsible open={true}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		expect(content).toHaveAttribute("data-state", "open");
	});

	it("should not expand when disabled", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<Collapsible disabled>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		);

		await user.click(screen.getByText("Toggle"));
		const content = container.querySelector(
			'[data-slot="collapsible-content"]',
		);
		expect(content).toHaveAttribute("data-state", "closed");
	});

	it("should apply custom className to content", () => {
		const { container } = render(
			<Collapsible defaultOpen>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent className="custom-content">
					Content
				</CollapsibleContent>
			</Collapsible>,
		);

		expect(
			container.querySelector('[data-slot="collapsible-content"]'),
		).toHaveClass("custom-content");
	});
});
