import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";
import { SkeletonWrapper } from "./skeleton-wrapper";

describe("SkeletonWrapper", () => {
	it("renders skeleton when loading", () => {
		render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
			>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		expect(screen.getByTestId("skeleton")).toBeInTheDocument();
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("renders content when not loading", async () => {
		render(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("content")).toBeInTheDocument();
		});
	});

	it("applies default duration of 300ms", () => {
		const { container } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeletonWrapper = container.querySelector(
			'[class*="transition-opacity"]',
		);
		expect(skeletonWrapper).toHaveStyle({ transitionDuration: "300ms" });
	});

	it("applies custom duration", () => {
		const { container } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div>Loading...</div>}
				duration={500}
			>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeletonWrapper = container.querySelector(
			'[class*="transition-opacity"]',
		);
		expect(skeletonWrapper).toHaveStyle({ transitionDuration: "500ms" });
	});

	it("applies custom className to container", () => {
		const { container } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div>Loading...</div>}
				className="custom-class"
			>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const wrapper = container.querySelector('[data-slot="skeleton-wrapper"]');
		expect(wrapper).toHaveClass("custom-class");
	});

	it("has relative positioning on container", () => {
		const { container } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const wrapper = container.querySelector('[data-slot="skeleton-wrapper"]');
		expect(wrapper).toHaveClass("relative");
	});

	it("skeleton has aria-hidden when not loading during transition", () => {
		const { container, rerender } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		rerender(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[aria-hidden="true"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("skeleton is visible when loading", () => {
		render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = screen.getByText("Loading...");
		expect(skeleton).toBeInTheDocument();
		expect(skeleton.parentElement).toHaveAttribute("aria-hidden", "false");
	});

	it("transitions from loading to loaded state", async () => {
		const { rerender } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		expect(screen.getByTestId("skeleton")).toBeInTheDocument();

		rerender(
			<SkeletonWrapper
				isLoading={false}
				skeleton={<div data-testid="skeleton">Loading...</div>}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		// Skeleton should still be visible initially for fade-out
		expect(screen.getByTestId("skeleton")).toBeInTheDocument();

		// After duration, content should appear
		await waitFor(
			() => {
				expect(screen.getByTestId("content")).toBeInTheDocument();
			},
			{ timeout: 500 },
		);
	});

	it("transitions from loaded to loading state", () => {
		const { rerender } = render(
			<SkeletonWrapper
				isLoading={false}
				skeleton={<div data-testid="skeleton">Loading...</div>}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		rerender(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		expect(screen.getByTestId("skeleton")).toBeInTheDocument();
	});

	it("cleans up timeout on unmount", () => {
		const { unmount, rerender } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		// Trigger state change that sets timeout
		rerender(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		// Unmount should not throw errors
		expect(() => unmount()).not.toThrow();
	});

	it("handles rapid state changes", async () => {
		const { rerender } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
				duration={100}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		// Rapid toggle
		rerender(
			<SkeletonWrapper
				isLoading={false}
				skeleton={<div data-testid="skeleton">Loading...</div>}
				duration={100}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		rerender(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
				duration={100}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		// Should show skeleton
		expect(screen.getByTestId("skeleton")).toBeInTheDocument();
	});

	it("skeleton has opacity-100 when loading", () => {
		const { container } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[class*="opacity-100"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("skeleton has opacity-0 when transitioning out", () => {
		const { container, rerender } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		rerender(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[class*="opacity-0"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("content has fade-in animation class", async () => {
		const { container } = render(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		await waitFor(() => {
			const content = container.querySelector('[class*="animate-fade-in"]');
			expect(content).toBeInTheDocument();
		});
	});

	it("skeleton has fade-out animation class when transitioning", () => {
		const { container, rerender } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		rerender(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[class*="animate-fade-out"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("renders multiple children in content", async () => {
		render(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Child 1</div>
				<div>Child 2</div>
				<div>Child 3</div>
			</SkeletonWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByText("Child 1")).toBeInTheDocument();
			expect(screen.getByText("Child 2")).toBeInTheDocument();
			expect(screen.getByText("Child 3")).toBeInTheDocument();
		});
	});

	it("uses ease-out timing for skeleton", () => {
		const { container } = render(
			<SkeletonWrapper isLoading={true} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[class*="ease-out"]');
		expect(skeleton).toBeInTheDocument();
	});

	it("uses ease-in timing for content", async () => {
		const { container } = render(
			<SkeletonWrapper isLoading={false} skeleton={<div>Loading...</div>}>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		await waitFor(() => {
			const content = container.querySelector('[class*="ease-in"]');
			expect(content).toBeInTheDocument();
		});
	});

	it("disables transition when transition prop is false", async () => {
		const { rerender } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<div data-testid="skeleton">Loading...</div>}
				transition={false}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		expect(screen.getByTestId("skeleton")).toBeInTheDocument();

		rerender(
			<SkeletonWrapper
				isLoading={false}
				skeleton={<div data-testid="skeleton">Loading...</div>}
				transition={false}
			>
				<div data-testid="content">Content</div>
			</SkeletonWrapper>,
		);

		// Content should appear immediately without delay
		await waitFor(() => {
			expect(screen.getByTestId("content")).toBeInTheDocument();
		});
	});

	it("works with Skeleton component", () => {
		const { container } = render(
			<SkeletonWrapper
				isLoading={true}
				skeleton={<Skeleton className="w-full h-4" />}
			>
				<div>Content</div>
			</SkeletonWrapper>,
		);

		const skeleton = container.querySelector('[data-slot="skeleton"]');
		// Should render skeleton
		expect(skeleton).toBeInTheDocument();
	});
});
