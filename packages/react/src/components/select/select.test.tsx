import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
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
		// Select content renders in portal asynchronously
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
		// Select content renders in portal asynchronously
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
});
