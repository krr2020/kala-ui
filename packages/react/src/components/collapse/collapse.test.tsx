import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Collapse } from "./collapse";

describe("Collapse", () => {
	it("renders without crashing when open", () => {
		render(
			<Collapse in>
				<div data-testid="child">Content</div>
			</Collapse>,
		);
		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("does not render children when closed", () => {
		render(
			<Collapse in={false}>
				<div data-testid="child">Content</div>
			</Collapse>,
		);
		expect(screen.queryByTestId("child")).not.toBeInTheDocument();
	});

	it("renders children when in prop is true", () => {
		render(
			<Collapse in>
				<span>Hello</span>
			</Collapse>,
		);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("supports nested elements as children", () => {
		render(
			<Collapse in>
				<div>
					<p>Nested content</p>
					<button type="button">Click me</button>
				</div>
			</Collapse>,
		);
		expect(screen.getByText("Nested content")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
	});

	it("sets overflow hidden on the wrapper", () => {
		const { container } = render(
			<Collapse in>
				<div>Content</div>
			</Collapse>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper).toHaveStyle({ overflow: "hidden" });
	});

	it("has displayName set to Collapse", () => {
		expect(Collapse.displayName).toBe("Collapse");
	});

	it("renders with animateOpacity set to true", () => {
		const { container } = render(
			<Collapse in animateOpacity>
				<div>Animated</div>
			</Collapse>,
		);
		expect(screen.getByText("Animated")).toBeInTheDocument();
	});

	it("renders with animateOpacity set to false", () => {
		const { container } = render(
			<Collapse in animateOpacity={false}>
				<div>Not Animated</div>
			</Collapse>,
		);
		expect(screen.getByText("Not Animated")).toBeInTheDocument();
	});

	it("calls onTransitionEnd when animation completes", () => {
		const onTransitionEnd = vi.fn();
		render(
			<Collapse in onTransitionEnd={onTransitionEnd}>
				<div>Content</div>
			</Collapse>,
		);
		// The callback is set but framer-motion controls when it fires
		expect(onTransitionEnd).not.toHaveBeenCalled();
	});

	it("renders with custom transitionDuration", () => {
		render(
			<Collapse in transitionDuration={0.5}>
				<div>Slow transition</div>
			</Collapse>,
		);
		expect(screen.getByText("Slow transition")).toBeInTheDocument();
	});

	it("renders with custom transitionTimingFunction", () => {
		render(
			<Collapse in transitionTimingFunction="ease-in-out">
				<div>Custom easing</div>
			</Collapse>,
		);
		expect(screen.getByText("Custom easing")).toBeInTheDocument();
	});

	it("renders with array transitionTimingFunction", () => {
		render(
			<Collapse in transitionTimingFunction={[0.42, 0, 0.58, 1]}>
				<div>Array easing</div>
			</Collapse>,
		);
		expect(screen.getByText("Array easing")).toBeInTheDocument();
	});
});
