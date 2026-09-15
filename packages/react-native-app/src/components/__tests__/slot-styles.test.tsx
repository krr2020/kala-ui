import { render } from "@testing-library/react-native";
import { Home, Search, User } from "lucide-react-native";
import { Text } from "react-native";
import { AppShell } from "../app-shell";
import { Header } from "../header";
import { HeaderSkeleton } from "../header/header-skeleton";
import { TabBar } from "../tab-bar";
import { TabBarSkeleton } from "../tab-bar/tab-bar-skeleton";

const incl = { includeHiddenElements: true } as const;

interface StyleHost {
	props: { style?: unknown };
}

function flatStyle(node: StyleHost): Record<string, unknown> {
	const style = node.props.style;
	const arr = Array.isArray(style) ? style : [style];
	return Object.assign(
		{},
		...arr.map((s: unknown) => (s && typeof s === "object" ? s : {})),
	);
}

const tabs = [
	{ value: "home", label: "Home", icon: Home },
	{ value: "search", label: "Search", icon: Search },
	{ value: "profile", label: "Profile", icon: User },
];

const fixtures = [
	{
		name: "AppShell",
		marker: "k-app-shell",
		render: () =>
			render(
				<AppShell styles={{ root: { borderWidth: 7 } }}>
					<Text>content</Text>
				</AppShell>,
			),
	},
	{
		name: "Header",
		marker: "k-header",
		render: () =>
			render(<Header title="t" styles={{ root: { borderWidth: 7 } }} />),
	},
	{
		name: "HeaderSkeleton",
		marker: "k-header",
		render: () =>
			render(<HeaderSkeleton styles={{ root: { borderWidth: 7 } }} />),
	},
	{
		name: "TabBar",
		marker: "k-tab-bar",
		render: () =>
			render(
				<TabBar
					items={tabs}
					value="home"
					onChange={() => undefined}
					styles={{ root: { borderWidth: 7 } }}
				/>,
			),
	},
	{
		name: "TabBarSkeleton",
		marker: "k-tab-bar",
		render: () =>
			render(<TabBarSkeleton styles={{ root: { borderWidth: 7 } }} />),
	},
] as const;

describe("slot-styles contract", () => {
	it("the sweep covers all shipped app composites", () => {
		expect(fixtures.length).toBe(5);
	});

	it.each(fixtures)("$name: styles.root reaches $marker", async (fixture) => {
		const screen = await fixture.render();
		const root = screen.getByTestId(fixture.marker, incl);
		expect(Number(flatStyle(root).borderWidth)).toBe(7);
	});
});
