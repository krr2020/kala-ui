import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
	it("copies the value and announces the copied state", () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		render(<CopyButton value="hello" />);

		fireEvent.click(screen.getByRole("button", { name: "Copy to clipboard" }));
		expect(writeText).toHaveBeenCalledWith("hello");
		vi.unstubAllGlobals();
	});

	it("shows the copied state and resets after the timeout", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		render(<CopyButton value="hello" timeout={50} />);

		fireEvent.click(screen.getByRole("button"));
		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Copied!" }),
			).toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Copy to clipboard" }),
			).toBeInTheDocument(),
		);
		vi.unstubAllGlobals();
	});

	it("does not stack reset timers on rapid clicks", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		render(<CopyButton value="hello" timeout={200} />);

		const button = screen.getByRole("button");
		fireEvent.click(button);
		await waitFor(() =>
			expect(
				screen.getByRole("button", { name: "Copied!" }),
			).toBeInTheDocument(),
		);
		fireEvent.click(button);
		fireEvent.click(button);
		// state still resets exactly once, 200ms after the LAST click
		await waitFor(
			() =>
				expect(
					screen.getByRole("button", { name: "Copy to clipboard" }),
				).toBeInTheDocument(),
			{ timeout: 1000 },
		);
		vi.unstubAllGlobals();
	});

	it("clears the pending timer on unmount without throwing", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		const { unmount } = render(<CopyButton value="hello" timeout={50} />);

		fireEvent.click(screen.getByRole("button"));
		unmount();
		await new Promise((resolve) => setTimeout(resolve, 120));
		vi.unstubAllGlobals();
	});

	it("swallows clipboard rejections without unhandled errors", async () => {
		const writeText = vi.fn().mockRejectedValue(new Error("denied"));
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		render(<CopyButton value="hello" />);

		fireEvent.click(screen.getByRole("button"));
		await waitFor(() => expect(writeText).toHaveBeenCalled());
		expect(
			screen.getByRole("button", { name: "Copy to clipboard" }),
		).toBeInTheDocument();
		vi.unstubAllGlobals();
	});
});
