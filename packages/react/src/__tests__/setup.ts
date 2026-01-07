import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock ResizeObserver for components that use it (Tooltip, Popover, etc.)
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock PointerEvent for Radix UI components
global.PointerEvent = class PointerEvent extends Event {
	button: number;
	ctrlKey: boolean;
	pointerType: string;

	constructor(type: string, params: PointerEventInit = {}) {
		super(type, params);
		this.button = params.button || 0;
		this.ctrlKey = params.ctrlKey || false;
		this.pointerType = params.pointerType || "mouse";
	}
} as unknown as typeof PointerEvent;

// Mock hasPointerCapture for Radix UI Select
if (typeof Element !== "undefined") {
	Element.prototype.hasPointerCapture = () => false;
	Element.prototype.setPointerCapture = () => {};
	Element.prototype.releasePointerCapture = () => {};

	// Mock scrollIntoView for Radix UI Select
	Element.prototype.scrollIntoView = () => {};
}
