import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid, GridItem } from "./grid";

describe("Grid", () => {
	it("renders correctly", () => {
		render(
			<Grid data-testid="grid" cols={3}>
				<div>1</div>
				<div>2</div>
				<div>3</div>
			</Grid>,
		);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("grid");
		expect(grid).toHaveClass("grid-cols-3");
	});

	it("applies gap", () => {
		render(<Grid data-testid="grid" gap={4} />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("gap-4");
	});
});

describe("GridItem", () => {
	it("applies colSpan", () => {
		render(<GridItem data-testid="item" colSpan={2} />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-span-2");
	});

	it("applies rowSpan", () => {
		render(<GridItem data-testid="item" rowSpan={2} />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("row-span-2");
	});
});
