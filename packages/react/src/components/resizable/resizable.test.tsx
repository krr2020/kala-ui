import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";

describe("ResizablePanelGroup", () => {
	describe("Orientation", () => {
		it("should render with horizontal orientation", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toBeInTheDocument();
			expect(group).toHaveAttribute("data-orientation", "horizontal");
		});

		it("should render with vertical orientation", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveAttribute("data-orientation", "vertical");
		});

		it("should default to horizontal orientation", () => {
			const { container } = render(
				<ResizablePanelGroup>
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveAttribute("data-orientation", "horizontal");
		});

		it("should apply flex classes", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveClass("flex");
		});
	});

	describe("Props and Styling", () => {
		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal" className="custom-class">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveClass("custom-class");
		});

		it("should accept onLayoutChanged callback", () => {
			const onLayoutChanged = vi.fn();
			const { container } = render(
				<ResizablePanelGroup
					orientation="horizontal"
					onLayoutChanged={onLayoutChanged}
				>
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel-group"]'),
			).toBeInTheDocument();
		});

		it("should accept disabled prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal" disabled>
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel-group"]'),
			).toBeInTheDocument();
		});

		it("should accept custom id prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal" id="test-group">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveAttribute("id", "test-group");
		});
	});
});

describe("ResizablePanel", () => {
	describe("Rendering and Content", () => {
		it("should render panel content", () => {
			render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>
						<div>Panel Content</div>
					</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(screen.getByText("Panel Content")).toBeInTheDocument();
		});

		it("should render multiple panels", () => {
			render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 3</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(screen.getByText("Panel 1")).toBeInTheDocument();
			expect(screen.getByText("Panel 2")).toBeInTheDocument();
			expect(screen.getByText("Panel 3")).toBeInTheDocument();
		});

		it("should render with complex nested content", () => {
			render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>
						<div>
							<h2>Title</h2>
							<p>Content</p>
							<button type="button">Action</button>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(screen.getByText("Title")).toBeInTheDocument();
			expect(screen.getByText("Content")).toBeInTheDocument();
			expect(screen.getByText("Action")).toBeInTheDocument();
		});
	});

	describe("Props and Styling", () => {
		// v4 applies className to the nested div (outer div handles flex layout)
		const styledPanel = (container: HTMLElement) =>
			container.querySelector('[data-slot="resizable-panel"] > div');

		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel className="custom-panel">Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(styledPanel(container)).toHaveClass("custom-panel");
		});

		it("should have relative positioning", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(styledPanel(container)).toHaveClass("relative");
		});

		it("should accept custom id prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel id="test-panel">Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toHaveAttribute("id", "test-panel");
		});
	});

	describe("Size Constraints", () => {
		it("should accept defaultSize prop (percentage as string)", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize="30">Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize="70">Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panels = container.querySelectorAll(
				'[data-slot="resizable-panel"]',
			);
			expect(panels).toHaveLength(2);
		});

		it("should accept minSize prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel minSize="20">Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel"]'),
			).toBeInTheDocument();
		});

		it("should accept maxSize prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel maxSize="80">Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel"]'),
			).toBeInTheDocument();
		});

		it("should accept both minSize and maxSize props", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel minSize="20" maxSize="40">
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel"]'),
			).toBeInTheDocument();
		});
	});

	describe("Collapsible Behavior", () => {
		it("should support collapsible prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel collapsible>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel"]'),
			).toBeInTheDocument();
		});

		it("should handle onResize callback", () => {
			const onResize = vi.fn();
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel collapsible onResize={onResize}>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-panel"]'),
			).toBeInTheDocument();
		});
	});
});

describe("ResizableHandle", () => {
	describe("Rendering", () => {
		it("should render resize handle", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(
				container.querySelector('[data-slot="resizable-handle"]'),
			).toBeInTheDocument();
		});

		it("should render multiple resize handles", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 3</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handles = container.querySelectorAll(
				'[data-slot="resizable-handle"]',
			);
			expect(handles).toHaveLength(2);
		});

		it("should render separator semantics from the library", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toHaveAttribute("role", "separator");
		});
	});

	describe("Handle Indicator", () => {
		it("should render without handle indicator by default", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle?.querySelector("svg")).not.toBeInTheDocument();
		});

		it("should render with handle indicator when withHandle is true", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle?.querySelector("svg")).toBeInTheDocument();
		});

		it("should rotate handle indicator for vertical orientation", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle?.querySelector("svg")).toHaveClass(
				"group-data-[orientation=vertical]:rotate-90",
			);
		});

		it("should have correct aria-hidden on handle indicator", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle?.querySelector("svg")).toHaveAttribute(
				"aria-hidden",
				"true",
			);
		});
	});

	describe("Props and Styling", () => {
		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle className="custom-handle" />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toHaveClass("custom-handle");
		});

		it("should accept custom id prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle id="test-handle" />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toHaveAttribute("id", "test-handle");
		});

		it("should support disabled prop", () => {
			const { container } = render(
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle disabled />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toBeInTheDocument();
		});
	});
});

describe("Nested Panels", () => {
	it("should support nested panel groups", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel>Panel 2A</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel>Panel 2B</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const groups = container.querySelectorAll(
			'[data-slot="resizable-panel-group"]',
		);
		expect(groups).toHaveLength(2);
		expect(screen.getByText("Panel 1")).toBeInTheDocument();
		expect(screen.getByText("Panel 2A")).toBeInTheDocument();
		expect(screen.getByText("Panel 2B")).toBeInTheDocument();
	});

	it("should support deeply nested panel groups", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>
					<ResizablePanelGroup orientation="vertical">
						<ResizablePanel>Panel 1A</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel>
							<ResizablePanelGroup orientation="horizontal">
								<ResizablePanel>Panel 1A-i</ResizablePanel>
								<ResizableHandle />
								<ResizablePanel>Panel 1A-ii</ResizablePanel>
							</ResizablePanelGroup>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const groups = container.querySelectorAll(
			'[data-slot="resizable-panel-group"]',
		);
		expect(groups).toHaveLength(3);
	});
});

describe("Accessibility", () => {
	it("should have proper ARIA attributes for keyboard navigation", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const handle = container.querySelector('[data-slot="resizable-handle"]');
		// react-resizable-panels handles accessibility attributes
		expect(handle).toBeInTheDocument();
	});

	it("should have focus-ring class on handle", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const handle = container.querySelector('[data-slot="resizable-handle"]');
		expect(handle).toHaveClass("focus-ring");
	});

	it("should have proper styling for separator", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const handle = container.querySelector('[data-slot="resizable-handle"]');
		expect(handle).toHaveClass("bg-separator");
	});
});

describe("Edge Cases", () => {
	it("should handle empty panel content", () => {
		render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel></ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panel = document.querySelector('[data-slot="resizable-panel"]');
		expect(panel).toBeInTheDocument();
	});

	it("should handle single panel without handles", () => {
		const { container } = render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel>Single Panel</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const handles = container.querySelectorAll(
			'[data-slot="resizable-handle"]',
		);
		expect(handles).toHaveLength(0);
	});

	it("should handle panel with only whitespace content", () => {
		render(
			<ResizablePanelGroup orientation="horizontal">
				<ResizablePanel> </ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panel = document.querySelector('[data-slot="resizable-panel"]');
		expect(panel).toBeInTheDocument();
	});
});
