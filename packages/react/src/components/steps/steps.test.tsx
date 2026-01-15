import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { type StepItem, Steps } from "./steps";

const mockSteps: StepItem[] = [
	{ title: "Step 1", description: "First step description" },
	{ title: "Step 2", description: "Second step description" },
	{ title: "Step 3", description: "Third step description" },
];

describe("Steps", () => {
	describe("Basic Rendering", () => {
		it("renders all steps", () => {
			render(<Steps currentStep={1} items={mockSteps} />);

			expect(screen.getByText("Step 1")).toBeInTheDocument();
			expect(screen.getByText("Step 2")).toBeInTheDocument();
			expect(screen.getByText("Step 3")).toBeInTheDocument();
		});

		it("renders step descriptions", () => {
			render(<Steps currentStep={1} items={mockSteps} />);

			expect(screen.getByText("First step description")).toBeInTheDocument();
			expect(screen.getByText("Second step description")).toBeInTheDocument();
			expect(screen.getByText("Third step description")).toBeInTheDocument();
		});

		it("renders without descriptions", () => {
			const stepsWithoutDesc: StepItem[] = [
				{ title: "Step 1" },
				{ title: "Step 2" },
			];

			render(<Steps currentStep={1} items={stepsWithoutDesc} />);

			expect(screen.getByText("Step 1")).toBeInTheDocument();
			expect(screen.getByText("Step 2")).toBeInTheDocument();
		});

		it("renders step numbers by default", () => {
			render(<Steps currentStep={1} items={mockSteps} />);

			expect(screen.getByText("1")).toBeInTheDocument();
			expect(screen.getByText("2")).toBeInTheDocument();
			expect(screen.getByText("3")).toBeInTheDocument();
		});

		it("accepts custom className", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} className="custom-class" />,
			);

			expect(container.firstChild as HTMLElement).toHaveClass("custom-class");
		});
	});

	describe("Current Step", () => {
		it("highlights current step", () => {
			render(<Steps currentStep={2} items={mockSteps} />);

			const step2 = screen.getByText("Step 2").closest("div");
			expect(step2).not.toBeNull();
			expect(step2).toHaveClass("text-primary");
		});

		it("shows check icon for completed steps", () => {
			const { container } = render(<Steps currentStep={3} items={mockSteps} />);

			const checkIcons = container.querySelectorAll("svg");
			expect(checkIcons.length).toBeGreaterThan(0);
		});

		it("shows numbers for upcoming steps", () => {
			render(<Steps currentStep={1} items={mockSteps} />);

			expect(screen.getByText("2")).toBeInTheDocument();
			expect(screen.getByText("3")).toBeInTheDocument();
		});

		it("applies scale to active step", () => {
			const { container } = render(<Steps currentStep={2} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const activeIndicator = indicators[1]; // Second step (index 1)
			expect(activeIndicator).toBeDefined();
			expect(activeIndicator).toHaveClass("scale-110");
		});
	});

	describe("Completed Steps", () => {
		it("marks previous steps as completed", () => {
			const { container } = render(<Steps currentStep={3} items={mockSteps} />);

			const checkIcons = container.querySelectorAll("svg");
			expect(checkIcons.length).toBeGreaterThanOrEqual(2);
		});

		it("applies completed styling to finished steps", () => {
			const { container } = render(<Steps currentStep={3} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const firstIndicator = indicators[0];
			expect(firstIndicator).toBeDefined();
			expect(firstIndicator).toHaveClass("bg-primary");
		});

		it("shows progress line for completed steps", () => {
			const { container } = render(<Steps currentStep={3} items={mockSteps} />);

			const progressLines = container.querySelectorAll('[class*="bg-primary"]');
			expect(progressLines.length).toBeGreaterThan(0);
		});
	});

	describe("Orientation", () => {
		it("renders horizontal by default", () => {
			const { container } = render(<Steps currentStep={1} items={mockSteps} />);

			expect(container.firstChild).toHaveClass("flex-row");
		});

		it("renders vertical when specified", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="vertical" />,
			);

			expect(container.firstChild).toHaveClass("flex-col");
		});

		it("applies correct horizontal styling", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="horizontal" />,
			);

			expect(container.firstChild).toHaveClass("items-start");
		});

		it("applies correct vertical styling", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="vertical" />,
			);

			expect(container.firstChild).toHaveClass("flex-col");
		});
	});

	describe("Click Interactions", () => {
		it("calls onStepClick when step is clicked", async () => {
			const user = userEvent.setup();
			const onStepClick = vi.fn();

			const { container } = render(
				<Steps currentStep={1} items={mockSteps} onStepClick={onStepClick} />,
			);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const secondIndicator = indicators[1];
			expect(secondIndicator).toBeDefined();
			await user.click(secondIndicator as Element); // Click second step

			expect(onStepClick).toHaveBeenCalledWith(2);
		});

		it("does not call onStepClick when not provided", async () => {
			const user = userEvent.setup();
			const { container } = render(<Steps currentStep={1} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const secondIndicator = indicators[1];
			expect(secondIndicator).toBeDefined();
			await user.click(secondIndicator as Element);

			// Should not throw error
			expect(true).toBe(true);
		});

		it("makes steps clickable when onStepClick is provided", () => {
			const onStepClick = vi.fn();
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} onStepClick={onStepClick} />,
			);

			const indicators = container.querySelectorAll(
				'[class*="cursor-pointer"]',
			);
			expect(indicators.length).toBeGreaterThan(0);
		});

		it("does not make current step clickable", () => {
			const onStepClick = vi.fn();
			const { container } = render(
				<Steps currentStep={2} items={mockSteps} onStepClick={onStepClick} />,
			);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const activeIndicator = indicators[1]; // Second step (current)

			// Current step should not have cursor-pointer
			expect(activeIndicator).toBeDefined();
			expect(activeIndicator?.className).not.toContain("cursor-pointer");
		});

		it("allows clicking on completed steps", async () => {
			const user = userEvent.setup();
			const onStepClick = vi.fn();

			const { container } = render(
				<Steps currentStep={3} items={mockSteps} onStepClick={onStepClick} />,
			);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const firstIndicator = indicators[0];
			expect(firstIndicator).toBeDefined();
			await user.click(firstIndicator as Element); // Click first (completed) step

			expect(onStepClick).toHaveBeenCalledWith(1);
		});

		it("allows clicking on future steps", async () => {
			const user = userEvent.setup();
			const onStepClick = vi.fn();

			const { container } = render(
				<Steps currentStep={1} items={mockSteps} onStepClick={onStepClick} />,
			);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const thirdIndicator = indicators[2];
			expect(thirdIndicator).toBeDefined();
			await user.click(thirdIndicator as Element); // Click third (future) step

			expect(onStepClick).toHaveBeenCalledWith(3);
		});
	});

	describe("Custom Icons", () => {
		it("renders custom icons", () => {
			const stepsWithIcons: StepItem[] = [
				{ title: "Step 1", icon: <span data-testid="icon-1">📝</span> },
				{ title: "Step 2", icon: <span data-testid="icon-2">✅</span> },
			];

			render(<Steps currentStep={1} items={stepsWithIcons} />);

			expect(screen.getByTestId("icon-1")).toBeInTheDocument();
			expect(screen.getByTestId("icon-2")).toBeInTheDocument();
		});

		it("replaces custom icons with check for completed steps", () => {
			const stepsWithIcons: StepItem[] = [
				{ title: "Step 1", icon: <span data-testid="icon-1">📝</span> },
				{ title: "Step 2", icon: <span data-testid="icon-2">✅</span> },
			];

			const { container } = render(
				<Steps currentStep={2} items={stepsWithIcons} />,
			);

			// First step should show check icon instead of custom icon
			const checkIcons = container.querySelectorAll("svg");
			expect(checkIcons.length).toBeGreaterThan(0);
		});
	});

	describe("Progress Lines", () => {
		it("shows connecting lines between steps", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="horizontal" />,
			);

			// Check for horizontal connecting lines (have w-full class)
			const horizontalLines = container.querySelectorAll('[class*="w-full"]');
			expect(horizontalLines.length).toBeGreaterThan(0);
		});

		it("shows horizontal lines in horizontal orientation", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="horizontal" />,
			);

			const horizontalLines = container.querySelectorAll('[class*="w-full"]');
			expect(horizontalLines.length).toBeGreaterThan(0);
		});

		it("shows vertical lines in vertical orientation", () => {
			const { container } = render(
				<Steps currentStep={1} items={mockSteps} orientation="vertical" />,
			);

			const verticalLines = Array.from(
				container.querySelectorAll("div"),
			).filter((el) => el.className.includes("h-[calc"));
			expect(verticalLines.length).toBeGreaterThan(0);
		});

		it("animates progress lines with transitions", () => {
			const { container } = render(<Steps currentStep={2} items={mockSteps} />);

			const progressBars = container.querySelectorAll(
				'[class*="transition-all"]',
			);
			expect(progressBars.length).toBeGreaterThan(0);
		});

		it("does not show line after last step", () => {
			const { container } = render(<Steps currentStep={1} items={mockSteps} />);

			const stepContainers = container.querySelectorAll(
				'[class*="group relative flex"]',
			);
			const lastStep = stepContainers[stepContainers.length - 1];

			// Last step should not contain connecting line
			expect(lastStep).toBeDefined();
			expect(lastStep?.querySelector('[class*="absolute"]')).toBeNull();
		});
	});

	describe("Edge Cases", () => {
		it("handles single step", () => {
			const singleStep: StepItem[] = [{ title: "Only Step" }];

			render(<Steps currentStep={1} items={singleStep} />);

			expect(screen.getByText("Only Step")).toBeInTheDocument();
		});

		it("handles empty items array gracefully", () => {
			const { container } = render(<Steps currentStep={1} items={[]} />);

			expect(container.firstChild).toBeInTheDocument();
		});

		it("handles currentStep beyond items length", () => {
			render(<Steps currentStep={10} items={mockSteps} />);

			const { container } = render(
				<Steps currentStep={10} items={mockSteps} />,
			);

			// All steps should be completed
			const checkIcons = container.querySelectorAll("svg");
			expect(checkIcons.length).toBe(3);
		});

		it("handles currentStep of 0", () => {
			render(<Steps currentStep={0} items={mockSteps} />);

			// No steps should be completed
			expect(screen.queryByText("1")).toBeInTheDocument();
		});

		it("handles many steps", () => {
			const manySteps: StepItem[] = Array.from({ length: 10 }, (_, i) => ({
				title: `Step ${i + 1}`,
			}));

			render(<Steps currentStep={5} items={manySteps} />);

			expect(screen.getByText("Step 1")).toBeInTheDocument();
			expect(screen.getByText("Step 10")).toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("applies transition classes", () => {
			const { container } = render(<Steps currentStep={1} items={mockSteps} />);

			const transitionElements = container.querySelectorAll(
				'[class*="transition"]',
			);
			expect(transitionElements.length).toBeGreaterThan(0);
		});

		it("applies proper colors to active step", () => {
			const { container } = render(<Steps currentStep={2} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const activeIndicator = indicators[1];

			expect(activeIndicator).toHaveClass("bg-primary");
			expect(activeIndicator).toHaveClass("text-primary-foreground");
		});

		it("applies proper colors to completed steps", () => {
			const { container } = render(<Steps currentStep={3} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const completedIndicator = indicators[0];

			expect(completedIndicator).toHaveClass("bg-primary");
		});

		it("applies proper colors to future steps", () => {
			const { container } = render(<Steps currentStep={1} items={mockSteps} />);

			const indicators = container.querySelectorAll('[class*="rounded-full"]');
			const futureIndicator = indicators[2];

			expect(futureIndicator).toHaveClass("border-border");
			expect(futureIndicator).toHaveClass("bg-background");
		});
	});

	describe("HTML Attributes", () => {
		it("accepts standard div attributes", () => {
			const { container } = render(
				<Steps
					currentStep={1}
					items={mockSteps}
					id="test-steps"
					data-testid="steps"
				/>,
			);

			expect(container.firstChild).toHaveAttribute("id", "test-steps");
		});

		it("forwards ref correctly", () => {
			const ref = vi.fn();
			render(<Steps currentStep={1} items={mockSteps} ref={ref} />);

			expect(ref).toHaveBeenCalled();
		});
	});
});
