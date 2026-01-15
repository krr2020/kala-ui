import { describe, expect, it } from "vitest";
import { cn } from "../lib/utils";

describe("cn utility", () => {
	it("should merge class names", () => {
		const result = cn("px-4", "py-2");
		expect(result).toBe("px-4 py-2");
	});

	it("should handle conditional classes", () => {
		const isActive = true;
		const isInactive = false;
		const result = cn("base", isActive && "active", isInactive && "inactive");
		expect(result).toContain("base");
		expect(result).toContain("active");
		expect(result).not.toContain("inactive");
	});

	it("should override conflicting Tailwind CSS classes", () => {
		const result = cn("px-4", "px-8");
		expect(result).toBe("px-8");
	});

	it("should handle arrays of classes", () => {
		const result = cn(["px-4", "py-2"], "rounded");
		expect(result).toContain("px-4");
		expect(result).toContain("py-2");
		expect(result).toContain("rounded");
	});

	it("should handle undefined and null values", () => {
		const result = cn("base", undefined, null, "active");
		expect(result).toContain("base");
		expect(result).toContain("active");
	});

	it("should handle objects with boolean values", () => {
		const result = cn("base", { active: true, disabled: false });
		expect(result).toContain("base");
		expect(result).toContain("active");
		expect(result).not.toContain("disabled");
	});
});
