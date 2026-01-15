import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
	it("should render skeleton", () => {
		const { container } = render(<Skeleton />);
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(<Skeleton className="custom-skeleton" />);
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("custom-skeleton");
	});

	it("should render with custom dimensions", () => {
		const { container } = render(<Skeleton className="w-20 h-20" />);
		const skeleton = container.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("w-20", "h-20");
	});

	it("should render multiple skeletons", () => {
		const { container } = render(
			<div>
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</div>,
		);
		const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
		expect(skeletons).toHaveLength(3);
	});

	describe("Fade Mode", () => {
		it("should render with pulse animation by default", () => {
			const { container } = render(<Skeleton />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveClass("animate-pulse");
			expect(skeleton).not.toHaveClass("animate-fade-in");
		});

		it("should render with fade animation when fade prop is true", () => {
			const { container } = render(<Skeleton fade={true} />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveClass("animate-fade-in");
			expect(skeleton).not.toHaveClass("animate-pulse");
		});

		it("should apply custom fade duration", () => {
			const { container } = render(<Skeleton fade={true} fadeDuration={500} />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveStyle({ transitionDuration: "500ms" });
		});

		it("should use default fade duration of 300ms", () => {
			const { container } = render(<Skeleton fade={true} />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveStyle({ transitionDuration: "300ms" });
		});
	});

	describe("Forward Ref", () => {
		it("should forward ref to div element", () => {
			const ref = { current: null } as unknown as React.RefObject<HTMLDivElement>;
			render(<Skeleton ref={ref} />);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("Accessibility", () => {
		it("should have data-slot attribute for testing", () => {
			const { container } = render(<Skeleton />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toBeInTheDocument();
		});

		it("should allow passing through aria attributes", () => {
			const { container } = render(<Skeleton aria-label="Loading content" />);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveAttribute("aria-label", "Loading content");
		});
	});

	describe("Custom Styles", () => {
		it("should merge custom style with inline styles", () => {
			const { container } = render(
				<Skeleton
					fade={true}
					fadeDuration={400}
					style={{ width: "200px", height: "100px" }}
				/>,
			);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveStyle({
				width: "200px",
				height: "100px",
				transitionDuration: "400ms",
			});
		});

		it("should preserve existing transitionDuration in style prop", () => {
			const { container } = render(
				<Skeleton style={{ transitionDuration: "200ms" }} />,
			);
			const skeleton = container.querySelector('[data-slot="skeleton"]');
			expect(skeleton).toHaveStyle({ transitionDuration: "200ms" });
		});
	});
});
