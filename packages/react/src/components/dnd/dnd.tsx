/**
 * DnD Component - Drag and Drop primitives for @dnd-kit
 * Provides consistent wrappers with animations, sortable support, and drag overlays
 */

"use client";

import type {
	Active,
	Collision,
	CollisionDetection,
	DndContextProps as DndKitContextProps,
	DragEndEvent,
	DraggableAttributes,
	DraggableSyntheticListeners,
	DragOverEvent,
	DragStartEvent,
	Modifier,
	Over,
	PointerActivationConstraint,
	UniqueIdentifier,
} from "@dnd-kit/core";
import {
	closestCenter,
	closestCorners,
	DndContext as DndKitContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToFirstScrollableAncestor,
	restrictToHorizontalAxis,
	restrictToParentElement,
	restrictToVerticalAxis,
	restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
	horizontalListSortingStrategy,
	rectSortingStrategy,
	rectSwappingStrategy,
	SortableContext as SortableContextKit,
	type SortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Transform } from "@dnd-kit/utilities";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";
import { cn } from "../../lib/utils";

type SyntheticListenerMap = DraggableSyntheticListeners;

// ============================================================================
// Types
// ============================================================================

export type DragDropModifier = Modifier;
export type DragDropCollisionDetection = CollisionDetection;
export type DragDropSortingStrategy = SortingStrategy;
export type DragDropPointerConstraint = PointerActivationConstraint;

// ============================================================================
// Collision Detection Algorithms
// ============================================================================

export const collisionDetectionAlgorithms = {
	closestCenter,
	closestCorners,
	rectIntersection,
	pointerWithin,
} as const;

// ============================================================================
// Modifiers
// ============================================================================

export const modifiers = {
	restrictToHorizontalAxis,
	restrictToVerticalAxis,
	restrictToWindowEdges,
	restrictToParentElement,
	restrictToFirstScrollableAncestor,
} as const;

// ============================================================================
// Sorting Strategies
// ============================================================================

export const sortingStrategies = {
	vertical: verticalListSortingStrategy,
	horizontal: horizontalListSortingStrategy,
	rect: rectSortingStrategy,
	rectSwapping: rectSwappingStrategy,
} as const;

// ============================================================================
// Sensors Hook
// ============================================================================

export interface UseDragDropSensorsOptions {
	activationConstraint?: PointerActivationConstraint;
	keyboardCoordinateGetter?: typeof sortableKeyboardCoordinates;
}

function createDragDropSensors(options: UseDragDropSensorsOptions = {}) {
	const {
		activationConstraint,
		keyboardCoordinateGetter = sortableKeyboardCoordinates,
	} = options;

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint,
		}),
		useSensor(TouchSensor, {
			activationConstraint,
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: keyboardCoordinateGetter,
		}),
	);

	return sensors;
}

// ============================================================================
// DndContext
// ============================================================================

export interface DragDropContextProps
	extends Omit<DndKitContextProps, "sensors"> {
	children: React.ReactNode;
	sensors?: ReturnType<typeof createDragDropSensors>;
	useSensors?: UseDragDropSensorsOptions;
}

const DragDropContext = React.forwardRef<HTMLDivElement, DragDropContextProps>(
	(
		{ children, sensors: sensorsProp, useSensors: useSensorsOptions, ...props },
		_ref,
	) => {
		const defaultSensors = createDragDropSensors(useSensorsOptions);
		const sensors = sensorsProp ?? defaultSensors;

		return (
			<DndKitContext sensors={sensors} {...props}>
				{children}
			</DndKitContext>
		);
	},
);

DragDropContext.displayName = "DragDropContext";

// ============================================================================
// Droppable
// ============================================================================

export interface DroppableProps {
	id: UniqueIdentifier;
	children:
		| React.ReactNode
		| ((args: {
				isOver: boolean;
				setNodeRef: (node: HTMLElement | null) => void;
		  }) => React.ReactNode);
	className?: string;
	disabled?: boolean;
}

const Droppable = React.forwardRef<HTMLDivElement, DroppableProps>(
	({ children, className, id, disabled = false, ...props }, ref) => {
		const { isOver, setNodeRef } = useDroppable({
			id,
			disabled,
		});

		const content =
			typeof children === "function"
				? children({ isOver, setNodeRef })
				: children;

		return (
			<div
				ref={(node) => {
					setNodeRef(node);
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
				}}
				className={cn(className)}
				{...props}
			>
				{content}
			</div>
		);
	},
);

Droppable.displayName = "Droppable";

// ============================================================================
// Draggable
// ============================================================================

export interface DraggableProps {
	id: UniqueIdentifier;
	children:
		| React.ReactNode
		| ((args: {
				attributes: DraggableAttributes;
				listeners: SyntheticListenerMap | undefined;
				setNodeRef: (node: HTMLElement | null) => void;
				transform: {
					x: number;
					y: number;
					scaleX: number;
					scaleY: number;
				} | null;
				isDragging: boolean;
		  }) => React.ReactNode);
	className?: string;
	disabled?: boolean;
}

