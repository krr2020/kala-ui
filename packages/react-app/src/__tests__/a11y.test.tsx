/**
 * Automated accessibility sweep: every kala-ui app-level component rendered
 * in a minimal realistic composition and checked with axe-core.
 *
 * When adding a component to the package, add a case here. A failure means
 * the default markup violates WCAG (axe's ruleset) — fix the component,
 * not the test.
 */
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { toHaveNoViolations } from "vitest-axe/matchers";
import * as K from "../index";

expect.extend({ toHaveNoViolations });

const cases: Array<[string, () => ReactElement]> = [
	[
		"AppShell",
		() => (
			<K.AppShell>
				<K.AppShell.Main>Main content</K.AppShell.Main>
			</K.AppShell>
		),
	],
	[
		"Chart (wrapper)",
		() => (
			<K.Chart
				options={{ chart: { id: "a11y-chart" } }}
				series={[{ name: "S", data: [1, 2] }]}
			/>
		),
	],
	[
		"DataTable",
		() => (
			<K.DataTable
				columns={[
					{ id: "name", header: "Name", accessorKey: "name" },
					{ id: "role", header: "Role", accessorKey: "role" },
				]}
				data={[
					{ name: "Ada", role: "admin" },
					{ name: "Linus", role: "user" },
				]}
			/>
		),
	],
	[
		"DndContext",
		() => (
			<K.DragDropContext onDragEnd={() => {}}>
				<div>Drag area</div>
			</K.DragDropContext>
		),
	],
	["Footer", () => <K.Footer>footer</K.Footer>],
	[
		"Header",
		() => (
			<K.Header
				logo={<a href="/">App</a>}
				navLinks={[{ label: "Home", href: "/" }]}
			/>
		),
	],
	[
		"MetricCard",
		() => (
			<K.MetricCard
				title="Revenue"
				value="$12k"
				trend={{ value: 12, isPositive: true }}
			/>
		),
	],
	["NavLink", () => <K.NavLink label="Docs" active />],
	["Navigation", () => <K.Navigation links={[{ label: "Home", href: "/" }]} />],
	[
		"SessionCard",
		() => (
			<K.SessionCard
				session={{
					id: "s1",
					device: "Desktop",
					browser: "Chrome",
					os: "macOS",
					ip: "192.168.1.1",
					lastActiveAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					isCurrent: true,
				}}
			/>
		),
	],
	[
		"Sidebar",
		() => (
			<K.Sidebar
				logo={<span>Kala</span>}
				navSections={[{ title: "Main", links: [{ label: "Home", href: "/" }] }]}
				onClose={() => {}}
			/>
		),
	],
	[
		"SocialLoginButton",
		() => <K.SocialLoginButton provider="google" onClick={() => {}} />,
	],
	[
		"SocialLoginButtons",
		() => <K.SocialLoginButtons onProviderClick={() => {}} />,
	],
	["SparklineChart", () => <K.SparklineChart data={[1, 2, 3, 2]} />],
	[
		"UserMenuDropdown",
		() => (
			<K.UserMenuDropdown
				user={{ name: "Jane Doe", email: "jane@example.com" }}
			/>
		),
	],
	[
		"AreaChart",
		() => (
			<K.AreaChart
				series={[{ name: "S", data: [1, 2] }]}
				categories={["A", "B"]}
			/>
		),
	],
	[
		"BarChart",
		() => (
			<K.BarChart
				series={[{ name: "S", data: [2, 3] }]}
				categories={["A", "B"]}
			/>
		),
	],
	[
		"LineChart",
		() => (
			<K.LineChart
				series={[{ name: "S", data: [1, 2] }]}
				categories={["A", "B"]}
			/>
		),
	],
	["DonutChart", () => <K.DonutChart labels={["A", "B"]} series={[4, 6]} />],
];

describe("axe accessibility sweep", () => {
	for (const [name, renderCase] of cases) {
		it(`${name} has no axe violations`, async () => {
			const { container } = render(renderCase());
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	}
});
