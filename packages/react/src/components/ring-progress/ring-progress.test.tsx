import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RingProgress } from "./ring-progress";

describe("RingProgress", () => {
	it("renders label", () => {
		render(<RingProgress value={50} label="50%" />);
		expect(screen.getByText("50%")).toBeInTheDocument();
	});

	it("renders correctly with sections", () => {
		const { container } = render(
			<RingProgress
				sections={[
					{ value: 20, color: "red" },
					{ value: 30, color: "blue" },
				]}
			/>,
		);
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBe(3);
	});

	it("renders with single value", () => {
		const { container } = render(<RingProgress value={75} />);
		const circles = container.querySelectorAll("circle");
		// 1 background + 1 segment
		expect(circles.length).toBe(2);
	});

	it("renders without label", () => {
		const { container } = render(<RingProgress value={50} />);
		expect(container.querySelector(".absolute")).toBeNull();
	});

	it("renders with custom size", () => {
		const { container } = render(<RingProgress value={50} size={200} />);
		const svg = container.querySelector("svg");
		expect(svg).toHaveAttribute("width", "200");
		expect(svg).toHaveAttribute("height", "200");
	});

	it("renders with custom thickness", () => {
		const { container } = render(<RingProgress value={50} thickness={8} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("renders with custom color", () => {
		const { container } = render(<RingProgress value={50} color="text-red-500" />);
		const circles = container.querySelectorAll("circle");
		expect(circles[1]).toHaveClass("text-red-500");
	});

	it("renders with custom empty color", () => {
		const { container } = render(<RingProgress value={50} emptyColor="text-gray-200" />);
		const circles = container.querySelectorAll("circle");
		expect(circles[0]).toHaveClass("text-gray-200");
	});

	it("renders with round caps", () => {
		const { container } = render(<RingProgress value={50} roundCaps />);
		const circles = container.querySelectorAll("circle");
		expect(circles[1]).toHaveAttribute("stroke-linecap", "round");
	});

	it("renders without round caps", () => {
		const { container } = render(<RingProgress value={50} roundCaps={false} />);
		const circles = container.querySelectorAll("circle");
		expect(circles[1]).toHaveAttribute("stroke-linecap", "butt");
	});

	it("renders with no value and no sections", () => {
		const { container } = render(<RingProgress />);
		const circles = container.querySelectorAll("circle");
		// Only background circle
		expect(circles.length).toBe(1);
	});

	it("applies custom className", () => {
		const { container } = render(<RingProgress value={50} className="custom-ring" />);
		expect(container.firstChild).toHaveClass("custom-ring");
	});

	it("renders with sections including tooltip", () => {
		const { container } = render(
			<RingProgress
				sections={[
					{ value: 50, color: "text-red-500", tooltip: "Half" },
					{ value: 50, color: "text-blue-500", tooltip: "Other Half" },
				]}
			/>,
		);
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBe(3);
	});
});
