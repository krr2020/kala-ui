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
});
