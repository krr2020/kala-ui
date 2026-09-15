import { fireEvent, render } from "@testing-library/react-native";
import { ChevronLeft } from "lucide-react-native";
import { Header, HeaderSkeleton } from "../header";

describe("Header", () => {
	it("renders k-header with header role and title", async () => {
		const screen = await render(<Header title="Inbox" />);
		expect(screen.getByTestId("k-header")).toBeTruthy();
		expect(screen.getByRole("header", { name: "Inbox" })).toBeTruthy();
	});

	it("back button fires onPress exactly once", async () => {
		const onBack = jest.fn();
		const screen = await render(
			<Header title="Inbox" onBack={onBack} backLabel="go back" />,
		);
		await fireEvent.press(screen.getByTestId("k-header-back"));
		expect(onBack).toHaveBeenCalledTimes(1);
		expect(screen.getByLabelText("go back")).toBeTruthy();
	});

	it("each trailing action fires its own handler and carries its label", async () => {
		const onSearch = jest.fn();
		const onMore = jest.fn();
		const screen = await render(
			<Header
				title="Inbox"
				actions={[
					{ label: "search", onPress: onSearch },
					{ label: "more", onPress: onMore },
				]}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-header-action-0"));
		expect(onSearch).toHaveBeenCalledTimes(1);
		await fireEvent.press(screen.getByTestId("k-header-action-1"));
		expect(onMore).toHaveBeenCalledTimes(1);
		expect(screen.getByLabelText("search")).toBeTruthy();
		expect(screen.getByLabelText("more")).toBeTruthy();
	});

	it("disabled action blocks its press", async () => {
		const onSearch = jest.fn();
		const screen = await render(
			<Header
				title="Inbox"
				actions={[{ label: "search", onPress: onSearch, disabled: true }]}
			/>,
		);
		await fireEvent.press(screen.getByTestId("k-header-action-0"));
		expect(onSearch).not.toHaveBeenCalled();
		expect(
			screen.getByTestId("k-header-action-0").props.accessibilityState
				?.disabled,
		).toBe(true);
	});

	it("renders a minimal title-only bar when both arms are omitted", async () => {
		const screen = await render(<Header title="Inbox" />);
		expect(screen.queryByTestId("k-header-back")).toBeNull();
		expect(screen.queryByTestId("k-header-action-0")).toBeNull();
	});
});

describe("HeaderSkeleton", () => {
	it("keeps the k-header marker", async () => {
		const screen = await render(<HeaderSkeleton />);
		expect(screen.getByTestId("k-header")).toBeTruthy();
	});
});

// referenced so the import stays meaningful for the icon arm shape
void ChevronLeft;
