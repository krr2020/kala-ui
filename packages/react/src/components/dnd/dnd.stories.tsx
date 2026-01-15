import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
	GripVertical,
	Move3D,
	Trash2,
	Copy,
	Edit,
} from "lucide-react";
import { useState } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Card } from "../card";
import { Badge } from "../badge";
import { Button } from "../button";
import {
	DragDropContext,
	SortableContext,
	SortableItem,
	DragOverlayComponent,
	sortingStrategies,
	modifiers,
	collisionDetectionAlgorithms,
	useDragDropSensors,
} from "./dnd";
import type { UniqueIdentifier } from "./dnd";

const meta = {
	title: "Utilities/DnD",
	component: DragDropContext,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"A comprehensive drag and drop system built on @dnd-kit with sortable lists, animations, multiple containers, and accessibility features.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DragDropContext>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Task {
	id: string;
	content: string;
	status?: string;
	priority?: string;
}

// ============================================================================
// 1. Basic Sortable List
// ============================================================================

export const BasicSortableList: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story: "A simple vertical sortable list with smooth animations and visual feedback.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1: Review pull request" },
			{ id: "2", content: "Task 2: Update documentation" },
			{ id: "3", content: "Task 3: Fix bug in component" },
			{ id: "4", content: "Task 4: Write unit tests" },
			{ id: "5", content: "Task 5: Deploy to staging" },
		]);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;

			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);

				return newItems;
			});
		};

		return (
			<div className="w-full max-w-md mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Drag to Reorder Tasks</h3>
				<DragDropContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, isSorting, listeners, attributes, setNodeRef }) => (
										<div
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												relative flex items-center gap-3 p-4 rounded-lg border bg-card
												transition-all duration-200
												${
													isDragging
														? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary cursor-grabbing z-50"
														: "shadow-sm hover:shadow-md cursor-grab"
												}
												${isSorting ? "transition-transform duration-200" : ""}
											`}
										>
											<GripVertical className="size-5 text-muted-foreground flex-shrink-0" />
											<span className="flex-1">{item.content}</span>
											{isDragging && (
												<Move3D className="size-5 text-primary animate-pulse flex-shrink-0" />
											)}
										</div>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 2. Horizontal List
// ============================================================================

export const HorizontalList: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story: "Horizontal scrollable list with drag and drop reordering.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Sprint 1", status: "completed" },
			{ id: "2", content: "Sprint 2", status: "active" },
			{ id: "3", content: "Sprint 3", status: "upcoming" },
			{ id: "4", content: "Sprint 4", status: "upcoming" },
			{ id: "5", content: "Sprint 5", status: "upcoming" },
		]);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full">
				<h3 className="mb-4 text-lg font-semibold">Sprint Planning</h3>
				<DragDropContext
					sensors={sensors}
					onDragEnd={handleDragEnd}
					modifiers={[modifiers.restrictToHorizontalAxis]}
				>
					<SortableContext items={items} strategy={sortingStrategies.horizontal}>
						<div className="flex gap-3 overflow-x-auto pb-4">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, isSorting, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												relative min-w-[200px] cursor-grab active:cursor-grabbing
												${isDragging ? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary z-50" : ""}
												${isSorting ? "transition-transform duration-200" : ""}
											`}
										>
											<div className="p-4">
												<div className="flex items-center justify-between mb-2">
													<h4 className="font-semibold">{item.content}</h4>
													<Badge
														variant={
															item.status === "completed"
																? "success"
																: item.status === "active"
																	? "default"
																	: "secondary"
														}
													>
														{item.status}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">
													Drag to reorder sprints
												</p>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 3. Multiple Containers (Kanban Board)
// ============================================================================

