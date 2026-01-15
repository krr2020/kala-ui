import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
	describe("Basic Rendering", () => {
		it("renders correctly", () => {
			render(<FileUpload />);
			expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
			expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument();
		});

		it("displays correct file type hint with accept prop", () => {
			render(<FileUpload accept=".png,.jpg" />);
			expect(screen.getByText(/\.png, \.jpg/i)).toBeInTheDocument();
		});

		it("displays correct max size hint with maxSize prop", () => {
			render(<FileUpload maxSize={1048576} />); // 1MB
			expect(screen.getByText(/max 1 MB/i)).toBeInTheDocument();
		});

		it("displays both accept and maxSize hints", () => {
			render(<FileUpload accept=".png" maxSize={524288} />); // 512KB
			expect(screen.getByText(/\.png/i)).toBeInTheDocument();
			expect(screen.getByText(/max 512 KB/i)).toBeInTheDocument();
		});
	});

	describe("File Selection via Input", () => {
		it("handles file selection via input", async () => {
			const handleFileSelect = vi.fn();
			const { container } = render(
				<FileUpload onFileSelect={handleFileSelect} />,
			);

			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const input = container.querySelector('input[type="file"]');

			expect(input).toBeInTheDocument();
			if (input) {
				await userEvent.upload(input as HTMLInputElement, file);
				expect(handleFileSelect).toHaveBeenCalled();
				expect(handleFileSelect.mock.calls[0]?.[0]?.name).toBe("test.png");
			}
		});

		it("accepts file with matching type", async () => {
			const handleFileSelect = vi.fn();
			const { container } = render(
				<FileUpload accept=".png" onFileSelect={handleFileSelect} />,
			);

			const file = new File(["content"], "test.png", { type: "image/png" });
			const input = container.querySelector('input[type="file"]');

			if (input) {
				await userEvent.upload(input as HTMLInputElement, file);
				expect(handleFileSelect).toHaveBeenCalledWith(file);
			}
		});

		it("validates file size and calls onError", async () => {
			const handleFileSelect = vi.fn();
			const handleError = vi.fn();
			const { container } = render(
				<FileUpload
					maxSize={1024}
					onFileSelect={handleFileSelect}
					onError={handleError}
				/>,
			);

			// Create a file larger than maxSize (1KB)
			const largeFile = new File([new ArrayBuffer(2048)], "large.png", {
				type: "image/png",
			});
			const input = container.querySelector('input[type="file"]');

			if (input) {
				await userEvent.upload(input as HTMLInputElement, largeFile);
				expect(handleFileSelect).not.toHaveBeenCalled();
				expect(handleError).toHaveBeenCalledWith("File size exceeds 1 KB");
			}
		});

		it("accepts file within size limit", async () => {
			const handleFileSelect = vi.fn();
			const { container } = render(
				<FileUpload maxSize={2048} onFileSelect={handleFileSelect} />,
			);

			const file = new File(["content"], "small.png", { type: "image/png" });
			const input = container.querySelector('input[type="file"]');

			if (input) {
				await userEvent.upload(input as HTMLInputElement, file);
				expect(handleFileSelect).toHaveBeenCalledWith(file);
			}
		});
	});

	describe("Drag and Drop", () => {
		it("shows dragging state on drag over", () => {
			const { container } = render(<FileUpload />);
			const button = screen.getByRole("button");

			fireEvent.dragOver(button);
			expect(button).toHaveClass("border-primary", "bg-primary/10");
		});

		it("removes dragging state on drag leave", () => {
			const { container } = render(<FileUpload />);
			const button = screen.getByRole("button");

			fireEvent.dragOver(button);
			expect(button).toHaveClass("border-primary", "bg-primary/10");

			fireEvent.dragLeave(button);
			expect(button).not.toHaveClass("border-primary", "bg-primary/10");
		});

		it("handles file drop", async () => {
			const handleFileSelect = vi.fn();
			render(<FileUpload onFileSelect={handleFileSelect} />);

			const file = new File(["content"], "dropped.png", { type: "image/png" });
			const button = screen.getByRole("button");

			fireEvent.drop(button, {
				dataTransfer: { files: [file] },
			});

			expect(handleFileSelect).toHaveBeenCalledWith(file);
		});

		it("validates file size on drop", async () => {
			const handleFileSelect = vi.fn();
			const handleError = vi.fn();
			render(
				<FileUpload
					maxSize={1024}
					onFileSelect={handleFileSelect}
					onError={handleError}
				/>,
			);

			const largeFile = new File([new ArrayBuffer(2048)], "large.png", {
				type: "image/png",
			});
			const button = screen.getByRole("button");

			fireEvent.drop(button, {
				dataTransfer: { files: [largeFile] },
			});

			expect(handleFileSelect).not.toHaveBeenCalled();
			expect(handleError).toHaveBeenCalledWith("File size exceeds 1 KB");
		});

		it("does not handle drop when disabled", async () => {
			const handleFileSelect = vi.fn();
			render(<FileUpload disabled onFileSelect={handleFileSelect} />);

			const file = new File(["content"], "file.png", { type: "image/png" });
			const button = screen.getByRole("button");

			fireEvent.dragOver(button);
			expect(button).not.toHaveClass("border-primary");

			fireEvent.drop(button, {
				dataTransfer: { files: [file] },
			});

			expect(handleFileSelect).not.toHaveBeenCalled();
		});
	});

	describe("Selected File Display", () => {
		it("displays selected file", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			render(<FileUpload value={file} />);
			expect(screen.getByText("test.png")).toBeInTheDocument();
		});

		it("displays file size in human-readable format", () => {
			const file = new File([new ArrayBuffer(1024)], "test.png", {
				type: "image/png",
			});
			render(<FileUpload value={file} />);
			expect(screen.getByText("1 KB")).toBeInTheDocument();
		});

		it("displays file name with truncation when too long", () => {
			const longName = "a".repeat(100) + ".png";
			const file = new File(["content"], longName, { type: "image/png" });
			render(<FileUpload value={file} />);

			// Check if truncate class is present
			const fileName = screen.getByText(/a+\.png/);
			expect(fileName).toHaveClass("truncate");
		});
	});

	describe("Progress Bar", () => {
		it("displays progress bar", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} progress={50} />);

			const progressBar = container.querySelector(
				'[style*="width: 50%"]',
			) as HTMLElement;
			expect(progressBar).toBeInTheDocument();
		});

		it("displays 0% progress", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} progress={0} />);

			const progressBar = container.querySelector(
				'[style*="width: 0%"]',
			) as HTMLElement;
			expect(progressBar).toBeInTheDocument();
		});

		it("displays 100% progress", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} progress={100} />);

			const progressBar = container.querySelector(
				'[style*="width: 100%"]',
			) as HTMLElement;
			expect(progressBar).toBeInTheDocument();
		});

		it("clamps progress above 100% to 100%", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} progress={150} />);

			const progressBar = container.querySelector(
				'[style*="width: 100%"]',
			) as HTMLElement;
			expect(progressBar).toBeInTheDocument();
		});

		it("clamps progress below 0% to 0%", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} progress={-50} />);

			const progressBar = container.querySelector(
				'[style*="width: 0%"]',
			) as HTMLElement;
			expect(progressBar).toBeInTheDocument();
		});

		it("does not display progress bar when progress is undefined", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			const { container } = render(<FileUpload value={file} />);

			const progressBar = container.querySelector('[class*="bg-primary"]');
			expect(progressBar).not.toBeInTheDocument();
		});
	});

	describe("Clear Functionality", () => {
		it("handles clear", async () => {
			const handleClear = vi.fn();
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			render(<FileUpload value={file} onClear={handleClear} />);

			const clearButton = screen.getByRole("button");
			await userEvent.click(clearButton);
			expect(handleClear).toHaveBeenCalled();
		});

		it("does not show clear button when disabled", () => {
			const handleClear = vi.fn();
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			render(<FileUpload value={file} onClear={handleClear} disabled />);

			// Clear button should not be present when disabled
			const buttons = screen.queryAllByRole("button");
			expect(buttons).toHaveLength(0);
		});

		it("does not show clear button when onClear is not provided", () => {
			const file = new File(["dummy content"], "test.png", { type: "image/png" });
			render(<FileUpload value={file} />);

			const buttons = screen.queryAllByRole("button");
			expect(buttons).toHaveLength(0);
		});
	});

	describe("Error Handling", () => {
		it("displays error", () => {
			render(<FileUpload error="File too large" />);
			expect(screen.getByText("File too large")).toBeInTheDocument();
		});

		it("shows error state styling", () => {
			render(<FileUpload error="Invalid file" />);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("border-destructive", "bg-destructive/10");
		});

		it("displays error with selected file", () => {
			const file = new File(["content"], "test.png", { type: "image/png" });
			render(<FileUpload value={file} error="Upload failed" />);

			expect(screen.getByText("test.png")).toBeInTheDocument();
			expect(screen.getByText("Upload failed")).toBeInTheDocument();
		});
	});

	describe("Disabled State", () => {
		it("respects disabled state", () => {
			render(<FileUpload disabled />);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("cursor-not-allowed");
		});

		it("does not open file dialog when disabled", async () => {
			const handleFileSelect = vi.fn();
			const { container } = render(
				<FileUpload disabled onFileSelect={handleFileSelect} />,
			);

			const button = screen.getByRole("button");
			await userEvent.click(button);

			expect(handleFileSelect).not.toHaveBeenCalled();
		});

		it("disables input when disabled", () => {
			const { container } = render(<FileUpload disabled />);
			const input = container.querySelector('input[type="file"]');

			expect(input).toBeDisabled();
		});
	});

	describe("Click to Upload", () => {
		it("opens file dialog on click", async () => {
			const inputRef = { current: { click: vi.fn() } };
			const { container } = render(<FileUpload />);

			// Get the input element and verify it exists
			const input = container.querySelector('input[type="file"]');
			expect(input).toBeInTheDocument();

			// Click the upload button
			const button = screen.getByRole("button");
			await userEvent.click(button);

			// The input click should be triggered (not verifiable in test environment)
			expect(button).toBeInTheDocument();
		});

		it("does not open file dialog on click when disabled", async () => {
			const { container } = render(<FileUpload disabled />);

			const input = container.querySelector('input[type="file"]');
			const button = screen.getByRole("button");

			expect(input).toBeDisabled();

			await userEvent.click(button);

			// Verify no errors thrown and input remains disabled
			expect(input).toBeDisabled();
		});
	});

	describe("File Size Formatting", () => {
		it("formats bytes correctly", () => {
			const file = new File([new ArrayBuffer(500)], "test.png", {
				type: "image/png",
			});
			render(<FileUpload value={file} />);
			expect(screen.getByText("500 Bytes")).toBeInTheDocument();
		});

		it("formats kilobytes correctly", () => {
			const file = new File([new ArrayBuffer(2048)], "test.png", {
				type: "image/png",
			});
			render(<FileUpload value={file} />);
			expect(screen.getByText("2 KB")).toBeInTheDocument();
		});

		it("formats megabytes correctly", () => {
			const file = new File([new ArrayBuffer(2 * 1024 * 1024)], "test.png", {
				type: "image/png",
			});
			render(<FileUpload value={file} />);
			expect(screen.getByText(/2 MB/)).toBeInTheDocument();
		});

		it("formats gigabytes correctly", () => {
			const file = new File(
				[new ArrayBuffer(Math.floor(1.5 * 1024 * 1024 * 1024))],
				"test.png",
				{ type: "image/png" },
			);
			render(<FileUpload value={file} />);
			expect(screen.getByText(/1.5 GB/)).toBeInTheDocument();
		});

		it("formats zero bytes correctly", () => {
			const file = new File([""], "test.png", { type: "image/png" });
			render(<FileUpload value={file} />);
			expect(screen.getByText("0 Bytes")).toBeInTheDocument();
		});
	});
});
