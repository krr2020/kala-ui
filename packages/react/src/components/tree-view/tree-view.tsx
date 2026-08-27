"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

export interface TreeItem {
	id: string;
	label: string;
	children?: TreeItem[];
	icon?: React.ReactNode;
	disabled?: boolean;
}

export interface TreeViewProps
	extends Omit<React.ComponentProps<"ul">, "onSelect"> {
	/** Tree data */
	data: TreeItem[];
	/** Selected item id(s) */
	selected?: string | string[];
	/** Default expanded item ids */
	defaultExpanded?: string[];
	/** Callback when selection changes */
	onSelect?: (id: string) => void;
	/** Multi-select mode */
	multiSelect?: boolean;
}

interface TreeViewContextValue {
	selected: Set<string>;
	expanded: Set<string>;
	activeId: string | null;
	multiSelect: boolean;
	onSelect: (id: string) => void;
	onToggle: (id: string) => void;
	setActiveId: (id: string) => void;
	registerNode: (id: string, element: HTMLLIElement | null) => void;
	focusNode: (id: string) => void;
	navigate: (id: string, key: string) => void;
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null);

function useTreeView() {
	const context = React.useContext(TreeViewContext);
	if (!context) {
		throw new Error("Tree components must be used within a TreeView.");
	}
	return context;
}

interface TreeNodeProps {
	item: TreeItem;
	level: number;
}

function TreeNode({ item, level }: TreeNodeProps) {
	const {
		selected,
		expanded,
		activeId,
		onSelect,
		onToggle,
		setActiveId,
		registerNode,
		navigate,
	} = useTreeView();
	const liRef = React.useRef<HTMLLIElement>(null);

	const isSelected = selected.has(item.id);
	const isExpanded = expanded.has(item.id);
	const hasChildren = !!item.children?.length;
	const isActive = activeId === item.id;

	React.useEffect(() => {
		registerNode(item.id, liRef.current);
		return () => registerNode(item.id, null);
	}, [item.id, registerNode]);

	const activate = () => {
		if (item.disabled) return;
		if (hasChildren) onToggle(item.id);
		onSelect(item.id);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
		switch (e.key) {
			case "Enter":
			case " ":
				e.preventDefault();
				activate();
				break;
			case "ArrowDown":
			case "ArrowUp":
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End":
				e.preventDefault();
				navigate(item.id, e.key);
				break;
			default:
				break;
		}
	};

	return (
		<li
			ref={liRef}
			role="treeitem"
			data-slot="tree-node"
			data-selected={isSelected || undefined}
			tabIndex={isActive ? 0 : -1}
			aria-expanded={hasChildren ? isExpanded : undefined}
			aria-selected={isSelected}
			aria-disabled={item.disabled}
			aria-level={level + 1}
			onFocus={() => setActiveId(item.id)}
			onClick={(e) => {
				e.stopPropagation();
				activate();
			}}
			onKeyDown={handleKeyDown}
			className={cn(
				"group/tree-item outline-none",
				item.disabled && "cursor-not-allowed pointer-events-none",
			)}
		>
			<div
				style={{ paddingLeft: `${level * 1.25}rem` }}
				className={cn(
					"flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					"group-focus-visible/tree-item:outline-none group-focus-visible/tree-item:ring-2 group-focus-visible/tree-item:ring-ring",
					isSelected && "bg-accent text-accent-foreground font-medium",
					item.disabled && "opacity-50",
				)}
			>
				{hasChildren ? (
					<ChevronRight
						aria-hidden="true"
						className={cn(
							"h-4 w-4 shrink-0 text-muted-foreground transition-transform",
							isExpanded && "rotate-90",
						)}
					/>
				) : (
					<span className="w-4 shrink-0" aria-hidden="true" />
				)}

				{item.icon && (
					<span className="shrink-0 [&_svg]:size-4" aria-hidden="true">
						{item.icon}
					</span>
				)}

				<span className="truncate">{item.label}</span>
			</div>

			{hasChildren && isExpanded && (
				// biome-ignore lint/a11y/useSemanticElements: role=group is the ARIA APG treeview structure for child groups
				<ul role="group" className="mt-0.5">
					{item.children?.map((child) => (
						<TreeNode key={child.id} item={child} level={level + 1} />
					))}
				</ul>
			)}
		</li>
	);
}

