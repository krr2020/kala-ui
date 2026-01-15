import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../input";
import { InputGroup, InputGroupText } from "./input-group";

describe("InputGroup", () => {
	it("renders correctly", () => {
		render(
			<InputGroup data-testid="input-group">
				<InputGroupText>@</InputGroupText>
				<Input placeholder="Username" />
			</InputGroup>,
		);

		const group = screen.getByTestId("input-group");
		expect(group).toBeInTheDocument();
		expect(group).toHaveClass("flex", "w-full", "items-stretch");

		expect(screen.getByText("@")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<InputGroup data-testid="input-group" className="custom-class">
				<Input />
			</InputGroup>,
		);

		expect(screen.getByTestId("input-group")).toHaveClass("custom-class");
	});

	it("renders InputGroupText correctly", () => {
		render(<InputGroupText data-testid="addon">Addon</InputGroupText>);

		const addon = screen.getByTestId("addon");
		expect(addon).toBeInTheDocument();
		expect(addon).toHaveClass(
			"flex",
			"items-center",
			"justify-center",
			"bg-muted",
		);
	});
});
