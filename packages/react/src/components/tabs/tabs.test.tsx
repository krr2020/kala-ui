import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
	it("should render tabs", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(screen.getByRole("tablist")).toBeInTheDocument();
	});

	it("should render multiple tabs", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
					<TabsTrigger value="tab3">Tab 3</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
				<TabsContent value="tab3">Content 3</TabsContent>
			</Tabs>,
		);
		expect(screen.getByText("Tab 1")).toBeInTheDocument();
		expect(screen.getByText("Tab 2")).toBeInTheDocument();
		expect(screen.getByText("Tab 3")).toBeInTheDocument();
	});

	it("should show default tab content", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);
		expect(screen.getByText("Content 1")).toBeInTheDocument();
	});

	it("should switch tabs when clicked", async () => {
		const user = userEvent.setup();

		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		await user.click(screen.getByText("Tab 2"));
		expect(screen.getByText("Content 2")).toBeInTheDocument();
	});

	it("should apply custom className to tabs list", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList className="custom-tabs-list">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toHaveClass("custom-tabs-list");
	});

	it("should disable tab trigger when disabled prop is true", () => {
		render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2" disabled>
						Tab 2
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);
		expect(screen.getByRole("tab", { name: "Tab 2" })).toBeDisabled();
	});
});
