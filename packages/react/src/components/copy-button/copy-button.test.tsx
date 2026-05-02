import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

const mockWriteText = vi.fn().mockResolvedValue(undefined);

// Set up clipboard mock once (userEvent.setup() will patch it, so individual
// tests that check mockWriteText must re-define clipboard after userEvent.setup())
beforeAll(() => {
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText: mockWriteText },
		writable: true,
		configurable: true,
	});
});

beforeEach(() => {
	mockWriteText.mockClear();
});

describe("CopyButton", () => {
	it("should render with data-slot", () => {
		const { container } = render(<CopyButton value="hello" />);
		expect(
			container.querySelector('[data-slot="copy-button"]'),
		).toBeInTheDocument();
	});

	it("should have aria-label 'Copy to clipboard' by default", () => {
		render(<CopyButton value="hello" />);
		expect(screen.getByLabelText("Copy to clipboard")).toBeInTheDocument();
	});

	it("should accept custom aria-label", () => {
		render(<CopyButton value="hello" aria-label="Copy code" />);
		expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
	});

	it("should show copy icon by default", () => {
		const { container } = render(<CopyButton value="hello" />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("should call clipboard.writeText on click", async () => {
		const user = userEvent.setup();
		render(<CopyButton value="test text" />);
		// userEvent.setup() patches navigator.clipboard — re-define our mock after it
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: mockWriteText },
			writable: true,
			configurable: true,
		});
		await user.click(screen.getByLabelText("Copy to clipboard"));
		expect(mockWriteText).toHaveBeenCalledWith("test text");
	});

	it("should show 'Copied!' aria-label after copy", async () => {
		const user = userEvent.setup();
		render(<CopyButton value="hello" />);
		await user.click(screen.getByLabelText("Copy to clipboard"));
		expect(await screen.findByLabelText("Copied!")).toBeInTheDocument();
	});

	it("should have data-copied attribute after copy", async () => {
		const user = userEvent.setup();
		const { container } = render(<CopyButton value="hello" />);
		await user.click(
			container.querySelector('[data-slot="copy-button"]') as HTMLElement,
		);
		await screen.findByLabelText("Copied!");
		expect(container.querySelector('[data-copied="true"]')).toBeInTheDocument();
	});

	it("should render custom copyIcon", () => {
		const { container } = render(
			<CopyButton value="x" copyIcon={<span data-testid="custom-copy" />} />,
		);
		expect(
			container.querySelector('[data-testid="custom-copy"]'),
		).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<CopyButton value="hello" className="custom-copy-btn" />,
		);
		expect(container.querySelector('[data-slot="copy-button"]')).toHaveClass(
			"custom-copy-btn",
		);
	});
});
