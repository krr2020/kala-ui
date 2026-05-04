import {
	DndContext,
	PointerSensor,
	TouchSensor,
	KeyboardSensor,
	useDraggable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext as SortableContextKit, useSortable } from "@dnd-kit/sortable";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DragDropContext,
	Draggable,
	DragOverlayComponent,
	Droppable,
	SortableContext,
	SortableHandle,
	SortableItem,
	collisionDetectionAlgorithms,
	modifiers,
	sortingStrategies,
	useDragDropSensors,
} from "./dnd";

// Mock @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
	DndContext: vi.fn(
		({ children, sensors, onDragEnd, ...props }: any) => (
			<div data-testid="dnd-context">{children}</div>
		),
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
	useSensor: vi.fn((sensor: any, options: any) => ({ sensor, options })),
	useSensors: vi.fn((...sensors: any[]) => sensors),
	DragOverlay: vi.fn(
		({ children, dropAnimation, className, ...props }: any) =>
			children ? (
				<div
					data-testid="drag-overlay"
					data-dropanimation={!!dropAnimation}
					className={className}
					{...props}
				>
					{children}
				</div>
			) : null,
	),
}));

// Mock @dnd-kit/utilities
vi.mock("@dnd-kit/utilities", () => ({
	CSS: {
		Translate: {
			toString: vi.fn((transform: any) =>
				transform
					? `translate(${transform.x ?? 0}px, ${transform.y ?? 0}px)`
					: "",
			),
		},
		Transform: {
			toString: vi.fn((transform: any) =>
				transform
					? `translate3d(${transform.x}px, ${transform.y}px, 0)`
					: undefined,
			),
		},
	},
}));

// Mock @dnd-kit/sortable
vi.mock("@dnd-kit/sortable", () => ({
	SortableContext: vi.fn(
		({ children, items, strategy }: any) => (
			<div data-testid="sortable-context-kit">{children}</div>
		),
	),
	useSortable: vi.fn(() => ({
		attributes: { "data-sortable": "true" },
		listeners: { onMouseDown: vi.fn() },
		setNodeRef: vi.fn(),
		transform: null,
		transition: undefined,
		isDragging: false,
		isSorting: false,
		isOver: false,
	})),
	sortableKeyboardCoordinates: vi.fn(),
	verticalListSortingStrategy: "verticalListSortingStrategy",
	horizontalListSortingStrategy: "horizontalListSortingStrategy",
	rectSortingStrategy: "rectSortingStrategy",
	rectSwappingStrategy: "rectSwappingStrategy",
}));

// Mock @dnd-kit/modifiers
vi.mock("@dnd-kit/modifiers", () => ({
	restrictToHorizontalAxis: vi.fn(),
	restrictToVerticalAxis: vi.fn(),
	restrictToWindowEdges: vi.fn(),
	restrictToParentElement: vi.fn(),
	restrictToFirstScrollableAncestor: vi.fn(),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

// ============================================================================
// DragDropContext
// ============================================================================

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

	it("uses provided sensors prop instead of creating defaults", () => {
		const mockDndContext = vi.mocked(DndContext);
		mockDndContext.mockClear();

		const customSensors = [{ id: "custom-sensor" }];
		render(
			<DragDropContext sensors={customSensors} onDragEnd={vi.fn()}>
				<div>Test</div>
			</DragDropContext>,
		);

		const callArgs = mockDndContext.mock.calls[0][0] as any;
		expect(callArgs.sensors).toEqual(customSensors);
	});

	it("creates default sensors when no sensors prop is provided", () => {
		const mockDndContext = vi.mocked(DndContext);
		const mockUseSensor = vi.mocked(useSensor);
		mockDndContext.mockClear();
		mockUseSensor.mockClear();

		render(
			<DragDropContext onDragEnd={vi.fn()}>
				<div>Test</div>
			</DragDropContext>,
		);

		expect(mockUseSensor).toHaveBeenCalledTimes(3);
		// The default sensors from createDragDropSensors are passed to DndKitContext
		const callArgs = mockDndContext.mock.calls[0][0] as any;
		expect(callArgs.sensors).toBeDefined();
		expect(Array.isArray(callArgs.sensors)).toBe(true);
	});

	it("passes useSensors options to createDragDropSensors", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		const constraint = { distance: 10 };
		render(
			<DragDropContext
				useSensors={{ activationConstraint: constraint }}
				onDragEnd={vi.fn()}
			>
				<div>Test</div>
			</DragDropContext>,
		);

		// useSensor is called 3 times (PointerSensor, TouchSensor, KeyboardSensor)
		expect(mockUseSensor).toHaveBeenCalledTimes(3);
		// PointerSensor and TouchSensor receive activationConstraint
		expect(mockUseSensor).toHaveBeenCalledWith(
			expect.any(Function),
			{ activationConstraint: constraint },
		);
		// KeyboardSensor receives coordinateGetter
		expect(mockUseSensor).toHaveBeenCalledWith(
			expect.any(Function),
			{ coordinateGetter: expect.any(Function) },
		);
	});
});

