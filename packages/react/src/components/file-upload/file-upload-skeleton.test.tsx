import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileUploadSkeleton } from "./file-upload-skeleton";

describe("FileUploadSkeleton", () => {
	it("renders without crashing", () => {
		render(<FileUploadSkeleton />);
		const skeleton = screen.getByTestId("file-upload-skeleton");
		expect(skeleton).toBeInTheDocument();
	});

	it("renders with default test id", () => {
		render(<FileUploadSkeleton />);
		expect(screen.getByTestId("file-upload-skeleton")).toBeInTheDocument();
	});

	it("accepts custom data-testid", () => {
		render(<FileUploadSkeleton data-testid="custom-upload-skeleton" />);
		expect(screen.getByTestId("custom-upload-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<FileUploadSkeleton className="custom-class" />);
		const skeleton = screen.getByTestId("file-upload-skeleton");
		expect(skeleton).toHaveClass("custom-class");
	});

	it("shows icon by default", () => {
		const { container } = render(<FileUploadSkeleton />);
		const icon = container.querySelector(".h-12.w-12.rounded-full");
		expect(icon).toBeInTheDocument();
	});

	it("hides icon when showIcon is false", () => {
		const { container } = render(<FileUploadSkeleton showIcon={false} />);
		const icon = container.querySelector(".h-12.w-12.rounded-full");
		expect(icon).not.toBeInTheDocument();
	});

	it("shows upload button by default", () => {
		const { container } = render(<FileUploadSkeleton />);
		const button = container.querySelector(".h-10.w-32.rounded-md");
		expect(button).toBeInTheDocument();
	});

	it("hides upload button when showButton is false", () => {
		const { container } = render(<FileUploadSkeleton showButton={false} />);
		const button = container.querySelector(".h-10.w-32.rounded-md");
		expect(button).not.toBeInTheDocument();
	});

	it("always renders title skeleton", () => {
		const { container } = render(
			<FileUploadSkeleton showIcon={false} showButton={false} />,
		);
		const title = container.querySelector(".h-5.w-48");
		expect(title).toBeInTheDocument();
	});

	it("always renders description skeleton", () => {
		const { container } = render(
			<FileUploadSkeleton showIcon={false} showButton={false} />,
		);
		const description = container.querySelector(".h-4.w-64");
		expect(description).toBeInTheDocument();
	});

	it("renders with dashed border", () => {
		render(<FileUploadSkeleton />);
		const skeleton = screen.getByTestId("file-upload-skeleton");
		expect(skeleton).toHaveClass("border-2", "border-dashed", "rounded-lg");
	});
});
