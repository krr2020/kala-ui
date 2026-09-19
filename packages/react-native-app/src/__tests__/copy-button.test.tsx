/**
 * CopyButton contract, ported from the web suite: value lands on the
 * clipboard writer, the copied state is announced and auto-resets from
 * the LAST click, and clipboard failures surface through onError without
 * crashing. Timers are real (short timeouts) so reset/unmount races are
 * exercised against the actual clock.
 */
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { CopyButton } from "@kala-ui/react-native-app";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("CopyButton", () => {
	it("renders the core Button primitive under this package's jest harness", async () => {
		const screen = await render(<CopyButton value="hello" />);
		expect(screen.getByTestId("k-copy-button")).toBeTruthy();
	});
	it("copies the value via the injected writer and announces the copied state", async () => {
		const writeClipboard = jest.fn().mockResolvedValue(undefined);
		const screen = await render(
			<CopyButton value="hello" writeClipboard={writeClipboard} />,
		);

		const button = screen.getByTestId("k-copy-button");
		expect(button.props.accessibilityRole).toBe("button");
		expect(button.props.accessibilityLabel).toBe("Copy to clipboard");
		expect(button.props.accessibilityLiveRegion).toBe("polite");

		await fireEvent.press(button);
		await waitFor(() =>
			expect(button.props.accessibilityLabel).toBe("Copied!"),
		);
		expect(writeClipboard).toHaveBeenCalledWith("hello");
	});

	it("resets to the copy state after the timeout", async () => {
		const writeClipboard = jest.fn().mockResolvedValue(undefined);
		const screen = await render(
			<CopyButton value="hello" timeout={50} writeClipboard={writeClipboard} />,
		);

		await fireEvent.press(screen.getByTestId("k-copy-button"));
		await waitFor(() =>
			expect(screen.getByTestId("k-copy-button").props.accessibilityLabel).toBe(
				"Copied!",
			),
		);
		await waitFor(
			() =>
				expect(
					screen.getByTestId("k-copy-button").props.accessibilityLabel,
				).toBe("Copy to clipboard"),
			{ timeout: 2000 },
		);
	});

	it("falls back to navigator.clipboard.writeText when no writer is injected", async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);
		(globalThis as { navigator?: unknown }).navigator = {
			clipboard: { writeText },
		};
		try {
			const screen = await render(<CopyButton value="hello" />);
			await fireEvent.press(screen.getByTestId("k-copy-button"));
			await waitFor(() => expect(writeText).toHaveBeenCalledWith("hello"));
		} finally {
			delete (globalThis as { navigator?: unknown }).navigator;
		}
	});

	it("does not stack reset timers on rapid clicks", async () => {
		const writeClipboard = jest.fn().mockResolvedValue(undefined);
		const screen = await render(
			<CopyButton
				value="hello"
				timeout={200}
				writeClipboard={writeClipboard}
			/>,
		);

		const button = screen.getByTestId("k-copy-button");
		await fireEvent.press(button);
		await fireEvent.press(button);
		await fireEvent.press(button);
		await waitFor(
			() =>
				expect(
					screen.getByTestId("k-copy-button").props.accessibilityLabel,
				).toBe("Copy to clipboard"),
			{ timeout: 1000 },
		);
		// resets exactly once after the last click: label never flips back to
		// copied once the single timer has fired
		await new Promise((resolve) => setTimeout(resolve, 250));
		expect(screen.getByTestId("k-copy-button").props.accessibilityLabel).toBe(
			"Copy to clipboard",
		);
	});

	it("ignores a stale write resolving after a newer click", async () => {
		let resolveFirst: () => void = () => {};
		const first = new Promise<void>((resolve) => {
			resolveFirst = resolve;
		});
		let resolveSecond: () => void = () => {};
		const second = new Promise<void>((resolve) => {
			resolveSecond = resolve;
		});
		const writeClipboard = jest
			.fn()
			.mockImplementationOnce(() => first)
			.mockImplementationOnce(() => second);

		const screen = await render(
			<CopyButton value="hello" timeout={50} writeClipboard={writeClipboard} />,
		);
		const button = screen.getByTestId("k-copy-button");

		await fireEvent.press(button); // slow first write stays pending
		await fireEvent.press(button); // fast second write wins
		resolveSecond();
		await flush();
		await waitFor(() =>
			expect(button.props.accessibilityLabel).toBe("Copied!"),
		);

		resolveFirst(); // stale success arrives after the reset
		await flush();
		await new Promise((resolve) => setTimeout(resolve, 120));
		expect(button.props.accessibilityLabel).toBe("Copy to clipboard");
	});

	it("surfaces clipboard rejections via onError and stays in the copy state", async () => {
		const onError = jest.fn();
		const writeClipboard = jest.fn().mockRejectedValue(new Error("denied"));
		const screen = await render(
			<CopyButton
				value="hello"
				writeClipboard={writeClipboard}
				onError={onError}
			/>,
		);

		const button = screen.getByTestId("k-copy-button");
		await fireEvent.press(button);
		await waitFor(() => expect(writeClipboard).toHaveBeenCalled());
		await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
		expect((onError.mock.calls[0] as Error[])[0].message).toBe("denied");
		expect(button.props.accessibilityLabel).toBe("Copy to clipboard");
	});

	it("reports a missing clipboard API through onError and renders idle", async () => {
		const onError = jest.fn();
		const screen = await render(<CopyButton value="hello" onError={onError} />);

		await fireEvent.press(screen.getByTestId("k-copy-button"));
		await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
		expect((onError.mock.calls[0] as Error[])[0].message).toMatch(/clipboard/i);
		expect(screen.getByTestId("k-copy-button").props.accessibilityLabel).toBe(
			"Copy to clipboard",
		);
	});

	it("clears the pending timer on unmount without acting afterwards", async () => {
		const writeClipboard = jest.fn().mockResolvedValue(undefined);
		const screen = await render(
			<CopyButton value="hello" timeout={50} writeClipboard={writeClipboard} />,
		);

		await fireEvent.press(screen.getByTestId("k-copy-button"));
		screen.unmount();
		await new Promise((resolve) => setTimeout(resolve, 120));
	});
});
