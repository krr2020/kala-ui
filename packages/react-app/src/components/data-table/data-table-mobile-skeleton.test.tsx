import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTableMobileSkeleton } from "./data-table-mobile-skeleton";

describe("DataTableMobileSkeleton", () => {
	it("renders the requested number of card-shaped rows", () => {
		const { container } = render(<DataTableMobileSkeleton rows={3} />);
		const marker = container.querySelector(
			'[data-kala-component="data-table-mobile-skeleton"]',
		);
		expect(marker).not.toBeNull();
		expect(marker?.children.length).toBe(3);
	});

	it("shows a leading checkbox skeleton only when selection is enabled", () => {
		const { container } = render(
			<DataTableMobileSkeleton rows={2} showSelection />,
		);
		const rows = container.querySelectorAll(
			'[data-kala-component="data-table-mobile-skeleton"] > div',
		);
		expect(rows[0].children.length).toBe(2);
		const withoutSelection = render(<DataTableMobileSkeleton rows={2} />);
		const plainRows = withoutSelection.container.querySelectorAll(
			'[data-kala-component="data-table-mobile-skeleton"] > div',
		);
		expect(plainRows[0].children.length).toBe(1);
		expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
	});
});
