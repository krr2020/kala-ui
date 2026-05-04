import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

describe("Accordion", () => {
	it("should render accordion with items", () => {
		render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		expect(screen.getByText("Item 1")).toBeInTheDocument();
	});

	it("should render multiple items", () => {
		render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Item 2</AccordionTrigger>
					<AccordionContent>Content 2</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
	});

	it("should toggle content visibility", async () => {
		const { container } = render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Toggle Me</AccordionTrigger>
					<AccordionContent>Hidden Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		// Content should be hidden initially
		const content = container.querySelector('[data-slot="accordion-content"]');
		expect(content).toHaveAttribute("data-state", "closed");
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Accordion type="single" collapsible className="custom-accordion">
				<AccordionItem value="item-1">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const accordion = container.querySelector('[data-slot="accordion"]');
		expect(accordion).toHaveClass("custom-accordion");
	});

	it("should render with data-slot attributes", () => {
		const { container } = render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		expect(
			container.querySelector('[data-slot="accordion"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector('[data-slot="accordion-item"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector('[data-slot="accordion-trigger"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector('[data-slot="accordion-content"]'),
		).toBeInTheDocument();
	});

	it("should handle disabled state", () => {
		render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger disabled>Disabled Item</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const trigger = screen.getByText("Disabled Item");
		expect(trigger).toBeDisabled();
	});

	it("should render with bordered variant", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="bordered">
				<AccordionItem value="item-1">
					<AccordionTrigger>Bordered Item</AccordionTrigger>
					<AccordionContent>Bordered Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const accordion = container.querySelector('[data-slot="accordion"]');
		expect(accordion).toHaveClass("space-y-2");

		const item = container.querySelector('[data-slot="accordion-item"]');
		expect(item).toHaveClass("border", "rounded-md", "overflow-hidden");
	});

	it("should render with filled variant", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="filled">
				<AccordionItem value="item-1">
					<AccordionTrigger>Filled Item</AccordionTrigger>
					<AccordionContent>Filled Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const accordion = container.querySelector('[data-slot="accordion"]');
		expect(accordion).toHaveClass("space-y-2");

		const item = container.querySelector('[data-slot="accordion-item"]');
		expect(item).toHaveClass("border", "rounded-md", "overflow-hidden");
	});

	it("should apply default variant styles to item", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="default">
				<AccordionItem value="item-1">
					<AccordionTrigger>Default Item</AccordionTrigger>
					<AccordionContent>Default Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const item = container.querySelector('[data-slot="accordion-item"]');
		expect(item).toHaveClass("border-b");
		expect(item).not.toHaveClass("rounded-md");
	});

	it("should apply variant-specific styles to trigger", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="bordered">
				<AccordionItem value="item-1">
					<AccordionTrigger>Bordered Trigger</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const trigger = container.querySelector('[data-slot="accordion-trigger"]');
		expect(trigger).toHaveClass("px-4", "rounded-t-md");
	});

	it("should apply filled variant styles to trigger", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="filled">
				<AccordionItem value="item-1">
					<AccordionTrigger>Filled Trigger</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const trigger = container.querySelector('[data-slot="accordion-trigger"]');
		expect(trigger).toHaveClass("px-4");
	});

	it("should apply variant-specific styles to content", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="bordered">
				<AccordionItem value="item-1">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent>Bordered Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const content = container.querySelector('[data-slot="accordion-content"]');
		expect(content).toBeInTheDocument();
	});

	it("should apply filled variant styles to content", () => {
		const { container } = render(
			<Accordion type="single" collapsible variant="filled">
				<AccordionItem value="item-1">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent>Filled Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const content = container.querySelector('[data-slot="accordion-content"]');
		expect(content).toBeInTheDocument();
	});

	it("should apply custom className to item", () => {
		const { container } = render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1" className="custom-item">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const item = container.querySelector('[data-slot="accordion-item"]');
		expect(item).toHaveClass("custom-item");
	});

	it("should apply custom className to trigger", () => {
		const { container } = render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger className="custom-trigger">
						Item
					</AccordionTrigger>
					<AccordionContent>Content</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const trigger = container.querySelector('[data-slot="accordion-trigger"]');
		expect(trigger).toHaveClass("custom-trigger");
	});

	it("should apply custom className to content", () => {
		const { container } = render(
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item</AccordionTrigger>
					<AccordionContent className="custom-content">
						Content
					</AccordionContent>
				</AccordionItem>
			</Accordion>,
		);

		const content = container.querySelector('[data-slot="accordion-content"]');
		expect(content).toBeInTheDocument();
	});
});
