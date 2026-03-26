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

export interface TreeViewProps {
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
	/** Additional className */
	className?: string;
}

interface TreeViewContextValue {
	selected: Set<string>;
	expanded: Set<string>;
	onSelect: (id: string) => void;
	onToggle: (id: string) => void;
	multiSelect: boolean;
}

const TreeViewContext = React.createContext<TreeViewContextValue>({
	selected: new Set(),
	expanded: new Set(),
	onSelect: () => {},
	onToggle: () => {},
	multiSelect: false,
});

interface TreeNodeProps {
	item: TreeItem;
	level: number;
}

function TreeNode({ item, level }: TreeNodeProps) {
	const { selected, expanded, onSelect, onToggle } =
		React.useContext(TreeViewContext);

	const isSelected = selected.has(item.id);
	const isExpanded = expanded.has(item.id);
	const hasChildren = !!item.children?.length;

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (item.disabled) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (hasChildren) onToggle(item.id);
			else onSelect(item.id);
		} else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
			e.preventDefault();
			onToggle(item.id);
		} else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
			e.preventDefault();
			onToggle(item.id);
		}
	};

	return (
		<li
			role="treeitem"
			tabIndex={item.disabled ? -1 : 0}
			aria-expanded={hasChildren ? isExpanded : undefined}
			aria-selected={isSelected}
			aria-disabled={item.disabled}
		>
			<div
				data-slot="tree-node"
				data-selected={isSelected || undefined}
				tabIndex={item.disabled ? -1 : 0}
				onClick={() => {
					if (item.disabled) return;
					if (hasChildren) onToggle(item.id);
					onSelect(item.id);
				}}
				onKeyDown={handleKeyDown}
				style={{ paddingLeft: `${level * 1.25}rem` }}
				className={cn(
					"flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					isSelected && "bg-accent text-accent-foreground font-medium",
					item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
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
				<ul className="mt-0.5">
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
}: TreeViewProps) {
	const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => {
		if (!selectedProp) return new Set();
		return new Set(Array.isArray(selectedProp) ? selectedProp : [selectedProp]);
	});

	const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
		() => new Set(defaultExpanded),
	);

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

	return (
		<TreeViewContext.Provider
			value={{
				selected: currentSelected,
				expanded: expandedIds,
				onSelect: handleSelect,
				onToggle: handleToggle,
				multiSelect,
			}}
		>
			<div
				role="tree"
				data-slot="tree-view"
				aria-multiselectable={multiSelect}
				className={cn("space-y-0.5 p-1", className)}
			>
				{data.map((item) => (
					<TreeNode key={item.id} item={item} level={0} />
				))}
			</div>
		</TreeViewContext.Provider>
	);
}

export { TreeView };