// ============================================================================
// Droppable
// ============================================================================

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

// ============================================================================
// Draggable
// ============================================================================

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
		expect(draggableElement).toHaveStyle({ transform: "translate(10px, 20px)" });
	});
});

// ============================================================================
// SortableContext
// ============================================================================

describe("SortableContext", () => {
	it("renders children", () => {
		render(
			<SortableContext items={["a", "b", "c"]}>
				<div>Sortable Content</div>
			</SortableContext>,
		);

		expect(screen.getByText("Sortable Content")).toBeInTheDocument();
	});

	it("normalizes string items to string IDs", () => {
		const mockKit = vi.mocked(SortableContextKit);
		mockKit.mockClear();

		render(
			<SortableContext items={["a", "b", "c"]}>
				<div>Test</div>
			</SortableContext>,
		);

		const callArgs = mockKit.mock.calls[0][0] as any;
		expect(callArgs.items).toEqual(["a", "b", "c"]);
	});

	it("normalizes { id } items to string IDs", () => {
		const mockKit = vi.mocked(SortableContextKit);
		mockKit.mockClear();

		render(
			<SortableContext items={[{ id: "a" }, { id: "b" }, { id: "c" }]}>
				<div>Test</div>
			</SortableContext>,
		);

		const callArgs = mockKit.mock.calls[0][0] as any;
		expect(callArgs.items).toEqual(["a", "b", "c"]);
	});

	it("normalizes mixed item formats", () => {
		const mockKit = vi.mocked(SortableContextKit);
		mockKit.mockClear();

		render(
			<SortableContext items={["a", { id: "b" }, 3]}>
				<div>Test</div>
			</SortableContext>,
		);

		const callArgs = mockKit.mock.calls[0][0] as any;
		expect(callArgs.items).toEqual(["a", "b", 3]);
	});

	it("passes custom strategy to SortableContextKit", () => {
		const mockKit = vi.mocked(SortableContextKit);
		mockKit.mockClear();

		const customStrategy = "myCustomStrategy";
		render(
			<SortableContext
				items={["a"]}
				strategy={customStrategy as any}
			>
				<div>Test</div>
			</SortableContext>,
		);

		const callArgs = mockKit.mock.calls[0][0] as any;
		expect(callArgs.strategy).toBe(customStrategy);
	});

	it("defaults to verticalListSortingStrategy", () => {
		const mockKit = vi.mocked(SortableContextKit);
		mockKit.mockClear();

		render(
			<SortableContext items={["a"]}>
				<div>Test</div>
			</SortableContext>,
		);

		const callArgs = mockKit.mock.calls[0][0] as any;
		expect(callArgs.strategy).toBe("verticalListSortingStrategy");
	});
});

// ============================================================================
// SortableItem
// ============================================================================

