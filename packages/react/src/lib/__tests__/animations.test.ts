import { describe, expect, it } from "vitest";
import {
	animationPresets,
	buildAnimationClass,
	transitionClasses,
} from "../animations";

describe("animations", () => {
	describe("buildAnimationClass", () => {
		it("should build basic animation class", () => {
			const result = buildAnimationClass("fadeIn");
			expect(result).toContain("animate-fade-in");
			expect(result).toContain("duration-200");
			expect(result).toContain("ease-in-out");
		});

		it("should build animation class with custom duration", () => {
			const result = buildAnimationClass("fadeIn", { duration: "fast" });
			expect(result).toContain("animate-fade-in");
			expect(result).toContain("duration-150");
		});

		it("should build animation class with custom timing", () => {
			const result = buildAnimationClass("slideInFromLeft", {
				timing: "bounce",
			});
			expect(result).toContain("animate-slide-in-from-left");
			expect(result).toContain("ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]");
		});

		it("should build animation class with additional classes", () => {
			const result = buildAnimationClass("scaleIn", {
				additionalClasses: "opacity-50",
			});
			expect(result).toContain("animate-scale-in");
			expect(result).toContain("opacity-50");
		});
	});

	describe("animationPresets", () => {
		it("should have fadeIn preset", () => {
			expect(animationPresets.fadeIn).toBe("animate-fade-in");
		});

		it("should have slide transitions", () => {
			expect(animationPresets.slideInFromLeft).toBe(
				"animate-slide-in-from-left",
			);
			expect(animationPresets.slideInFromRight).toBe(
				"animate-slide-in-from-right",
			);
			expect(animationPresets.slideInFromTop).toBe("animate-slide-in-from-top");
			expect(animationPresets.slideInFromBottom).toBe(
				"animate-slide-in-from-bottom",
			);
		});

		it("should have scale transitions", () => {
			expect(animationPresets.scaleIn).toBe("animate-scale-in");
			expect(animationPresets.scaleOut).toBe("animate-scale-out");
		});
	});

	describe("transitionClasses", () => {
		it("should have hover transition class", () => {
			expect(transitionClasses.hover).toContain("transition-all");
			expect(transitionClasses.hover).toContain("duration-200");
		});

		it("should have colors transition class", () => {
			expect(transitionClasses.colors).toContain(
				"transition-[color,background-color,border-color]",
			);
		});

		it("should have modal transition class", () => {
			expect(transitionClasses.modal).toContain(
				"transition-[opacity,transform]",
			);
			expect(transitionClasses.modal).toContain("duration-300");
		});
	});
});
