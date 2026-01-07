/**
 * DnD Component - Drag and Drop primitives for @dnd-kit/core
 * Provides consistent wrappers for DndContext, Droppable, and Draggable
 */

'use client';

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DraggableAttributes,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  DndContext as DndKitContext,
  useDraggable,
  useDroppable,
  type DndContextProps as DndKitContextProps,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import { cn } from '../../lib/utils';

// ============================================================================
// DndContext
// ============================================================================

export interface DragDropContextProps extends DndKitContextProps {
  children: React.ReactNode;
}

const DragDropContext = React.forwardRef<HTMLDivElement, DragDropContextProps>(
  ({ children, ...props }, _ref) => {
    return <DndKitContext {...props}>{children}</DndKitContext>;
  },
);

DragDropContext.displayName = 'DragDropContext';

// ============================================================================
// Droppable
// ============================================================================

export interface DroppableProps {
  id: UniqueIdentifier;
  children:
    | React.ReactNode
    | ((args: { isOver: boolean; setNodeRef: (node: HTMLElement | null) => void }) => React.ReactNode);
  className?: string;
  disabled?: boolean;
}

const Droppable = React.forwardRef<HTMLDivElement, DroppableProps>(
  ({ children, className, id, disabled = false, ...props }, ref) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
      disabled,
    });

    const content = typeof children === 'function' ? children({ isOver, setNodeRef }) : children;

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') {
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

Droppable.displayName = 'Droppable';

// ============================================================================
// Draggable
// ============================================================================

export interface DraggableProps {
  id: UniqueIdentifier;
  children:
    | React.ReactNode
    | ((args: {
        attributes: DraggableAttributes;
        listeners: Record<string, Function> | undefined;
        setNodeRef: (node: HTMLElement | null) => void;
        transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
        isDragging: boolean;
      }) => React.ReactNode);
  className?: string;
  disabled?: boolean;
}

const Draggable = React.forwardRef<HTMLDivElement, DraggableProps>(
  ({ children, className, id, disabled = false, ...props }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id,
      disabled,
    });

    const content = typeof children === 'function'
      ? children({ attributes, listeners, setNodeRef, transform, isDragging })
      : children;

    const style = transform ? {
      transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') {
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

Draggable.displayName = 'Draggable';

// ============================================================================
// Exports
// ============================================================================

export { DragDropContext, Droppable, Draggable };

export type {
  // Context types
  DragEndEvent as DropResult,
  DragStartEvent as DragStart,
  DragOverEvent as DragUpdate,
  // Droppable types
  // Draggable types
  DraggableAttributes,
  UniqueIdentifier,
};
