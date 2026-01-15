import { useDraggable } from "@dnd-kit/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DragDropContext, Draggable, Droppable } from "./dnd";

// Mock @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
	DndContext: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="dnd-context">{children}</div>
	),
	useDroppable: vi.fn(() => ({
		isOver: false,
		setNodeRef: vi.fn(),
	})),
	useDraggable: vi.fn(() => ({
		active: null,
		activatorEvent: null,
		activeNodeRect: null,
		attributes: {
			role: "button",
			tabIndex: 0,
			"aria-disabled": false,
			"aria-pressed": false,
			"aria-roledescription": "draggable",
			"aria-describedby": "",
		},
		listeners: { onClick: vi.fn() },
		setNodeRef: vi.fn(),
		setActivatorNodeRef: vi.fn(),
		transform: null,
		isDragging: false,
		node: { current: null },
		over: null,
	})),
	closestCenter: vi.fn(),
	closestCorners: vi.fn(),
	rectIntersection: vi.fn(),
	pointerWithin: vi.fn(),
	KeyboardSensor: vi.fn(),
	PointerSensor: vi.fn(),
	TouchSensor: vi.fn(),
	useSensor: vi.fn(),
	useSensors: vi.fn(),
	DragOverlay: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
}));

// Mock @dnd-kit/utilities
vi.mock("@dnd-kit/utilities", () => ({
	CSS: {
		Translate: {
			toString: vi.fn(() => ""),
		},
		Transform: {
			toString: vi.fn(() => ""),
		},
	},
}));

// Mock @dnd-kit/sortable
vi.mock("@dnd-kit/sortable", () => ({
	SortableContext: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sortable-context">{children}</div>
	),
	useSortable: vi.fn(() => ({
		attributes: {
			role: "button",
			tabIndex: 0,
			"aria-disabled": false,
		},
		listeners: undefined,
		setNodeRef: vi.fn(),
		transform: null,
		transition: undefined,
		isDragging: false,
		isSorting: false,
		isOver: false,
	})),
	sortableKeyboardCoordinates: vi.fn(),
	verticalListSortingStrategy: vi.fn(),
	horizontalListSortingStrategy: vi.fn(),
	rectSortingStrategy: vi.fn(),
	rectSwappingStrategy: vi.fn(),
}));

// Mock @dnd-kit/modifiers
vi.mock("@dnd-kit/modifiers", () => ({
	restrictToHorizontalAxis: vi.fn(),
	restrictToVerticalAxis: vi.fn(),
	restrictToWindowEdges: vi.fn(),
	restrictToParentElement: vi.fn(),
	restrictToFirstScrollableAncestor: vi.fn(),
}));

describe("DragDropContext", () => {
	it("renders children", () => {
		const handleDragEnd = vi.fn();
		render(
			<DragDropContext onDragEnd={handleDragEnd}>
				<div>Test Content</div>
			</DragDropContext>,
		);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("accepts onDragEnd callback", () => {
		const handleDragEnd = vi.fn();
		render(
			<DragDropContext onDragEnd={handleDragEnd}>
				<div>Test Content</div>
			</DragDropContext>,
		);

		expect(handleDragEnd).not.toHaveBeenCalled();
	});
});

describe("Droppable", () => {
	it("renders with id", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Droppable id="test-droppable">
					<div>Droppable Content</div>
				</Droppable>
			</DragDropContext>,
		);

		expect(screen.getByText("Droppable Content")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Droppable id="test-droppable" className="custom-class">
					<div>Droppable Content</div>
				</Droppable>
			</DragDropContext>,
		);

		const droppableElement =
			screen.getByText("Droppable Content").parentElement;
		expect(droppableElement).toHaveClass("custom-class");
	});

	it("renders function children with correct props", () => {
		const mockChildren = vi.fn(() => <div>Function Child</div>);

		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Droppable id="test-droppable">{mockChildren}</Droppable>
			</DragDropContext>,
		);

		expect(mockChildren).toHaveBeenCalledWith({
			isOver: false,
			setNodeRef: expect.any(Function),
		});
		expect(screen.getByText("Function Child")).toBeInTheDocument();
	});

	it("handles disabled prop", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Droppable id="test-droppable" disabled>
					<div>Disabled Droppable</div>
				</Droppable>
			</DragDropContext>,
		);

		expect(screen.getByText("Disabled Droppable")).toBeInTheDocument();
	});
});

describe("Draggable", () => {
	it("renders with id", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Draggable id="test-draggable">
					<div>Draggable Content</div>
				</Draggable>
			</DragDropContext>,
		);

		expect(screen.getByText("Draggable Content")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Draggable id="test-draggable" className="custom-class">
					<div>Draggable Content</div>
				</Draggable>
			</DragDropContext>,
		);

		const draggableElement =
			screen.getByText("Draggable Content").parentElement;
		expect(draggableElement).toHaveClass("custom-class");
	});

	it("renders function children with correct props", () => {
		const mockChildren = vi.fn(() => <div>Function Child</div>);

		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Draggable id="test-draggable">{mockChildren}</Draggable>
			</DragDropContext>,
		);

		expect(mockChildren).toHaveBeenCalledWith(
			expect.objectContaining({
				attributes: expect.objectContaining({
					role: "button",
					tabIndex: 0,
					"aria-disabled": false,
					"aria-pressed": false,
					"aria-roledescription": "draggable",
				}),
				listeners: expect.objectContaining({
					onClick: expect.any(Function),
				}),
				isDragging: false,
			}),
		);
		expect(screen.getByText("Function Child")).toBeInTheDocument();
	});

	it("handles disabled prop", () => {
		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Draggable id="test-draggable" disabled>
					<div>Disabled Draggable</div>
				</Draggable>
			</DragDropContext>,
		);

		expect(screen.getByText("Disabled Draggable")).toBeInTheDocument();
	});

	it("applies transform styles when dragging", () => {
		// Temporarily override the mock for this test
		const mockedUseDraggable = vi.mocked(useDraggable);
		mockedUseDraggable.mockReturnValueOnce({
			active: {
				id: "test",
				data: { current: {} },
				rect: { current: { initial: null, translated: null } },
			},
			activatorEvent: null,
			activeNodeRect: null,
			attributes: {
				role: "button",
				tabIndex: 0,
				"aria-disabled": false,
				"aria-pressed": false,
				"aria-roledescription": "draggable",
				"aria-describedby": "",
			},
			listeners: { onClick: vi.fn() },
			setNodeRef: vi.fn(),
			setActivatorNodeRef: vi.fn(),
			transform: { x: 10, y: 20, scaleX: 1, scaleY: 1 },
			isDragging: true,
			node: { current: null },
			over: null,
		});

		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<Draggable id="test-draggable">
					<div>Draggable Content</div>
				</Draggable>
			</DragDropContext>,
		);

		const draggableElement =
			screen.getByText("Draggable Content").parentElement;
		expect(draggableElement).toHaveStyle({ transform: "" }); // CSS.Translate.toString is mocked
	});
});
