import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./slider";

describe("Slider", () => {
	describe("Basic Rendering", () => {
		it("renders slider component", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toBeInTheDocument();
		});

		it("renders with default value", () => {
			const { container } = render(<Slider defaultValue={[25]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "25");
		});

		it("renders with custom className", () => {
			const { container } = render(
				<Slider defaultValue={[50]} className="custom-class" />,
			);

			const root = container.firstChild;
			expect(root).toHaveClass("custom-class");
		});

		it("has correct structure", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			// Should have track
			const track = container.querySelector('[class*="rounded-full"]');
			expect(track).toBeInTheDocument();

			// Should have thumb
			const thumb = container.querySelector('[role="slider"]');
			expect(thumb).toBeInTheDocument();
		});
	});

	describe("Value Control", () => {
		it("supports controlled value", () => {
			const { container } = render(
				<Slider value={[75]} onValueChange={vi.fn()} />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "75");
		});

		it("supports uncontrolled value", () => {
			const { container } = render(<Slider defaultValue={[30]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "30");
		});

		it("calls onValueChange when value changes", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			const { container } = render(
				<Slider defaultValue={[50]} onValueChange={onValueChange} />,
			);

			const slider = container.querySelector('[role="slider"]') as HTMLElement;
			slider.focus();
			await user.keyboard("[ArrowRight]");

			// onValueChange should be called when using keyboard
			expect(onValueChange).toHaveBeenCalled();
		});

		it("updates value when controlled", () => {
			const { container, rerender } = render(
				<Slider value={[25]} onValueChange={vi.fn()} />,
			);

			let slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "25");

			rerender(<Slider value={[75]} onValueChange={vi.fn()} />);

			slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "75");
		});
	});

	describe("Range Configuration", () => {
		it("supports custom min value", () => {
			const { container } = render(<Slider defaultValue={[50]} min={0} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemin", "0");
		});

		it("supports custom max value", () => {
			const { container } = render(<Slider defaultValue={[50]} max={200} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemax", "200");
		});

		it("supports custom step", () => {
			const { container } = render(<Slider defaultValue={[50]} step={5} />);

			const slider = container.querySelector('[role="slider"]');
			// Step is handled internally by Radix
			expect(slider).toBeInTheDocument();
		});

		it("respects min/max boundaries", () => {
			const { container } = render(
				<Slider value={[150]} min={0} max={100} onValueChange={vi.fn()} />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemax", "100");
		});
	});

	describe("Multiple Thumbs", () => {
		it("supports multiple values", () => {
			const { container } = render(<Slider defaultValue={[25, 75]} />);

			const sliders = container.querySelectorAll('[role="slider"]');
			expect(sliders.length).toBe(2);
		});

		it("renders correct values for multiple thumbs", () => {
			const { container } = render(<Slider defaultValue={[20, 80]} />);

			const sliders = container.querySelectorAll('[role="slider"]');
			expect(sliders[0]).toHaveAttribute("aria-valuenow", "20");
			expect(sliders[1]).toHaveAttribute("aria-valuenow", "80");
		});

		it("handles three thumbs", () => {
			const { container } = render(<Slider defaultValue={[25, 50, 75]} />);

			const sliders = container.querySelectorAll('[role="slider"]');
			expect(sliders.length).toBe(3);
		});
	});

	describe("Disabled State", () => {
		it("renders disabled slider", () => {
			const { container } = render(<Slider defaultValue={[50]} disabled />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("data-disabled");
		});

		it("applies disabled styles", () => {
			const { container } = render(<Slider defaultValue={[50]} disabled />);

			const thumb = container.querySelector(
				'[class*="rounded-full"][class*="border-2"]',
			);
			expect(thumb).toHaveClass("disabled:opacity-50");
		});

		it("does not call onValueChange when disabled", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			const { container } = render(
				<Slider defaultValue={[50]} disabled onValueChange={onValueChange} />,
			);

			const slider = container.querySelector('[role="slider"]') as HTMLElement;
			await user.click(slider);

			// Should not change value when disabled
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	describe("Orientation", () => {
		it("renders horizontal by default", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-orientation", "horizontal");
		});

		it("supports vertical orientation", () => {
			const { container } = render(
				<Slider defaultValue={[50]} orientation="vertical" />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-orientation", "vertical");
		});
	});

	describe("Keyboard Navigation", () => {
		it("has correct role for keyboard accessibility", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toBeInTheDocument();
		});

		it("is keyboard focusable", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]') as HTMLElement;
			slider.focus();

			expect(slider).toHaveFocus();
		});

		it("supports arrow key navigation", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			const { container } = render(
				<Slider defaultValue={[50]} onValueChange={onValueChange} />,
			);

			const slider = container.querySelector('[role="slider"]') as HTMLElement;
			slider.focus();

			await user.keyboard("[ArrowRight]");

			expect(onValueChange).toHaveBeenCalled();
		});
	});

	describe("Accessibility", () => {
		it("has slider role", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("role", "slider");
		});

		it("has aria-valuenow", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "50");
		});

		it("has aria-valuemin", () => {
			const { container } = render(<Slider defaultValue={[50]} min={0} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemin", "0");
		});

		it("has aria-valuemax", () => {
			const { container } = render(<Slider defaultValue={[50]} max={100} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemax", "100");
		});

		it("supports aria-label", () => {
			const { container } = render(
				<Slider defaultValue={[50]} aria-label="Volume control" />,
			);

			// Radix applies aria-label to the root element, not individual thumbs
			const root = container.firstChild as HTMLElement;
			expect(root).toHaveAttribute("aria-label", "Volume control");
		});

		it("has visible focus styles", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const thumb = container.querySelector(
				'[class*="rounded-full"][class*="border-2"]',
			);
			expect(thumb).toHaveClass("focus-ring");
		});

		it("announces disabled state", () => {
			const { container } = render(<Slider defaultValue={[50]} disabled />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("data-disabled");
		});
	});

	describe("Styling", () => {
		it("applies base styles", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const root = container.firstChild;
			expect(root).toHaveClass("relative");
			expect(root).toHaveClass("flex");
			expect(root).toHaveClass("w-full");
		});

		it("applies track styles", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const track = container.querySelector('[class*="bg-secondary"]');
			expect(track).toHaveClass("rounded-full");
		});

		it("applies range styles", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const range = container.querySelector('[class*="bg-primary"]');
			expect(range).toBeInTheDocument();
		});

		it("applies thumb styles", () => {
			const { container } = render(<Slider defaultValue={[50]} />);

			const thumb = container.querySelector('[class*="border-primary"]');
			expect(thumb).toHaveClass("rounded-full");
			expect(thumb).toHaveClass("bg-background");
		});
	});

	describe("HTML Attributes", () => {
		it("forwards ref correctly", () => {
			const ref = vi.fn();
			render(<Slider defaultValue={[50]} ref={ref} />);

			expect(ref).toHaveBeenCalled();
		});

		it("accepts custom id", () => {
			const { container } = render(
				<Slider defaultValue={[50]} id="volume-slider" />,
			);

			expect(container.querySelector("#volume-slider")).toBeInTheDocument();
		});

		it("accepts data attributes", () => {
			const { container } = render(
				<Slider defaultValue={[50]} data-testid="slider" />,
			);

			expect(
				container.querySelector('[data-testid="slider"]'),
			).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("handles value of 0", () => {
			const { container } = render(<Slider defaultValue={[0]} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "0");
		});

		it("handles value at max", () => {
			const { container } = render(<Slider defaultValue={[100]} max={100} />);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "100");
		});

		it("handles decimal values with step", () => {
			const { container } = render(
				<Slider defaultValue={[2.5]} min={0} max={10} step={0.5} />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "2.5");
		});

		it("handles negative range", () => {
			const { container } = render(
				<Slider defaultValue={[-50]} min={-100} max={0} />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuemin", "-100");
			expect(slider).toHaveAttribute("aria-valuemax", "0");
		});

		it("handles large numbers", () => {
			const { container } = render(
				<Slider defaultValue={[5000]} min={0} max={10000} />,
			);

			const slider = container.querySelector('[role="slider"]');
			expect(slider).toHaveAttribute("aria-valuenow", "5000");
		});
	});
});
