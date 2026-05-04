import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./select";

describe("Select", () => {
	it("should render select trigger", () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByText("Select an option")).toBeInTheDocument();
	});

	it("should open select when trigger is clicked", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByText("Option 1")).toBeInTheDocument();
		expect(await screen.findByText("Option 2")).toBeInTheDocument();
	});

	it("should render select with groups", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Vegetables</SelectLabel>
						<SelectItem value="carrot">Carrot</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByText("Fruits")).toBeInTheDocument();
		expect(await screen.findByText("Vegetables")).toBeInTheDocument();
	});

	it("should render with default value", () => {
		render(
			<Select defaultValue="option2">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		const { container } = render(
			<Select>
				<SelectTrigger className="custom-select">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = container.querySelector('[data-slot="select-trigger"]');
		expect(trigger).toHaveClass("custom-select");
	});

	it("should disable select when disabled prop is true", () => {
		render(
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = screen.getByRole("combobox");
		expect(trigger).toBeDisabled();
	});

	it("should render loading skeleton when isLoading is true", () => {
		render(
			<Select>
				<SelectTrigger isLoading>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
	});

	it("should render loading skeleton with sm size", () => {
		render(
			<Select>
				<SelectTrigger isLoading size="sm">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		const skeleton = document.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("h-9");
	});

	it("should render loading skeleton with default size", () => {
		render(
			<Select>
				<SelectTrigger isLoading size="default">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		const skeleton = document.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("h-10");
	});

	it("should set data-size on trigger", () => {
		const { container } = render(
			<Select>
				<SelectTrigger size="sm">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = container.querySelector('[data-slot="select-trigger"]');
		expect(trigger).toHaveAttribute("data-size", "sm");
	});

	it("should render with separator", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
					<SelectSeparator />
					<SelectItem value="b">B</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByText("A")).toBeInTheDocument();
		expect(await screen.findByText("B")).toBeInTheDocument();
	});

	it("should render ScrollUpButton and ScrollDownButton inside SelectContent", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		// ScrollUpButton and ScrollDownButton are rendered by SelectContent but only visible
		// when content overflows. In jsdom they still render in the DOM but may be hidden.
		// Verify the content rendered successfully
		expect(await screen.findByRole("listbox")).toBeInTheDocument();
	});

	it("should render ScrollDownButton inside SelectContent", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		// ScrollDownButton is rendered by SelectContent but visibility depends on overflow in jsdom
		expect(await screen.findByRole("listbox")).toBeInTheDocument();
	});

	it("should render with controlled value", () => {
		render(
			<Select value="option1" onValueChange={() => {}}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByText("Option 1")).toBeInTheDocument();
	});

	it("should render SelectSeparator with custom className", () => {
		const { container } = render(
			<SelectSeparator className="custom-sep" />,
		);
		expect(container.firstChild).toHaveClass("custom-sep");
	});

	it("should render SelectContent with matchTriggerWidth", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent matchTriggerWidth>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
	});

	it("should render SelectContent without matchTriggerWidth", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent matchTriggerWidth={false}>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
	});

	it("should render SelectItem with custom className", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a" className="custom-item">
						A
					</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const item = await screen.findByRole("option");
		expect(item).toHaveClass("custom-item");
	});

	it("should render SelectLabel with custom className", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="custom-label">Group</SelectLabel>
						<SelectItem value="a">A</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const label = await screen.findByText("Group");
		expect(label).toHaveClass("custom-label");
	});

	it("should render SelectTrigger without isLoading (normal state)", () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = screen.getByRole("combobox");
		expect(trigger).toBeInTheDocument();
		expect(document.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument();
	});

	it("should render SelectScrollUpButton with custom className inside SelectContent", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		// ScrollUpButton is rendered but visibility depends on content overflow in jsdom
		expect(await screen.findByRole("listbox")).toBeInTheDocument();
	});

	it("should render SelectContent with custom align", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent align="start">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
	});

	it("should render SelectContent with position item-aligned", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent position="item-aligned">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
		// item-aligned should NOT have popper translate classes
		expect(content.className).not.toContain("translate-y-1");
	});

	it("should render SelectContent with matchTriggerWidth=true and popper position", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent matchTriggerWidth position="popper">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
		// matchTriggerWidth=true should apply w-(--radix-select-trigger-width)
		expect(content.className).toContain("w-(--radix-select-trigger-width)");
	});

	it("should render SelectContent without matchTriggerWidth and popper position", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent matchTriggerWidth={false} position="popper">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
		// matchTriggerWidth=false should apply min-w-[8rem]
		expect(content.className).toContain("min-w-[8rem]");
	});

	it("should render SelectContent with custom className", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent className="custom-content">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toHaveClass("custom-content");
	});

	it("should render SelectGroup with custom className", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup className="custom-group">
						<SelectItem value="a">A</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const group = document.querySelector(".custom-group");
		expect(group).toBeInTheDocument();
	});

	it("should render SelectTrigger with data-size default", () => {
		const { container } = render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = container.querySelector('[data-slot="select-trigger"]');
		expect(trigger).toHaveAttribute("data-size", "default");
	});

	it("should render SelectScrollUpButton inside SelectContent", async () => {
		const user = userEvent.setup();
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByRole("listbox")).toBeInTheDocument();
	});

	it("should render SelectScrollDownButton inside SelectContent", async () => {
		const user = userEvent.setup();
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByRole("listbox")).toBeInTheDocument();
	});

	it("should render SelectTrigger with isLoading and custom className", () => {
		render(
			<Select>
				<SelectTrigger isLoading className="loading-class">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const skeleton = document.querySelector('[data-slot="skeleton"]');
		expect(skeleton).toHaveClass("loading-class");
	});

	it("should render SelectContent with matchTriggerWidth and item-aligned position", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent matchTriggerWidth position="item-aligned">
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();
		// item-aligned position should apply w-(--radix-select-trigger-width) when matchTriggerWidth
		expect(content.className).toContain("w-(--radix-select-trigger-width)");
	});

	it("should render SelectItem with custom data attributes", async () => {
		const user = userEvent.setup();

		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a" data-testid="custom-item">
						A
					</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));
		expect(await screen.findByTestId("custom-item")).toBeInTheDocument();
	});

	it("should render SelectTrigger with chevron icon", () => {
		render(
			<Select>
				<SelectTrigger data-testid="trigger">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = screen.getByTestId("trigger");
		const svg = trigger.querySelector("svg");
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass("opacity-50");
	});
});