describe("SortableItem", () => {
	it("renders with id", () => {
		render(
			<SortableItem id="test-item">
				<div>Sortable Item</div>
			</SortableItem>,
		);

		expect(screen.getByText("Sortable Item")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<SortableItem id="test-item" className="custom-sortable">
				<div>Sortable Item</div>
			</SortableItem>,
		);

		const wrapper = screen.getByText("Sortable Item").parentElement;
		expect(wrapper).toHaveClass("custom-sortable");
	});

	it("renders function children with all sortable args", () => {
		const mockChild = vi.fn(() => <div>Rendered</div>);

		render(
			<SortableItem id="test-item">{mockChild}</SortableItem>,
		);

		expect(mockChild).toHaveBeenCalledWith(
			expect.objectContaining({
				attributes: expect.any(Object),
				listeners: expect.any(Object),
				setNodeRef: expect.any(Function),
				transform: null,
				transition: undefined,
				isDragging: false,
				isSorting: false,
				isOver: false,
			}),
		);
		expect(screen.getByText("Rendered")).toBeInTheDocument();
	});

	it("handles disabled prop by passing to useSortable", () => {
		const mockUseSortable = vi.mocked(useSortable);
		mockUseSortable.mockClear();

		render(
			<SortableItem id="test-item" disabled>
				<div>Disabled</div>
			</SortableItem>,
		);

		expect(mockUseSortable).toHaveBeenCalledWith(
			expect.objectContaining({ disabled: true }),
		);
	});

	it("spreads listeners on wrapper div when handle is false (default)", () => {
		const mockListener = vi.fn();
		vi.mocked(useSortable).mockReturnValueOnce({
			attributes: { "data-sortable": "true" },
			listeners: { onMouseDown: mockListener },
			setNodeRef: vi.fn(),
			transform: null,
			transition: undefined,
			isDragging: false,
			isSorting: false,
			isOver: false,
		});

		const { container } = render(
			<SortableItem id="test-item" handle={false}>
				<div>Content</div>
			</SortableItem>,
		);

		fireEvent.mouseDown(container.firstChild!);
		expect(mockListener).toHaveBeenCalled();
	});

	it("does not spread listeners on wrapper div when handle is true", () => {
		const mockListener = vi.fn();
		vi.mocked(useSortable).mockReturnValueOnce({
			attributes: { "data-sortable": "true" },
			listeners: { onMouseDown: mockListener },
			setNodeRef: vi.fn(),
			transform: null,
			transition: undefined,
			isDragging: false,
			isSorting: false,
			isOver: false,
		});

		const { container } = render(
			<SortableItem id="test-item" handle={true}>
				<div>Content</div>
			</SortableItem>,
		);

		fireEvent.mouseDown(container.firstChild!);
		expect(mockListener).not.toHaveBeenCalled();
	});

	it("applies transform via CSS.Transform.toString when transform is non-null", () => {
		vi.mocked(useSortable).mockReturnValueOnce({
			attributes: { "data-sortable": "true" },
			listeners: { onMouseDown: vi.fn() },
			setNodeRef: vi.fn(),
			transform: { x: 15, y: 25, scaleX: 1, scaleY: 1 },
			transition: "transform 200ms",
			isDragging: false,
			isSorting: false,
			isOver: false,
		});

		const { container } = render(
			<SortableItem id="test-item">
				<div>Content</div>
			</SortableItem>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.style.transform).toBe("translate3d(15px, 25px, 0)");
	});

	it("applies transition from useSortable", () => {
		vi.mocked(useSortable).mockReturnValueOnce({
			attributes: { "data-sortable": "true" },
			listeners: { onMouseDown: vi.fn() },
			setNodeRef: vi.fn(),
			transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
			transition: "transform 150ms ease",
			isDragging: false,
			isSorting: false,
			isOver: false,
		});

		const { container } = render(
			<SortableItem id="test-item">
				<div>Content</div>
			</SortableItem>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.style.transition).toBe("transform 150ms ease");
	});

	it("sets z-index to 9999 when isDragging is true", () => {
		vi.mocked(useSortable).mockReturnValueOnce({
			attributes: { "data-sortable": "true" },
			listeners: { onMouseDown: vi.fn() },
			setNodeRef: vi.fn(),
			transform: { x: 5, y: 10, scaleX: 1, scaleY: 1 },
			transition: "transform 200ms",
			isDragging: true,
			isSorting: false,
			isOver: false,
		});

		const { container } = render(
			<SortableItem id="test-item">
				<div>Content</div>
			</SortableItem>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.style.zIndex).toBe("9999");
	});

	it("does not set z-index when isDragging is false", () => {
		const { container } = render(
			<SortableItem id="test-item">
				<div>Content</div>
			</SortableItem>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.style.zIndex).toBe("");
	});

	it("always spreads attributes on the wrapper div", () => {
		const { container } = render(
			<SortableItem id="test-item">
				<div>Content</div>
			</SortableItem>,
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveAttribute("data-sortable", "true");
	});
});

// ============================================================================
// SortableHandle
// ============================================================================

describe("SortableHandle", () => {
	it("renders children", () => {
		render(
			<SortableHandle>
				<div>Handle Content</div>
			</SortableHandle>,
		);

		expect(screen.getByText("Handle Content")).toBeInTheDocument();
	});

	it("renders function children with listeners", () => {
		const mockChild = vi.fn((listeners: any) => (
			<div>Function Handle</div>
		));

		render(<SortableHandle>{mockChild}</SortableHandle>);

		expect(mockChild).toHaveBeenCalledWith(expect.any(Object));
		expect(screen.getByText("Function Handle")).toBeInTheDocument();
	});

	it("applies cursor-grab and active:cursor-grabbing classes", () => {
		render(
			<SortableHandle>
				<div>Handle</div>
			</SortableHandle>,
		);

		const handle = screen.getByText("Handle").parentElement;
		expect(handle).toHaveClass("cursor-grab");
		expect(handle!.className).toContain("active:cursor-grabbing");
	});

	it("merges custom className with default classes", () => {
		render(
			<SortableHandle className="custom-handle">
				<div>Handle</div>
			</SortableHandle>,
		);

		const handle = screen.getByText("Handle").parentElement;
		expect(handle).toHaveClass("cursor-grab");
		expect(handle).toHaveClass("custom-handle");
	});

	it("spreads attributes and listeners from useSortable", () => {
		render(
			<SortableHandle>
				<div>Handle</div>
			</SortableHandle>,
		);

		// useSortable is called with id: "" for SortableHandle
		expect(useSortable).toHaveBeenCalledWith({ id: "" });
	});
});

// ============================================================================
// DragOverlayComponent
// ============================================================================

describe("DragOverlayComponent", () => {
	it("renders children wrapped in a div", () => {
		render(
			<DragOverlayComponent>
				<div>Overlay Content</div>
			</DragOverlayComponent>,
		);

		expect(screen.getByText("Overlay Content")).toBeInTheDocument();
		expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
	});

	it("wraps children in a div with className", () => {
		render(
			<DragOverlayComponent className="overlay-class">
				<div>Overlay Content</div>
			</DragOverlayComponent>,
		);

		// The inner wrapper div gets the className
		const content = screen.getByText("Overlay Content");
		expect(content.parentElement).toHaveClass("overlay-class");
	});

	it("returns null when children is null", () => {
		const { container } = render(
			<DragOverlayComponent>{null}</DragOverlayComponent>,
		);

		expect(container.innerHTML).toBe("");
	});

	it("returns null when children is undefined", () => {
		const { container } = render(
			<DragOverlayComponent>{undefined}</DragOverlayComponent>,
		);

		expect(container.innerHTML).toBe("");
	});

	it("passes dropAnimation prop to DragOverlay", () => {
		render(
			<DragOverlayComponent dropAnimation={{ duration: 200, easing: "ease" }}>
				<div>Content</div>
			</DragOverlayComponent>,
		);

		const overlay = screen.getByTestId("drag-overlay");
		expect(overlay).toHaveAttribute("data-dropanimation", "true");
	});

	it("passes null dropAnimation to DragOverlay", () => {
		render(
			<DragOverlayComponent dropAnimation={null}>
				<div>Content</div>
			</DragOverlayComponent>,
		);

		const overlay = screen.getByTestId("drag-overlay");
		expect(overlay).toHaveAttribute("data-dropanimation", "false");
	});
});

// ============================================================================
// useDragDropSensors
// ============================================================================

describe("useDragDropSensors", () => {
	it("creates sensors with PointerSensor, TouchSensor, and KeyboardSensor", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		const sensors = useDragDropSensors();

		expect(mockUseSensor).toHaveBeenCalledTimes(3);
		expect(sensors).toHaveLength(3);
	});

	it("passes activationConstraint to PointerSensor and TouchSensor", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		const constraint = { distance: 8 };
		useDragDropSensors({ activationConstraint: constraint });

		// First call: PointerSensor with activationConstraint
		expect(mockUseSensor.mock.calls[0][1]).toEqual({
			activationConstraint: constraint,
		});
		// Second call: TouchSensor with activationConstraint
		expect(mockUseSensor.mock.calls[1][1]).toEqual({
			activationConstraint: constraint,
		});
	});

	it("passes coordinateGetter to KeyboardSensor", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		useDragDropSensors();

		// Third call: KeyboardSensor with coordinateGetter
		expect(mockUseSensor.mock.calls[2][1]).toEqual({
			coordinateGetter: expect.any(Function),
		});
	});

	it("uses default activationConstraint when not provided", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		useDragDropSensors();

		expect(mockUseSensor.mock.calls[0][1]).toEqual({
			activationConstraint: undefined,
		});
		expect(mockUseSensor.mock.calls[1][1]).toEqual({
			activationConstraint: undefined,
		});
	});

	it("accepts custom keyboardCoordinateGetter option", () => {
		const mockUseSensor = vi.mocked(useSensor);
		mockUseSensor.mockClear();

		const customGetter = vi.fn();
		useDragDropSensors({ keyboardCoordinateGetter: customGetter });

		expect(mockUseSensor.mock.calls[2][1]).toEqual({
			coordinateGetter: customGetter,
		});
	});

	it("returns an array of sensor configurations", () => {
		const sensors = useDragDropSensors();

		expect(Array.isArray(sensors)).toBe(true);
		for (const sensor of sensors) {
			expect(sensor).toHaveProperty("sensor");
			expect(sensor).toHaveProperty("options");
		}
	});
});

// ============================================================================
// Exported constants
// ============================================================================

describe("Exported constants", () => {
	it("exports collisionDetectionAlgorithms with all algorithms", () => {
		expect(collisionDetectionAlgorithms).toHaveProperty("closestCenter");
		expect(collisionDetectionAlgorithms).toHaveProperty("closestCorners");
		expect(collisionDetectionAlgorithms).toHaveProperty("rectIntersection");
		expect(collisionDetectionAlgorithms).toHaveProperty("pointerWithin");
	});

	it("exports modifiers with all modifier functions", () => {
		expect(modifiers).toHaveProperty("restrictToHorizontalAxis");
		expect(modifiers).toHaveProperty("restrictToVerticalAxis");
		expect(modifiers).toHaveProperty("restrictToWindowEdges");
		expect(modifiers).toHaveProperty("restrictToParentElement");
		expect(modifiers).toHaveProperty("restrictToFirstScrollableAncestor");
	});

	it("exports sortingStrategies with all strategies", () => {
		expect(sortingStrategies).toHaveProperty("vertical");
		expect(sortingStrategies).toHaveProperty("horizontal");
		expect(sortingStrategies).toHaveProperty("rect");
		expect(sortingStrategies).toHaveProperty("rectSwapping");
	});
});
