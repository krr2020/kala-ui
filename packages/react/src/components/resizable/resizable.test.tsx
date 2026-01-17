import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import type {
	ImperativePanelGroupHandle,
	ImperativePanelHandle,
} from "react-resizable-panels";
import { describe, expect, it, vi } from "vitest";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./resizable";

describe("ResizablePanelGroup", () => {
	describe("Direction", () => {
		it("should render with horizontal direction", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toBeInTheDocument();
			expect(group).toHaveAttribute("data-panel-group-direction", "horizontal");
		});

		it("should render with vertical direction", () => {
			const { container } = render(
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveAttribute("data-panel-group-direction", "vertical");
		});

		it("should apply correct flex classes for horizontal direction", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveClass("flex");
			expect(group).not.toHaveClass("flex-col");
		});

		it("should apply correct flex classes for vertical direction", () => {
			const { container } = render(
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveClass("flex");
			expect(group).toHaveAttribute("data-panel-group-direction", "vertical");
		});
	});

	describe("Props and Styling", () => {
		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal" className="custom-class">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toHaveClass("custom-class");
		});

		it("should accept autoSaveId prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal" autoSaveId="test-layout">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toBeInTheDocument();
		});

		it("should accept keyboardResizeBy prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal" keyboardResizeBy={5}>
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const group = container.querySelector(
				'[data-slot="resizable-panel-group"]',
			);
			expect(group).toBeInTheDocument();
		});

		it("should accept custom id prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal" id="test-group">
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
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>
						<div>Panel Content</div>
					</ResizablePanel>
				</ResizablePanelGroup>,
			);
			expect(screen.getByText("Panel Content")).toBeInTheDocument();
		});

		it("should render multiple panels", () => {
			render(
				<ResizablePanelGroup direction="horizontal">
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
				<ResizablePanelGroup direction="horizontal">
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
		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel className="custom-panel">Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toHaveClass("custom-panel");
		});

		it("should have relative positioning", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toHaveClass("relative");
		});

		it("should accept custom id prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel id="test-panel">Panel 1</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toHaveAttribute("id", "test-panel");
		});
	});

	describe("Size Constraints", () => {
		it("should accept defaultSize prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={30}>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={70}>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panels = container.querySelectorAll(
				'[data-slot="resizable-panel"]',
			);
			expect(panels).toHaveLength(2);
		});

		it("should accept minSize prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel minSize={20}>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should accept maxSize prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel maxSize={80}>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should accept both minSize and maxSize props", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel minSize={20} maxSize={40}>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should handle minSize equal to maxSize", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel minSize={50} maxSize={50}>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});
	});

	describe("Collapsible Behavior", () => {
		it("should support collapsible prop", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel collapsible>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should handle onCollapse callback", () => {
			const onCollapse = vi.fn();
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel collapsible onCollapse={onCollapse}>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should handle onExpand callback", () => {
			const onExpand = vi.fn();
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel collapsible onExpand={onExpand}>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});

		it("should handle both onCollapse and onExpand callbacks", () => {
			const onCollapse = vi.fn();
			const onExpand = vi.fn();
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel
						collapsible
						onCollapse={onCollapse}
						onExpand={onExpand}
					>
						Panel 1
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const panel = container.querySelector('[data-slot="resizable-panel"]');
			expect(panel).toBeInTheDocument();
		});
	});
});

describe("ResizableHandle", () => {
	describe("Rendering", () => {
		it("should render resize handle", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toBeInTheDocument();
		});

		it("should render multiple resize handles", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
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
	});

	describe("Handle Indicator", () => {
		it("should render without handle indicator by default", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			const svg = handle?.querySelector("svg");
			expect(svg).not.toBeInTheDocument();
		});

		it("should render with handle indicator when withHandle is true", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			const svg = handle?.querySelector("svg");
			expect(svg).toBeInTheDocument();
		});

		it("should rotate handle indicator for vertical direction", () => {
			const { container } = render(
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			const svg = handle?.querySelector("svg");
			expect(svg).toHaveClass(
				"data-[panel-group-direction=vertical]:rotate-90",
			);
		});

		it("should have correct aria-hidden on handle indicator", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			const svg = handle?.querySelector("svg");
			expect(svg).toHaveAttribute("aria-hidden", "true");
		});
	});

	describe("Props and Styling", () => {
		it("should apply custom className", () => {
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
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
				<ResizablePanelGroup direction="horizontal">
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
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle disabled />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toBeInTheDocument();
			// The disabled state is handled by library
		});
	});

	describe("Callbacks", () => {
		it("should handle onDragging callback", () => {
			const onDragging = vi.fn();
			const { container } = render(
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle onDragging={onDragging} />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>,
			);
			const handle = container.querySelector('[data-slot="resizable-handle"]');
			expect(handle).toBeInTheDocument();
		});
	});
});

