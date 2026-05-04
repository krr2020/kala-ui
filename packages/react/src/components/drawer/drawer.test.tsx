import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";

// Mock vaul - source does: import { Drawer as DrawerPrimitive } from "vaul"
// then uses DrawerPrimitive.Root, DrawerPrimitive.Trigger, etc.
vi.mock("vaul", () => {
	const DrawerRoot = vi.fn(
		({ children, direction, shouldScaleBackground, open, onOpenChange, ...props }: any) => (
			<div data-testid="drawer-root" data-direction={direction || "bottom"}>
				{typeof children === "function"
					? children({ open: open ?? true, onClose: onOpenChange ?? (() => {}) })
					: children}
			</div>
		),
	);
	const DrawerPortal = vi.fn(({ children }: any) => (
		<div data-testid="drawer-portal">{children}</div>
	));
	const DrawerOverlay = vi.fn(({ className, ...props }: any) => (
		<div data-testid="drawer-overlay" className={className} {...props} />
	));
	const DrawerTrigger = vi.fn(({ children, className, asChild, ...props }: any) => (
		<button data-testid="drawer-trigger" className={className} {...props}>
			{children}
		</button>
	));
	const DrawerClose = vi.fn(({ children, className, asChild, ...props }: any) => (
		<button data-testid="drawer-close" className={className} {...props}>
			{children}
		</button>
	));
	const DrawerContent = vi.fn(({ children, className, ...props }: any) => (
		<div data-testid="drawer-content" className={className} {...props}>
			{children}
		</div>
	));
	const DrawerTitle = vi.fn(({ children, className, ...props }: any) => (
		<h2 data-testid="drawer-title" className={className} {...props}>
			{children}
		</h2>
	));
	const DrawerDescription = vi.fn(({ children, className, ...props }: any) => (
		<p data-testid="drawer-description" className={className} {...props}>
			{children}
		</p>
	));

	return {
		Drawer: {
			Root: DrawerRoot,
			Trigger: DrawerTrigger,
			Close: DrawerClose,
			Portal: DrawerPortal,
			Overlay: DrawerOverlay,
			Content: DrawerContent,
			Title: DrawerTitle,
			Description: DrawerDescription,
		},
		DrawerPortal,
		DrawerOverlay,
		DrawerTrigger,
		DrawerClose,
		DrawerContent,
		DrawerTitle,
		DrawerDescription,
	};
});

// ============================================================================
// Drawer (root)
// ============================================================================

