import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DesignSystemOverview } from "./overview";

// Mock all child components to avoid complex rendering
vi.mock("../accordion", () => ({
	Accordion: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="accordion">{children}</div>
	),
	AccordionContent: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="accordion-content">{children}</div>
	),
	AccordionItem: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="accordion-item">{children}</div>
	),
	AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="accordion-trigger">{children}</div>
	),
}));

vi.mock("../alert", () => ({
	Alert: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="alert">{children}</div>
	),
}));

vi.mock("../avatar", () => ({
	Avatar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="avatar">{children}</div>
	),
	AvatarFallback: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="avatar-fallback">{children}</div>
	),
	AvatarImage: () => <div data-testid="avatar-image" />,
}));

vi.mock("../badge", () => ({
	Badge: ({ children }: { children: React.ReactNode }) => (
		<span data-testid="badge">{children}</span>
	),
}));

vi.mock("../breadcrumbs", () => ({
	Breadcrumbs: ({ items }: { items: Array<{ label: string; href?: string }> }) => (
		<nav data-testid="breadcrumbs">
			{items.map((item, i) => (
				<span key={i}>{item.label}</span>
			))}
		</nav>
	),
}));

vi.mock("../button", () => ({
	Button: ({ children }: { children: React.ReactNode }) => (
		<button type="button" data-testid="button">
			{children}
		</button>
	),
}));

vi.mock("../card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card">{children}</div>
	),
	CardContent: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-content">{children}</div>
	),
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-header">{children}</div>
	),
	CardTitle: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-title">{children}</div>
	),
}));

vi.mock("../checkbox", () => ({
	Checkbox: () => <div data-testid="checkbox" />,
}));

vi.mock("../input", () => ({
	Input: () => <input data-testid="input" />,
}));

vi.mock("../label", () => ({
	Label: ({ children }: { children: React.ReactNode }) => (
		<label>{children}</label>
	),
}));

vi.mock("../progress", () => ({
	Progress: () => <div data-testid="progress" />,
}));

vi.mock("../radio-group", () => ({
	RadioGroup: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="radio-group">{children}</div>
	),
	RadioGroupItem: () => <div data-testid="radio-group-item" />,
}));

vi.mock("../select", () => ({
	Select: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="select">{children}</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="select-trigger">{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
}));

vi.mock("../skeleton", () => ({
	Skeleton: ({ className }: { className?: string }) => (
		<div data-testid="skeleton" className={className} />
	),
}));

vi.mock("../slider", () => ({
	Slider: () => <div data-testid="slider" />,
}));

vi.mock("../spinner", () => ({
	Spinner: () => <div data-testid="spinner" />,
}));

vi.mock("../switch", () => ({
	Switch: () => <div data-testid="switch" />,
}));

vi.mock("../table", () => ({
	Table: ({ children }: { children: React.ReactNode }) => (
		<table data-testid="table">{children}</table>
	),
	TableBody: ({ children }: { children: React.ReactNode }) => (
		<tbody data-testid="table-body">{children}</tbody>
	),
	TableCell: ({ children }: { children: React.ReactNode }) => (
		<td>{children}</td>
	),
	TableHead: ({ children }: { children: React.ReactNode }) => (
		<th>{children}</th>
	),
	TableHeader: ({ children }: { children: React.ReactNode }) => (
		<thead>{children}</thead>
	),
	TableRow: ({ children }: { children: React.ReactNode }) => (
		<tr>{children}</tr>
	),
}));

vi.mock("../tabs", () => ({
	Tabs: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tabs">{children}</div>
	),
	TabsList: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tabs-list">{children}</div>
	),
	TabsTrigger: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tabs-trigger">{children}</div>
	),
}));

vi.mock("../textarea", () => ({
	Textarea: () => <textarea data-testid="textarea" />,
}));

vi.mock("../toggle", () => ({
	Toggle: ({ children }: { children: React.ReactNode }) => (
		<button type="button" data-testid="toggle">
			{children}
		</button>
	),
}));

