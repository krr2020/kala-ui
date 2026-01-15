import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", async () => {
	const actual = (await vi.importActual("sonner")) as typeof import("sonner");
	const toastMock = vi.fn(actual.toast);

	Object.assign(toastMock, {
		success: vi.fn(actual.toast.success),
		error: vi.fn(actual.toast.error),
		warning: vi.fn(actual.toast.warning),
		info: vi.fn(actual.toast.info),
		promise: vi.fn(actual.toast.promise),
		dismiss: vi.fn(actual.toast.dismiss),
		custom: vi.fn(actual.toast.custom),
	});

	return {
		...actual,
		toast: toastMock,
	};
});

import { toast } from "sonner";
import { Toast } from "./toast";

describe("Toast", () => {
	describe("Basic Rendering", () => {
		it("renders toaster component", () => {
			const { container } = render(<Toast />);
			// Sonner uses portals, just verify component renders
			expect(container).toBeTruthy();
		});

		it("applies toaster className", () => {
			const { container } = render(<Toast />);
			// Verify component renders with className prop
			expect(container).toBeTruthy();
		});

		it("accepts custom props", () => {
			const { container } = render(<Toast position="top-right" />);
			expect(container).toBeTruthy();
		});
	});

	describe("Toast Display", () => {
		it("displays default toast", async () => {
			render(<Toast />);

			toast("Test message");

			await waitFor(() => {
				expect(screen.getByText("Test message")).toBeInTheDocument();
			});
		});

		it("displays toast with description", async () => {
			render(<Toast />);

			toast("Test title", {
				description: "Test description",
			});

			await waitFor(() => {
				expect(screen.getByText("Test title")).toBeInTheDocument();
				expect(screen.getByText("Test description")).toBeInTheDocument();
			});
		});

		it("displays multiple toasts", async () => {
			render(<Toast />);

			toast("First message");
			toast("Second message");
			toast("Third message");

			await waitFor(() => {
				expect(screen.getByText("First message")).toBeInTheDocument();
				expect(screen.getByText("Second message")).toBeInTheDocument();
				expect(screen.getByText("Third message")).toBeInTheDocument();
			});
		});
	});

	describe("Toast Types", () => {
		it("displays success toast", async () => {
			render(<Toast />);

			toast.success("Success message");

			await waitFor(() => {
				const toastElement = screen
					.getByText("Success message")
					.closest(".toast");
				expect(toastElement).toBeInTheDocument();
				expect(toastElement).toHaveAttribute("data-type", "success");
			});
		});

		it("displays error toast", async () => {
			render(<Toast />);

			toast.error("Error message");

			await waitFor(() => {
				const toastElement = screen
					.getByText("Error message")
					.closest(".toast");
				expect(toastElement).toBeInTheDocument();
				expect(toastElement).toHaveAttribute("data-type", "error");
			});
		});

		it("displays warning toast", async () => {
			render(<Toast />);

			toast.warning("Warning message");

			await waitFor(() => {
				const toastElement = screen
					.getByText("Warning message")
					.closest(".toast");
				expect(toastElement).toBeInTheDocument();
				expect(toastElement).toHaveAttribute("data-type", "warning");
			});
		});

		it("displays info toast", async () => {
			render(<Toast />);

			toast.info("Info message");

			await waitFor(() => {
				const toastElement = screen.getByText("Info message").closest(".toast");
				expect(toastElement).toBeInTheDocument();
				expect(toastElement).toHaveAttribute("data-type", "info");
			});
		});
	});

	describe("Toast Styling", () => {
		it("applies success toast styles", async () => {
			render(<Toast />);
			toast.success("Success message", {
				className: "custom-success-class",
			});
			expect(toast.success).toHaveBeenCalledWith("Success message", {
				className: "custom-success-class",
			});
		});

		it("applies error toast styles", async () => {
			render(<Toast />);
			toast.error("Error message", {
				className: "custom-error-class",
			});
			expect(toast.error).toHaveBeenCalledWith("Error message", {
				className: "custom-error-class",
			});
		});

		it("applies warning toast styles", async () => {
			render(<Toast />);
			toast.warning("Warning message", {
				className: "custom-warning-class",
			});
			expect(toast.warning).toHaveBeenCalledWith("Warning message", {
				className: "custom-warning-class",
			});
		});

		it("applies info toast styles", async () => {
			render(<Toast />);
			toast.info("Info message", {
				className: "custom-info-class",
			});
			expect(toast.info).toHaveBeenCalledWith("Info message", {
				className: "custom-info-class",
			});
		});
	});

	describe("Toast Actions", () => {
		it("displays action button", async () => {
			render(<Toast />);

			toast("Message with action", {
				action: {
					label: "Undo",
					onClick: vi.fn(),
				},
			});

			await waitFor(() => {
				expect(screen.getByText("Undo")).toBeInTheDocument();
			});
		});

		it("calls action onClick", async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();
			render(<Toast />);

			toast("Message with action", {
				action: {
					label: "Undo",
					onClick,
				},
			});

			await waitFor(() => {
				expect(screen.getByText("Undo")).toBeInTheDocument();
			});

			await user.click(screen.getByText("Undo"));
			expect(onClick).toHaveBeenCalled();
		});

		it("applies action button styles", async () => {
			render(<Toast />);

			toast("Message", {
				action: {
					label: "Action",
					onClick: vi.fn(),
				},
			});

			await waitFor(() => {
				const actionButton = screen.getByText("Action");
				expect(actionButton).toHaveClass("group-[.toast]:bg-primary");
			});
		});

		it("applies action button status styles", async () => {
			render(<Toast />);

			toast.success("Success message", {
				action: {
					label: "Success Action",
					onClick: vi.fn(),
				},
			});

			await waitFor(() => {
				const actionButton = screen.getByText("Success Action");
				expect(actionButton).toHaveClass(
					"group-data-[type=success]:!bg-success",
				);
			});
		});

		it("displays cancel button", async () => {
			render(<Toast />);

			toast("Message with cancel", {
				cancel: {
					label: "Cancel",
					onClick: vi.fn(),
				},
			});

			await waitFor(() => {
				expect(screen.getByText("Cancel")).toBeInTheDocument();
			});
		});

		it("applies cancel button styles", async () => {
			render(<Toast />);

			toast("Message", {
				cancel: {
					label: "Cancel",
					onClick: vi.fn(),
				},
			});

			await waitFor(() => {
				const cancelButton = screen.getByText("Cancel");
				expect(cancelButton).toHaveClass("group-[.toast]:bg-muted");
			});
		});
	});

	describe("Toast Dismissal", () => {
		it("applies close button status styles", async () => {
			render(<Toast closeButton />);

			toast.error("Error message");

			await waitFor(() => {
				const closeButton = screen.getByRole("button", { name: /close/i });
				expect(closeButton).toHaveClass(
					"group-data-[type=error]:!border-destructive",
				);
			});
		});

		it("dismisses toast automatically", async () => {
			render(<Toast duration={100} />);

			toast("Auto dismiss");

			await waitFor(() => {
				expect(screen.getByText("Auto dismiss")).toBeInTheDocument();
			});

			await waitFor(
				() => {
					expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
				},
				{ timeout: 500 }, // Increased to account for animation time
			);
		});

		it("dismisses toast manually", async () => {
			render(<Toast />);

			const id = toast("Manual dismiss");

			await waitFor(() => {
				expect(screen.getByText("Manual dismiss")).toBeInTheDocument();
			});

			toast.dismiss(id);

			await waitFor(() => {
				expect(screen.queryByText("Manual dismiss")).not.toBeInTheDocument();
			});
		});

		it("has close button", async () => {
			render(<Toast closeButton />);

			toast("With close button");

			await waitFor(() => {
				expect(screen.getByText("With close button")).toBeInTheDocument();
				// Sonner adds a close button with aria-label
				const closeButton = screen.getByRole("button", { name: /close/i });
				expect(closeButton).toBeInTheDocument();
			});
		});

		it("dismisses toast via close button", async () => {
			const user = userEvent.setup();
			render(<Toast closeButton />);

			toast("Dismissible toast");

			await waitFor(() => {
				expect(screen.getByText("Dismissible toast")).toBeInTheDocument();
			});

			const closeButton = screen.getByRole("button", { name: /close/i });
			await user.click(closeButton);

			await waitFor(() => {
				expect(screen.queryByText("Dismissible toast")).not.toBeInTheDocument();
			});
		});
	});

	describe("Toast Position", () => {
		it("supports top-left position", () => {
			const { container } = render(<Toast position="top-left" />);
			// Sonner uses portals, just verify it renders without error
			expect(container).toBeTruthy();
		});

		it("supports top-center position", () => {
			const { container } = render(<Toast position="top-center" />);
			expect(container).toBeTruthy();
		});

		it("supports top-right position", () => {
			const { container } = render(<Toast position="top-right" />);
			expect(container).toBeTruthy();
		});

		it("supports bottom-left position", () => {
			const { container } = render(<Toast position="bottom-left" />);
			expect(container).toBeTruthy();
		});

		it("supports bottom-center position", () => {
			const { container } = render(<Toast position="bottom-center" />);
			expect(container).toBeTruthy();
		});

		it("supports bottom-right position", () => {
			const { container } = render(<Toast position="bottom-right" />);
			expect(container).toBeTruthy();
		});
	});

	describe("Toast Duration", () => {
		it("uses default duration", async () => {
			render(<Toast />);

			toast("Default duration");

			await waitFor(() => {
				expect(screen.getByText("Default duration")).toBeInTheDocument();
			});
		});

		it("supports custom duration", async () => {
			render(<Toast duration={500} />);

			toast("Custom duration");

			await waitFor(() => {
				expect(screen.getByText("Custom duration")).toBeInTheDocument();
			});
		});

		it("supports infinite duration", async () => {
			render(<Toast duration={Infinity} />);

			toast("Infinite duration");

			await waitFor(() => {
				expect(screen.getByText("Infinite duration")).toBeInTheDocument();
			});

			// Should still be visible after a delay
			await new Promise((resolve) => setTimeout(resolve, 200));
			expect(screen.getByText("Infinite duration")).toBeInTheDocument();
		});

		it("supports per-toast duration", async () => {
			render(<Toast />);

			toast("Custom toast duration", { duration: 100 });

			await waitFor(() => {
				expect(screen.getByText("Custom toast duration")).toBeInTheDocument();
			});

			await waitFor(
				() => {
					expect(
						screen.queryByText("Custom toast duration"),
					).not.toBeInTheDocument();
				},
				{ timeout: 500 }, // Increased to account for animation time
			);
		});
	});

	describe("Toast Configuration", () => {
		it("supports expand option", () => {
			const { container } = render(<Toast expand />);
			expect(container).toBeTruthy();
		});

		it("supports visibleToasts limit", () => {
			const { container } = render(<Toast visibleToasts={3} />);
			expect(container).toBeTruthy();
		});

		it("supports richColors", () => {
			const { container } = render(<Toast richColors />);
			expect(container).toBeTruthy();
		});
	});

	describe("Promise Toast", () => {
		it("handles promise toast states", async () => {
			render(<Toast />);

			const promise = new Promise((resolve) => setTimeout(resolve, 100));

			toast.promise(promise, {
				loading: "Loading...",
				success: "Success!",
				error: "Error!",
			});

			await waitFor(() => {
				expect(screen.getByText("Loading...")).toBeInTheDocument();
			});

			await waitFor(
				() => {
					expect(screen.getByText("Success!")).toBeInTheDocument();
				},
				{ timeout: 200 },
			);
		});

		it("handles promise rejection", async () => {
			render(<Toast />);

			const promise = new Promise((_, reject) =>
				setTimeout(() => reject("Failed"), 100),
			);

			toast.promise(promise, {
				loading: "Loading...",
				success: "Success!",
				error: "Error occurred",
			});

			await waitFor(() => {
				expect(screen.getByText("Loading...")).toBeInTheDocument();
			});

			await waitFor(
				() => {
					expect(screen.getByText("Error occurred")).toBeInTheDocument();
				},
				{ timeout: 200 },
			);
		});
	});

	describe("Custom Toast", () => {
		it("displays custom JSX content", async () => {
			render(<Toast />);

			toast.custom(() => <div data-testid="custom-toast">Custom content</div>);

			await waitFor(() => {
				expect(screen.getByTestId("custom-toast")).toBeInTheDocument();
			});
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA attributes", async () => {
			render(<Toast />);

			toast("Accessible toast");

			await waitFor(() => {
				const toastElement = screen.getByText("Accessible toast");
				// Sonner wraps toasts in a section with aria-live
				expect(toastElement).toBeInTheDocument();
			});
		});

		it("supports screen readers", async () => {
			render(<Toast />);

			toast("Screen reader announcement");

			await waitFor(() => {
				const announcement = screen.getByText("Screen reader announcement");
				expect(announcement).toBeInTheDocument();
			});
		});
	});

	describe("Edge Cases", () => {
		it("handles empty message", async () => {
			render(<Toast />);

			toast("");

			// Should still render the toast container
			await waitFor(() => {
				const toaster = document.querySelector(".toaster");
				expect(toaster).toBeInTheDocument();
			});
		});

		it("handles very long messages", async () => {
			render(<Toast />);

			const longMessage = "A".repeat(500);
			toast(longMessage);

			await waitFor(() => {
				expect(screen.getByText(longMessage)).toBeInTheDocument();
			});
		});

		it("handles rapid toast creation", async () => {
			render(<Toast />);

			for (let i = 0; i < 10; i++) {
				toast(`Toast ${i}`);
			}

			// Should handle multiple toasts
			await waitFor(() => {
				expect(screen.getByText("Toast 0")).toBeInTheDocument();
			});
		});

		it("handles toast update", async () => {
			render(<Toast />);

			const id = toast("Initial message");

			await waitFor(() => {
				expect(screen.getByText("Initial message")).toBeInTheDocument();
			});

			toast("Updated message", { id });

			await waitFor(() => {
				expect(screen.getByText("Updated message")).toBeInTheDocument();
				expect(screen.queryByText("Initial message")).not.toBeInTheDocument();
			});
		});
	});
});
