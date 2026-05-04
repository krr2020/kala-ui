import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Indicator, indicatorVariants } from "./indicator";

describe("Indicator", () => {
	it("renders children correctly", () => {
		render(
			<Indicator>
				<div data-testid="target">Target</div>
			</Indicator>,
		);
		expect(screen.getByTestId("target")).toBeInTheDocument();
	});

	it("renders label correctly", () => {
		render(
			<Indicator label="New">
				<div>Target</div>
			</Indicator>,
		);
		expect(screen.getByText("New")).toBeInTheDocument();
	});

	it("does not render when disabled", () => {
		render(
			<Indicator disabled label="New">
				<div>Target</div>
			</Indicator>,
		);
		expect(screen.queryByText("New")).not.toBeInTheDocument();
	});

	it("applies inline style when inline prop is true", () => {
		const { container } = render(
			<Indicator inline>
				<div>Target</div>
			</Indicator>,
		);
		expect(container.firstChild).toHaveClass("inline-block");
	});

	it("applies processing animation class", () => {
		const { container } = render(
			<Indicator processing>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("animate-pulse");
	});

	// NEW TESTS BELOW

	it("applies block style by default (inline=false)", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		expect(container.firstChild).toHaveClass("block");
	});

	it("renders with custom className", () => {
		const { container } = render(
			<Indicator className="custom-class">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("custom-class");
	});

	it("renders with default position (top-right)", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-0", "right-0", "translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with top-left position", () => {
		const { container } = render(
			<Indicator position="top-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-0", "left-0", "-translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with top-center position", () => {
		const { container } = render(
			<Indicator position="top-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-0", "left-1/2", "-translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with middle-left position", () => {
		const { container } = render(
			<Indicator position="middle-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-1/2", "left-0", "-translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with middle-center position", () => {
		const { container } = render(
			<Indicator position="middle-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-1/2", "left-1/2", "-translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with middle-right position", () => {
		const { container } = render(
			<Indicator position="middle-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("top-1/2", "right-0", "translate-x-1/2", "-translate-y-1/2");
	});

	it("renders with bottom-left position", () => {
		const { container } = render(
			<Indicator position="bottom-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bottom-0", "left-0", "-translate-x-1/2", "translate-y-1/2");
	});

	it("renders with bottom-center position", () => {
		const { container } = render(
			<Indicator position="bottom-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bottom-0", "left-1/2", "-translate-x-1/2", "translate-y-1/2");
	});

	it("renders with bottom-right position", () => {
		const { container } = render(
			<Indicator position="bottom-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bottom-0", "right-0", "translate-x-1/2", "translate-y-1/2");
	});

	it("renders with primary color (default)", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("renders with secondary color", () => {
		const { container } = render(
			<Indicator color="secondary">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-secondary", "text-secondary-foreground");
	});

	it("renders with danger color", () => {
		const { container } = render(
			<Indicator color="danger">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-destructive", "text-destructive-foreground");
	});

	it("renders with success color", () => {
		const { container } = render(
			<Indicator color="success">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-success", "text-success-foreground");
	});

	it("renders with warning color", () => {
		const { container } = render(
			<Indicator color="warning">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-warning", "text-warning-foreground");
	});

	it("renders with info color", () => {
		const { container } = render(
			<Indicator color="info">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("bg-info", "text-info-foreground");
	});

	it("renders with border when withBorder is true", () => {
		const { container } = render(
			<Indicator withBorder={true}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("border-2", "border-background");
	});

	it("renders with custom size", () => {
		const { container } = render(
			<Indicator size={20}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.width).toBe("20px");
		expect(indicator.style.height).toBe("20px");
	});

	it("renders label with auto width and padding", () => {
		const { container } = render(
			<Indicator label="Badge" size={12}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.width).toBe("auto");
		expect(indicator.style.padding).toBe("0px 4px");
	});

	it("renders with offset styles for top-right", () => {
		const { container } = render(
			<Indicator offset={5} position="top-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.top).toBe("5px");
		expect(indicator.style.right).toBe("5px");
	});

	it("renders with offset styles for bottom-left", () => {
		const { container } = render(
			<Indicator offset={10} position="bottom-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.bottom).toBe("10px");
		expect(indicator.style.left).toBe("10px");
	});

	it("renders with offset styles for top-left", () => {
		const { container } = render(
			<Indicator offset={8} position="top-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.top).toBe("8px");
		expect(indicator.style.left).toBe("8px");
	});

	it("renders with offset styles for middle-center (no position offset applied)", () => {
		const { container } = render(
			<Indicator offset={5} position="middle-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		// middle-center has no offset in the switch statement
		expect(indicator.style.top).toBe("");
		expect(indicator.style.left).toBe("");
	});

	it("does not apply offset styles when offset is 0 (default)", () => {
		const { container } = render(
			<Indicator position="top-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.top).toBe("");
	});

	it("exports indicatorVariants", () => {
		expect(indicatorVariants).toBeDefined();
	});

	it("renders with offset styles for top-center", () => {
		const { container } = render(
			<Indicator offset={5} position="top-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.top).toBe("5px");
	});

	it("renders with offset styles for bottom-right", () => {
		const { container } = render(
			<Indicator offset={5} position="bottom-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.bottom).toBe("5px");
		expect(indicator.style.right).toBe("5px");
	});

	it("renders with offset styles for bottom-center", () => {
		const { container } = render(
			<Indicator offset={5} position="bottom-center">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.bottom).toBe("5px");
	});

	it("renders with offset styles for middle-left", () => {
		const { container } = render(
			<Indicator offset={5} position="middle-left">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.left).toBe("5px");
	});

	it("renders with offset styles for middle-right", () => {
		const { container } = render(
			<Indicator offset={5} position="middle-right">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.right).toBe("5px");
	});

	it("renders with custom style", () => {
		const { container } = render(
			<Indicator style={{ top: "20px" }}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.top).toBe("20px");
	});

	it("renders without label (dot indicator)", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.width).toBe("10px");
		expect(indicator.textContent).toBe("");
	});

	it("renders without children", () => {
		render(<Indicator label="3" />);
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("renders with minWidth equal to size when no label", () => {
		const { container } = render(
			<Indicator size={20}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.minWidth).toBe("20px");
	});

	it("renders with correct fontSize based on size", () => {
		const { container } = render(
			<Indicator size={16} label="Hi">
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.fontSize).toBe("11.2px");
	});

	it("renders with height equal to size when no label", () => {
		const { container } = render(
			<Indicator size={14}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.height).toBe("14px");
	});

	it("renders with padding 0 when no label", () => {
		const { container } = render(
			<Indicator size={10}>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild as HTMLElement;
		expect(indicator.style.padding).toBe("0px");
	});

	it("applies rounded-full class", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).toHaveClass("rounded-full");
	});

	it("renders without processing class by default", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).not.toHaveClass("animate-pulse");
	});

	it("renders without border class by default", () => {
		const { container } = render(
			<Indicator>
				<div>Target</div>
			</Indicator>,
		);
		const indicator = container.firstChild?.firstChild;
		expect(indicator).not.toHaveClass("border-2");
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(
			<Indicator ref={ref}>
				<div>Target</div>
			</Indicator>,
		);
		expect(ref).toHaveBeenCalled();
	});

	it("spreads additional HTML props to indicator div", () => {
		const { container } = render(
			<Indicator data-testid="my-indicator">
				<div>Target</div>
			</Indicator>,
		);
		expect(screen.getByTestId("my-indicator")).toBeInTheDocument();
	});

	it("has correct displayName", () => {
		expect(Indicator.displayName).toBe("Indicator");
	});

	it("indicatorVariants function produces expected output", () => {
		const result = indicatorVariants({
			position: "top-right",
			color: "danger",
			withBorder: true,
			processing: true,
		});
		expect(result).toContain("top-0");
		expect(result).toContain("right-0");
		expect(result).toContain("bg-destructive");
		expect(result).toContain("border-2");
		expect(result).toContain("animate-pulse");
	});
});
