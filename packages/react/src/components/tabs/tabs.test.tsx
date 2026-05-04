import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

	it("should set data-slot on tabs root", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
	});

	it("should set data-slot on tabs trigger", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
	});

	it("should set data-slot on tabs content", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs-content"]')).toBeInTheDocument();
	});

	it("should render vertical orientation", () => {
		const { container } = render(
			<Tabs defaultValue="tab1" orientation="vertical">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabs = container.querySelector('[data-slot="tabs"]');
		expect(tabs).toHaveClass("flex-row", "gap-6");
	});

	it("should render horizontal orientation by default", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabs = container.querySelector('[data-slot="tabs"]');
		expect(tabs).toHaveClass("flex-col");
	});

	it("should apply custom className to Tabs root", () => {
		const { container } = render(
			<Tabs defaultValue="tab1" className="custom-root">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs"]')).toHaveClass("custom-root");
	});

	it("should apply custom className to TabsContent", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1" className="custom-content">
					Content 1
				</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs-content"]')).toHaveClass("custom-content");
	});

	it("should apply custom className to TabsTrigger", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1" className="custom-trigger">
						Tab 1
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		expect(container.querySelector('[data-slot="tabs-trigger"]')).toHaveClass("custom-trigger");
	});

	it("should support controlled mode with value and onValueChange", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<Tabs value="tab1" onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		);

		await user.click(screen.getByText("Tab 2"));
		expect(onValueChange).toHaveBeenCalledWith("tab2");
	});

	it("should support different list variants", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="outline">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should support list align prop", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList align="center">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should support trigger variant override", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="outline">
					<TabsTrigger value="tab1" variant="default">
						Tab 1
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const trigger = container.querySelector('[data-slot="tabs-trigger"]');
		expect(trigger).toBeInTheDocument();
	});

	it("should support TabsList variant as pills", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="pills">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should support TabsList variant as underline", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="underline">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should support TabsList align start", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList align="start">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should support TabsList align end", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList align="end">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
	});

	it("should use uncontrolled mode with defaultValue and not call onValueChange", async () => {
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

	it("should support TabsList variant as line", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="line">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
		expect(tabsList).toHaveClass("bg-transparent", "border-b", "border-border");
	});

	it("should support TabsList variant as vertical", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="vertical">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const tabsList = container.querySelector('[data-slot="tabs-list"]');
		expect(tabsList).toBeInTheDocument();
		expect(tabsList).toHaveClass("flex-col", "bg-transparent");
	});

	it("should support TabsTrigger variant as line", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1" variant="line">
						Tab 1
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const trigger = container.querySelector('[data-slot="tabs-trigger"]');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveClass("rounded-none", "border-b-2");
	});

	it("should support TabsTrigger variant as vertical", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1" variant="vertical">
						Tab 1
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const trigger = container.querySelector('[data-slot="tabs-trigger"]');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveClass("justify-start", "rounded-md");
	});

	it("should inherit TabsList variant in TabsTrigger when no override", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="line">
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const trigger = container.querySelector('[data-slot="tabs-trigger"]');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveClass("rounded-none");
	});

	it("should override TabsList variant with TabsTrigger variant", () => {
		const { container } = render(
			<Tabs defaultValue="tab1">
				<TabsList variant="vertical">
					<TabsTrigger value="tab1" variant="default">
						Tab 1
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		);
		const trigger = container.querySelector('[data-slot="tabs-trigger"]');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveClass("rounded-md");
	});
});
