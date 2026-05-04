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

	it("renders as div by default", () => {
		const { container } = render(<Grid data-testid="grid">Test</Grid>);
		expect(container.querySelector("div")).toBeInTheDocument();
	});

	it("renders as child element when asChild is true", () => {
		render(
			<Grid asChild data-testid="grid">
				<section>Grid Section</section>
			</Grid>,
		);
		const el = screen.getByTestId("grid");
		expect(el.tagName).toBe("SECTION");
	});

	it("applies col flow", () => {
		render(<Grid data-testid="grid" flow="col" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("grid-flow-col");
	});

	it("applies row dense flow", () => {
		render(<Grid data-testid="grid" flow="rowDense" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("grid-flow-row-dense");
	});

	it("applies col dense flow", () => {
		render(<Grid data-testid="grid" flow="colDense" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("grid-flow-col-dense");
	});

	it("applies align start", () => {
		render(<Grid data-testid="grid" align="start" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("items-start");
	});

	it("applies align center", () => {
		render(<Grid data-testid="grid" align="center" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("items-center");
	});

	it("applies justify center", () => {
		render(<Grid data-testid="grid" justify="center" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("justify-center");
	});

	it("applies justify between", () => {
		render(<Grid data-testid="grid" justify="between" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("justify-between");
	});

	it("applies cols none", () => {
		render(<Grid data-testid="grid" cols="none" />);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("grid-cols-none");
	});

	it("applies custom className", () => {
		render(
			<Grid data-testid="grid" className="my-grid">
				Content
			</Grid>,
		);
		const grid = screen.getByTestId("grid");
		expect(grid).toHaveClass("my-grid");
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

	it("renders as div by default", () => {
		const { container } = render(<GridItem data-testid="item">Test</GridItem>);
		expect(container.querySelector("div")).toBeInTheDocument();
	});

	it("renders as child element when asChild is true", () => {
		render(
			<GridItem asChild data-testid="item">
				<div>Item Content</div>
			</GridItem>,
		);
		const el = screen.getByTestId("item");
		expect(el.tagName).toBe("DIV");
	});

	it("applies colSpan full", () => {
		render(<GridItem data-testid="item" colSpan="full" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-span-full");
	});

	it("applies colSpan auto", () => {
		render(<GridItem data-testid="item" colSpan="auto" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-auto");
	});

	it("applies rowSpan full", () => {
		render(<GridItem data-testid="item" rowSpan="full" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("row-span-full");
	});

	it("applies rowSpan auto", () => {
		render(<GridItem data-testid="item" rowSpan="auto" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("row-auto");
	});

	it("applies colStart", () => {
		render(<GridItem data-testid="item" colStart={3} />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-start-3");
	});

	it("applies colStart auto", () => {
		render(<GridItem data-testid="item" colStart="auto" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-start-auto");
	});

	it("applies colEnd", () => {
		render(<GridItem data-testid="item" colEnd={5} />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-end-5");
	});

	it("applies colEnd auto", () => {
		render(<GridItem data-testid="item" colEnd="auto" />);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("col-end-auto");
	});

	it("applies custom className", () => {
		render(
			<GridItem data-testid="item" className="my-item">
				Content
			</GridItem>,
		);
		const item = screen.getByTestId("item");
		expect(item).toHaveClass("my-item");
	});
});
