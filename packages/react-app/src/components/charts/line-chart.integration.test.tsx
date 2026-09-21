import { render } from "@testing-library/react";
import { KalaProvider } from "@kala-ui/react";
import { describe, expect, it } from "vitest";
import { LineChart } from "./line-chart";

/**
 * Cross-package seam: react-app chart wrappers consume the core contract —
 * useSlotStyles resolution + KalaProvider context defaults flow across the
 * package boundary, and the wrapper marker survives Chart's rendering.
 */
describe("react-app ↔ react chart seam", () => {
	it("applies instance slotStyles.root on the chart wrapper", () => {
		render(
			<LineChart
				series={[{ name: "A", data: [1, 2] }]}
				slotStyles={{ root: "seam-root" }}
			/>,
		);
		const root = document.querySelector(
			'[data-kala-component="charts-line-chart"]',
		) as HTMLElement;
		expect(root.className).toContain("w-full");
		expect(root.className).toContain("seam-root");
	});

	it("KalaProvider context default flows across the package boundary", () => {
		render(
			<KalaProvider defaultSlotStyles={{ charts: { root: "ctx-root" } }}>
				<LineChart series={[{ name: "A", data: [1, 2] }]} />
			</KalaProvider>,
		);
		const root = document.querySelector(
			'[data-kala-component="charts-line-chart"]',
		) as HTMLElement;
		expect(root.className).toContain("ctx-root");
	});

	it("instance slot beats the context default per part", () => {
		render(
			<KalaProvider defaultSlotStyles={{ charts: { root: "ctx-root" } }}>
				<LineChart
					series={[{ name: "A", data: [1, 2] }]}
					slotStyles={{ root: "inst-root" }}
				/>
			</KalaProvider>,
		);
		const root = document.querySelector(
			'[data-kala-component="charts-line-chart"]',
		) as HTMLElement;
		expect(root.className).toContain("inst-root");
		expect(root.className).not.toContain("ctx-root");
	});
});
