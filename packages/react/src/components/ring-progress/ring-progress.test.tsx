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
		// Check for svg circles (1 background + 2 segments)
		const circles = container.querySelectorAll("circle");
		expect(circles.length).toBe(3);
	});
});
