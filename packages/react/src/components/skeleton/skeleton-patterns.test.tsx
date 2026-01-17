import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	SkeletonAvatar,
	SkeletonButton,
	SkeletonCardContent,
	SkeletonCircle,
	SkeletonHeader,
	SkeletonParagraph,
	SkeletonRectangle,
	SkeletonText,
} from "./skeleton-patterns";

describe("Skeleton Patterns", () => {
	describe("SkeletonText", () => {
		it("renders with default 3 lines", () => {
			const { container } = render(<SkeletonText />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			expect(skeletons).toHaveLength(3);
		});

		it("renders with custom line count", () => {
			const { container } = render(<SkeletonText lines={5} />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			expect(skeletons).toHaveLength(5);
		});

		it("applies custom last line width", () => {
			const { container } = render(<SkeletonText lastLineWidth="40%" />);
			const skeletons = container.querySelectorAll('[style*="width: 40%"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("applies custom className", () => {
			const { container } = render(<SkeletonText className="custom-class" />);
			const wrapper = container.querySelector(".custom-class");
			expect(wrapper).toBeInTheDocument();
		});

		it("uses default last line width of 75%", () => {
			const { container } = render(<SkeletonText />);
			const skeletons = container.querySelectorAll('[style*="width: 75%"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});
	});

	describe("SkeletonCircle", () => {
		it("renders circular skeleton", () => {
			const { container } = render(<SkeletonCircle />);
			const circle = container.querySelector(".rounded-full");
			expect(circle).toBeInTheDocument();
		});

		it("applies custom size", () => {
			const { container } = render(<SkeletonCircle size="5rem" />);
			const circle = container.querySelector('[style*="width: 5rem"]');
			expect(circle).toBeInTheDocument();
		});

		it("uses default size of 3rem", () => {
			const { container } = render(<SkeletonCircle />);
			const circle = container.querySelector('[style*="width: 3rem"]');
			expect(circle).toBeInTheDocument();
		});

		it("applies custom className", () => {
			const { container } = render(<SkeletonCircle className="custom-class" />);
			const circle = container.querySelector(".custom-class");
			expect(circle).toBeInTheDocument();
		});

		it("has equal width and height", () => {
			const { container } = render(<SkeletonCircle size="4rem" />);
			const circle = container.querySelector(".rounded-full");
			expect(circle).toHaveStyle({ width: "4rem", height: "4rem" });
		});
	});

	describe("SkeletonRectangle", () => {
		it("renders rectangular skeleton", () => {
			const { container } = render(<SkeletonRectangle />);
			const rect = container.querySelector('[style*="width: 100%"]');
			expect(rect).toBeInTheDocument();
		});

		it("applies custom width", () => {
			const { container } = render(<SkeletonRectangle width="200px" />);
			const rect = container.querySelector('[style*="width: 200px"]');
			expect(rect).toBeInTheDocument();
		});

		it("applies custom height", () => {
			const { container } = render(<SkeletonRectangle height="150px" />);
			const rect = container.querySelector('[style*="height: 150px"]');
			expect(rect).toBeInTheDocument();
		});

		it("applies rounded-md by default", () => {
			const { container } = render(<SkeletonRectangle />);
			const rect = container.querySelector(".rounded-md");
			expect(rect).toBeInTheDocument();
		});

		it("applies custom rounded variant", () => {
			const { container } = render(<SkeletonRectangle rounded="lg" />);
			const rect = container.querySelector(".rounded-lg");
			expect(rect).toBeInTheDocument();
		});

		it("applies custom className", () => {
			const { container } = render(
				<SkeletonRectangle className="custom-class" />,
			);
			const rect = container.querySelector(".custom-class");
			expect(rect).toBeInTheDocument();
		});
	});

	describe("SkeletonAvatar", () => {
		it("renders avatar skeleton", () => {
			const { container } = render(<SkeletonAvatar />);
			const avatar = container.querySelector(".rounded-full");
			expect(avatar).toBeInTheDocument();
		});

		it("renders with sm size", () => {
			const { container } = render(<SkeletonAvatar size="sm" />);
			const avatar = container.querySelector('[style*="width: 2rem"]');
			expect(avatar).toBeInTheDocument();
		});

		it("renders with md size (default)", () => {
			const { container } = render(<SkeletonAvatar size="md" />);
			const avatar = container.querySelector('[style*="width: 3rem"]');
			expect(avatar).toBeInTheDocument();
		});

		it("renders with lg size", () => {
			const { container } = render(<SkeletonAvatar size="lg" />);
			const avatar = container.querySelector('[style*="width: 4rem"]');
			expect(avatar).toBeInTheDocument();
		});

		it("applies custom className", () => {
			const { container } = render(<SkeletonAvatar className="custom-class" />);
			const avatar = container.querySelector(".custom-class");
			expect(avatar).toBeInTheDocument();
		});
	});

	describe("SkeletonParagraph", () => {
		it("renders with default 2 paragraphs", () => {
			const { container } = render(<SkeletonParagraph />);
			// Each paragraph should have a data-testid pattern
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("renders with custom paragraph count", () => {
			const { container } = render(<SkeletonParagraph paragraphs={3} />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("renders with custom line counts per paragraph", () => {
			const { container } = render(<SkeletonParagraph lines={[2, 4, 3]} />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			// Should have 2 + 4 + 3 = 9 lines total
			expect(skeletons.length).toBe(9);
		});

		it("applies custom className", () => {
			const { container } = render(
				<SkeletonParagraph className="custom-class" />,
			);
			const wrapper = container.querySelector(".custom-class");
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe("SkeletonHeader", () => {
		it("renders header with title and subtitle", () => {
			const { container } = render(<SkeletonHeader />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			// Should have title and subtitle (2 lines)
			expect(skeletons.length).toBe(2);
		});

		it("renders header with only title", () => {
			const { container } = render(<SkeletonHeader showSubtitle={false} />);
			const skeletons = container.querySelectorAll(
				'[data-testid^="skeleton-text-line-"]',
			);
			// Should have only title (1 line)
			expect(skeletons.length).toBe(1);
		});

		it("applies custom title width", () => {
			const { container } = render(<SkeletonHeader titleWidth="80%" />);
			const skeletons = container.querySelectorAll('[style*="width: 80%"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("applies custom subtitle width", () => {
			const { container } = render(<SkeletonHeader subtitleWidth="50%" />);
			const skeletons = container.querySelectorAll('[style*="width: 50%"]');
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("applies custom className", () => {
			const { container } = render(<SkeletonHeader className="custom-class" />);
			const wrapper = container.querySelector(".custom-class");
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe("SkeletonButton", () => {
		it("renders button skeleton", () => {
			const { container } = render(<SkeletonButton />);
			const button = container.querySelector('[style*="width: auto"]');
			expect(button).toBeInTheDocument();
		});

		it("renders with sm size", () => {
			const { container } = render(<SkeletonButton size="sm" />);
			const button = container.querySelector(".h-8");
			expect(button).toBeInTheDocument();
		});

		it("renders with md size (default)", () => {
			const { container } = render(<SkeletonButton size="md" />);
			const button = container.querySelector(".h-10");
			expect(button).toBeInTheDocument();
		});

		it("renders with lg size", () => {
			const { container } = render(<SkeletonButton size="lg" />);
			const button = container.querySelector(".h-12");
			expect(button).toBeInTheDocument();
		});

		it("applies custom width", () => {
			const { container } = render(<SkeletonButton width="10rem" />);
			const button = container.querySelector('[style*="width: 10rem"]');
			expect(button).toBeInTheDocument();
		});

		it("applies custom className", () => {
			const { container } = render(<SkeletonButton className="custom-class" />);
			const button = container.querySelector(".custom-class");
			expect(button).toBeInTheDocument();
		});
	});

	describe("SkeletonCardContent", () => {
		it("renders card content with header, content, and footer", () => {
			render(<SkeletonCardContent />);
			const skeletons = screen.getAllByTestId(/skeleton/);
			// Should have header (2 lines), content (3 lines), footer (2 buttons)
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("renders without header", () => {
			render(<SkeletonCardContent showHeader={false} />);
			const skeletons = screen.getAllByTestId(/skeleton/);
			// Should have content and footer only
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("renders without footer", () => {
			render(<SkeletonCardContent showFooter={false} />);
			const skeletons = screen.getAllByTestId(/skeleton/);
			// Should have header and content only
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("renders with custom content lines", () => {
			render(<SkeletonCardContent contentLines={5} />);
			const skeletons = screen.getAllByTestId(/skeleton-text-line/);
			// Should have header (2 lines) + content (5 lines) = 7 lines
			expect(skeletons.length).toBe(7);
		});

		it("applies custom className", () => {
			const { container } = render(
				<SkeletonCardContent className="custom-class" />,
			);
			const wrapper = container.querySelector(".custom-class");
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe("Pattern Composition", () => {
		it("allows combining multiple patterns", () => {
			render(
				<div className="space-y-4">
					<SkeletonHeader showSubtitle={false} />
					<SkeletonText lines={3} />
					<SkeletonButton width="8rem" />
				</div>,
			);
			const skeletons = screen.getAllByTestId(/skeleton/);
			expect(skeletons.length).toBeGreaterThan(0);
		});

		it("allows nesting patterns", () => {
			render(
				<div className="flex gap-4">
					<SkeletonAvatar size="lg" />
					<div className="flex-1 space-y-2">
						<SkeletonHeader />
						<SkeletonText lines={2} />
					</div>
				</div>,
			);
			const skeletons = screen.getAllByTestId(/skeleton/);
			expect(skeletons.length).toBeGreaterThan(0);
		});
	});
});
