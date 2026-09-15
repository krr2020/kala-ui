import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { TagInput } from "../tag-input";

type Screen = Awaited<ReturnType<typeof render>>;

describe("TagInput", () => {
	it("renders chips per value plus the entry field", async () => {
		const screen: Screen = await render(
			<TagInput defaultValue={["alpha", "beta"]} />,
		);
		expect(screen.getByTestId("k-tag-input")).toBeTruthy();
		expect(screen.getAllByTestId("k-tag")).toHaveLength(2);
		expect(screen.getByTestId("k-tag-input-field")).toBeTruthy();
	});

	it("a separator in the typed text commits the tag and clears the field", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput defaultValue={["alpha"]} onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(
			screen.getByTestId("k-tag-input-field"),
			"beta,",
		);
		expect(onValueChange).toHaveBeenCalledWith(["alpha", "beta"]);
		expect(
			screen.getByTestId("k-tag-input-field").props.value ?? "",
		).not.toContain("beta");
		expect(screen.getAllByTestId("k-tag")).toHaveLength(2);
	});

	it("submit commits the pending text", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), "solo");
		await fireEvent(screen.getByTestId("k-tag-input-field"), "submitEditing");
		expect(onValueChange).toHaveBeenCalledWith(["solo"]);
	});

	it("chip remove press drops that tag only", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput defaultValue={["a", "b", "c"]} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getAllByTestId("k-tag-remove")[1]);
		expect(onValueChange).toHaveBeenCalledWith(["a", "c"]);
	});

	it("backspace on an empty field removes the last tag", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput defaultValue={["a", "b"]} onValueChange={onValueChange} />,
		);
		await fireEvent(screen.getByTestId("k-tag-input-field"), "onKeyPress", {
			nativeEvent: { key: "backspace" },
		});
		expect(onValueChange).toHaveBeenCalledWith(["a"]);
	});

	it("clear-all empties the set", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput defaultValue={["a", "b"]} onValueChange={onValueChange} />,
		);
		await fireEvent.press(screen.getByTestId("k-tag-input-clear"));
		expect(onValueChange).toHaveBeenCalledWith([]);
	});

	it("maxTags stops additions", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput
				defaultValue={["a"]}
				maxTags={2}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), "b,c,");
		expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
		expect(screen.getAllByTestId("k-tag")).toHaveLength(2);
	});

	it("duplicates are rejected by default and accepted with allowDuplicates", async () => {
		const strict = await render(
			<TagInput defaultValue={["a"]} onValueChange={jest.fn()} />,
		);
		await fireEvent.changeText(strict.getByTestId("k-tag-input-field"), "a,");
		expect(strict.getAllByTestId("k-tag")).toHaveLength(1);

		const loose = await render(
			<TagInput
				defaultValue={["a"]}
				allowDuplicates
				onValueChange={jest.fn()}
			/>,
		);
		await fireEvent.changeText(loose.getByTestId("k-tag-input-field"), "a,");
		expect(loose.getAllByTestId("k-tag")).toHaveLength(2);
	});

	it("transformTag and validateTag are honored", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput
				transformTag={(tag: string) => tag.trim()}
				validateTag={(tag: string) => tag.length >= 2}
				onValueChange={onValueChange}
			/>,
		);
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), "ok,");
		expect(onValueChange).toHaveBeenCalledWith(["ok"]);
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), " x,");
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), "y,");
		expect(screen.getAllByTestId("k-tag")).toHaveLength(1);
	});

	it("controlled value locks chips until the parent re-renders", async () => {
		const onValueChange = jest.fn();
		const screen: Screen = await render(
			<TagInput value={["locked"]} onValueChange={onValueChange} />,
		);
		await fireEvent.changeText(screen.getByTestId("k-tag-input-field"), "new,");
		expect(onValueChange).toHaveBeenCalledWith(["locked", "new"]);
		expect(screen.getAllByTestId("k-tag")).toHaveLength(1);
	});

	it("hasError borders destructive and disabled blocks removal", async () => {
		const errScreen = await render(<TagInput defaultValue={["a"]} hasError />);
		const borderColor = StyleSheet.flatten(
			errScreen.getByTestId("k-tag-input").props.style,
		).borderColor;
		const okScreen = await render(<TagInput defaultValue={["a"]} />);
		const okBorder = StyleSheet.flatten(
			okScreen.getByTestId("k-tag-input").props.style,
		).borderColor;
		expect(borderColor).not.toEqual(okBorder);

		const onValueChange = jest.fn();
		const disabled = await render(
			<TagInput defaultValue={["a"]} disabled onValueChange={onValueChange} />,
		);
		await fireEvent.press(disabled.getAllByTestId("k-tag-remove")[0]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(disabled.queryByTestId("k-tag-input-clear")).toBeNull();
	});

	it("slot style overrides reach the root", async () => {
		const screen: Screen = await render(
			<TagInput styles={{ root: { borderWidth: 7 } }} />,
		);
		expect(
			StyleSheet.flatten(screen.getByTestId("k-tag-input").props.style)
				.borderWidth,
		).toBe(7);
	});
});
