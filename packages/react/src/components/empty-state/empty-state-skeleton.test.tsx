import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyStateSkeleton } from "./empty-state-skeleton";

describe("EmptyStateSkeleton", () => {
	describe("Basic Rendering", () => {
		it("renders with default props", () => {
			render(<EmptyStateSkeleton />);
			const skeleton = screen.getByTestId("empty-state-skeleton");
			expect(skeleton).toBeInTheDocument();
		});

		it("renders with custom className", () => {
			const { container } = render(
				<EmptyStateSkeleton className="custom-class" />,
			);
			const skeleton = container.querySelector(".custom-class");
			expect(skeleton).toBeInTheDocument();
		});

		it("renders with custom data-testid", () => {
			render(<EmptyStateSkeleton data-testid="custom-skeleton" />);
			const skeleton = screen.getByTestId("custom-skeleton");
			expect(skeleton).toBeInTheDocument();
		});
	});

	describe("Icon", () => {
		it("renders icon by default", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toBeInTheDocument();
		});

		it("does not render icon when showIcon is false", () => {
			const { container } = render(<EmptyStateSkeleton showIcon={false} />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).not.toBeInTheDocument();
		});
	});

	describe("Content Elements", () => {
		it("renders title skeleton", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const title = container.querySelector(".h-6");
			expect(title).toBeInTheDocument();
		});

		it("renders description skeleton", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const description = container.querySelector(".max-w-sm");
			expect(description).toBeInTheDocument();
		});

		it("renders action button when showAction is true", () => {
			const { container } = render(<EmptyStateSkeleton showAction={true} />);
			const button = container.querySelector('[style*="width: 8rem"]');
			expect(button).toBeInTheDocument();
		});

		it("does not render action button when showAction is false", () => {
			const { container } = render(<EmptyStateSkeleton showAction={false} />);
			const button = container.querySelector('[style*="width: 8rem"]');
			expect(button).not.toBeInTheDocument();
		});
	});

	describe("Layout", () => {
		it("has centered layout", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("items-center");
			expect(skeleton).toHaveClass("justify-center");
		});

		it("has flex column layout", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("flex-col");
		});

		it("has rounded corners", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("rounded-lg");
		});

		it("has border", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("border");
		});

		it("has padding", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("p-8");
		});

		it("has text-center", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeleton = container.querySelector('[data-testid="empty-state-skeleton"]');
			expect(skeleton).toHaveClass("text-center");
		});
	});

	describe("Icon Styling", () => {
		it("icon container has correct dimensions", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toHaveClass("h-20");
			expect(iconContainer).toHaveClass("w-20");
		});

		it("icon container has centered layout", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toHaveClass("flex");
			expect(iconContainer).toHaveClass("items-center");
			expect(iconContainer).toHaveClass("justify-center");
		});

		it("icon container has bg-muted background", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toHaveClass("bg-muted");
		});
	});

	describe("Skeleton Elements", () => {
		it("icon skeleton has correct size", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const skeletonCircle = container.querySelector('[style*="width: 2.5rem"]');
			expect(skeletonCircle).toBeInTheDocument();
		});

		it("title skeleton has correct size and margin", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const title = container.querySelector(".h-6.w-48");
			expect(title).toBeInTheDocument();
		});

		it("description skeleton has correct size and margin", () => {
			const { container } = render(<EmptyStateSkeleton />);
			const description = container.querySelector(".h-4.max-w-sm");
			expect(description).toBeInTheDocument();
			expect(description).toHaveClass("mb-4");
		});

		it("button skeleton has correct width", () => {
			const { container } = render(<EmptyStateSkeleton showAction={true} />);
			const button = container.querySelector('[style*="width: 8rem"]');
			expect(button).toBeInTheDocument();
		});
	});
});
