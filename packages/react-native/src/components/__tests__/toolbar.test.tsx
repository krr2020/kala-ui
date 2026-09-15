import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import {
	Toolbar,
	ToolbarButton,
	ToolbarLink,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
} from "../toolbar";

type Screen = Awaited<ReturnType<typeof render>>;

describe("Toolbar", () => {
	it("renders the bordered row with all child markers", async () => {
		const screen: Screen = await render(
			<Toolbar>
				<ToolbarButton onPress={() => undefined}>bold</ToolbarButton>
				<ToolbarSeparator />
				<ToolbarLink onPress={() => undefined}>docs</ToolbarLink>
				<ToolbarToggleGroup type="single">
					<ToolbarToggleItem value="left">left</ToolbarToggleItem>
					<ToolbarToggleItem value="center">center</ToolbarToggleItem>
				</ToolbarToggleGroup>
			</Toolbar>,
		);
		expect(screen.getByTestId("k-toolbar")).toBeTruthy();
		const root = StyleSheet.flatten(
			screen.getByTestId("k-toolbar").props.style,
		);
		expect(root.borderWidth).toBe(1);
		expect(screen.getByTestId("k-toolbar-button")).toBeTruthy();
		expect(screen.getByTestId("k-toolbar-separator")).toBeTruthy();
		expect(screen.getByTestId("k-toolbar-link")).toBeTruthy();
		expect(screen.getByTestId("k-toolbar-toggle-group")).toBeTruthy();
		expect(screen.getAllByTestId("k-toolbar-toggle-item")).toHaveLength(2);
	});

	it("ToolbarButton press fires; disabled blocks press and exposes state", async () => {
		const onPress = jest.fn();
		let screen: Screen = await render(
			<ToolbarButton onPress={onPress}>bold</ToolbarButton>,
		);
		await fireEvent.press(screen.getByTestId("k-toolbar-button"));
		expect(onPress).toHaveBeenCalledTimes(1);

		screen = await render(
			<ToolbarButton disabled onPress={onPress}>
				bold
			</ToolbarButton>,
		);
		const disabled = screen.getByTestId("k-toolbar-button");
		expect(disabled.props.accessibilityState.disabled).toBe(true);
		await fireEvent.press(disabled);
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("ToolbarLink press fires onPress", async () => {
		const onPress = jest.fn();
		const screen: Screen = await render(
			<ToolbarLink onPress={onPress}>docs</ToolbarLink>,
		);
		const link = screen.getByTestId("k-toolbar-link");
		expect(link.props.accessibilityRole).toBe("link");
		await fireEvent.press(link);
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("ToolbarToggleGroup composes the toggle engine for selection", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<ToolbarToggleGroup type="single" onValueChange={onValueChange}>
				<ToolbarToggleItem value="left">left</ToolbarToggleItem>
				<ToolbarToggleItem value="center">center</ToolbarToggleItem>
			</ToolbarToggleGroup>,
		);
		await fireEvent.press(screen.getAllByTestId("k-toolbar-toggle-item")[1]);
		expect(onValueChange).toHaveBeenCalledWith("center");
	});

	it("toolbar slot style overrides win on the root", async () => {
		const screen: Screen = await render(
			<Toolbar styles={{ root: { minHeight: 64 } }}>
				<ToolbarButton onPress={() => undefined}>bold</ToolbarButton>
			</Toolbar>,
		);
		expect(
			StyleSheet.flatten(screen.getByTestId("k-toolbar").props.style).minHeight,
		).toBe(64);
	});
});
