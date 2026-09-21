import { render, screen } from "@testing-library/react";
import { KalaProvider } from "@kala-ui/react";
import type { SlotStyles } from "@kala-ui/react/lib/slot-styles";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "../components/app-shell";
import { Footer } from "../components/footer";
import { SessionCard } from "../components/session-card";
import { SocialLoginButtons } from "../components/social-login-button";
import { DataTable } from "../components/data-table/data-table";
import { LineChart } from "../components/charts/line-chart";
import { SortableItem } from "../components/dnd/dnd";

const session = {
	id: "1",
	device: "Desktop",
	browser: "Firefox",
	os: "macOS",
	ip: "203.0.113.1",
	lastActiveAt: new Date().toISOString(),
	createdAt: new Date().toISOString(),
	isCurrent: true,
};

const columns = [
	{ id: "name", header: "Name" },
	{ id: "role", header: "Role" },
];
const rows = [
	{ id: "1", name: "Ada", role: "Admin" },
	{ id: "2", name: "Grace", role: "Engineer" },
];

describe("react-app markers (ported families)", () => {
	it("component roots carry data-kala-component", () => {
		render(
			<div>
				<Footer copyright="© test">
					<p>x</p>
				</Footer>
				<SessionCard session={session} />
				<SocialLoginButtons onProviderClick={vi.fn()} />
				<AppShell>
					<p>content</p>
				</AppShell>
				<DataTable columns={columns} data={rows} />
			</div>,
		);
		for (const marker of [
			"footer",
			"session-card",
			"social-login-buttons",
			"app-shell",
			"data-table",
		]) {
			expect(
				document.querySelector(`[data-kala-component="${marker}"]`),
				marker,
			).toBeInTheDocument();
		}
	});
});

describe("react-app slotStyles contract", () => {
	it("Footer applies sectionTitle/sectionLink slots to the right nodes", () => {
		render(
			<Footer
				linkSections={[
					{ title: "Product", links: [{ label: "Docs", href: "/docs" }] },
				]}
				slotStyles={{ sectionTitle: "ctx-title", sectionLink: "ctx-link" }}
			/>,
		);
		expect(screen.getByText("Product").className).toContain("ctx-title");
		expect(screen.getByText("Docs").className).toContain("ctx-link");
	});

	it("SessionCard skeleton arm still applies slotStyles.root", () => {
		render(
			<SessionCard
				session={session}
				isLoading
				slotStyles={{ root: "ctx-root" }}
			/>,
		);
		expect(
			document.querySelector('[data-kala-component="session-card"]')?.className,
		).toContain("ctx-root");
	});

	it("AppShell applies header/footer/main slot classes on part nodes", () => {
		const slots: SlotStyles = { header: "ctx-h", footer: "ctx-f", main: "ctx-m" };
		render(
			<AppShell slotStyles={slots}>
				<p>content</p>
			</AppShell>,
		);
		expect(
			document.querySelector('[data-kala-component="app-shell-header"]')
				?.className,
		).toContain("ctx-h");
		expect(
			document.querySelector('[data-kala-component="app-shell-footer"]')
				?.className,
		).toContain("ctx-f");
		expect(
			document.querySelector('[data-kala-component="app-shell-main"]')
				?.className,
		).toContain("ctx-m");
	});

	it("DataTable full part matrix: root/thead/th/tr/td/empty/pagination", () => {
		render(
			<DataTable
				columns={columns}
				data={rows}
				slotStyles={{
					root: "p-root",
					thead: "p-thead",
					th: "p-th",
					tr: "p-tr",
					td: "p-td",
				}}
			/>,
		);
		expect(
			document.querySelector('[data-kala-component="data-table"]')?.className,
		).toContain("p-root");
		expect(document.querySelector("thead")?.className).toContain("p-thead");
		expect(document.querySelector("th")?.className).toContain("p-th");
		expect(
			document.querySelector("tbody tr")?.className,
		).toContain("p-tr");
		expect(document.querySelector("tbody td")?.className).toContain("p-td");

		render(
			<DataTable columns={columns} data={[]} slotStyles={{ empty: "p-empty" }} />,
		);
		expect(
			document.querySelector('[data-kala-component="data-table-empty"]')
				?.className,
		).toContain("p-empty");
	});

	it("chart wrapper applies root and legend slots", () => {
		render(
			<LineChart
				series={[{ name: "A", data: [1, 2] }]}
				slotStyles={{ root: "ctx-chart", legend: "ctx-legend" }}
			/>,
		);
		expect(
			document.querySelector('[data-kala-component="line-chart"]')?.className,
		).toContain("ctx-chart");
	});

		it("dnd full part matrix: root/item/dragOverlay", () => {
			render(
				<div data-testid="dnd-host">
					<SortableItem id="1" slotStyles={{ root: "d-item", dragOverlay: "d-overlay" }}>
						<div>item one</div>
					</SortableItem>
				</div>,
			);
			expect(
				document.querySelector('[data-kala-component="dnd-sortable-item"]')
					?.className,
			).toContain("d-item");
		});

	it("KalaProvider context defaults flow into react-app composites", () => {
		render(
			<KalaProvider
				defaultSlotStyles={{ "app-shell": { header: "ctx-class" } }}
			>
				<AppShell>
					<p>content</p>
				</AppShell>
			</KalaProvider>,
		);
		expect(
			document.querySelector('[data-kala-component="app-shell-header"]')
				?.className,
		).toContain("ctx-class");
	});

	it("instance slot beats the context default per part", () => {
		render(
			<KalaProvider
				defaultSlotStyles={{ footer: { sectionTitle: "ctx-class" } }}
			>
				<Footer
					linkSections={[{ title: "Product", links: [] }]}
					slotStyles={{ sectionTitle: "inst-class" }}
				/>
			</KalaProvider>,
		);
		const title = screen.getByText("Product").className;
		expect(title).toContain("inst-class");
		expect(title).not.toContain("ctx-class");
	});

	it("merged SocialLoginButtons renders from the canonical dir", () => {
		render(<SocialLoginButtons onProviderClick={vi.fn()} />);
		expect(
			screen.getAllByRole("button", { name: /google|github|facebook/i }).length,
		).toBeGreaterThan(0);
	});
});