describe("Drawer", () => {
	it("renders drawer trigger", () => {
		render(
			<Drawer>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("renders with right direction", () => {
		render(
			<Drawer direction="right">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-root")).toHaveAttribute(
			"data-direction",
			"right",
		);
	});

	it("renders with left direction", () => {
		render(
			<Drawer direction="left">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-root")).toHaveAttribute(
			"data-direction",
			"left",
		);
	});

	it("renders with top direction", () => {
		render(
			<Drawer direction="top">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-root")).toHaveAttribute(
			"data-direction",
			"top",
		);
	});

	it("renders with bottom direction explicitly", () => {
		render(
			<Drawer direction="bottom">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-root")).toHaveAttribute(
			"data-direction",
			"bottom",
		);
	});

	it("defaults to bottom direction when no direction prop", () => {
		render(
			<Drawer>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-root")).toHaveAttribute(
			"data-direction",
			"bottom",
		);
	});

	it("renders with shouldScaleBackground false", () => {
		render(
			<Drawer shouldScaleBackground={false}>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("renders with custom className", () => {
		render(
			<Drawer className="custom-drawer">
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Open")).toBeInTheDocument();
	});
});

// ============================================================================
// DrawerTrigger
// ============================================================================

describe("DrawerTrigger", () => {
	it("renders as a button", () => {
		render(
			<Drawer>
				<DrawerTrigger>Open Drawer</DrawerTrigger>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-trigger")).toBeInTheDocument();
		expect(screen.getByText("Open Drawer")).toBeInTheDocument();
	});
});

// ============================================================================
// DrawerClose
// ============================================================================

describe("DrawerClose", () => {
	it("renders as a button", () => {
		render(
			<Drawer>
				<DrawerClose>Close</DrawerClose>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-close")).toBeInTheDocument();
		expect(screen.getByText("Close")).toBeInTheDocument();
	});
});

// ============================================================================
// DrawerPortal
// ============================================================================

describe("DrawerPortal", () => {
	it("renders children through portal", () => {
		render(
			<Drawer>
				<DrawerPortal>
					<div>Portal Content</div>
				</DrawerPortal>
			</Drawer>,
		);
		expect(screen.getByText("Portal Content")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-portal")).toBeInTheDocument();
	});
});

// ============================================================================
// DrawerOverlay
// ============================================================================

describe("DrawerOverlay", () => {
	it("renders with data-slot attribute", () => {
		render(
			<Drawer>
				<DrawerOverlay />
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-overlay")).toHaveAttribute(
			"data-slot",
			"drawer-overlay",
		);
	});

	it("applies default classes", () => {
		render(
			<Drawer>
				<DrawerOverlay />
			</Drawer>,
		);
		const overlay = screen.getByTestId("drawer-overlay");
		expect(overlay.className).toContain("fixed");
		expect(overlay.className).toContain("inset-0");
		expect(overlay.className).toContain("bg-black/50");
		expect(overlay.className).toContain("backdrop-blur-sm");
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerOverlay className="custom-overlay" />
			</Drawer>,
		);
		const overlay = screen.getByTestId("drawer-overlay");
		expect(overlay.className).toContain("custom-overlay");
		expect(overlay.className).toContain("fixed");
	});
});

// ============================================================================
// DrawerContent
// ============================================================================

describe("DrawerContent", () => {
	it("renders with data-slot attribute", () => {
		render(
			<Drawer>
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-content")).toHaveAttribute(
			"data-slot",
			"drawer-content",
		);
	});

	it("applies default classes for bottom direction", () => {
		render(
			<Drawer direction="bottom">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const content = screen.getByTestId("drawer-content");
		expect(content.className).toContain("fixed");
		expect(content.className).toContain("inset-x-0");
		expect(content.className).toContain("bottom-0");
		expect(content.className).toContain("rounded-t-lg");
		expect(content.className).toContain("border-t");
	});

	it("applies right direction classes", () => {
		render(
			<Drawer direction="right">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const content = screen.getByTestId("drawer-content");
		expect(content.className).toContain("inset-y-0");
		expect(content.className).toContain("right-0");
		expect(content.className).toContain("h-full");
		expect(content.className).toContain("border-l");
	});

	it("applies left direction classes", () => {
		render(
			<Drawer direction="left">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const content = screen.getByTestId("drawer-content");
		expect(content.className).toContain("inset-y-0");
		expect(content.className).toContain("left-0");
		expect(content.className).toContain("h-full");
		expect(content.className).toContain("border-r");
	});

	it("applies top direction classes", () => {
		render(
			<Drawer direction="top">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const content = screen.getByTestId("drawer-content");
		expect(content.className).toContain("inset-x-0");
		expect(content.className).toContain("top-0");
		expect(content.className).toContain("rounded-b-lg");
		expect(content.className).toContain("border-b");
	});

	it("renders handle div for bottom direction", () => {
		const { container } = render(
			<Drawer direction="bottom">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const handle = container.querySelector(".rounded-full.bg-muted");
		expect(handle).toBeInTheDocument();
	});

	it("renders handle div when no direction specified", () => {
		const { container } = render(
			<Drawer>
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const handle = container.querySelector(".rounded-full.bg-muted");
		expect(handle).toBeInTheDocument();
	});

	it("does not render handle div for right direction", () => {
		const { container } = render(
			<Drawer direction="right">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const handle = container.querySelector(".rounded-full.bg-muted");
		expect(handle).not.toBeInTheDocument();
	});

	it("does not render handle div for left direction", () => {
		const { container } = render(
			<Drawer direction="left">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const handle = container.querySelector(".rounded-full.bg-muted");
		expect(handle).not.toBeInTheDocument();
	});

	it("does not render handle div for top direction", () => {
		const { container } = render(
			<Drawer direction="top">
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		const handle = container.querySelector(".rounded-full.bg-muted");
		expect(handle).not.toBeInTheDocument();
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerContent className="custom-content">Content</DrawerContent>
			</Drawer>,
		);
		const content = screen.getByTestId("drawer-content");
		expect(content.className).toContain("custom-content");
	});
});

// ============================================================================
// DrawerHeader
// ============================================================================

describe("DrawerHeader", () => {
	it("renders children", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerHeader>Header Content</DrawerHeader>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Header Content")).toBeInTheDocument();
	});

	it("applies default classes", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerHeader>Header</DrawerHeader>
				</DrawerContent>
			</Drawer>,
		);
		const header = screen.getByText("Header");
		expect(header.className).toContain("grid");
		expect(header.className).toContain("px-6");
		expect(header.className).toContain("py-5");
		expect(header.className).toContain("text-center");
		expect(header.className).toContain("sm:text-left");
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerHeader className="custom-header">Header</DrawerHeader>
				</DrawerContent>
			</Drawer>,
		);
		const header = screen.getByText("Header");
		expect(header.className).toContain("custom-header");
		expect(header.className).toContain("grid");
	});
});

// ============================================================================
// DrawerFooter
// ============================================================================

describe("DrawerFooter", () => {
	it("renders children", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerFooter>Footer Content</DrawerFooter>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("Footer Content")).toBeInTheDocument();
	});

	it("applies default classes", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerFooter>Footer</DrawerFooter>
				</DrawerContent>
			</Drawer>,
		);
		const footer = screen.getByText("Footer");
		expect(footer.className).toContain("mt-auto");
		expect(footer.className).toContain("flex");
		expect(footer.className).toContain("flex-col");
		expect(footer.className).toContain("border-t");
		expect(footer.className).toContain("px-6");
		expect(footer.className).toContain("py-5");
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerFooter className="custom-footer">Footer</DrawerFooter>
				</DrawerContent>
			</Drawer>,
		);
		const footer = screen.getByText("Footer");
		expect(footer.className).toContain("custom-footer");
		expect(footer.className).toContain("mt-auto");
	});
});

// ============================================================================
// DrawerTitle
// ============================================================================

describe("DrawerTitle", () => {
	it("renders title text", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerTitle>My Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("My Title")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-title")).toBeInTheDocument();
	});

	it("applies default classes", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		const title = screen.getByTestId("drawer-title");
		expect(title.className).toContain("text-lg");
		expect(title.className).toContain("font-semibold");
		expect(title.className).toContain("text-foreground");
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerTitle className="custom-title">Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		const title = screen.getByTestId("drawer-title");
		expect(title.className).toContain("custom-title");
		expect(title.className).toContain("text-lg");
	});
});

// ============================================================================
// DrawerDescription
// ============================================================================

describe("DrawerDescription", () => {
	it("renders description text", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerDescription>My Description</DrawerDescription>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByText("My Description")).toBeInTheDocument();
		expect(screen.getByTestId("drawer-description")).toBeInTheDocument();
	});

	it("applies default classes", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerDescription>Desc</DrawerDescription>
				</DrawerContent>
			</Drawer>,
		);
		const desc = screen.getByTestId("drawer-description");
		expect(desc.className).toContain("text-sm");
		expect(desc.className).toContain("text-muted-foreground");
	});

	it("merges custom className", () => {
		render(
			<Drawer>
				<DrawerContent>
					<DrawerDescription className="custom-desc">
						Desc
					</DrawerDescription>
				</DrawerContent>
			</Drawer>,
		);
		const desc = screen.getByTestId("drawer-description");
		expect(desc.className).toContain("custom-desc");
		expect(desc.className).toContain("text-sm");
	});
});

// ============================================================================
// DrawerContent renders DrawerPortal and DrawerOverlay internally
// ============================================================================

describe("DrawerContent internal rendering", () => {
	it("renders DrawerPortal when DrawerContent is used", () => {
		render(
			<Drawer>
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-portal")).toBeInTheDocument();
	});

	it("renders DrawerOverlay when DrawerContent is used", () => {
		render(
			<Drawer>
				<DrawerContent>Content</DrawerContent>
			</Drawer>,
		);
		expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
	});
});
