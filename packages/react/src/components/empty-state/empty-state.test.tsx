import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Search, } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
	describe("Basic Rendering", () => {
		it("renders with title", () => {
			render(<EmptyState title="No data" />);
			expect(screen.getByText("No data")).toBeInTheDocument();
		});

		it("renders with description", () => {
			render(
				<EmptyState title="No data" description="There is no data available" />,
			);
			expect(screen.getByText("There is no data available")).toBeInTheDocument();
		});

		it("does not render description when not provided", () => {
			render(<EmptyState title="No data" />);
			const paragraphs = screen.queryAllByRole("paragraph");
			expect(paragraphs.length).toBe(0);
		});
	});

	describe("Icons", () => {
		it("renders with custom LucideIcon", () => {
			const { container } = render(<EmptyState title="No data" icon={Search} />);
			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("renders with custom string icon", () => {
			const { container } = render(<EmptyState title="No data" icon="test-icon" />);
			// The string icon is part of the className
			const iconContainer = container.querySelector('[aria-hidden="true"] span');
			expect(iconContainer).toBeInTheDocument();
			expect(iconContainer).toHaveClass("test-icon");
		});

		it("renders default Inbox icon when no icon provided", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("icon container has rounded-full class", () => {
			const { container } = render(<EmptyState title="No data" />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toBeInTheDocument();
		});

		it("icon container has bg-muted class", () => {
			const { container } = render(<EmptyState title="No data" />);
			const iconContainer = container.querySelector(".rounded-full");
			expect(iconContainer).toHaveClass("bg-muted");
		});

		it("icon is hidden from screen readers", () => {
			const { container } = render(<EmptyState title="No data" />);
			const iconContainer = container.querySelector('[aria-hidden="true"]');
			expect(iconContainer).toBeInTheDocument();
		});
	});

	describe("Action Button", () => {
		it("renders action button when provided", () => {
			const handleClick = vi.fn();
			render(
				<EmptyState
					title="No data"
					action={{ label: "Create new", onClick: handleClick }}
				/>,
			);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("calls action onClick when button is clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<EmptyState
					title="No data"
					action={{ label: "Create new", onClick: handleClick }}
				/>,
			);

			const button = screen.getByRole("button");
			await user.click(button);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("does not render action button when not provided", () => {
			render(<EmptyState title="No data" />);
			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});

		it("renders with default button variant", () => {
			const { container } = render(
				<EmptyState
					title="No data"
					action={{ label: "Create new", onClick: vi.fn() }}
				/>,
			);
			expect(container.firstChild).toHaveClass("border-dashed");
		});

		it("renders with custom button variant", () => {
			render(
				<EmptyState
					title="No data"
					action={{
						label: "Create new",
						onClick: vi.fn(),
						variant: "destructive",
					}}
				/>,
			);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});

	describe("Variants", () => {
		it("renders with default variant", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("border-dashed");
		});

		it("renders with destructive variant", () => {
			const { container } = render(
				<EmptyState title="No data" variant="destructive" />,
			);
			expect(container.firstChild).toHaveClass("border-destructive/20");
		});

		it("applies correct background for default variant", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("bg-muted/20");
		});

		it("applies correct background for destructive variant", () => {
			const { container } = render(
				<EmptyState title="No data" variant="destructive" />,
			);
			expect(container.firstChild).toHaveClass("bg-destructive/10");
		});
	});

	describe("Sizes", () => {
		it("renders with default size", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("min-h-[300px]");
		});

		it("renders with sm size", () => {
			const { container } = render(
				<EmptyState title="No data" size="sm" />,
			);
			expect(container.firstChild).toHaveClass("min-h-[150px]");
			expect(container.firstChild).toHaveClass("p-4");
		});

		it("renders with lg size", () => {
			const { container } = render(
				<EmptyState title="No data" size="lg" />,
			);
			expect(container.firstChild).toHaveClass("min-h-[500px]");
		});
	});

	describe("Loading State", () => {
		it("renders EmptyStateSkeleton when isLoading is true", () => {
			const { container } = render(<EmptyState title="No data" isLoading />);
			expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
		});

		it("renders custom skeleton when isLoading and skeleton prop provided", () => {
			render(
				<EmptyState
					title="No data"
					isLoading
					skeleton={<div data-testid="custom-skeleton">Loading...</div>}
				/>,
			);
			expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
		});

		it("does not render content when isLoading is true", () => {
			render(<EmptyState title="No data" description="Test" isLoading />);
			expect(screen.queryByText("No data")).not.toBeInTheDocument();
			expect(screen.queryByText("Test")).not.toBeInTheDocument();
		});

		it("does not render action button when isLoading is true", () => {
			render(
				<EmptyState
					title="No data"
					isLoading
					action={{ label: "Action", onClick: vi.fn() }}
				/>,
			);
			expect(screen.queryByRole("button")).not.toBeInTheDocument();
		});
	});

	describe("Children", () => {
		it("renders children when provided", () => {
			render(
				<EmptyState title="No data">
					<div data-testid="child-content">Child content</div>
				</EmptyState>,
			);
			expect(screen.getByTestId("child-content")).toBeInTheDocument();
		});

		it("does not render children when isLoading is true", () => {
			render(
				<EmptyState title="No data" isLoading>
					<div data-testid="child-content">Child content</div>
				</EmptyState>,
			);
			expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has proper data-comp attribute", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.querySelector('[data-comp="empty-state"]')).toBeInTheDocument();
		});

		it("icon is hidden from screen readers", () => {
			const { container } = render(<EmptyState title="No data" />);
			const iconContainer = container.querySelector('[aria-hidden="true"]');
			expect(iconContainer).toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("applies custom className", () => {
			const { container } = render(
				<EmptyState title="No data" className="custom-class" />,
			);
			expect(container.firstChild).toHaveClass("custom-class");
		});

		it("has centered layout", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("items-center");
			expect(container.firstChild).toHaveClass("justify-center");
		});

		it("has flex column layout", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("flex-col");
		});

		it("has rounded corners", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("rounded-lg");
		});

		it("has border", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("border");
		});

		it("has padding", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("p-8");
		});

		it("has text-center", () => {
			const { container } = render(<EmptyState title="No data" />);
			expect(container.firstChild).toHaveClass("text-center");
		});
	});

	describe("Content Structure", () => {
		it("renders title as h3", () => {
			const { container } = render(<EmptyState title="No data" />);
			const title = container.querySelector("h3");
			expect(title).toBeInTheDocument();
			expect(title).toHaveTextContent("No data");
		});

		it("title has correct styling", () => {
			const { container } = render(<EmptyState title="No data" />);
			const title = container.querySelector("h3");
			expect(title).toHaveClass("text-lg");
			expect(title).toHaveClass("font-semibold");
		});

		it("description has correct styling", () => {
			const { container } = render(
				<EmptyState title="No data" description="Test description" />,
			);
			const description = container.querySelector("p");
			expect(description).toHaveClass("text-sm");
			expect(description).toHaveClass("text-muted-foreground");
		});

		it("description has max width", () => {
			const { container } = render(
				<EmptyState title="No data" description="Test description" />,
			);
			const description = container.querySelector("p");
			expect(description).toHaveClass("max-w-sm");
		});
	});
});
