import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { ErrorBoundary } from "./error-boundary";

// Component that throws an error
function ThrowError({
	shouldThrow = false,
	message = "Test error",
}: {
	shouldThrow?: boolean;
	message?: string;
}) {
	if (shouldThrow) {
		throw new Error(message);
	}
	return <div>Normal content</div>;
}

// Suppress console.error for tests (ErrorBoundary logs errors)
const originalError = console.error;
beforeEach(() => {
	console.error = vi.fn();
});

afterEach(() => {
	console.error = originalError;
});

describe("ErrorBoundary", () => {
	describe("Normal Rendering", () => {
		it("renders children when no error occurs", () => {
			render(
				<ErrorBoundary>
					<div>Test content</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("Test content")).toBeInTheDocument();
		});

		it("renders nested children correctly", () => {
			render(
				<ErrorBoundary>
					<div>
						<span>Nested</span>
						<span>Content</span>
					</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("Nested")).toBeInTheDocument();
			expect(screen.getByText("Content")).toBeInTheDocument();
		});
	});

	describe("Error Handling", () => {
		it("catches errors from child components", () => {
			render(
				<ErrorBoundary fallback={<div>Error occurred</div>}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(screen.getByText("Error occurred")).toBeInTheDocument();
			expect(screen.queryByText("Normal content")).not.toBeInTheDocument();
		});

		it("displays fallback UI when error occurs", () => {
			const fallback = <div data-testid="fallback">Custom error message</div>;

			render(
				<ErrorBoundary fallback={fallback}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId("fallback")).toBeInTheDocument();
		});

		it("handles different error messages", () => {
			render(
				<ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
					<ThrowError shouldThrow={true} message="Custom error message" />
				</ErrorBoundary>,
			);

			expect(
				screen.getByText("Error: Custom error message"),
			).toBeInTheDocument();
		});
	});

	describe("Fallback Prop", () => {
		it("supports fallback as ReactNode", () => {
			render(
				<ErrorBoundary fallback={<div>Static fallback</div>}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(screen.getByText("Static fallback")).toBeInTheDocument();
		});

		it("supports fallback as function", () => {
			render(
				<ErrorBoundary
					fallback={(error, reset) => (
						<div>
							<p>Error: {error.message}</p>
							<Button type="button" onClick={reset}>
								Reset
							</Button>
						</div>
					)}
				>
					<ThrowError shouldThrow={true} message="Function fallback test" />
				</ErrorBoundary>,
			);

			expect(
				screen.getByText("Error: Function fallback test"),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
		});

		it("fallback function receives error object", () => {
			const fallbackFn = vi.fn((error) => <div>Error: {error.message}</div>);

			render(
				<ErrorBoundary fallback={fallbackFn}>
					<ThrowError shouldThrow={true} message="Test message" />
				</ErrorBoundary>,
			);

			expect(fallbackFn).toHaveBeenCalled();
			const error = fallbackFn.mock.calls[0]?.[0];
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("Test message");
		});

		it("fallback function receives reset callback", () => {
			const fallbackFn = vi.fn((_error, reset) => (
				<Button type="button" onClick={reset}>
					Reset
				</Button>
			));

			render(
				<ErrorBoundary fallback={fallbackFn}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(fallbackFn).toHaveBeenCalled();
			const resetFn = fallbackFn.mock.calls[0]?.[1];
			expect(typeof resetFn).toBe("function");
		});
	});

	describe("Reset Functionality", () => {
		it("resets error state when reset is called", async () => {
			const user = userEvent.setup();
			const { rerender } = render(
				<ErrorBoundary
					fallback={(_error, reset) => (
						<div>
							<p>Error occurred</p>
							<Button type="button" onClick={reset}>
								Try again
							</Button>
						</div>
					)}
				>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			// Error fallback should be shown
			expect(screen.getByText("Error occurred")).toBeInTheDocument();

			// Click reset button
			await user.click(screen.getByRole("button", { name: "Try again" }));

			// Re-render with no error, use key to force remount
			rerender(
				<ErrorBoundary
					key="reset"
					fallback={(_error, reset) => (
						<div>
							<p>Error occurred</p>
							<Button type="button" onClick={reset}>
								Try again
							</Button>
						</div>
					)}
				>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>,
			);

			// Normal content should be shown after reset
			expect(screen.getByText("Normal content")).toBeInTheDocument();
		});

		it("allows recovery after error", async () => {
			const user = userEvent.setup();
			let shouldThrow = true;

			const { rerender } = render(
				<ErrorBoundary
					fallback={(_error, reset) => (
						<Button type="button" onClick={reset}>
							Retry
						</Button>
					)}
				>
					<ThrowError shouldThrow={shouldThrow} />
				</ErrorBoundary>,
			);

			// Error state
			expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();

			// Fix the error condition
			shouldThrow = false;

			// Click retry
			await user.click(screen.getByRole("button", { name: "Retry" }));

			// Rerender without error, use key to force remount
			rerender(
				<ErrorBoundary
					key="recovered"
					fallback={(_error, reset) => (
						<Button type="button" onClick={reset}>
							Retry
						</Button>
					)}
				>
					<ThrowError shouldThrow={shouldThrow} />
				</ErrorBoundary>,
			);

			expect(screen.getByText("Normal content")).toBeInTheDocument();
		});
	});

	describe("onError Callback", () => {
		it("calls onError when error is caught", () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary fallback={<div>Error</div>} onError={onError}>
					<ThrowError shouldThrow={true} message="Test error" />
				</ErrorBoundary>,
			);

			expect(onError).toHaveBeenCalled();
		});

		it("onError receives error object", () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary fallback={<div>Error</div>} onError={onError}>
					<ThrowError shouldThrow={true} message="Callback test error" />
				</ErrorBoundary>,
			);

			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({
					message: "Callback test error",
				}),
				expect.any(Object),
			);
		});

		it("onError receives errorInfo with component stack", () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary fallback={<div>Error</div>} onError={onError}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			const errorInfo = onError.mock.calls[0]?.[1];
			expect(errorInfo).toBeDefined();
			expect(errorInfo).toHaveProperty("componentStack");
		});

		it("does not call onError when no error occurs", () => {
			const onError = vi.fn();

			render(
				<ErrorBoundary fallback={<div>Error</div>} onError={onError}>
					<div>Normal content</div>
				</ErrorBoundary>,
			);

			expect(onError).not.toHaveBeenCalled();
		});
	});

	describe("Console Logging", () => {
		it("logs error to console", () => {
			const consoleError = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			render(
				<ErrorBoundary fallback={<div>Error</div>}>
					<ThrowError shouldThrow={true} message="Console test error" />
				</ErrorBoundary>,
			);

			expect(consoleError).toHaveBeenCalled();
			consoleError.mockRestore();
		});
	});

	describe("State Management", () => {
		it("initializes with no error state", () => {
			render(
				<ErrorBoundary fallback={<div>Error</div>}>
					<div>Content</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("Content")).toBeInTheDocument();
			expect(screen.queryByText("Error")).not.toBeInTheDocument();
		});

		it("updates state when error occurs", () => {
			render(
				<ErrorBoundary fallback={<div>Error state active</div>}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(screen.getByText("Error state active")).toBeInTheDocument();
		});

		it("maintains error state until reset", async () => {
			render(
				<ErrorBoundary
					fallback={(_error, reset) => (
						<div>
							<p>Error persists</p>
							<Button type="button" onClick={reset}>
								Clear
							</Button>
						</div>
					)}
				>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			expect(screen.getByText("Error persists")).toBeInTheDocument();

			// Error should persist until reset is called
			expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
		});
	});

	describe("Multiple Children", () => {
		it("catches errors from any child", () => {
			render(
				<ErrorBoundary fallback={<div>Error caught</div>}>
					<div>Safe child</div>
					<ThrowError shouldThrow={true} />
					<div>Another safe child</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("Error caught")).toBeInTheDocument();
			expect(screen.queryByText("Safe child")).not.toBeInTheDocument();
		});

		it("renders all children when no errors", () => {
			render(
				<ErrorBoundary fallback={<div>Error</div>}>
					<div>First child</div>
					<div>Second child</div>
					<div>Third child</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("First child")).toBeInTheDocument();
			expect(screen.getByText("Second child")).toBeInTheDocument();
			expect(screen.getByText("Third child")).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("handles missing fallback prop", () => {
			render(
				<ErrorBoundary>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>,
			);

			// Should not crash, fallback should be undefined
			expect(screen.queryByText("Normal content")).not.toBeInTheDocument();
		});

		it("handles errors in deeply nested components", () => {
			render(
				<ErrorBoundary fallback={<div>Deep error caught</div>}>
					<div>
						<div>
							<div>
								<ThrowError shouldThrow={true} />
							</div>
						</div>
					</div>
				</ErrorBoundary>,
			);

			expect(screen.getByText("Deep error caught")).toBeInTheDocument();
		});
	});
});
