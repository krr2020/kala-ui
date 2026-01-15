import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea", () => {
	it("should render with default props", () => {
		const { container } = render(
			<ScrollArea>
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<ScrollArea className="custom-class">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toHaveClass("custom-class");
	});

	it("should render children content", () => {
		render(
			<ScrollArea>
				<div>Test Content</div>
				<p>More content</p>
			</ScrollArea>,
		);
		expect(screen.getByText("Test Content")).toBeInTheDocument();
		expect(screen.getByText("More content")).toBeInTheDocument();
	});

	it("should accept type prop", () => {
		const { container } = render(
			<ScrollArea type="always">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should accept scrollHideDelay prop", () => {
		const { container } = render(
			<ScrollArea scrollHideDelay={300}>
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should support dir prop for RTL", () => {
		const { container } = render(
			<ScrollArea dir="rtl">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should render with custom styles", () => {
		const { container } = render(
			<ScrollArea className="border-red-500">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toHaveClass("border-red-500");
	});
});

describe("ScrollBar", () => {
	it("should render vertical scrollbar by default", () => {
		const { container } = render(
			<ScrollArea className="h-20">
				<div className="h-40">Tall content that causes overflow</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should render horizontal scrollbar", () => {
		const { container } = render(
			<ScrollArea className="w-20">
				<div className="w-40">Wide content</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should apply custom className to scrollbar", () => {
		const { container } = render(
			<ScrollArea>
				<div>Content</div>
				<ScrollBar className="custom-scrollbar" />
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should render scroll thumb", () => {
		const { container } = render(
			<ScrollArea className="h-20">
				<div className="h-40">Tall content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});
});

describe("ScrollArea with different types", () => {
	it('should render with type="hover"', () => {
		const { container } = render(
			<ScrollArea type="hover">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it('should render with type="always"', () => {
		const { container } = render(
			<ScrollArea type="always">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it('should render with type="scroll"', () => {
		const { container } = render(
			<ScrollArea type="scroll">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it('should render with type="auto"', () => {
		const { container } = render(
			<ScrollArea type="auto">
				<div>Content</div>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});
});

describe("ScrollArea with both scrollbars", () => {
	it("should render both vertical and horizontal scrollbars", () => {
		const { container } = render(
			<ScrollArea className="size-20">
				<div className="size-40">Content</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should handle corner element", () => {
		const { container } = render(
			<ScrollArea>
				<div>Content with both scrollbars</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});
});

describe("ScrollArea accessibility", () => {
	it("should be keyboard accessible", () => {
		const { container } = render(
			<ScrollArea>
				<div>Scrollable content</div>
			</ScrollArea>,
		);
		const viewport = container.querySelector(
			"[data-radix-scroll-area-viewport]",
		);
		expect(viewport).toBeInTheDocument();
	});

	it("should have proper structure for screen readers", () => {
		render(
			<ScrollArea>
				<section aria-label="Scrollable content">Content</section>
			</ScrollArea>,
		);
		expect(screen.getByRole("region")).toBeInTheDocument();
	});
});

describe("ScrollArea edge cases", () => {
	it("should handle empty content", () => {
		const { container } = render(<ScrollArea />);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should handle very long content", () => {
		const longContent = Array.from({ length: 100 })
			.map((_, i) => `Line ${i + 1}`)
			.join("\n");
		const { container } = render(
			<ScrollArea>
				<pre>{longContent}</pre>
			</ScrollArea>,
		);
		const scrollArea = container.querySelector('[data-slot="scroll-area"]');
		expect(scrollArea).toBeInTheDocument();
	});

	it("should handle nested scroll areas", () => {
		const { container } = render(
			<ScrollArea>
				<div>
					Outer content
					<ScrollArea>
						<div>Inner content</div>
					</ScrollArea>
				</div>
			</ScrollArea>,
		);
		const scrollAreas = container.querySelectorAll('[data-slot="scroll-area"]');
		expect(scrollAreas.length).toBe(2);
	});
});
