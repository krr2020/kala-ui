/**
 * Integration seam: pins the Tabs API surface exactly as the native
 * playground demos consume it (packages/react-native ↔ apps/native-playground).
 * If a rename or behavior change breaks the demo-facing contract — variant
 * looks, badge/indicator props, a11y composition — this fails before the
 * playground does.
 */
import { render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";
import { themes } from "../../themes";
import { Tabs } from "../tabs";

const inclHidden = { includeHiddenElements: true } as const;

// Mirrors apps/native-playground/src/demos/components/tabs-demo.tsx.
describe("Tabs ↔ playground demo contract", () => {
	it("line demo block: divider + muted active fill + badge chip + dot render together", async () => {
		const screen = await render(
			<Tabs
				items={[
					{ value: "overview", label: "Overview" },
					{ value: "activity", label: "Activity", badge: 3 },
					{ value: "settings", label: "Settings", indicator: true },
				]}
				value="overview"
				onValueChange={() => undefined}
			>
				panel
			</Tabs>,
		);
		const track = screen.getByTestId("k-tab-list").props.style;
		expect(JSON.stringify(track)).toContain(themes.light.border);
		expect(screen.getByTestId("k-tab-badge")).toBeTruthy();
		expect(screen.getByTestId("k-indicator-dot")).toBeTruthy();
		expect(screen.getByTestId("k-tab-content-overview")).toBeTruthy();
		expect(screen.getByRole("tab", { name: "Activity 3" })).toBeTruthy();
	});

it("pill demo block: rounded muted wrapper, primary trigger with card-visible badge", async () => {
	const screen = await render(
		<Tabs
			variant="pill"
			defaultValue="grid"
			items={[
				{ value: "grid", label: "Grid" },
				{ value: "list", label: "List", badge: 12 },
				{ value: "lock", label: "Locked", disabled: true },
			]}
		>
			panel
		</Tabs>,
	);
	const track = require("react-native").StyleSheet.flatten(
		screen.getByTestId("k-tab-list").props.style,
	);
	expect(track.backgroundColor).toBe(themes.light.muted);
	expect(track.borderRadius).toBe(999);
	expect(screen.getByTestId("k-tab-badge")).toBeTruthy();
	const [grid] = screen.getAllByTestId("k-tab");
	const s = require("react-native").StyleSheet.flatten(grid.props.style);
	expect(s.backgroundColor).toBe(themes.light.primary);
	expect(s.borderRadius).toBe(999);
	});

it("vertical demo block: leading rail + badge + dot on stacked tabs", async () => {
	const screen = await render(
		<Tabs
			orientation="vertical"
			defaultValue="account"
			items={[
				{ value: "account", label: "Account" },
				{ value: "privacy", label: "Privacy", indicator: true },
				{ value: "notifications", label: "Alerts", badge: "99+" },
			]}
		>
			panel
		</Tabs>,
	);
	expect(screen.getByTestId("k-tab-badge")).toBeTruthy();
	expect(screen.getByTestId("k-indicator-dot")).toBeTruthy();
	expect(screen.getByRole("tab", { name: "Alerts 99+" })).toBeTruthy();
	});

it("icons, long-label and slotStyles demo blocks render as the demo consumes them", async () => {
	const icons = await render(
		<Tabs
			defaultValue="home"
			items={[
				{ value: "home", label: "Home", icon: Sun },
				{ value: "search", label: "Search", icon: Sun },
			]}
		>
			panel
		</Tabs>,
	);
	expect(icons.getAllByTestId("k-icon", inclHidden).length).toBe(2);

	const long = await render(
		<Tabs
			items={[
				{ value: "one", label: "Territory management for the western sales pod" },
				{ value: "two", label: "Two" },
			]}
		>
			panel
		</Tabs>,
	);
	const label = long.getByText("Territory management for the western sales pod");
	expect(label.props.numberOfLines).toBe(2);

	const slotted = await render(
		<Tabs
			defaultValue="one"
			items={[
				{ value: "one", label: "One" },
				{ value: "two", label: "Two" },
			]}
			slotStyles={{ tab: { paddingHorizontal: 24 } }}
		>
			panel
		</Tabs>,
	);
	const tab = slotted.getAllByTestId("k-tab")[0];
	const s = require("react-native").StyleSheet.flatten(tab.props.style);
	expect(s.paddingHorizontal).toBe(24);
	});
});
