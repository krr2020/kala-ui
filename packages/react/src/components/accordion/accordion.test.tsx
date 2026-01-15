import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
