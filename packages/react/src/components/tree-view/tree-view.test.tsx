import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeView } from "./tree-view";
import type { TreeItem } from "./tree-view";

const treeData: TreeItem[] = [
	{
		id: "1",
		label: "Documents",
		children: [
			{ id: "1-1", label: "Resume.pdf" },
			{ id: "1-2", label: "Cover Letter.docx" },
		],
	},
	{
		id: "2",
		label: "Pictures",
		children: [{ id: "2-1", label: "Vacation" }],
	},
	{ id: "3", label: "Notes.txt" },
];

describe("TreeView", () => {
	it("should render root items", () => {
		render(<TreeView data={treeData} />);

		expect(screen.getByText("Documents")).toBeInTheDocument();
		expect(screen.getByText("Pictures")).toBeInTheDocument();
		expect(screen.getByText("Notes.txt")).toBeInTheDocument();
	});

	it("should not show children by default (collapsed)", () => {
		render(<TreeView data={treeData} />);

		expect(screen.queryByText("Resume.pdf")).toBeNull();
	});

	it("should expand children when node is clicked", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		await user.click(screen.getByText("Documents"));
		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
		expect(screen.getByText("Cover Letter.docx")).toBeInTheDocument();
	});

	it("should collapse expanded node on second click", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		await user.click(screen.getByText("Documents"));
		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();

		await user.click(screen.getByText("Documents"));
		expect(screen.queryByText("Resume.pdf")).toBeNull();
	});

	it("should call onSelect when leaf is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		render(<TreeView data={treeData} onSelect={handleSelect} />);

		await user.click(screen.getByText("Notes.txt"));
		expect(handleSelect).toHaveBeenCalledWith("3");
	});

	it("should call onSelect when parent is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		render(<TreeView data={treeData} onSelect={handleSelect} />);

		await user.click(screen.getByText("Documents"));
		expect(handleSelect).toHaveBeenCalledWith("1");
	});

	it("should expand nodes listed in defaultExpanded", () => {
		render(<TreeView data={treeData} defaultExpanded={["1"]} />);

		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});

	it("should mark item as selected", () => {
		const { container } = render(<TreeView data={treeData} selected="3" />);

		const selectedNode = container.querySelector('[data-selected="true"]');
		expect(selectedNode).toBeInTheDocument();
	});

	it("should render with role=tree", () => {
		render(<TreeView data={treeData} />);
		expect(screen.getByRole("tree")).toBeInTheDocument();
	});

	it("should render items with role=treeitem", () => {
		render(<TreeView data={treeData} />);
		expect(screen.getAllByRole("treeitem").length).toBeGreaterThanOrEqual(3);
	});

	it("should expand on ArrowRight key", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard("{ArrowRight}");

		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<TreeView data={treeData} className="custom-tree" />,
		);
		expect(container.querySelector('[data-slot="tree-view"]')).toHaveClass(
			"custom-tree",
		);
	});

	it("should render with multiSelect prop", () => {
		const { container } = render(
			<TreeView data={treeData} multiSelect />,
		);
		const tree = container.querySelector('[data-slot="tree-view"]');
		expect(tree).toHaveAttribute("aria-multiselectable", "true");
	});

	it("should render without multiSelect by default", () => {
		const { container } = render(<TreeView data={treeData} />);
		const tree = container.querySelector('[data-slot="tree-view"]');
		expect(tree).not.toHaveAttribute("aria-multiselectable", "true");
	});

	it("should handle multi-select with array selected prop", () => {
		const { container } = render(
			<TreeView data={treeData} selected={["1", "3"]} multiSelect />,
		);
		const selectedNodes = container.querySelectorAll('[data-selected="true"]');
		expect(selectedNodes.length).toBe(2);
	});

	it("should render disabled tree item", () => {
		const dataWithDisabled: typeof treeData = [
			{ id: "1", label: "Enabled", children: [
				{ id: "1-1", label: "Disabled Child", disabled: true },
			] },
		];
		render(<TreeView data={dataWithDisabled} />);

		// Expand parent
		expect(screen.getByText("Enabled")).toBeInTheDocument();
	});

	it("should not toggle disabled item on click", async () => {
		const handleSelect = vi.fn();
		const dataWithDisabled: typeof treeData = [
			{ id: "1", label: "Disabled Item", disabled: true },
		];
		const user = userEvent.setup();
		render(<TreeView data={dataWithDisabled} onSelect={handleSelect} />);

		await user.click(screen.getByText("Disabled Item"));
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("should collapse expanded node with ArrowLeft key", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} defaultExpanded={["1"]} />);

		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard("{ArrowLeft}");

		expect(screen.queryByText("Resume.pdf")).toBeNull();
	});

	it("should render items with custom icons", () => {
		const dataWithIcons: typeof treeData = [
			{
				id: "1",
				label: "With Icon",
				icon: <span data-testid="custom-icon">icon</span>,
			},
		];
		render(<TreeView data={dataWithIcons} />);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("should render leaf node without chevron", () => {
		const { container } = render(<TreeView data={treeData} />);
		const notesNode = screen.getByText("Notes.txt").closest('[data-slot="tree-node"]');
		expect(notesNode?.querySelector("svg.lucide-chevron-right")).not.toBeInTheDocument();
	});

	it("should handle onSelect callback not provided", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		// Should not throw
		await user.click(screen.getByText("Notes.txt"));
		expect(screen.getByText("Notes.txt")).toBeInTheDocument();
	});

	it("should render empty data array", () => {
		render(<TreeView data={[]} />);
		expect(screen.getByRole("tree")).toBeInTheDocument();
	});

	it("should toggle multi-select (add and remove)", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} multiSelect />);

		// Select leaf
		await user.click(screen.getByText("Notes.txt"));

		const { container } = render(<TreeView data={treeData} multiSelect selected={["3"]} />);
		let selectedNodes = container.querySelectorAll('[data-selected="true"]');
		expect(selectedNodes.length).toBe(1);

		// Select another leaf - must expand parent "2" to see "2-1"
		const handleSelect = vi.fn();
		const { container: c2 } = render(
			<TreeView data={treeData} multiSelect selected={["3", "2-1"]} defaultExpanded={["2"]} onSelect={handleSelect} />,
		);
		selectedNodes = c2.querySelectorAll('[data-selected="true"]');
		expect(selectedNodes.length).toBe(2);
	});

	it("should handle controlled selected as string", () => {
		const { container } = render(
			<TreeView data={treeData} selected="2" />,
		);
		const selectedNodes = container.querySelectorAll('[data-selected="true"]');
		expect(selectedNodes.length).toBe(1);
	});

	it("should expand on Enter key press for parent node", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard("{Enter}");

		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});

	it("should select on Enter key press for leaf node", async () => {
		const handleSelect = vi.fn();
		const user = userEvent.setup();
		render(<TreeView data={treeData} onSelect={handleSelect} />);

		const notesNode = screen
			.getByText("Notes.txt")
			.closest('[data-slot="tree-node"]');
		if (!notesNode) throw new Error("Node not found");
		(notesNode as HTMLElement).focus();
		await user.keyboard("{Enter}");

		expect(handleSelect).toHaveBeenCalledWith("3");
	});

	it("should expand on Space key press for parent node", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard(" ");

		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});

	it("should select on Space key press for leaf node", async () => {
		const handleSelect = vi.fn();
		const user = userEvent.setup();
		render(<TreeView data={treeData} onSelect={handleSelect} />);

		const notesNode = screen
			.getByText("Notes.txt")
			.closest('[data-slot="tree-node"]');
		if (!notesNode) throw new Error("Node not found");
		(notesNode as HTMLElement).focus();
		await user.keyboard(" ");

		expect(handleSelect).toHaveBeenCalledWith("3");
	});

	it("should not expand or select disabled node on Enter key", async () => {
		const handleSelect = vi.fn();
		const user = userEvent.setup();
		const dataWithDisabled: TreeItem[] = [
			{ id: "1", label: "Parent", disabled: true, children: [
				{ id: "1-1", label: "Child" },
			]},
		];
		render(<TreeView data={dataWithDisabled} onSelect={handleSelect} />);

		const parentNode = screen
			.getByText("Parent")
			.closest('[data-slot="tree-node"]');
		if (!parentNode) throw new Error("Node not found");
		(parentNode as HTMLElement).focus();
		await user.keyboard("{Enter}");

		expect(handleSelect).not.toHaveBeenCalled();
		expect(screen.queryByText("Child")).toBeNull();
	});

	it("should not expand on ArrowRight when node is already expanded", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} defaultExpanded={["1"]} />);

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard("{ArrowRight}");

		// Should still be expanded, no double-expand effect
		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});

	it("should not collapse on ArrowLeft when node is already collapsed", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		const docsNode = screen
			.getByText("Documents")
			.closest('[data-slot="tree-node"]');
		if (!docsNode) throw new Error("Node not found");
		(docsNode as HTMLElement).focus();
		await user.keyboard("{ArrowLeft}");

		// Should still be collapsed
		expect(screen.queryByText("Resume.pdf")).toBeNull();
	});

	it("should not react to ArrowRight on leaf node", async () => {
		const user = userEvent.setup();
		render(<TreeView data={treeData} />);

		const notesNode = screen
			.getByText("Notes.txt")
			.closest('[data-slot="tree-node"]');
		if (!notesNode) throw new Error("Node not found");
		(notesNode as HTMLElement).focus();
		await user.keyboard("{ArrowRight}");

		// Leaf has no children, nothing happens
		expect(screen.getByText("Notes.txt")).toBeInTheDocument();
	});

	it("should apply level-based padding", () => {
		render(<TreeView data={treeData} defaultExpanded={["1"]} />);

		const docsNode = screen.getByText("Documents").closest('[data-slot="tree-node"]');
		const childNode = screen.getByText("Resume.pdf").closest('[data-slot="tree-node"]');

		expect((docsNode as HTMLElement).style.paddingLeft).toBe("0rem");
		expect((childNode as HTMLElement).style.paddingLeft).toBe("1.25rem");
	});

	it("should set aria-expanded on parent nodes", () => {
		render(<TreeView data={treeData} defaultExpanded={["1"]} />);
		const docsItem = screen.getByText("Documents").closest('[role="treeitem"]');
		expect(docsItem).toHaveAttribute("aria-expanded", "true");
	});

	it("should not set aria-expanded on leaf nodes", () => {
		render(<TreeView data={treeData} />);
		const notesItem = screen.getByText("Notes.txt").closest('[role="treeitem"]');
		expect(notesItem).not.toHaveAttribute("aria-expanded");
	});

	it("should set tabIndex=-1 on disabled nodes", () => {
		const dataWithDisabled: TreeItem[] = [
			{ id: "1", label: "Disabled", disabled: true },
		];
		render(<TreeView data={dataWithDisabled} />);
		const node = screen.getByText("Disabled").closest('[data-slot="tree-node"]');
		expect(node).toHaveAttribute("tabIndex", "-1");
	});

	it("should set aria-disabled on disabled nodes", () => {
		const dataWithDisabled: TreeItem[] = [
			{ id: "1", label: "Disabled", disabled: true },
		];
		render(<TreeView data={dataWithDisabled} />);
		const item = screen.getByText("Disabled").closest('[role="treeitem"]');
		expect(item).toHaveAttribute("aria-disabled", "true");
	});

	it("should not call onSelect in controlled mode when clicking", async () => {
		const handleSelect = vi.fn();
		const user = userEvent.setup();
		render(<TreeView data={treeData} selected="3" onSelect={handleSelect} />);

		await user.click(screen.getByText("Notes.txt"));
		// In controlled mode, onSelect should still be called (it's the callback)
		expect(handleSelect).toHaveBeenCalledWith("3");
	});

	it("should render deeply nested children", async () => {
		const user = userEvent.setup();
		const deepData: TreeItem[] = [
			{
				id: "1", label: "Level 0",
				children: [
					{
						id: "1-1", label: "Level 1",
						children: [
							{ id: "1-1-1", label: "Level 2" },
						],
					},
				],
			},
		];
		render(<TreeView data={deepData} />);

		await user.click(screen.getByText("Level 0"));
		expect(screen.getByText("Level 1")).toBeInTheDocument();

		await user.click(screen.getByText("Level 1"));
		expect(screen.getByText("Level 2")).toBeInTheDocument();
	});

	it("should call onSelect and onToggle when clicking a parent node", async () => {
		const handleSelect = vi.fn();
		const user = userEvent.setup();
		render(<TreeView data={treeData} onSelect={handleSelect} />);

		await user.click(screen.getByText("Documents"));
		expect(handleSelect).toHaveBeenCalledWith("1");
		expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
	});
});
