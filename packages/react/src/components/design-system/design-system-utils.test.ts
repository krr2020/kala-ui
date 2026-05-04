import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { designSystemComponents } from "./design-system-utils";
import type { ComponentMetadata, CategoryMetadata } from "./design-system-utils";

describe("designSystemComponents", () => {
	it("should be a non-empty array", () => {
		expect(Array.isArray(designSystemComponents)).toBe(true);
		expect(designSystemComponents.length).toBeGreaterThan(0);
	});

	it("should have 20 components", () => {
		expect(designSystemComponents.length).toBe(20);
	});

	it("should include Button as the first component", () => {
		expect(designSystemComponents[0].name).toBe("Button");
	});

	it("should include Toggle as the last component", () => {
		const last = designSystemComponents[designSystemComponents.length - 1];
		expect(last.name).toBe("Toggle");
	});

	it("should have required fields on each component", () => {
		for (const component of designSystemComponents) {
			expect(component).toHaveProperty("name");
			expect(component).toHaveProperty("description");
			expect(component).toHaveProperty("docPath");
			expect(typeof component.name).toBe("string");
			expect(typeof component.description).toBe("string");
			expect(typeof component.docPath).toBe("string");
			expect(component.name.length).toBeGreaterThan(0);
		}
	});

	it("should have unique component names", () => {
		const names = designSystemComponents.map((c) => c.name);
		const uniqueNames = new Set(names);
		expect(uniqueNames.size).toBe(names.length);
	});

	it("should have docPaths starting with /docs/", () => {
		for (const component of designSystemComponents) {
			expect(component.docPath).toMatch(/^\/docs\//);
		}
	});

	it("should include expected components", () => {
		const names = designSystemComponents.map((c) => c.name);
		expect(names).toContain("Button");
		expect(names).toContain("Input");
		expect(names).toContain("Textarea");
		expect(names).toContain("Checkbox");
		expect(names).toContain("Switch");
		expect(names).toContain("Radio Group");
		expect(names).toContain("Select");
		expect(names).toContain("Alert");
		expect(names).toContain("Spinner");
		expect(names).toContain("Skeleton");
		expect(names).toContain("Card");
		expect(names).toContain("Badge");
		expect(names).toContain("Avatar");
		expect(names).toContain("Table");
		expect(names).toContain("Breadcrumbs");
		expect(names).toContain("Tabs");
		expect(names).toContain("Accordion");
		expect(names).toContain("Progress");
		expect(names).toContain("Slider");
		expect(names).toContain("Toggle");
	});

	it("should conform to ComponentMetadata type", () => {
		for (const component of designSystemComponents) {
			const meta: ComponentMetadata = component;
			expect(meta.name).toBeDefined();
			expect(meta.description).toBeDefined();
			expect(meta.docPath).toBeDefined();
		}
	});

	it("should allow constructing CategoryMetadata from components", () => {
		const category: CategoryMetadata = {
			name: "Test Category",
			description: "A test category",
			components: designSystemComponents.slice(0, 3),
		};
		expect(category.components.length).toBe(3);
		expect(category.name).toBe("Test Category");
	});
});
