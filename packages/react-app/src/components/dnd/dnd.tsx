/**
 * DnD Component - Drag and Drop primitives for @dnd-kit
 * Provides consistent wrappers with animations, sortable support, and drag overlays
 */

"use client";

import type {
	DragDropContextProps,
	DragOverlayComponentProps,
	DraggableAttributes,
	DraggableProps,
	DroppableProps,
	SortableContextProps,
	SortableHandleProps,
	SortableItemProps,
	SyntheticListenerMap,
	UseDragDropSensorsOptions,
} from "./dnd.types";
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
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@kala-ui/react/lib/utils";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot } from "@kala-ui/react/lib/slot-styles";
import { useMergedRef } from "@kala-ui/react-hooks";
import * as React from "react";

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

function DragDropContext({
	children,
	sensors: sensorsProp,
	useSensors: useSensorsOptions,
	...props
}: DragDropContextProps) {
	const defaultSensors = createDragDropSensors(useSensorsOptions);
	const sensors = sensorsProp ?? defaultSensors;

	return (
		<DndKitContext
			data-kala-component="dnd-drag-drop-context"
			sensors={sensors}
			{...props}
		>
			{children}
		</DndKitContext>
	);
}

// ============================================================================
// Droppable
// ============================================================================

function Droppable({
	ref,
	children,
	className,
	id,
	disabled = false,
	...props
}: DroppableProps) {
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
			data-kala-component="dnd-droppable"
			ref={useMergedRef(ref, setNodeRef)}
			className={cn(className)}
			{...props}
		>
			{content}
		</div>
	);
}

// ============================================================================
// Draggable
// ============================================================================

function Draggable({
	ref,
	children,
	className,
	id,
	disabled = false,
	...props
}: DraggableProps) {
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
			data-kala-component="dnd-draggable"
			ref={useMergedRef(ref, setNodeRef)}
			style={style}
			className={cn(className)}
			{...attributes}
			{...listeners}
			{...props}
		>
			{content}
		</div>
	);
}

// ============================================================================
// Sortable Context
// ============================================================================

function SortableContext({
	children,
	items,
	strategy = verticalListSortingStrategy,
}: SortableContextProps) {
	const itemIds = React.useMemo(
		() =>
			items.map((item) =>
				typeof item === "object" && "id" in item ? item.id : item,
			),
		[items],
	);

	return (
		<SortableContextKit
			data-kala-component="dnd-sortable-context"
			items={itemIds}
			strategy={strategy}
		>
			{children}
		</SortableContextKit>
	);
}

// ============================================================================
// Sortable Item
// ============================================================================

// SortableHandle receives its parent SortableItem's dnd-kit wiring through
// this context — a handle must never register its own sortable (the old
// `useSortable({ id: "" })` created a phantom element that broke
// handle-based dragging and collided with real ids).
interface SortableHandleContextValue {
	attributes: DraggableAttributes;
	listeners: SyntheticListenerMap | undefined;
	setActivatorNodeRef: (node: HTMLElement | null) => void;
}

const SortableHandleContext =
	React.createContext<SortableHandleContextValue | null>(null);

function SortableItem({
	ref,
	children,
	className,
	id,
	disabled = false,
	handle = false,
	slotStyles: slotStylesRaw,
	...props
}: SortableItemProps) {
	const slotStyles = useSlotStyles("dnd", slotStylesRaw);
	const itemRoot = applySlot(cn(className), slotStyles?.root);
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
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
		<SortableHandleContext.Provider
			value={{ attributes, listeners, setActivatorNodeRef }}
		>
			<div
				data-kala-component="dnd-sortable-item"
				ref={useMergedRef(ref, setNodeRef)}
				style={style}
				className={itemRoot.className}
				{...attributes}
				{...(handle ? {} : listeners)}
				{...props}
			>
				{content}
			</div>
		</SortableHandleContext.Provider>
	);
}

// ============================================================================
// Sortable Handle
// ============================================================================

function SortableHandle({
	ref,
	children,
	className,
	...props
}: SortableHandleProps) {
	const sortable = React.useContext(SortableHandleContext);

	if (!sortable && process.env.NODE_ENV !== "production") {
		console.warn(
			"SortableHandle must be rendered inside a SortableItem to receive drag listeners.",
		);
	}

	const content =
		typeof children === "function" ? children(sortable?.listeners) : children;

	return (
		<div
			data-kala-component="dnd-sortable-handle"
			ref={useMergedRef(ref, sortable?.setActivatorNodeRef)}
			className={cn("cursor-grab active:cursor-grabbing", className)}
			{...(sortable?.attributes ?? {})}
			{...(sortable?.listeners ?? {})}
			{...props}
		>
			{content}
		</div>
	);
}

// ============================================================================
// Drag Overlay Component
// ============================================================================

function DragOverlayComponent({
	children,
	className,
	dropAnimation,
	...props
}: DragOverlayComponentProps) {
	return (
		<DragOverlay
			data-kala-component="dnd-drag-overlay-component"
			dropAnimation={dropAnimation}
			{...props}
		>
			{children ? <div className={cn(className)}>{children}</div> : null}
		</DragOverlay>
	);
}

// ============================================================================
// Exports
// ============================================================================

export {
	createDragDropSensors as useDragDropSensors,
	DragDropContext,
	Draggable,
	DragOverlayComponent,
	Droppable,
	// Re-export sensors
	KeyboardSensor,
	PointerSensor,
	SortableContext,
	SortableHandle,
	SortableItem,
	sortableKeyboardCoordinates,
	TouchSensor,
	// Re-export useful hooks
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
	useSortable,
};