describe("DesignSystemOverview", () => {
	it("should render the overview container", () => {
		render(<DesignSystemOverview />);
		const container = document.querySelector(".container");
		expect(container).toBeInTheDocument();
	});

	it("should render a grid layout", () => {
		const { container } = render(<DesignSystemOverview />);
		const grid = container.querySelector(".grid");
		expect(grid).toBeInTheDocument();
	});

	it("should render Button variations", () => {
		render(<DesignSystemOverview />);
		const buttons = screen.getAllByTestId("button");
		expect(buttons.length).toBeGreaterThanOrEqual(3); // Default, Secondary, Outline
	});

	it("should render Input variations", () => {
		render(<DesignSystemOverview />);
		const inputs = screen.getAllByTestId("input");
		expect(inputs.length).toBeGreaterThanOrEqual(3); // Default, Error, Disabled
	});

	it("should render Textarea variations", () => {
		render(<DesignSystemOverview />);
		const textareas = screen.getAllByTestId("textarea");
		expect(textareas.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Checkbox variations", () => {
		render(<DesignSystemOverview />);
		const checkboxes = screen.getAllByTestId("checkbox");
		expect(checkboxes.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Switch variations", () => {
		render(<DesignSystemOverview />);
		const switches = screen.getAllByTestId("switch");
		expect(switches.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Alert variations", () => {
		render(<DesignSystemOverview />);
		const alerts = screen.getAllByTestId("alert");
		expect(alerts.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Spinner variations", () => {
		render(<DesignSystemOverview />);
		const spinners = screen.getAllByTestId("spinner");
		expect(spinners.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Skeleton variations", () => {
		render(<DesignSystemOverview />);
		const skeletons = screen.getAllByTestId("skeleton");
		expect(skeletons.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Card variations", () => {
		render(<DesignSystemOverview />);
		const cards = screen.getAllByTestId("card");
		expect(cards.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Badge variations", () => {
		render(<DesignSystemOverview />);
		const badges = screen.getAllByTestId("badge");
		expect(badges.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Avatar variations", () => {
		render(<DesignSystemOverview />);
		const avatars = screen.getAllByTestId("avatar");
		expect(avatars.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Table component", () => {
		render(<DesignSystemOverview />);
		const tables = screen.getAllByTestId("table");
		expect(tables.length).toBeGreaterThanOrEqual(1);
	});

	it("should render Breadcrumbs variations", () => {
		render(<DesignSystemOverview />);
		const breadcrumbs = screen.getAllByTestId("breadcrumbs");
		expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Tabs variations", () => {
		render(<DesignSystemOverview />);
		const tabs = screen.getAllByTestId("tabs");
		expect(tabs.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Accordion variations", () => {
		render(<DesignSystemOverview />);
		const accordions = screen.getAllByTestId("accordion");
		expect(accordions.length).toBeGreaterThanOrEqual(2);
	});

	it("should render Progress component", () => {
		render(<DesignSystemOverview />);
		const progress = screen.getAllByTestId("progress");
		expect(progress.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Slider variations", () => {
		render(<DesignSystemOverview />);
		const sliders = screen.getAllByTestId("slider");
		expect(sliders.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Toggle variations", () => {
		render(<DesignSystemOverview />);
		const toggles = screen.getAllByTestId("toggle");
		expect(toggles.length).toBeGreaterThanOrEqual(3);
	});

	it("should render Select variations", () => {
		render(<DesignSystemOverview />);
		const selects = screen.getAllByTestId("select");
		expect(selects.length).toBeGreaterThanOrEqual(3);
	});

	it("should render RadioGroup component", () => {
		render(<DesignSystemOverview />);
		const radioGroups = screen.getAllByTestId("radio-group");
		expect(radioGroups.length).toBeGreaterThanOrEqual(2);
	});

	it("should render all 20 component sections", () => {
		const { container } = render(<DesignSystemOverview />);
		const gridItems = container.querySelector(".grid")?.children;
		expect(gridItems?.length).toBe(20);
	});
});
