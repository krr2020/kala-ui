import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageTransition } from "./page-transition";

describe("PageTransition", () => {
	it("renders children", () => {
		render(
			<PageTransition>
				<div>Test Content</div>
			</PageTransition>,
		);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("applies default duration", () => {
		const { container } = render(
			<PageTransition>
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveStyle({ transitionDuration: "300ms" });
	});

	it("applies custom duration", () => {
		const { container } = render(
			<PageTransition duration={500}>
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveStyle({ transitionDuration: "500ms" });
	});

	it("applies custom className", () => {
		const { container } = render(
			<PageTransition className="custom-class">
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveClass("custom-class");
	});

	it("has transition-opacity class", () => {
		const { container } = render(
			<PageTransition>
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveClass("transition-opacity");
	});

	it("has ease-in-out timing function", () => {
		const { container } = render(
			<PageTransition>
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveClass("ease-in-out");
	});

	it("starts with opacity-0", () => {
		const { container } = render(
			<PageTransition pageKey="test-key">
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');
		expect(wrapper).toHaveClass("opacity-0");
	});

	it("transitions to opacity-100", async () => {
		const { container } = render(
			<PageTransition pageKey="test-key">
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');

		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});
	});

	it("re-triggers transition when pageKey changes", async () => {
		const { container, rerender } = render(
			<PageTransition pageKey="page-1">
				<div>Content 1</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');

		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});

		// Change pageKey
		rerender(
			<PageTransition pageKey="page-2">
				<div>Content 2</div>
			</PageTransition>,
		);

		// Should immediately go back to opacity-0
		expect(wrapper).toHaveClass("opacity-0");

		// Then transition back to opacity-100
		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});
	});

	it("does not re-trigger when pageKey is unchanged", async () => {
		const { container, rerender } = render(
			<PageTransition pageKey="same-key">
				<div>Content 1</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');

		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});

		// Rerender with same pageKey
		rerender(
			<PageTransition pageKey="same-key">
				<div>Content 2</div>
			</PageTransition>,
		);

		// Should still be opacity-100 (no transition reset)
		expect(wrapper).toHaveClass("opacity-100");
	});

	it("works without pageKey prop", async () => {
		const { container } = render(
			<PageTransition>
				<div>Content</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');

		// Should still transition even without pageKey
		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});
	});

	it("renders multiple children", () => {
		render(
			<PageTransition>
				<div>Child 1</div>
				<div>Child 2</div>
				<div>Child 3</div>
			</PageTransition>,
		);

		expect(screen.getByText("Child 1")).toBeInTheDocument();
		expect(screen.getByText("Child 2")).toBeInTheDocument();
		expect(screen.getByText("Child 3")).toBeInTheDocument();
	});

	it("cleans up timeout on unmount", () => {
		const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

		const { unmount } = render(
			<PageTransition pageKey="test">
				<div>Content</div>
			</PageTransition>,
		);

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
		clearTimeoutSpy.mockRestore();
	});

	it("handles rapid pageKey changes", async () => {
		const { container, rerender } = render(
			<PageTransition pageKey="page-1">
				<div>Content 1</div>
			</PageTransition>,
		);

		const wrapper = container.querySelector('[data-slot="page-transition"]');

		// Rapid changes
		rerender(
			<PageTransition pageKey="page-2">
				<div>Content 2</div>
			</PageTransition>,
		);
		rerender(
			<PageTransition pageKey="page-3">
				<div>Content 3</div>
			</PageTransition>,
		);

		expect(wrapper).toHaveClass("opacity-0");

		await waitFor(() => {
			expect(wrapper).toHaveClass("opacity-100");
		});
	});
});
