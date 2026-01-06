/**
 * DnD Component - Drag and Drop primitives for @hello-pangea/dnd
 * Provides consistent wrappers for DragDropContext, Droppable, and Draggable
 */

'use client';

import type {
  BeforeCapture,
  DraggableLocation,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  DragStart,
  DragUpdate,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
  DragDropContextProps as HelloPangeaDragDropContextProps,
  DraggableProps as HelloPangeaDraggableProps,
  DroppableProps as HelloPangeaDroppableProps,
  ResponderProvided,
} from '@hello-pangea/dnd';
import {
  DragDropContext as HelloPangeaDragDropContext,
  Draggable as HelloPangeaDraggable,
  Droppable as HelloPangeaDroppable,
} from '@hello-pangea/dnd';
import * as React from 'react';
import { cn } from '../../lib/utils';

// ============================================================================
// DragDropContext
// ============================================================================

export interface DragDropContextProps extends HelloPangeaDragDropContextProps {
  children: React.ReactNode;
}

const DragDropContext = React.forwardRef<HTMLDivElement, DragDropContextProps>(
  ({ children, ...props }, _ref) => {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);

    if (!enabled) {
      return null;
    }

    return <HelloPangeaDragDropContext {...props}>{children}</HelloPangeaDragDropContext>;
  },
);

DragDropContext.displayName = 'DragDropContext';

// ============================================================================
// Droppable
// ============================================================================

export interface DroppableProps extends Omit<HelloPangeaDroppableProps, 'children'> {
  children:
    | React.ReactNode
    | ((provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode);
  className?: string;
}

const Droppable = React.forwardRef<HTMLDivElement, DroppableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <HelloPangeaDroppable {...props}>
        {(provided, snapshot) => {
          const content = typeof children === 'function' ? children(provided, snapshot) : children;

          return (
            <div
              ref={(node) => {
                provided.innerRef(node);
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              {...provided.droppableProps}
              className={cn(className)}
            >
              {content}
              {provided.placeholder}
            </div>
          );
        }}
      </HelloPangeaDroppable>
    );
  },
);

Droppable.displayName = 'Droppable';

// ============================================================================
// Draggable
// ============================================================================

export interface DraggableProps extends Omit<HelloPangeaDraggableProps, 'children'> {
  children:
    | React.ReactNode
    | ((provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode);
  className?: string;
}

const Draggable = React.forwardRef<HTMLDivElement, DraggableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <HelloPangeaDraggable {...props}>
        {(provided, snapshot) => {
          const content = typeof children === 'function' ? children(provided, snapshot) : children;

          return (
            <div
              ref={(node) => {
                provided.innerRef(node);
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={cn(className)}
            >
              {content}
            </div>
          );
        }}
      </HelloPangeaDraggable>
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
  DropResult,
  DragStart,
  DragUpdate,
  BeforeCapture,
  ResponderProvided,
  // Droppable types
  DroppableProvided,
  DroppableStateSnapshot,
  // Draggable types
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DraggableLocation,
};
