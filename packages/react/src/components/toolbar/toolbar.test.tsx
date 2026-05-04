import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlignCenter, AlignLeft, AlignRight, Bold } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
	Toolbar,
	ToolbarButton,
	ToolbarLink,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
} from "./toolbar";

describe("Toolbar", () => {
	it("should render toolbar with buttons", () => {
		render(
			<Toolbar>
				<ToolbarButton aria-label="Bold">
					<Bold className="h-4 w-4" />
				</ToolbarButton>
			</Toolbar>,
		);

		expect(screen.getByLabelText("Bold")).toBeInTheDocument();
	});

	it("should set data-slot on root", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton>B</ToolbarButton>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar"]'),
		).toBeInTheDocument();
	});

	it("should set data-slot on button", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton>B</ToolbarButton>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-button"]'),
		).toBeInTheDocument();
	});

	it("should render separator", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton>A</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarButton>B</ToolbarButton>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-separator"]'),
		).toBeInTheDocument();
	});

	it("should apply custom className to separator", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarSeparator className="custom-sep" />
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-separator"]'),
		).toHaveClass("custom-sep");
	});

	it("should call onClick on button click", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(
			<Toolbar>
				<ToolbarButton onClick={handleClick}>Click me</ToolbarButton>
			</Toolbar>,
		);

		await user.click(screen.getByText("Click me"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("should render toggle group with items", () => {
		render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="left" aria-label="Left align">
						<AlignLeft className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="center" aria-label="Center align">
						<AlignCenter className="h-4 w-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="right" aria-label="Right align">
						<AlignRight className="h-4 w-4" />
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);

		expect(screen.getByLabelText("Left align")).toBeInTheDocument();
		expect(screen.getByLabelText("Center align")).toBeInTheDocument();
		expect(screen.getByLabelText("Right align")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Toolbar className="custom-toolbar">
				<ToolbarButton>B</ToolbarButton>
			</Toolbar>,
		);
		expect(container.querySelector('[data-slot="toolbar"]')).toHaveClass(
			"custom-toolbar",
		);
	});

	it("should render ToolbarLink with data-slot", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarLink href="/docs">Docs</ToolbarLink>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-link"]'),
		).toBeInTheDocument();
		expect(screen.getByText("Docs")).toHaveAttribute("href", "/docs");
	});

	it("should apply custom className to ToolbarLink", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarLink href="/about" className="custom-link">
					About
				</ToolbarLink>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-link"]'),
		).toHaveClass("custom-link");
	});

	it("should render ToolbarButton with custom className", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton className="btn-custom">B</ToolbarButton>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-button"]'),
		).toHaveClass("btn-custom");
	});

	it("should render ToolbarToggleGroup with custom className", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single" className="tg-custom">
					<ToolbarToggleItem value="a">A</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-toggle-group"]'),
		).toHaveClass("tg-custom");
	});

	it("should render ToolbarToggleItem with custom className", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a" className="ti-custom">
						A
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-toggle-item"]'),
		).toHaveClass("ti-custom");
	});

	it("should render ToolbarButton with variant and size props", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton variant="outline" size="sm">
					B
				</ToolbarButton>
			</Toolbar>,
		);
		const btn = container.querySelector('[data-slot="toolbar-button"]');
		expect(btn).toBeInTheDocument();
	});

	it("should render ToolbarToggleItem with variant and size props", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a" variant="outline" size="lg">
						A
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		const item = container.querySelector('[data-slot="toolbar-toggle-item"]');
		expect(item).toBeInTheDocument();
	});

	it("should render ToolbarButton with different variant values", () => {
		const variants = ["default", "outline", "ghost"] as const;
		variants.forEach((variant) => {
			const { container, unmount } = render(
				<Toolbar>
					<ToolbarButton variant={variant}>{variant}</ToolbarButton>
				</Toolbar>,
			);
			const btn = container.querySelector('[data-slot="toolbar-button"]');
			expect(btn).toBeInTheDocument();
			unmount();
		});
	});

	it("should render ToolbarButton with different size values", () => {
		const sizes = ["default", "sm", "lg"] as const;
		sizes.forEach((size) => {
			const { container, unmount } = render(
				<Toolbar>
					<ToolbarButton size={size}>{size}</ToolbarButton>
				</Toolbar>,
			);
			const btn = container.querySelector('[data-slot="toolbar-button"]');
			expect(btn).toBeInTheDocument();
			unmount();
		});
	});

	it("should render ToolbarToggleItem with different variant values", () => {
		const variants = ["default", "outline"] as const;
		variants.forEach((variant) => {
			const { container, unmount } = render(
				<Toolbar>
					<ToolbarToggleGroup type="single">
						<ToolbarToggleItem value="a" variant={variant}>
							{variant}
						</ToolbarToggleItem>
					</ToolbarToggleGroup>
				</Toolbar>,
			);
			const item = container.querySelector('[data-slot="toolbar-toggle-item"]');
			expect(item).toBeInTheDocument();
			unmount();
		});
	});

	it("should render ToolbarToggleItem with different size values", () => {
		const sizes = ["default", "sm", "lg"] as const;
		sizes.forEach((size) => {
			const { container, unmount } = render(
				<Toolbar>
					<ToolbarToggleGroup type="single">
						<ToolbarToggleItem value="a" size={size}>
							{size}
						</ToolbarToggleItem>
					</ToolbarToggleGroup>
				</Toolbar>,
			);
			const item = container.querySelector('[data-slot="toolbar-toggle-item"]');
			expect(item).toBeInTheDocument();
			unmount();
		});
	});

	it("should render ToolbarToggleGroup with type multiple", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="multiple">
					<ToolbarToggleItem value="a">A</ToolbarToggleItem>
					<ToolbarToggleItem value="b">B</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-toggle-group"]'),
		).toBeInTheDocument();
	});

	it("should render ToolbarLink with all link props", () => {
		render(
			<Toolbar>
				<ToolbarLink href="/about" target="_blank" rel="noopener">
					About
				</ToolbarLink>
			</Toolbar>,
		);
		const link = screen.getByText("About");
		expect(link).toHaveAttribute("href", "/about");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("should render Toolbar with no children", () => {
		const { container } = render(<Toolbar />);
		expect(container.querySelector('[data-slot="toolbar"]')).toBeInTheDocument();
	});

	it("should render ToolbarSeparator without custom className", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarSeparator />
			</Toolbar>,
		);
		expect(
			container.querySelector('[data-slot="toolbar-separator"]'),
		).toBeInTheDocument();
	});

	it("should apply default variant classes to ToolbarButton", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton>Default</ToolbarButton>
			</Toolbar>,
		);
		const btn = container.querySelector('[data-slot="toolbar-button"]');
		expect(btn).toHaveClass("bg-transparent", "h-9");
	});

	it("should apply default variant classes to ToolbarToggleItem", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a">Default</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		const item = container.querySelector('[data-slot="toolbar-toggle-item"]');
		expect(item).toHaveClass("bg-transparent", "h-9");
	});

	it("should apply outline variant classes to ToolbarButton", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarButton variant="outline">Outline</ToolbarButton>
			</Toolbar>,
		);
		const btn = container.querySelector('[data-slot="toolbar-button"]');
		expect(btn).toHaveClass("border", "bg-transparent");
	});

	it("should apply outline variant classes to ToolbarToggleItem", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a" variant="outline">
						Outline
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		const item = container.querySelector('[data-slot="toolbar-toggle-item"]');
		expect(item).toHaveClass("border", "bg-transparent");
	});

	it("should apply size classes to ToolbarButton", () => {
		const { container: c1 } = render(
			<Toolbar>
				<ToolbarButton size="sm">SM</ToolbarButton>
			</Toolbar>,
		);
		expect(c1.querySelector('[data-slot="toolbar-button"]')).toHaveClass("h-8");

		const { container: c2 } = render(
			<Toolbar>
				<ToolbarButton size="lg">LG</ToolbarButton>
			</Toolbar>,
		);
		expect(c2.querySelector('[data-slot="toolbar-button"]')).toHaveClass("h-10");
	});

	it("should apply size classes to ToolbarToggleItem", () => {
		const { container: c1 } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a" size="sm">SM</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(
			c1.querySelector('[data-slot="toolbar-toggle-item"]'),
		).toHaveClass("h-8");

		const { container: c2 } = render(
			<Toolbar>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a" size="lg">LG</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(
			c2.querySelector('[data-slot="toolbar-toggle-item"]'),
		).toHaveClass("h-10");
	});

	it("should apply base classes to ToolbarLink", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarLink href="/test">Link</ToolbarLink>
			</Toolbar>,
		);
		const link = container.querySelector('[data-slot="toolbar-link"]');
		expect(link).toHaveClass(
			"text-sm",
			"font-medium",
			"text-muted-foreground",
			"hover:text-foreground",
			"transition-colors",
			"px-2",
		);
	});

	it("should apply base classes to ToolbarSeparator", () => {
		const { container } = render(
			<Toolbar>
				<ToolbarSeparator />
			</Toolbar>,
		);
		const sep = container.querySelector('[data-slot="toolbar-separator"]');
		expect(sep).toHaveClass("mx-1", "h-6", "w-px", "bg-border");
	});

	it("should apply base classes to Toolbar root", () => {
		const { container } = render(<Toolbar />);
		const toolbar = container.querySelector('[data-slot="toolbar"]');
		expect(toolbar).toHaveClass(
			"flex",
			"h-10",
			"items-center",
			"gap-1",
			"rounded-md",
			"border",
			"bg-card",
			"p-1",
		);
	});

	it("should render all toolbar subcomponents together", () => {
		render(
			<Toolbar>
				<ToolbarButton>B</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="a">A</ToolbarToggleItem>
				</ToolbarToggleGroup>
				<ToolbarSeparator />
				<ToolbarLink href="/help">Help</ToolbarLink>
			</Toolbar>,
		);
		expect(screen.getByText("B")).toBeInTheDocument();
		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("Help")).toHaveAttribute("href", "/help");
	});
});
