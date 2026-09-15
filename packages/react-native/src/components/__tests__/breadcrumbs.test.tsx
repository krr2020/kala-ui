import { fireEvent, render } from "@testing-library/react-native";
import type { BreadcrumbItem } from "../breadcrumbs";
import { Breadcrumbs, BreadcrumbsSkeleton } from "../breadcrumbs";

type Screen = Awaited<ReturnType<typeof render>>;

const items: BreadcrumbItem[] = [
	{ label: "home", onPress: () => undefined },
	{ label: "orders", onPress: () => undefined },
	{ label: "INV-42" },
];

describe("Breadcrumbs", () => {
	it("renders one item per entry with separators between", async () => {
		const screen = await render(<Breadcrumbs items={items} />);
		expect(screen.getByTestId("k-breadcrumbs")).toBeTruthy();
		expect(screen.getAllByTestId("k-breadcrumbs-item")).toHaveLength(3);
		expect(screen.getAllByTestId("k-breadcrumbs-separator")).toHaveLength(2);
	});

	it("renders nothing for an empty items array", async () => {
		const screen = await render(<Breadcrumbs items={[]} />);
		expect(screen.queryByTestId("k-breadcrumbs")).toBeNull();
	});

	it("marks the last item as the current page", async () => {
		const screen = await render(<Breadcrumbs items={items} />);
		const last = screen.getAllByTestId("k-breadcrumbs-item")[2];
		expect(last.props.accessibilityLabel).toBe("INV-42 (current page)");
		expect(last.props.onPress).toBeUndefined();
	});

	it("fires onPress only for wired non-last items", async () => {
		const onPress = jest.fn();
		const screen: Screen = await render(
			<Breadcrumbs items={[{ label: "home", onPress }, { label: "here" }]} />,
		);
		await fireEvent.press(screen.getAllByTestId("k-breadcrumbs-item")[0]);
		expect(onPress).toHaveBeenCalledTimes(1);
		await fireEvent.press(screen.getAllByTestId("k-breadcrumbs-item")[1]);
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("a custom separator string replaces the default glyph", async () => {
		const screen = await render(
			<Breadcrumbs items={[{ label: "a" }, { label: "b" }]} separator="/" />,
		);
		expect(screen.getByText("/")).toBeTruthy();
	});

	it("skeleton renders depth crumbs with separators", async () => {
		const screen = await render(<BreadcrumbsSkeleton depth={4} />);
		expect(screen.getByTestId("k-breadcrumbs-skeleton")).toBeTruthy();
		expect(screen.getAllByTestId("k-breadcrumbs-skeleton-crumb")).toHaveLength(
			4,
		);
		expect(
			screen.getAllByTestId("k-breadcrumbs-skeleton-separator"),
		).toHaveLength(3);
	});
});
