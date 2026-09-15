import { describe, expect, it } from "vitest";
import { barHeights, donutArcs, sparklinePoints } from "../chart-geometry";

describe("barHeights", () => {
	it("returns an empty array for empty data", () => {
		expect(barHeights([], 100)).toEqual([]);
	});

	it("scales values proportionally to the max", () => {
		expect(barHeights([4, 8, 2], 100)).toEqual([50, 100, 25]);
	});

	it("clamps negative values to the minimum bar", () => {
		expect(barHeights([-5, 10], 100)).toEqual([2, 100]);
	});

	it("renders minimal bars for all-zero data", () => {
		expect(barHeights([0, 0], 100)).toEqual([2, 2]);
	});

	it("treats NaN entries as zero", () => {
		expect(barHeights([Number.NaN, 10], 100)).toEqual([2, 100]);
	});
});

describe("donutArcs", () => {
	it("returns no arcs for empty data", () => {
		expect(donutArcs([])).toEqual([]);
	});

	it("returns no arcs when the total is zero", () => {
		expect(donutArcs([0, 0])).toEqual([]);
	});

	it("returns a single full arc for one complete segment", () => {
		expect(donutArcs([100])).toEqual([{ offset: 0, fraction: 1 }]);
	});

	it("splits evenly for equal halves", () => {
		expect(donutArcs([1, 1])).toEqual([
			{ offset: 0, fraction: 0.5 },
			{ offset: 0.5, fraction: 0.5 },
		]);
	});

	it("offsets each segment where the previous ended", () => {
		expect(donutArcs([1, 2, 1])).toEqual([
			{ offset: 0, fraction: 0.25 },
			{ offset: 0.25, fraction: 0.5 },
			{ offset: 0.75, fraction: 0.25 },
		]);
	});

	it("clamps negatives to zero-length arcs", () => {
		expect(donutArcs([-10, 10])).toEqual([
			{ offset: 0, fraction: 0 },
			{ offset: 0, fraction: 1 },
		]);
	});
});

describe("sparklinePoints", () => {
	it("yields an empty string for empty data", () => {
		expect(sparklinePoints([], 100, 40)).toBe("");
	});

	it("maps each datum across the width", () => {
		expect(sparklinePoints([0, 10, 5], 100, 40)).toBe("0,38 50,2 100,20");
	});

	it("renders an all-equal series as a flat centered line", () => {
		expect(sparklinePoints([5, 5, 5], 100, 40)).toBe("0,20 50,20 100,20");
	});

	it("duplicates a single point into a flat line", () => {
		expect(sparklinePoints([7], 100, 40)).toBe("0,20 100,20");
	});

	it("drops NaN entries before generating points", () => {
		expect(
			sparklinePoints([1, Number.NaN, 3], 100, 40).split(" "),
		).toHaveLength(2);
	});
});
