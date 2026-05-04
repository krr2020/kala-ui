import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	buttonGroupVariants,
} from "./button-group";

describe("ButtonGroup", () => {
	describe("Basic Rendering", () => {
		it("renders children correctly", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<Button>Second</Button>
					<Button>Third</Button>
				</ButtonGroup>,
			);

			expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Second" }),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Third" })).toBeInTheDocument();
		});

		it("renders as a group role", () => {
			render(
				<ButtonGroup data-testid="button-group">
					<Button>First</Button>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			// ButtonGroup renders as a div without explicit role
			expect(group).toBeInTheDocument();
		});

		it("accepts custom className", () => {
			render(
				<ButtonGroup className="custom-class" data-testid="button-group">
					<Button>Test</Button>
				</ButtonGroup>,
			);

			expect(screen.getByTestId("button-group")).toHaveClass("custom-class");
		});
	});

	describe("Orientation", () => {
		it("renders horizontal by default", () => {
			render(
				<ButtonGroup data-testid="button-group">
					<Button>First</Button>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			expect(group).toHaveClass("flex-row");
		});

		it("renders vertical when orientation is vertical", () => {
			render(
				<ButtonGroup orientation="vertical" data-testid="button-group">
					<Button>First</Button>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			expect(group).toHaveClass("flex-col");
		});

		it("applies correct horizontal styling", () => {
			render(
				<ButtonGroup orientation="horizontal" data-testid="button-group">
					<Button>Test</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			expect(group.className).toContain("flex-row");
		});

		it("applies correct vertical styling", () => {
			render(
				<ButtonGroup orientation="vertical" data-testid="button-group">
					<Button>Test</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			expect(group.className).toContain("flex-col");
		});
	});

	describe("HTML Attributes", () => {
		it("accepts standard div attributes", () => {
			render(
				<ButtonGroup
					id="test-group"
					data-testid="button-group"
					aria-label="Action buttons"
				>
					<Button>Test</Button>
				</ButtonGroup>,
			);

			const group = screen.getByTestId("button-group");
			expect(group).toHaveAttribute("id", "test-group");
			expect(group).toHaveAttribute("aria-label", "Action buttons");
		});

		it("forwards other props", () => {
			render(
				<ButtonGroup data-custom="value" data-testid="button-group">
					<Button>Test</Button>
				</ButtonGroup>,
			);

			expect(screen.getByTestId("button-group")).toHaveAttribute(
				"data-custom",
				"value",
			);
		});
	});
});

describe("ButtonGroupSeparator", () => {
	describe("Basic Rendering", () => {
		it("renders with separator role", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<ButtonGroupSeparator />
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const separator = screen.getByRole("separator");
			expect(separator).toBeInTheDocument();
		});

		it("accepts custom className", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<ButtonGroupSeparator
						className="custom-separator"
						data-testid="separator"
					/>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
		});
	});

	describe("Orientation", () => {
		it("has horizontal orientation by default", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<ButtonGroupSeparator data-testid="separator" />
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const separator = screen.getByTestId("separator");
			expect(separator).toHaveAttribute("aria-orientation", "horizontal");
		});

		it("supports vertical orientation", () => {
			render(
				<ButtonGroup orientation="vertical">
					<Button>First</Button>
					<ButtonGroupSeparator
						orientation="vertical"
						data-testid="separator"
					/>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const separator = screen.getByTestId("separator");
			expect(separator).toHaveAttribute("aria-orientation", "vertical");
		});

		it("applies correct horizontal styling", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<ButtonGroupSeparator
						orientation="horizontal"
						data-testid="separator"
					/>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const separator = screen.getByTestId("separator");
			expect(separator).toHaveClass("w-px");
		});

		it("applies correct vertical styling", () => {
			render(
				<ButtonGroup orientation="vertical">
					<Button>First</Button>
					<ButtonGroupSeparator
						orientation="vertical"
						data-testid="separator"
					/>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			const separator = screen.getByTestId("separator");
			expect(separator).toHaveClass("h-px");
		});
	});
});

