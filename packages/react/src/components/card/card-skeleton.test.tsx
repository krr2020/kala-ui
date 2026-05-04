import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardSkeleton } from "./card-skeleton";

describe("CardSkeleton", () => {
	it("renders with default variant", () => {
		const { container } = render(<CardSkeleton />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
		expect(container.firstChild).toHaveClass("rounded-md", "border", "bg-card");
	});

	it("renders with custom data-testid", () => {
		render(<CardSkeleton data-testid="custom-skeleton" />);
		expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(<CardSkeleton className="extra-class" />);
		expect(container.firstChild).toHaveClass("extra-class");
	});

	it("renders default variant with header", () => {
		const { container } = render(
			<CardSkeleton variant="default" hasHeader={true} />,
		);
		// Default variant with header should render header skeleton items
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders default variant without header", () => {
		const { container } = render(
			<CardSkeleton variant="default" hasHeader={false} />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
		// Without header, the content area should have py-6 instead of pt-0
		const contentArea = container.querySelector(".py-6");
		expect(contentArea).toBeInTheDocument();
	});

	it("renders default variant with footer", () => {
		const { container } = render(
			<CardSkeleton variant="default" hasFooter={true} />,
		);
		// Should have a border-t element for footer
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("renders default variant with showActions", () => {
		const { container } = render(
			<CardSkeleton variant="default" showActions={true} />,
		);
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("renders default variant with custom contentRows", () => {
		render(<CardSkeleton variant="default" contentRows={5} />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withImage variant", () => {
		render(<CardSkeleton variant="withImage" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withImage variant without header", () => {
		const { container } = render(
			<CardSkeleton variant="withImage" hasHeader={false} />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
		const contentArea = container.querySelector(".py-6");
		expect(contentArea).toBeInTheDocument();
	});

	it("renders withImage variant with footer", () => {
		const { container } = render(
			<CardSkeleton variant="withImage" hasFooter={true} />,
		);
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("renders withImageTop variant", () => {
		render(<CardSkeleton variant="withImageTop" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withImageTop variant without header", () => {
		const { container } = render(
			<CardSkeleton variant="withImageTop" hasHeader={false} />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withImageTop variant with header (hasHeader overrides default false)", () => {
		render(<CardSkeleton variant="withImageTop" hasHeader={true} />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withImageTop variant with footer", () => {
		const { container } = render(
			<CardSkeleton variant="withImageTop" hasFooter={true} />,
		);
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("renders horizontal variant with left image position", () => {
		const { container } = render(
			<CardSkeleton variant="horizontal" imagePosition="left" />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
		// Horizontal variant uses flex layout
		const flexContainer = container.querySelector(".flex");
		expect(flexContainer).toBeInTheDocument();
	});

	it("renders horizontal variant with right image position", () => {
		render(<CardSkeleton variant="horizontal" imagePosition="right" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders horizontal variant with top image position", () => {
		render(<CardSkeleton variant="horizontal" imagePosition="top" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders horizontal variant without header", () => {
		const { container } = render(
			<CardSkeleton variant="horizontal" hasHeader={false} />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
		const contentArea = container.querySelector(".py-6");
		expect(contentArea).toBeInTheDocument();
	});

	it("renders horizontal variant with footer", () => {
		const { container } = render(
			<CardSkeleton variant="horizontal" hasFooter={true} />,
		);
		const footer = container.querySelector(".border-t");
		expect(footer).toBeInTheDocument();
	});

	it("renders withFooter variant", () => {
		render(<CardSkeleton variant="withFooter" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withFooter variant without header", () => {
		const { container } = render(
			<CardSkeleton variant="withFooter" hasHeader={false} />,
		);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders withFooter variant with showActions false", () => {
		const { container } = render(
			<CardSkeleton variant="withFooter" showActions={false} />,
		);
		// With showActions=false, the footer should not render
		const footer = container.querySelector(".border-t");
		expect(footer).not.toBeInTheDocument();
	});

	it("renders minimal variant", () => {
		render(<CardSkeleton variant="minimal" />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("renders minimal variant with custom contentRows", () => {
		render(<CardSkeleton variant="minimal" contentRows={1} />);
		expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
	});

	it("has compound component CardSkeleton.Skeleton", () => {
		expect(CardSkeleton.Skeleton).toBe(CardSkeleton);
	});
});
