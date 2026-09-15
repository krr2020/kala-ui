import { fireEvent, render } from "@testing-library/react-native";
import { Home, Search, User } from "lucide-react-native";
import { TabBar, TabBarSkeleton } from "../tab-bar";

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

describe("TabBar", () => {
	it("controlled value marks the matching item selected", async () => {
		const screen = await render(
			<TabBar items={tabs} value="search" onChange={() => undefined} />,
		);
		expect(
			screen.getByTestId("k-tab-bar-item-search").props.accessibilityState
				?.selected,
		).toBe(true);
		expect(
			screen.getByTestId("k-tab-bar-item-home").props.accessibilityState
				?.selected,
		).toBe(false);
	});

	it("pressing an unselected item fires onChange with its value once", async () => {
		const onChange = jest.fn();
		const screen = await render(
			<TabBar items={tabs} value="home" onChange={onChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-tab-bar-item-profile"));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("profile");
	});

	it("pressing the already-selected item re-asserts but selection is unchanged", async () => {
		const onChange = jest.fn();
		const screen = await render(
			<TabBar items={tabs} value="home" onChange={onChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-tab-bar-item-home"));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("home");
		// controlled: value prop never changed, selected stays on home
		expect(
			screen.getByTestId("k-tab-bar-item-home").props.accessibilityState
				?.selected,
		).toBe(true);
	});

	it("empty items renders an empty bar", async () => {
		const screen = await render(
			<TabBar items={[]} value={undefined} onChange={() => undefined} />,
		);
		expect(screen.getByTestId("k-tab-bar")).toBeTruthy();
		expect(screen.queryByTestId("k-tab-bar-item-home")).toBeNull();
	});

	it("value matching no item selects nothing", async () => {
		const screen = await render(
			<TabBar items={tabs} value="nope" onChange={() => undefined} />,
		);
		for (const item of screen.getAllByRole("tab")) {
			expect(item.props.accessibilityState?.selected).toBeFalsy();
		}
	});

	it("enforces the 44dp touch floor on every item", async () => {
		const screen = await render(
			<TabBar items={tabs} value="home" onChange={() => undefined} />,
		);
		for (const tab of tabs) {
			const s = flatStyle(screen.getByTestId(`k-tab-bar-item-${tab.value}`));
			expect(Number(s.minHeight)).toBeGreaterThanOrEqual(44);
			expect(Number(s.minWidth)).toBeGreaterThanOrEqual(44);
		}
	});

	it("items announce as tabs with their labels", async () => {
		const screen = await render(
			<TabBar items={tabs} value="home" onChange={() => undefined} />,
		);
		expect(screen.getByRole("tab", { name: "Home" })).toBeTruthy();
	});

	it("TabBarSkeleton keeps the k-tab-bar marker", async () => {
		const screen = await render(<TabBarSkeleton />);
		expect(screen.getByTestId("k-tab-bar")).toBeTruthy();
	});
});