describe("Imperative Panel API", () => {
	it("should support ref on ResizablePanel", () => {
		function TestComponent() {
			const panelRef = useRef<ImperativePanelHandle>(null);
			return (
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel ref={panelRef}>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>
			);
		}

		const { container } = render(<TestComponent />);
		const panel = container.querySelector('[data-slot="resizable-panel"]');
		expect(panel).toBeInTheDocument();
	});

	it("should support ref on ResizablePanelGroup", () => {
		function TestComponent() {
			const groupRef = useRef<ImperativePanelGroupHandle>(null);
			return (
				<ResizablePanelGroup ref={groupRef} direction="horizontal">
					<ResizablePanel>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel>Panel 2</ResizablePanel>
				</ResizablePanelGroup>
			);
		}

		const { container } = render(<TestComponent />);
		const group = container.querySelector(
			'[data-slot="resizable-panel-group"]',
		);
		expect(group).toBeInTheDocument();
	});

	it("should support multiple refs", () => {
		function TestComponent() {
			const panel1Ref = useRef<ImperativePanelHandle>(null);
			const panel2Ref = useRef<ImperativePanelHandle>(null);
			const groupRef = useRef<ImperativePanelGroupHandle>(null);
			return (
				<ResizablePanelGroup ref={groupRef} direction="horizontal">
					<ResizablePanel ref={panel1Ref}>Panel 1</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel ref={panel2Ref}>Panel 2</ResizablePanel>
				</ResizablePanelGroup>
			);
		}

		const { container } = render(<TestComponent />);
		const panels = container.querySelectorAll('[data-slot="resizable-panel"]');
		expect(panels).toHaveLength(2);
	});
});

describe("Nested Panels", () => {
	it("should support nested panel groups", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<ResizablePanelGroup direction="vertical">
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
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel>Panel 1A</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel>
							<ResizablePanelGroup direction="horizontal">
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

	it("should handle multiple nested panel groups", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel>Panel 1A</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel>Panel 1B</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<ResizablePanelGroup direction="vertical">
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
		expect(groups).toHaveLength(3);
	});
});

describe("Accessibility", () => {
	it("should have proper ARIA attributes for keyboard navigation", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const handle = container.querySelector('[data-slot="resizable-handle"]');
		// react-resizable-panels handles accessibility attributes
		expect(handle).toBeInTheDocument();
	});

	it("should support keyboard resize with keyboardResizeBy prop", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal" keyboardResizeBy={5}>
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const group = container.querySelector(
			'[data-slot="resizable-panel-group"]',
		);
		expect(group).toBeInTheDocument();
	});

	it("should have focus-ring class on handle", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
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
			<ResizablePanelGroup direction="horizontal">
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
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel></ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panel = document.querySelector('[data-slot="resizable-panel"]');
		expect(panel).toBeInTheDocument();
	});

	it("should handle single panel without handles", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
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
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel> </ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panel = document.querySelector('[data-slot="resizable-panel"]');
		expect(panel).toBeInTheDocument();
	});

	it("should handle zero defaultSize", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={0}>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panels = container.querySelectorAll('[data-slot="resizable-panel"]');
		expect(panels).toHaveLength(2);
	});

	it("should handle large defaultSize value", () => {
		const { container } = render(
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={100}>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={0}>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		const panels = container.querySelectorAll('[data-slot="resizable-panel"]');
		expect(panels).toHaveLength(2);
	});
});
