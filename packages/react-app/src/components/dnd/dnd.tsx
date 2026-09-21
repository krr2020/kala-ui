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
import { cn } from "@kala-ui/react/lib/utils";
import { useSlotStyles } from "@kala-ui/react/kala-provider";
import { applySlot, type SlotStyles } from "@kala-ui/react/lib/slot-styles";
import { useMergedRef } from "@kala-ui/react-hooks";
import * as React from "react";

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

export interface DroppableProps {
	ref?: React.Ref<HTMLDivElement>;
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

export interface DraggableProps {
	ref?: React.Ref<HTMLDivElement>;
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

export interface SortableContextProps {
	id?: UniqueIdentifier;
	items: UniqueIdentifier[] | { id: UniqueIdentifier }[];
	strategy?: SortingStrategy;
	children: React.ReactNode;
}

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

export interface SortableItemProps {
	ref?: React.Ref<HTMLDivElement>;
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
	slotStyles?: SlotStyles;
}

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
			data-kala-component="dnd-sortable-item"
			value={{ attributes, listeners, setActivatorNodeRef }}
		>
			<div
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

export interface SortableHandleProps {
	ref?: React.Ref<HTMLDivElement>;
	children:
		| React.ReactNode
		| ((listeners: SyntheticListenerMap | undefined) => React.ReactNode);
	className?: string;
}

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

export interface DragOverlayComponentProps {
	children: React.ReactNode;
	className?: string;
	dropAnimation?: {
		duration?: number;
		easing?: string;
	} | null;
}

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

export type {
	Active,
	Collision,
	// Context types
	DragEndEvent as DropResult,
	// Droppable types
	// Draggable types
	DraggableAttributes,
	DraggableSyntheticListeners,
	DragOverEvent as DragUpdate,
	DragOverEvent,
	DragStartEvent as DragStart,
	Over,
	// Sorting
	SortingStrategy,
	// Transform
	Transform,
	UniqueIdentifier,
};
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
