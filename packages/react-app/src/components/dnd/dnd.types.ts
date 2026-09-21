/**
 * DnD family types — the Kala-named surface over @dnd-kit plus the wrapper
 * component prop shapes. Kept free of runtime code so it doubles as the
 * @dnd-kit type re-export point for the family barrel.
 */

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
	useSensors,
} from "@dnd-kit/core";
import type {
	sortableKeyboardCoordinates,
	SortingStrategy,
} from "@dnd-kit/sortable";
import type { Transform } from "@dnd-kit/utilities";
import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import type * as React from "react";

export type SyntheticListenerMap = DraggableSyntheticListeners;

export type DragDropModifier = Modifier;
export type DragDropCollisionDetection = CollisionDetection;
export type DragDropSortingStrategy = SortingStrategy;
export type DragDropPointerConstraint = PointerActivationConstraint;

export interface UseDragDropSensorsOptions {
	activationConstraint?: PointerActivationConstraint;
	keyboardCoordinateGetter?: typeof sortableKeyboardCoordinates;
}

export interface DragDropContextProps
	extends Omit<DndKitContextProps, "sensors"> {
	children: React.ReactNode;
	sensors?: ReturnType<typeof useSensors>;
	useSensors?: UseDragDropSensorsOptions;
}

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

export interface SortableContextProps {
	id?: UniqueIdentifier;
	items: UniqueIdentifier[] | { id: UniqueIdentifier }[];
	strategy?: SortingStrategy;
	children: React.ReactNode;
}

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

export interface SortableHandleProps {
	ref?: React.Ref<HTMLDivElement>;
	children:
		| React.ReactNode
		| ((listeners: SyntheticListenerMap | undefined) => React.ReactNode);
	className?: string;
}

export interface DragOverlayComponentProps {
	children: React.ReactNode;
	className?: string;
	dropAnimation?: {
		duration?: number;
		easing?: string;
	} | null;
}

export type {
	Active,
	Collision,
	DragEndEvent as DropResult,
	DraggableAttributes,
	DraggableSyntheticListeners,
	DragOverEvent as DragUpdate,
	DragOverEvent,
	DragStartEvent as DragStart,
	Over,
	SortingStrategy,
	Transform,
	UniqueIdentifier,
};