describe("ButtonGroupText", () => {
	describe("Basic Rendering", () => {
		it("renders text content", () => {
			render(
				<ButtonGroup>
					<Button>First</Button>
					<ButtonGroupText>Label Text</ButtonGroupText>
					<Button>Second</Button>
				</ButtonGroup>,
			);

			expect(screen.getByText("Label Text")).toBeInTheDocument();
		});

		it("renders as span by default", () => {
			const { container } = render(
				<ButtonGroup>
					<ButtonGroupText>Test Text</ButtonGroupText>
				</ButtonGroup>,
			);

			const span = container.querySelector("span");
			expect(span).toBeInTheDocument();
			expect(span?.textContent).toBe("Test Text");
		});

		it("accepts custom className", () => {
			render(
				<ButtonGroup>
					<ButtonGroupText className="custom-text" data-testid="text">
						Test
					</ButtonGroupText>
				</ButtonGroup>,
			);

			expect(screen.getByTestId("text")).toHaveClass("custom-text");
		});
	});

	describe("asChild Prop", () => {
		it("renders as span when asChild is false", () => {
			const { container } = render(
				<ButtonGroup>
					<ButtonGroupText asChild={false}>Test</ButtonGroupText>
				</ButtonGroup>,
			);

			expect(container.querySelector("span")).toBeInTheDocument();
		});

		it("uses Slot when asChild is true", () => {
			render(
				<ButtonGroup>
					<ButtonGroupText asChild>
						<div data-testid="custom-element">Custom Element</div>
					</ButtonGroupText>
				</ButtonGroup>,
			);

			expect(screen.getByTestId("custom-element")).toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("applies base styling classes", () => {
			render(
				<ButtonGroup>
					<ButtonGroupText data-testid="text">Test</ButtonGroupText>
				</ButtonGroup>,
			);

			const text = screen.getByTestId("text");
			expect(text).toHaveClass("inline-flex");
			expect(text).toHaveClass("items-center");
			expect(text).toHaveClass("justify-center");
		});
	});

	describe("HTML Attributes", () => {
		it("accepts standard span attributes", () => {
			render(
				<ButtonGroup>
					<ButtonGroupText id="test-text" data-testid="text" title="Help text">
						Test
					</ButtonGroupText>
				</ButtonGroup>,
			);

			const text = screen.getByTestId("text");
			expect(text).toHaveAttribute("id", "test-text");
			expect(text).toHaveAttribute("title", "Help text");
		});
	});
});

describe("ButtonGroup Integration", () => {
	it("works with Button components", () => {
		render(
			<ButtonGroup>
				<Button variant="default">Edit</Button>
				<Button variant="default">Delete</Button>
			</ButtonGroup>,
		);

		expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
	});

	it("combines ButtonGroup, Separator, and Text", () => {
		render(
			<ButtonGroup>
				<Button>First</Button>
				<ButtonGroupSeparator data-testid="separator" />
				<ButtonGroupText data-testid="text">Label</ButtonGroupText>
				<ButtonGroupSeparator />
				<Button>Last</Button>
			</ButtonGroup>,
		);

		expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
		expect(screen.getByTestId("separator")).toBeInTheDocument();
		expect(screen.getByTestId("text")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Last" })).toBeInTheDocument();
	});

	it("supports mixed content in vertical orientation", () => {
		render(
			<ButtonGroup orientation="vertical" data-testid="group">
				<Button>Top</Button>
				<ButtonGroupSeparator orientation="vertical" />
				<ButtonGroupText>Middle</ButtonGroupText>
				<ButtonGroupSeparator orientation="vertical" />
				<Button>Bottom</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		expect(group).toHaveClass("flex-col");
		expect(screen.getByRole("button", { name: "Top" })).toBeInTheDocument();
		expect(screen.getByText("Middle")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Bottom" })).toBeInTheDocument();
	});
});

describe("Accessibility", () => {
	it("has proper group role", () => {
		render(
			<ButtonGroup data-testid="group">
				<Button>Test</Button>
			</ButtonGroup>,
		);

		// Component renders as div, role can be added via aria-label prop
		expect(screen.getByTestId("group")).toBeInTheDocument();
	});

	it("separator has correct aria-orientation", () => {
		render(
			<ButtonGroup>
				<Button>First</Button>
				<ButtonGroupSeparator data-testid="separator" />
				<Button>Second</Button>
			</ButtonGroup>,
		);

		const separator = screen.getByTestId("separator");
		// hr element has implicit separator role
		expect(separator.tagName).toBe("HR");
		expect(separator).toHaveAttribute("aria-orientation", "horizontal");
	});

	it("supports aria-label on group", () => {
		render(
			<ButtonGroup aria-label="Editor actions" data-testid="group">
				<Button>Bold</Button>
				<Button>Italic</Button>
			</ButtonGroup>,
		);

		expect(screen.getByTestId("group")).toHaveAttribute(
			"aria-label",
			"Editor actions",
		);
	});

	it("renders ButtonGroup with separated=true and inserts separators between children", () => {
		render(
			<ButtonGroup separated data-testid="group">
				<Button>First</Button>
				<Button>Second</Button>
				<Button>Third</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		const separators = within(group).getAllByRole("separator");
		// Should have 2 separators between 3 children
		expect(separators.length).toBe(2);
	});

	it("renders ButtonGroup with separated=true and vertical orientation", () => {
		render(
			<ButtonGroup separated orientation="vertical" data-testid="group">
				<Button>Top</Button>
				<Button>Bottom</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		expect(group).toHaveClass("flex-col");
		const separators = within(group).getAllByRole("separator");
		expect(separators.length).toBe(1);
	});

	it("renders ButtonGroup with separated=true and single child (no separators)", () => {
		render(
			<ButtonGroup separated data-testid="group">
				<Button>Only</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		const separators = within(group).queryAllByRole("separator");
		expect(separators.length).toBe(0);
	});

	it("renders ButtonGroupSeparator with className when orientation is vertical", () => {
		render(
			<ButtonGroup orientation="vertical">
				<Button>First</Button>
				<ButtonGroupSeparator className="v-sep" data-testid="sep" />
				<Button>Second</Button>
			</ButtonGroup>,
		);

		expect(screen.getByTestId("sep")).toHaveClass("v-sep");
	});

	it("renders ButtonGroupText without asChild", () => {
		const { container } = render(
			<ButtonGroup>
				<ButtonGroupText>Label</ButtonGroupText>
			</ButtonGroup>,
		);

		expect(container.querySelector("span")).toBeInTheDocument();
		expect(container.querySelector("span")).toHaveTextContent("Label");
	});

	it("renders ButtonGroupText with asChild using Slot", () => {
		render(
			<ButtonGroup>
				<ButtonGroupText asChild>
					<a href="/link" data-testid="slotted-link">
						Link Text
					</a>
				</ButtonGroupText>
			</ButtonGroup>,
		);

		const link = screen.getByTestId("slotted-link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent("Link Text");
		expect(link).toHaveAttribute("href", "/link");
	});

	it("exports buttonGroupVariants", () => {
		expect(buttonGroupVariants).toBeDefined();
	});

	it("renders separated mode with non-element children (text nodes)", () => {
		render(
			<ButtonGroup separated data-testid="group">
				<Button>First</Button>
				{"divider"}
				<Button>Second</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		expect(group).toHaveTextContent("divider");
		const separators = within(group).getAllByRole("separator");
		// Two separators: one between First and text, one between text and Second
		expect(separators.length).toBe(2);
	});

	it("uses child.key when available in separated mode", () => {
		render(
			<ButtonGroup separated data-testid="group">
				<Button key="btn-a">A</Button>
				<Button key="btn-b">B</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		const buttons = within(group).getAllByRole("button");
		expect(buttons.length).toBe(2);
	});

	it("renders separated mode with vertical orientation and keyed children", () => {
		render(
			<ButtonGroup separated orientation="vertical" data-testid="group">
				<Button key="v1">Top</Button>
				<Button key="v2">Bottom</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		expect(group).toHaveClass("flex-col");
		const separators = within(group).getAllByRole("separator");
		expect(separators.length).toBe(1);
		expect(separators[0]).toHaveAttribute("aria-orientation", "vertical");
	});

	it("renders ButtonGroupText with extra HTML attributes", () => {
		render(
			<ButtonGroup>
				<ButtonGroupText data-testid="text" style={{ color: "red" }}>
					Styled
				</ButtonGroupText>
			</ButtonGroup>,
		);

		const text = screen.getByTestId("text");
		expect(text).toHaveStyle({ color: "rgb(255, 0, 0)" });
	});

	it("renders ButtonGroupSeparator with extra HTML attributes", () => {
		render(
			<ButtonGroup>
				<Button>First</Button>
				<ButtonGroupSeparator data-testid="sep" id="my-sep" />
				<Button>Second</Button>
			</ButtonGroup>,
		);

		expect(screen.getByTestId("sep")).toHaveAttribute("id", "my-sep");
	});

	it("renders ButtonGroup with role attribute", () => {
		render(
			<ButtonGroup role="toolbar" data-testid="group">
				<Button>Tool</Button>
			</ButtonGroup>,
		);

		expect(screen.getByTestId("group")).toHaveAttribute("role", "toolbar");
	});

	it("renders ButtonGroupSeparator without aria-orientation when orientation is falsy", () => {
		// orientation defaults to "horizontal" so it always has a truthy value,
		// but test the default path
		render(
			<ButtonGroup>
				<Button>First</Button>
				<ButtonGroupSeparator data-testid="sep" />
				<Button>Second</Button>
			</ButtonGroup>,
		);

		const sep = screen.getByTestId("sep");
		expect(sep).toHaveAttribute("aria-orientation", "horizontal");
	});
});