export const MultipleContainers: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story: "Kanban board with multiple columns. Drag items between columns.",
			},
		},
	},
	render: () => {
		const [containers, setContainers] = useState({
			todo: [
				{ id: "todo-1", content: "Research competitors", priority: "high" },
				{ id: "todo-2", content: "Gather requirements", priority: "medium" },
				{ id: "todo-3", content: "Create wireframes", priority: "low" },
			],
			inProgress: [
				{ id: "progress-1", content: "Build component library", priority: "high" },
				{ id: "progress-2", content: "Create API endpoints", priority: "medium" },
			],
			done: [
				{ id: "done-1", content: "Setup project repository", priority: "high" },
			],
		});

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over) return;

			const activeId = active.id as string;
			const overId = over.id as string;

			// Find source and destination containers
			let sourceContainer: keyof typeof containers | null = null;
			let destContainer: keyof typeof containers | null = null;
			let sourceIndex = -1;
			let destIndex = -1;

			for (const [key, items] of Object.entries(containers)) {
				const index = items.findIndex((item) => item.id === activeId);
				if (index !== -1) {
					sourceContainer = key as keyof typeof containers;
					sourceIndex = index;
				}

				const overIndex = items.findIndex((item) => item.id === overId);
				if (overIndex !== -1) {
					destContainer = key as keyof typeof containers;
					destIndex = overIndex;
				}

				// Check if over is a container itself
				if (key === overId) {
					destContainer = key as keyof typeof containers;
					destIndex = items.length;
				}
			}

			if (!sourceContainer) return;

			setContainers((prev) => {
				const newContainers = { ...prev };

				if (sourceContainer === destContainer && destContainer) {
					// Reorder within same container
					const items = [...newContainers[sourceContainer]];
					const [movedItem] = items.splice(sourceIndex, 1);
					items.splice(destIndex, 0, movedItem);
					newContainers[sourceContainer] = items;
				} else if (destContainer) {
					// Move between containers
					const sourceItems = [...newContainers[sourceContainer]];
					const destItems = [...newContainers[destContainer]];
					const [movedItem] = sourceItems.splice(sourceIndex, 1);
					destItems.splice(destIndex, 0, movedItem);
					newContainers[sourceContainer] = sourceItems;
					newContainers[destContainer] = destItems;
				}

				return newContainers;
			});
		};

		const allItems = [
			...containers.todo.map((item) => item.id),
			...containers.inProgress.map((item) => item.id),
			...containers.done.map((item) => item.id),
			"todo",
			"inProgress",
			"done",
		];

		return (
			<div className="w-full">
				<h3 className="mb-4 text-lg font-semibold">Kanban Board</h3>
				<DragDropContext
					sensors={sensors}
					onDragEnd={handleDragEnd}
					collisionDetection={collisionDetectionAlgorithms.closestCorners}
				>
					<SortableContext items={allItems}>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{Object.entries(containers).map(([containerId, items]) => (
								<div key={containerId} className="flex flex-col">
									<div className="mb-3 flex items-center justify-between">
										<h4 className="font-medium text-sm uppercase text-muted-foreground">
											{containerId === "todo"
												? "To Do"
												: containerId === "inProgress"
													? "In Progress"
													: "Done"}
										</h4>
										<Badge variant="outline">{items.length}</Badge>
									</div>
									<SortableItem
										id={containerId}
										className="flex-1 min-h-[400px] rounded-lg border-2 border-dashed bg-muted/20 p-3"
									>
										{({ isOver }) => (
											<div
												className={`
													h-full rounded-md transition-colors
													${isOver ? "bg-accent/50 ring-2 ring-primary" : ""}
												`}
											>
												<SortableContext items={items} strategy={sortingStrategies.vertical}>
													<div className="space-y-2">
														{items.map((item) => (
															<SortableItem key={item.id} id={item.id}>
																{({ isDragging, isSorting, listeners, attributes, setNodeRef }) => (
																	<Card
																		ref={setNodeRef}
																		{...attributes}
																		{...listeners}
																		className={`
																			cursor-grab active:cursor-grabbing relative
																			${
																				isDragging
																					? "shadow-2xl scale-105 opacity-60 ring-2 ring-primary z-50"
																					: "shadow-sm hover:shadow-md"
																			}
																			${isSorting ? "transition-transform duration-200 ease-out" : ""}
																		`}
																	>
																		<div className="p-3">
																			<div className="flex items-start justify-between gap-2 mb-2">
																				<p className="font-medium text-sm flex-1">
																					{item.content}
																				</p>
																				<Badge
																					variant={
																						item.priority === "high"
																							? "destructive"
																							: item.priority === "medium"
																								? "default"
																								: "secondary"
																					}
																				>
																					{item.priority}
																				</Badge>
																			</div>
																		</div>
																	</Card>
																)}
															</SortableItem>
														))}
													</div>
												</SortableContext>
											</div>
										)}
									</SortableItem>
								</div>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 4. Grid Layout
// ============================================================================

export const GridLayout: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story: "Grid layout with drag and drop. Uses rect sorting strategy.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>(
			Array.from({ length: 12 }, (_, i) => ({
				id: `${i + 1}`,
				content: `Item ${i + 1}`,
			})),
		);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full">
				<h3 className="mb-4 text-lg font-semibold">Grid Dashboard</h3>
				<DragDropContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={sortingStrategies.rect}>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, isSorting, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												relative aspect-square cursor-grab active:cursor-grabbing
												${isDragging ? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary z-50" : ""}
												${isSorting ? "transition-transform duration-200" : ""}
											`}
										>
											<div className="h-full flex flex-col items-center justify-center p-4">
												<GripVertical className="size-5 text-muted-foreground mb-2" />
												<p className="font-medium text-center">{item.content}</p>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 5. Drag Handle
// ============================================================================

export const WithDragHandle: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Only the drag handle icon can be used to drag items. The rest of the item remains interactive.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1: Review pull request" },
			{ id: "2", content: "Task 2: Update documentation" },
			{ id: "3", content: "Task 3: Fix bug in component" },
			{ id: "4", content: "Task 4: Write unit tests" },
		]);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full max-w-2xl mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Tasks with Drag Handle</h3>
				<DragDropContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id} handle>
									{({ isDragging, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											className={`
												${isDragging ? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary" : ""}
											`}
										>
											<div className="flex items-center gap-3 p-4">
												<div
													{...listeners}
													className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent touch-none"
												>
													<GripVertical className="size-5 text-muted-foreground" />
												</div>
												<span className="flex-1">{item.content}</span>
												<div className="flex gap-2">
													<Button size="sm" variant="ghost">
														<Edit className="size-4" />
													</Button>
													<Button size="sm" variant="ghost">
														<Copy className="size-4" />
													</Button>
													<Button size="sm" variant="ghost">
														<Trash2 className="size-4" />
													</Button>
												</div>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 6. With Drag Overlay
// ============================================================================

export const WithDragOverlay: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Uses a drag overlay for smoother performance when dragging between containers.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1: Review pull request" },
			{ id: "2", content: "Task 2: Update documentation" },
			{ id: "3", content: "Task 3: Fix bug in component" },
			{ id: "4", content: "Task 4: Write unit tests" },
		]);
		const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

		const sensors = useDragDropSensors();

		const handleDragStart = (event: DragStartEvent) => {
			setActiveId(event.active.id);
		};

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;

			if (over && active.id !== over.id) {
				setItems((items) => {
					const oldIndex = items.findIndex((item) => item.id === active.id);
					const newIndex = items.findIndex((item) => item.id === over.id);
					const newItems = [...items];
					const [movedItem] = newItems.splice(oldIndex, 1);
					newItems.splice(newIndex, 0, movedItem);
					return newItems;
				});
			}

			setActiveId(null);
		};

		const activeItem = items.find((item) => item.id === activeId);

		return (
			<div className="w-full max-w-md mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Drag with Overlay</h3>
				<DragDropContext
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className="cursor-grab active:cursor-grabbing"
										>
											<div className="flex items-center gap-3 p-4">
												<GripVertical className="size-5 text-muted-foreground" />
												<span className="flex-1">{item.content}</span>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
					<DragOverlayComponent>
						{activeItem ? (
							<Card className="shadow-2xl ring-2 ring-primary cursor-grabbing">
								<div className="flex items-center gap-3 p-4">
									<GripVertical className="size-5 text-muted-foreground" />
									<span className="flex-1">{activeItem.content}</span>
								</div>
							</Card>
						) : null}
					</DragOverlayComponent>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 7. Press Delay (Mobile-Friendly)
// ============================================================================

export const PressDelay: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Requires a 250ms press before dragging starts. Useful for mobile to prevent accidental drags.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1: Review pull request" },
			{ id: "2", content: "Task 2: Update documentation" },
			{ id: "3", content: "Task 3: Fix bug in component" },
		]);

		const sensors = useDragDropSensors({
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		});

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full max-w-md mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Press & Hold to Drag</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Hold for 250ms before dragging starts
				</p>
				<DragDropContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												cursor-grab active:cursor-grabbing
												${isDragging ? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary" : ""}
											`}
										>
											<div className="flex items-center gap-3 p-4">
												<GripVertical className="size-5 text-muted-foreground" />
												<span className="flex-1">{item.content}</span>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 8. Minimum Distance
// ============================================================================

export const MinimumDistance: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"Requires 10px movement before dragging starts. Prevents accidental drags.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1: Review pull request" },
			{ id: "2", content: "Task 2: Update documentation" },
			{ id: "3", content: "Task 3: Fix bug in component" },
		]);

		const sensors = useDragDropSensors({
			activationConstraint: {
				distance: 10,
			},
		});

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full max-w-md mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Minimum Distance Drag</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Move 10px before dragging starts
				</p>
				<DragDropContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												cursor-grab active:cursor-grabbing
												${isDragging ? "shadow-2xl scale-105 opacity-50 ring-2 ring-primary" : ""}
											`}
										>
											<div className="flex items-center gap-3 p-4">
												<GripVertical className="size-5 text-muted-foreground" />
												<span className="flex-1">{item.content}</span>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 9. Vertical Axis Only
// ============================================================================

export const VerticalAxisOnly: Story = {
	// @ts-expect-error - Story requires args but we use render function
	args: {},
	parameters: {
		docs: {
			description: {
				story: "Restricts dragging to vertical axis only.",
			},
		},
	},
	render: () => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Task 1" },
			{ id: "2", content: "Task 2" },
			{ id: "3", content: "Task 3" },
		]);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full max-w-md mx-auto">
				<h3 className="mb-4 text-lg font-semibold">Vertical Axis Only</h3>
				<DragDropContext
					sensors={sensors}
					onDragEnd={handleDragEnd}
					modifiers={[modifiers.restrictToVerticalAxis]}
				>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												cursor-grab active:cursor-grabbing
												${isDragging ? "shadow-2xl opacity-50" : ""}
											`}
										>
											<div className="flex items-center gap-3 p-4">
												<GripVertical className="size-5 text-muted-foreground" />
												<span className="flex-1">{item.content}</span>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};