const Draggable = React.forwardRef<HTMLDivElement, DraggableProps>(
	({ children, className, id, disabled = false, ...props }, ref) => {
		const { attributes, listeners, setNodeRef, transform, isDragging } =
			useDraggable({
				id,
				disabled,
			});

		const content =
			typeof children === "function"
				? children({ attributes, listeners, setNodeRef, transform, isDragging })
				: children;

		const style = transform
			? {
					transform: CSS.Translate.toString(transform),
				}
			: undefined;

		return (
			<div
				ref={(node) => {
					setNodeRef(node);
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
				}}
				style={style}
				className={cn(className)}
				{...attributes}
				{...listeners}
				{...props}
			>
				{content}
			</div>
		);
	},
);

Draggable.displayName = "Draggable";

// ============================================================================
// Sortable Context
// ============================================================================

export interface SortableContextProps {
	id?: UniqueIdentifier;
	items: UniqueIdentifier[] | { id: UniqueIdentifier }[];
	strategy?: SortingStrategy;
	children: React.ReactNode;
}

const SortableContext = React.forwardRef<HTMLDivElement, SortableContextProps>(
	({ children, items, strategy = verticalListSortingStrategy }, _ref) => {
		const itemIds = React.useMemo(
			() =>
				items.map((item) =>
					typeof item === "object" && "id" in item ? item.id : item,
				),
			[items],
		);

		return (
			<SortableContextKit items={itemIds} strategy={strategy}>
				{children}
			</SortableContextKit>
		);
	},
);

SortableContext.displayName = "SortableContext";

// ============================================================================
// Sortable Item
// ============================================================================

export interface SortableItemProps {
	id: UniqueIdentifier;
	children:
		| React.ReactNode
		| ((args: {
				attributes: DraggableAttributes;
				listeners: SyntheticListenerMap | undefined;
				setNodeRef: (node: HTMLElement | null) => void;
				transform: Transform | null;
				transition: string | undefined;
				isDragging: boolean;
				isSorting: boolean;
				isOver: boolean;
		  }) => React.ReactNode);
	className?: string;
	disabled?: boolean;
	handle?: boolean;
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
	(
		{ children, className, id, disabled = false, handle = false, ...props },
		ref,
	) => {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
			isSorting,
			isOver,
		} = useSortable({
			id,
			disabled,
		});

		const content =
			typeof children === "function"
				? children({
						attributes,
						listeners,
						setNodeRef,
						transform,
						transition,
						isDragging,
						isSorting,
						isOver,
					})
				: children;

		const style: React.CSSProperties = {
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 9999 : undefined,
		};

		return (
			<div
				ref={(node) => {
					setNodeRef(node);
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
				}}
				style={style}
				className={cn(className)}
				{...attributes}
				{...(handle ? {} : listeners)}
				{...props}
			>
				{content}
			</div>
		);
	},
);

SortableItem.displayName = "SortableItem";

// ============================================================================
// Sortable Handle
// ============================================================================

export interface SortableHandleProps {
	children:
		| React.ReactNode
		| ((listeners: SyntheticListenerMap | undefined) => React.ReactNode);
	className?: string;
}

const SortableHandle = React.forwardRef<HTMLDivElement, SortableHandleProps>(
	({ children, className, ...props }, ref) => {
		const { attributes, listeners } = useSortable({ id: "" });

		const content =
			typeof children === "function" ? children(listeners) : children;

		return (
			<div
				ref={ref}
				className={cn("cursor-grab active:cursor-grabbing", className)}
				{...attributes}
				{...listeners}
				{...props}
			>
				{content}
			</div>
		);
	},
);

SortableHandle.displayName = "SortableHandle";

// ============================================================================
// Drag Overlay Component
// ============================================================================

export interface DragOverlayComponentProps {
	children: React.ReactNode;
	className?: string;
	dropAnimation?: {
		duration?: number;
		easing?: string;
	} | null;
}

const DragOverlayComponent = React.forwardRef<
	HTMLDivElement,
	DragOverlayComponentProps
>(({ children, className, dropAnimation, ...props }, _ref) => {
	return (
		<DragOverlay dropAnimation={dropAnimation} {...props}>
			{children ? <div className={cn(className)}>{children}</div> : null}
		</DragOverlay>
	);
});

DragOverlayComponent.displayName = "DragOverlayComponent";

// ============================================================================
// Exports
// ============================================================================

export {
	DragDropContext,
	Droppable,
	Draggable,
	SortableContext,
	SortableItem,
	SortableHandle,
	DragOverlayComponent,
	createDragDropSensors as useDragDropSensors,
	// Re-export useful hooks
	useDraggable,
	useDroppable,
	useSortable,
	// Re-export sensors
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	sortableKeyboardCoordinates,
};

export type {
	// Context types
	DragEndEvent as DropResult,
	DragStartEvent as DragStart,
	DragOverEvent as DragUpdate,
	DragOverEvent,
	Active,
	Over,
	Collision,
	// Droppable types
	// Draggable types
	DraggableAttributes,
	UniqueIdentifier,
	DraggableSyntheticListeners,
	// Sorting
	SortingStrategy,
	// Transform
	Transform,
};
