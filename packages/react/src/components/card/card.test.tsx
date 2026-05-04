import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardImageOverlay,
	CardMarker,
	CardSubtitle,
	CardTitle,
} from "./card";

describe("Card", () => {
	it("renders card with content", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>Card Content</CardContent>
				<CardFooter>Card Footer</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Card Title")).toBeInTheDocument();
		expect(screen.getByText("Card Description")).toBeInTheDocument();
		expect(screen.getByText("Card Content")).toBeInTheDocument();
		expect(screen.getByText("Card Footer")).toBeInTheDocument();
	});

	it("applies card styles", () => {
		const { container } = render(<Card>Content</Card>);
		const card = container.firstChild;
		expect(card).toHaveClass("bg-card");
		expect(card).toHaveClass("text-card-foreground");
		expect(card).toHaveClass("rounded-md");
		expect(card).toHaveClass("border");
	});

	it("applies custom className", () => {
		const { container } = render(<Card className="custom-class">Content</Card>);
		expect(container.firstChild).toHaveClass("custom-class");
	});

	it("renders with isLoading and custom skeleton", () => {
		render(
			<Card isLoading skeleton={<div data-testid="custom-skeleton">Loading...</div>}>
				Content
			</Card>,
		);
		expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("renders with isLoading and skeletonConfig (uses CardSkeleton)", () => {
		render(<Card isLoading skeletonConfig={{ variant: "default" }}>Content</Card>);
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("renders with isLoading and no skeleton props (uses default CardSkeleton)", () => {
		render(<Card isLoading>Content</Card>);
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("forwards additional HTML props", () => {
		render(<Card data-testid="my-card" id="card-1">Content</Card>);
		const card = screen.getByTestId("my-card");
		expect(card).toHaveAttribute("id", "card-1");
	});
});

describe("CardTitle", () => {
	it("renders as h5 heading", () => {
		render(<CardTitle>Title</CardTitle>);
		const heading = screen.getByRole("heading", { level: 5 });
		expect(heading).toHaveTextContent("Title");
	});

	it("applies custom className", () => {
		const { container } = render(<CardTitle className="custom">Title</CardTitle>);
		expect(container.firstChild).toHaveClass("custom");
	});
});

describe("CardSubtitle", () => {
	it("renders as h6 heading", () => {
		render(<CardSubtitle>Subtitle</CardSubtitle>);
		const heading = screen.getByRole("heading", { level: 6 });
		expect(heading).toHaveTextContent("Subtitle");
	});

	it("applies custom className", () => {
		const { container } = render(
			<CardSubtitle className="custom">Subtitle</CardSubtitle>,
		);
		expect(container.firstChild).toHaveClass("custom");
	});
});

describe("CardAction", () => {
	it("renders with ml-auto class", () => {
		const { container } = render(<CardAction>Action</CardAction>);
		expect(container.firstChild).toHaveClass("ml-auto");
	});

	it("applies custom className", () => {
		const { container } = render(
			<CardAction className="custom">Action</CardAction>,
		);
		expect(container.firstChild).toHaveClass("ml-auto", "custom");
	});
});

describe("CardImage", () => {
	it("renders an image", () => {
		render(<CardImage src="test.jpg" alt="Test image" />);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "test.jpg");
		expect(img).toHaveAttribute("alt", "Test image");
	});

	it("warns when alt text is missing", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<CardImage src="test.jpg" />);
		expect(warnSpy).toHaveBeenCalledWith(
			"CardImage: Missing alt text. Images should have descriptive alt text for accessibility.",
		);
		warnSpy.mockRestore();
	});

	it("applies custom className", () => {
		const { container } = render(
			<CardImage src="test.jpg" alt="test" className="custom" />,
		);
		expect(container.firstChild).toHaveClass("custom");
	});
});

describe("CardImageOverlay", () => {
	it("renders overlay content", () => {
		render(<CardImageOverlay>Overlay</CardImageOverlay>);
		expect(screen.getByText("Overlay")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<CardImageOverlay className="custom">Overlay</CardImageOverlay>,
		);
		expect(container.firstChild).toHaveClass("custom");
	});
});

describe("CardMarker", () => {
	it("renders default variant with children", () => {
		render(<CardMarker>New</CardMarker>);
		expect(screen.getByText("New")).toBeInTheDocument();
	});

	it("renders default variant at top-left position", () => {
		const { container } = render(
			<CardMarker position="top-left">Badge</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("top-2", "left-2");
		expect(marker).toHaveClass("rounded");
	});

	it("renders default variant at top-right position", () => {
		const { container } = render(
			<CardMarker position="top-right">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("top-2", "right-2");
	});

	it("renders default variant at bottom-left position", () => {
		const { container } = render(
			<CardMarker position="bottom-left">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bottom-2", "left-2");
	});

	it("renders default variant at bottom-right position", () => {
		const { container } = render(
			<CardMarker position="bottom-right">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bottom-2", "right-2");
	});

	it("renders default variant with primary color", () => {
		const { container } = render(
			<CardMarker color="primary">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bg-primary", "text-primary-foreground");
	});

	it("renders default variant with success color", () => {
		const { container } = render(
			<CardMarker color="success">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bg-success", "text-success-foreground");
	});

	it("renders default variant with warning color", () => {
		const { container } = render(
			<CardMarker color="warning">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bg-warning", "text-warning-foreground");
	});

	it("renders default variant with danger color", () => {
		const { container } = render(
			<CardMarker color="danger">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bg-destructive", "text-destructive-foreground");
	});

	it("renders default variant with info color", () => {
		const { container } = render(
			<CardMarker color="info">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bg-info", "text-info-foreground");
	});

	it("renders icon variant", () => {
		const { container } = render(
			<CardMarker variant="icon">Icon</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("rounded-full", "h-10", "w-10");
		expect(marker).toHaveClass("flex", "items-center", "justify-center");
	});

	it("renders icon variant at bottom-right", () => {
		const { container } = render(
			<CardMarker variant="icon" position="bottom-right">Icon</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("bottom-2", "right-2");
	});

	it("renders ribbon variant at top-left", () => {
		const { container } = render(
			<CardMarker variant="ribbon" position="top-left">Ribbon</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("-rotate-45", "origin-top-left");
		expect(marker).toHaveClass("top-3", "-left-8");
	});

	it("renders ribbon variant at top-right", () => {
		const { container } = render(
			<CardMarker variant="ribbon" position="top-right">Ribbon</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("rotate-45", "origin-top-right");
		expect(marker).toHaveClass("top-3", "-right-8");
	});

	it("renders ribbon variant at bottom-left", () => {
		const { container } = render(
			<CardMarker variant="ribbon" position="bottom-left">Ribbon</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("rotate-45", "origin-bottom-left");
		expect(marker).toHaveClass("bottom-3", "-left-8");
	});

	it("renders ribbon variant at bottom-right", () => {
		const { container } = render(
			<CardMarker variant="ribbon" position="bottom-right">Ribbon</CardMarker>,
		);
		const marker = container.firstChild;
		expect(marker).toHaveClass("-rotate-45", "origin-bottom-right");
		expect(marker).toHaveClass("bottom-3", "-right-8");
	});

	it("applies custom className", () => {
		const { container } = render(
			<CardMarker className="custom">Badge</CardMarker>,
		);
		expect(container.firstChild).toHaveClass("custom");
	});
});