// ============================================================================
// 10. With Actions (Callbacks)
// ============================================================================

export const WithActions: Story = {
	args: {
		children: <div />,
		onDragStart: fn(),
		onDragEnd: fn(),
	},
	parameters: {
		docs: {
			description: {
				story: "Check the Actions panel to see all drag event callbacks.",
			},
		},
	},
	render: (args) => {
		const [items, setItems] = useState<Task[]>([
			{ id: "1", content: "Item 1" },
			{ id: "2", content: "Item 2" },
			{ id: "3", content: "Item 3" },
		]);

		const sensors = useDragDropSensors();

		const handleDragEnd = (event: DragEndEvent) => {
			args.onDragEnd?.(event);
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newItems = [...items];
				const [movedItem] = newItems.splice(oldIndex, 1);
				newItems.splice(newIndex, 0, movedItem);
				return newItems;
			});
		};

		return (
			<div className="w-full max-w-md mx-auto">
				<p className="mb-4 text-sm text-muted-foreground">
					Check the Actions panel to see drag callbacks
				</p>
				<DragDropContext
					sensors={sensors}
					onDragStart={args.onDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={items} strategy={sortingStrategies.vertical}>
						<div className="space-y-2">
							{items.map((item) => (
								<SortableItem key={item.id} id={item.id}>
									{({ isDragging, isSorting, listeners, attributes, setNodeRef }) => (
										<Card
											ref={setNodeRef}
											{...attributes}
											{...listeners}
											className={`
												relative cursor-grab active:cursor-grabbing
												${isDragging ? "z-50 shadow-xl" : ""}
												${isSorting ? "transition-transform duration-200" : ""}
											`}
										>
											<div className="flex items-center gap-3 p-4">
												<GripVertical className="size-5 text-muted-foreground" />
												<span className="flex-1">{item.content}</span>
											</div>
										</Card>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DragDropContext>
			</div>
		);
	},
};
