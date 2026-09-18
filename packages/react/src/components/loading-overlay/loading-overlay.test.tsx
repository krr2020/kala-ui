import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay", () => {
	it("does not render when visible is false and no transition", () => {
		const { container } = render(<LoadingOverlay visible={false} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders when visible is true", () => {
		const { container } = render(<LoadingOverlay visible />);
		expect(container.firstChild).toBeInTheDocument();
		expect(container.firstChild).toHaveClass("opacity-100");
	});

	it("announces as a busy status while visible", () => {
		const { container } = render(<LoadingOverlay visible />);
		const root = container.firstChild as HTMLElement;
		expect(root).toHaveAttribute("aria-busy", "true");
		expect(root).toHaveAttribute("data-kala-component", "loading-overlay");
		// the Spinner's <output> is the single live status region
		const status = screen.getByRole("status");
		expect(root.contains(status)).toBe(true);
	});

	it("hidden with transition stays mounted but inert and unannounced", () => {
		const { container } = render(
			<LoadingOverlay visible={false} transitionDuration={500} />,
		);
		const root = container.firstChild as HTMLElement;
		// When transitionDuration > 0, it renders but with opacity 0
		expect(root).toBeInTheDocument();
		expect(root).toHaveClass("opacity-0");
		expect(root).toHaveStyle({ transitionDuration: "500ms" });
		expect(root).toHaveClass("pointer-events-none");
		expect(root).toHaveAttribute("aria-hidden", "true");
		// aria-hidden removes it from the accessibility tree — no stale announcement
		expect(screen.queryByRole("status")).toBeNull();
	});

	it("visible overlay intercepts pointer events, hidden does not", () => {
		const { rerender, container } = render(<LoadingOverlay visible />);
		expect(container.firstChild).toHaveClass("pointer-events-auto");
		rerender(<LoadingOverlay visible={false} transitionDuration={200} />);
		expect(container.firstChild).toHaveClass("pointer-events-none");
	});

	it("renders custom loader", () => {
		render(
			<LoadingOverlay
				visible
				loaderProps={{
					children: <div data-testid="custom-loader">Custom</div>,
				}}
			/>,
		);
		expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
	});

	it("spreads loaderProps onto the default Spinner", () => {
		render(<LoadingOverlay visible loaderProps={{ size: "xl" }} />);
		expect(document.querySelector(".h-12.w-12")).toBeInTheDocument();
	});

	it("passes props to Overlay and merges overlayProps.className", () => {
		render(
			<LoadingOverlay
				visible
				overlayProps={{ blur: 5, className: "custom-overlay-class" }}
			/>,
		);
		const overlay = document.querySelector(
			".custom-overlay-class[data-kala-component='overlay']",
		);
		expect(overlay).toBeInTheDocument();
		const overlayWithStyle = Array.from(
			document.querySelectorAll(".inset-0"),
		).find((el) => (el as HTMLElement).style.backdropFilter === "blur(5px)");
		expect(overlayWithStyle).toBeDefined();
	});

	it("applies the default z-index of 400 on the root", () => {
		const { container } = render(<LoadingOverlay visible />);
		expect(container.firstChild).toHaveStyle({ zIndex: "400" });
	});
});
