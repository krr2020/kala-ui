import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Spoiler } from "./spoiler";

// Store original scrollHeight descriptor
let originalScrollHeightDescriptor: PropertyDescriptor | undefined;

describe("Spoiler", () => {
	beforeEach(() => {
		originalScrollHeightDescriptor = Object.getOwnPropertyDescriptor(
			Element.prototype,
			"scrollHeight",
		);
	});

	afterEach(() => {
		// Restore original scrollHeight
		if (originalScrollHeightDescriptor) {
			Object.defineProperty(
				Element.prototype,
				"scrollHeight",
				originalScrollHeightDescriptor,
			);
		}
	});

	function mockScrollHeight(value: number) {
		Object.defineProperty(Element.prototype, "scrollHeight", {
			configurable: true,
			get: () => value,
		});
	}

	it("renders children", () => {
		render(<Spoiler maxHeight={100}>Content</Spoiler>);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders with default showLabel and hideLabel", () => {
		const { container } = render(<Spoiler maxHeight={50}>Content</Spoiler>);
		expect(container).toBeInTheDocument();
	});

	it("renders with custom showLabel and hideLabel", () => {
		render(
			<Spoiler maxHeight={100} showLabel="Expand" hideLabel="Collapse">
				Content
			</Spoiler>,
		);
		expect(screen.queryByText("Expand")).not.toBeInTheDocument();
	});

	it("renders with custom transitionDuration", () => {
		render(
			<Spoiler maxHeight={100} transitionDuration={0.5}>
				Content
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders with initialState true", () => {
		render(
			<Spoiler maxHeight={100} initialState>
				Content
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders with initialState false (explicit)", () => {
		render(
			<Spoiler maxHeight={100} initialState={false}>
				Content
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Spoiler maxHeight={100} className="my-spoiler">
				Content
			</Spoiler>,
		);
		const box = container.firstElementChild as HTMLElement;
		expect(box).toHaveClass("my-spoiler");
	});

	it("toggles expanded state when button is clicked", async () => {
		mockScrollHeight(200);

		const user = userEvent.setup();
		render(
			<Spoiler maxHeight={10} showLabel="Show more" hideLabel="Show less">
				<div>Long content that exceeds the max height</div>
			</Spoiler>,
		);

		// Button should appear because scrollHeight (200) > maxHeight (10)
		await waitFor(() => {
			expect(screen.getByRole("button", { name: /show more/i })).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: /show more/i }));

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
		});
	});

	it("hides button when content does not exceed maxHeight", () => {
		mockScrollHeight(50);

		render(
			<Spoiler maxHeight={100}>
				<div>Short content</div>
			</Spoiler>,
		);
		expect(screen.queryByText("Show more")).not.toBeInTheDocument();
	});

	it("shows showLabel when collapsed with overflow", async () => {
		mockScrollHeight(200);

		render(
			<Spoiler maxHeight={10} showLabel="Expand" hideLabel="Collapse">
				<div>Long content</div>
			</Spoiler>,
		);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /expand/i })).toBeInTheDocument();
		});
	});

	it("toggles from expanded back to collapsed", async () => {
		mockScrollHeight(200);

		const user = userEvent.setup();
		render(
			<Spoiler maxHeight={10} showLabel="Show more" hideLabel="Show less">
				<div>Long content</div>
			</Spoiler>,
		);

		// Expand
		await waitFor(() => {
			expect(screen.getByRole("button", { name: /show more/i })).toBeInTheDocument();
		});
		await user.click(screen.getByRole("button", { name: /show more/i }));

		// Collapse
		await waitFor(() => {
			expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
		});
		await user.click(screen.getByRole("button", { name: /show less/i }));

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /show more/i })).toBeInTheDocument();
		});
	});

	it("shows showLabel with React element when collapsed", async () => {
		mockScrollHeight(200);

		render(
			<Spoiler
				maxHeight={10}
				showLabel={<span data-testid="expand-el">Expand</span>}
				hideLabel={<span data-testid="collapse-el">Collapse</span>}
			>
				<div>Long content</div>
			</Spoiler>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("expand-el")).toBeInTheDocument();
		});
	});

	it("shows hideLabel with React element when expanded", async () => {
		mockScrollHeight(200);

		const user = userEvent.setup();
		render(
			<Spoiler
				maxHeight={10}
				showLabel={<span data-testid="expand-el">Expand</span>}
				hideLabel={<span data-testid="collapse-el">Collapse</span>}
			>
				<div>Long content</div>
			</Spoiler>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("expand-el")).toBeInTheDocument();
		});
		await user.click(screen.getByTestId("expand-el"));

		await waitFor(() => {
			expect(screen.getByTestId("collapse-el")).toBeInTheDocument();
		});
	});

	it("hides toggle button when scrollHeight equals maxHeight exactly", () => {
		mockScrollHeight(100);

		render(
			<Spoiler maxHeight={100}>
				<div>Content</div>
			</Spoiler>,
		);
		expect(screen.queryByText("Show more")).not.toBeInTheDocument();
	});

	it("renders with empty children", () => {
		render(<Spoiler maxHeight={100}>{null}</Spoiler>);
		expect(document.querySelector(".relative")).toBeInTheDocument();
	});

	it("renders multiple children", () => {
		render(
			<Spoiler maxHeight={100}>
				<p>First paragraph</p>
				<p>Second paragraph</p>
				<p>Third paragraph</p>
			</Spoiler>,
		);
		expect(screen.getByText("First paragraph")).toBeInTheDocument();
		expect(screen.getByText("Second paragraph")).toBeInTheDocument();
		expect(screen.getByText("Third paragraph")).toBeInTheDocument();
	});

	it("has displayName set to Spoiler", () => {
		expect(Spoiler.displayName).toBe("Spoiler");
	});

	it("renders with maxHeight of 0", () => {
		render(
			<Spoiler maxHeight={0}>
				<div style={{ height: 100 }}>Content</div>
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders with custom transitionDuration of 0", () => {
		render(
			<Spoiler maxHeight={100} transitionDuration={0}>
				Content
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("renders with React elements as showLabel/hideLabel", () => {
		render(
			<Spoiler
				maxHeight={100}
				showLabel={<span data-testid="show-btn">Expand</span>}
				hideLabel={<span data-testid="hide-btn">Collapse</span>}
			>
				Content
			</Spoiler>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(
			<Spoiler ref={ref} maxHeight={100}>
				Content
			</Spoiler>,
		);
		expect(ref).toHaveBeenCalled();
	});

	it("applies additional HTML attributes via props", () => {
		const { container } = render(
			<Spoiler maxHeight={100} data-testid="spoiler-el" id="my-spoiler">
				Content
			</Spoiler>,
		);
		expect(container.querySelector('[data-testid="spoiler-el"]')).toBeInTheDocument();
		expect(container.querySelector('[id="my-spoiler"]')).toBeInTheDocument();
	});
});
