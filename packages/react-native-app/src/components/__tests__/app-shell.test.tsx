import { fireEvent, render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { AppShell } from "../app-shell";

// The global setup swaps Modal for a test-renderer-safe View; re-assert
// the module mock locally so the suite never loads the raw native barrel.
jest.mock("react-native", () => jest.requireActual("react-native"));

function HeaderMock() {
	return <View testID="shell-header-stub" />;
}

function TabBarMock() {
	return <View testID="shell-tabbar-stub" />;
}

describe("AppShell", () => {
	it("renders k-app-shell with children in k-app-shell-content", async () => {
		const screen = await render(
			<AppShell>
				<Text>hello shell</Text>
			</AppShell>,
		);
		expect(screen.getByTestId("k-app-shell")).toBeTruthy();
		expect(screen.getByTestId("k-app-shell-content")).toBeTruthy();
		expect(screen.getByText("hello shell")).toBeTruthy();
	});

	it("renders header and tabBar slots when provided", async () => {
		const screen = await render(
			<AppShell header={<HeaderMock />} tabBar={<TabBarMock />}>
				<Text>content</Text>
			</AppShell>,
		);
		expect(screen.getByTestId("shell-header-stub")).toBeTruthy();
		expect(screen.getByTestId("shell-tabbar-stub")).toBeTruthy();
	});

	it("omits the slot rows entirely when header/tabBar are not provided", async () => {
		const screen = await render(
			<AppShell>
				<Text>content</Text>
			</AppShell>,
		);
		expect(screen.queryByTestId("shell-header-stub")).toBeNull();
		expect(screen.queryByTestId("shell-tabbar-stub")).toBeNull();
	});

	it("scrollable wraps ONLY the content area: slots stay outside the scroll region", async () => {
		const screen = await render(
			<AppShell scrollable header={<HeaderMock />} tabBar={<TabBarMock />}>
				<Text>content</Text>
			</AppShell>,
		);
		const scroll = screen.getByTestId("k-app-shell-content");
		// host component type: ScrollView renders RCTScrollView, not View
		expect(scroll.type).toBe("RCTScrollView");

		const flat = JSON.stringify(screen.toJSON());
		const headerAt = flat.indexOf("shell-header-stub");
		const scrollAt = flat.indexOf("k-app-shell-content");
		const tabbarAt = flat.indexOf("shell-tabbar-stub");
		expect(headerAt).toBeLessThan(scrollAt);
		expect(tabbarAt).toBeGreaterThan(scrollAt);
	});

	it("scrollable=false renders plain View content (no scroll host)", async () => {
		const screen = await render(
			<AppShell>
				<Text>content</Text>
			</AppShell>,
		);
		const content = screen.getByTestId("k-app-shell-content");
		expect(content.type).toBe("View");
	});

	it("children render verbatim inside the content region", async () => {
		const onPress = jest.fn();
		const screen = await render(
			<AppShell>
				<Text onPress={onPress}>tap me</Text>
			</AppShell>,
		);
		await fireEvent.press(screen.getByText("tap me"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});
});
