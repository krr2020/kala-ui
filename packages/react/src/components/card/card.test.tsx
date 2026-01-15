import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

describe("Card", () => {
	it("renders card with content", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>Card Content</CardContent>
				<CardFooter>Card Footer</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Card Title")).toBeInTheDocument();
		expect(screen.getByText("Card Description")).toBeInTheDocument();
		expect(screen.getByText("Card Content")).toBeInTheDocument();
		expect(screen.getByText("Card Footer")).toBeInTheDocument();
	});

	it("applies card styles", () => {
		const { container } = render(<Card>Content</Card>);
		const card = container.firstChild;
		expect(card).toHaveClass("bg-card");
		expect(card).toHaveClass("text-card-foreground");
		expect(card).toHaveClass("rounded-md");
		expect(card).toHaveClass("border");
	});

	it("applies custom className", () => {
		const { container } = render(<Card className="custom-class">Content</Card>);
		expect(container.firstChild).toHaveClass("custom-class");
	});
});
