import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress, ProgressBar, ProgressGroup } from "./progress";

describe("Progress", () => {
	describe("Accessibility", () => {
		it("should have progressbar role", () => {
			render(<Progress value={50} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toBeInTheDocument();
		});

		it("should have correct aria-valuenow", () => {
			render(<Progress value={75} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "75");
		});

		it("should have correct aria-valuemax", () => {
			render(<Progress value={50} max={100} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuemax", "100");
		});

		it("should support custom max value in aria attributes", () => {
			render(<Progress value={150} min={50} max={200} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "150");
			expect(progressbar).toHaveAttribute("aria-valuemax", "200");
		});

		it("should have accessible label when provided", () => {
			render(<Progress value={50} label="50%" size="lg" />);
			expect(screen.getByText("50%")).toBeInTheDocument();
		});

		it("should show percentage when showValue is true", () => {
			render(<Progress value={65} showValue size="lg" />);
			expect(screen.getByText("65%")).toBeInTheDocument();
		});
	});

	describe("Value Clamping", () => {
		it("should clamp negative values to min", () => {
			render(<Progress value={-10} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "0");
		});

		it("should clamp values exceeding max", () => {
			render(<Progress value={150} max={100} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "100");
		});

		it("should handle custom min/max range", () => {
			render(<Progress value={75} min={50} max={100} />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "75");
		});

		it("should handle missing value prop", () => {
			render(<Progress />);
			const progressbar = screen.getByRole("progressbar");
			expect(progressbar).toHaveAttribute("aria-valuenow", "0");
		});
	});

	describe("Visual Variants", () => {
		it("should apply default color", () => {
			const { container } = render(<Progress value={50} color="default" />);
			const root = container.querySelector("[data-state]");
			const indicator = root?.querySelector("div");
			expect(indicator).toHaveClass("bg-primary");
		});

		it("should apply success color", () => {
			const { container } = render(<Progress value={50} color="success" />);
			const root = container.querySelector("[data-state]");
			const indicator = root?.querySelector("div");
			expect(indicator).toHaveClass("bg-success");
		});

		it("should apply danger color", () => {
			const { container } = render(<Progress value={50} color="danger" />);
			const root = container.querySelector("[data-state]");
			const indicator = root?.querySelector("div");
			expect(indicator).toHaveClass("bg-destructive");
		});

		it("should apply small size", () => {
			const { container } = render(<Progress value={50} size="sm" />);
			const root = container.querySelector('[role="progressbar"]');
			expect(root).toHaveClass("h-1");
		});

		it("should apply medium size", () => {
			const { container } = render(<Progress value={50} size="md" />);
			const root = container.querySelector('[role="progressbar"]');
			expect(root).toHaveClass("h-2.5");
		});

		it("should apply large size", () => {
			const { container } = render(<Progress value={50} size="lg" />);
			const root = container.querySelector('[role="progressbar"]');
			expect(root).toHaveClass("h-4");
		});
	});

	describe("Striped and Animated", () => {
		it("should apply striped pattern when striped=true", () => {
			const { container } = render(<Progress value={50} striped />);
			const root = container.querySelector("[data-state]");
			const indicator = root?.querySelector("div");
			expect(indicator?.className).toContain("bg-[linear-gradient");
		});

		it("should apply animation when animated=true and striped=true", () => {
			const { container } = render(<Progress value={50} striped animated />);
			const root = container.querySelector("[data-state]");
			const indicator = root?.querySelector("div");
			expect(indicator).toHaveClass("animate-progress-stripes");
		});

		it("should not show label on small size", () => {
			render(<Progress value={50} label="Loading" size="sm" />);
			expect(screen.queryByText("Loading")).not.toBeInTheDocument();
		});
	});

	describe("Custom className", () => {
		it("should accept custom className", () => {
			const { container } = render(
				<Progress value={50} className="custom-class" />,
			);
			const root = container.querySelector('[role="progressbar"]');
			expect(root).toHaveClass("custom-class");
		});
	});
});

describe("ProgressBar", () => {
	describe("Multiple Bars", () => {
		it("should render with correct width", () => {
			const { container } = render(<ProgressBar value={30} />);
			const bar = container.querySelector('[role="progressbar"]');
			expect(bar).toHaveStyle({ width: "30%" });
		});

		it("should have progressbar role", () => {
			render(<ProgressBar value={50} />);
			const bar = screen.getByRole("progressbar");
			expect(bar).toBeInTheDocument();
		});

		it("should have correct aria attributes", () => {
			render(<ProgressBar value={60} />);
			const bar = screen.getByRole("progressbar");
			expect(bar).toHaveAttribute("aria-valuenow", "60");
			expect(bar).toHaveAttribute("aria-valuemin", "0");
			expect(bar).toHaveAttribute("aria-valuemax", "100");
		});

		it("should display label when provided", () => {
			render(<ProgressBar value={50} label="Documents" />);
			expect(screen.getByText("Documents")).toBeInTheDocument();
		});

		it("should clamp value to 0-100 range", () => {
			const { container: container1 } = render(<ProgressBar value={150} />);
			const bar1 = container1.querySelector('[role="progressbar"]');
			expect(bar1).toHaveStyle({ width: "100%" });

			const { container: container2 } = render(<ProgressBar value={-20} />);
			const bar2 = container2.querySelector('[role="progressbar"]');
			expect(bar2).toHaveStyle({ width: "0%" });
		});

		it("should apply color variant", () => {
			const { container } = render(<ProgressBar value={50} color="success" />);
			const bar = container.querySelector('[role="progressbar"]');
			expect(bar).toHaveClass("bg-success");
		});

		it("should apply striped pattern", () => {
			const { container } = render(<ProgressBar value={50} striped />);
			const bar = container.querySelector('[role="progressbar"]');
			expect(bar).toHaveClass(
				"bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]",
			);
		});

		it("should apply animation", () => {
			const { container } = render(<ProgressBar value={50} striped animated />);
			const bar = container.querySelector('[role="progressbar"]');
			expect(bar).toHaveClass("animate-progress-stripes");
		});
	});
});

describe("ProgressGroup", () => {
	describe("Multiple Progress Bars Container", () => {
		it("should have presentation role", () => {
			const { container } = render(
				<ProgressGroup>
					<ProgressBar value={30} />
					<ProgressBar value={20} />
				</ProgressGroup>,
			);
			const group = container.querySelector('[role="presentation"]');
			expect(group).toBeInTheDocument();
		});

		it("should render multiple bars", () => {
			render(
				<ProgressGroup>
					<ProgressBar value={15} label="Docs" />
					<ProgressBar value={30} label="Images" />
					<ProgressBar value={20} label="Videos" />
				</ProgressGroup>,
			);

			expect(screen.getByText("Docs")).toBeInTheDocument();
			expect(screen.getByText("Images")).toBeInTheDocument();
			expect(screen.getByText("Videos")).toBeInTheDocument();
		});

		it("should apply size variant", () => {
			const { container } = render(
				<ProgressGroup size="lg">
					<ProgressBar value={50} />
				</ProgressGroup>,
			);
			const group = container.querySelector('[role="presentation"]');
			expect(group).toHaveClass("h-4");
		});

		it("should accept custom className", () => {
			const { container } = render(
				<ProgressGroup className="custom-group">
					<ProgressBar value={50} />
				</ProgressGroup>,
			);
			const group = container.querySelector('[role="presentation"]');
			expect(group).toHaveClass("custom-group");
		});
	});
});
