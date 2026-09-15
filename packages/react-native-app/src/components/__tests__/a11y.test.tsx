import { render } from "@testing-library/react-native";
import { Home, Search } from "lucide-react-native";
import { Header } from "../header";
import { HeaderSkeleton } from "../header/header-skeleton";
import { TabBar } from "../tab-bar";
import { TabBarSkeleton } from "../tab-bar/tab-bar-skeleton";

const tabs = [
	{ value: "home", label: "Home", icon: Home },
	{ value: "search", label: "Search", icon: Search },
];

describe("a11y contract", () => {
	it("Header announces role=header with its title as the label", async () => {
		const screen = await render(<Header title="Inbox" />);
		expect(screen.getByRole("header", { name: "Inbox" })).toBeTruthy();
	});

	it("Header back and action buttons carry accessible labels", async () => {
		const screen = await render(
			<Header
				title="Inbox"
				onBack={() => undefined}
				backLabel="go back"
				actions={[{ label: "search", onPress: () => undefined }]}
			/>,
		);
		expect(screen.getByRole("button", { name: "go back" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "search" })).toBeTruthy();
	});

	it("TabBar items announce role=tab with label and selected state", async () => {
		const screen = await render(
			<TabBar items={tabs} value="home" onChange={() => undefined} />,
		);
		const home = screen.getByRole("tab", { name: "Home" });
		expect(home.props.accessibilityState?.selected).toBe(true);
		const search = screen.getByRole("tab", { name: "Search" });
		expect(search.props.accessibilityState?.selected).toBe(false);
	});

	it("skeletons keep their marker roots for E2E stability", async () => {
		const header = await render(<HeaderSkeleton />);
		expect(header.getByTestId("k-header")).toBeTruthy();
		const tabsScreen = await render(<TabBarSkeleton />);
		expect(tabsScreen.getByTestId("k-tab-bar")).toBeTruthy();
	});
});
