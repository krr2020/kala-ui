import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlignCenter, AlignLeft, AlignRight, Bold } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
	Toolbar,
	ToolbarButton,
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
});