function TreeView({
	data,
	selected: selectedProp,
	defaultExpanded = [],
	onSelect,
	multiSelect = false,
	className,
	...props
}: TreeViewProps) {
	const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => {
		if (!selectedProp) return new Set();
		return new Set(Array.isArray(selectedProp) ? selectedProp : [selectedProp]);
	});

	const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
		() => new Set(defaultExpanded),
	);

	const [activeId, setActiveId] = React.useState<string | null>(null);
	const nodeRefs = React.useRef(new Map<string, HTMLLIElement>());

	const isControlled = selectedProp !== undefined;
	const currentSelected = isControlled
		? new Set(Array.isArray(selectedProp) ? selectedProp : [selectedProp])
		: selectedIds;

	const handleSelect = (id: string) => {
		if (!isControlled) {
			setSelectedIds((prev) => {
				if (multiSelect) {
					const next = new Set(prev);
					if (next.has(id)) next.delete(id);
					else next.add(id);
					return next;
				}
				return new Set([id]);
			});
		}
		onSelect?.(id);
	};

	const handleToggle = (id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	// Flat ordered list of currently visible node ids plus parent/children info,
	// recomputed as nodes expand and collapse.
	const { visibleIds, parentId, hasChildrenMap, disabledMap } =
		React.useMemo(() => {
			const visible: string[] = [];
			const parent: Record<string, string | undefined> = {};
			const childrenMap: Record<string, boolean> = {};
			const disabled: Record<string, boolean> = {};

			const walk = (items: TreeItem[], parent_id: string | undefined) => {
				for (const item of items) {
					parent[item.id] = parent_id;
					childrenMap[item.id] = !!item.children?.length;
					disabled[item.id] = !!item.disabled;
					visible.push(item.id);
					if (item.children?.length && expandedIds.has(item.id)) {
						walk(item.children, item.id);
					}
				}
			};
			walk(data, undefined);
			return {
				visibleIds: visible,
				parentId: parent,
				hasChildrenMap: childrenMap,
				disabledMap: disabled,
			};
		}, [data, expandedIds]);

	// Roving tabindex: exactly one visible, enabled node (the active one, else
	// the first) is in the tab order. Disabled nodes are never focusable.
	const effectiveActiveId = React.useMemo(() => {
		if (activeId && visibleIds.includes(activeId) && !disabledMap[activeId]) {
			return activeId;
		}
		return visibleIds.find((id) => !disabledMap[id]) ?? null;
	}, [activeId, visibleIds, disabledMap]);

	const registerNode = React.useCallback(
		(id: string, element: HTMLLIElement | null) => {
			if (element) nodeRefs.current.set(id, element);
			else nodeRefs.current.delete(id);
		},
		[],
	);

	const focusNode = React.useCallback((id: string) => {
		nodeRefs.current.get(id)?.focus();
	}, []);

	const navigate = React.useCallback(
		(id: string, key: string) => {
			const index = visibleIds.indexOf(id);
			if (index === -1) return;

			// walk visible nodes in a direction, skipping disabled ones
			const step = (from: number, delta: number) => {
				for (let i = from; i >= 0 && i < visibleIds.length; i += delta) {
					if (!disabledMap[visibleIds[i]]) return visibleIds[i];
				}
				return undefined;
			};

			let target: string | undefined;
			switch (key) {
				case "ArrowDown":
					target = step(index + 1, 1);
					break;
				case "ArrowUp":
					target = step(index - 1, -1);
					break;
				case "Home":
					target = step(0, 1);
					break;
				case "End":
					target = step(visibleIds.length - 1, -1);
					break;
				case "ArrowRight":
					if (!hasChildrenMap[id]) return;
					if (expandedIds.has(id)) {
						// first child is the next visible node when expanded
						target = step(index + 1, 1);
					} else {
						handleToggle(id);
						return;
					}
					break;
				case "ArrowLeft":
					if (hasChildrenMap[id] && expandedIds.has(id)) {
						handleToggle(id);
						return;
					}
					target = parentId[id];
					if (target && disabledMap[target]) target = undefined;
					break;
				default:
					return;
			}

			if (target && target !== id) {
				setActiveId(target);
				focusNode(target);
			}
		},
		[visibleIds, hasChildrenMap, disabledMap, expandedIds, parentId, focusNode],
	);

	const contextValue = React.useMemo<TreeViewContextValue>(
		() => ({
			selected: currentSelected,
			expanded: expandedIds,
			activeId: effectiveActiveId,
			multiSelect,
			onSelect: handleSelect,
			onToggle: handleToggle,
			setActiveId,
			registerNode,
			focusNode,
			navigate,
		}),
		[
			currentSelected,
			expandedIds,
			effectiveActiveId,
			multiSelect,
			registerNode,
			focusNode,
			navigate,
		],
	);

	return (
		<TreeViewContext.Provider value={contextValue}>
			<ul
				role="tree"
				data-slot="tree-view"
				aria-multiselectable={multiSelect}
				className={cn("space-y-0.5 p-1", className)}
				{...props}
			>
				{data.map((item) => (
					<TreeNode key={item.id} item={item} level={0} />
				))}
			</ul>
		</TreeViewContext.Provider>
	);
}

export { TreeView };
