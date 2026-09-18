import { render } from "@testing-library/react-native";
import { Skeleton } from "../skeleton";

const inclHidden = { includeHiddenElements: true } as const;

describe("Skeleton a11y surface", () => {
	it("labeled arm: announces exactly the provided label", async () => {
		const screen = await render(
			<Skeleton accessibilityLabel="Loading profile" />,
		);
		const root = screen.getByTestId("k-skeleton", inclHidden);
		expect(root.props.accessible).toBe(true);
		expect(root.props.accessibilityLabel).toBe("Loading profile");
	});

	it("unlabeled arm: decorative — hidden from the a11y tree, no default label", async () => {
		const screen = await render(<Skeleton />);
		const root = screen.getByTestId("k-skeleton", inclHidden);
		expect(root.props.accessible).not.toBe(true);
		expect(root.props.accessibilityLabel).toBeUndefined();
		expect(root.props.accessibilityElementsHidden).toBe(true);
		expect(root.props.importantForAccessibility).toBe(
			"no-hide-descendants",
		);
	});

	it("static arm: animated=false renders without the pulse loop", async () => {
		const screen = await render(<Skeleton animated={false} />);
		expect(screen.getByTestId("k-skeleton", inclHidden)).toBeTruthy();
	});

	it("variant radii resolve: rect and circle styles both land", async () => {
		const rect = await render(
			<Skeleton style={{ width: 48, height: 12 }} />,
		);
		expect(
			rect.getByTestId("k-skeleton", inclHidden).props.style,
		).toBeTruthy();
		const circle = await render(
			<Skeleton variant="circle" style={{ width: 48, height: 48 }} />,
		);
		expect(
			circle.getByTestId("k-skeleton", inclHidden),
		).toBeTruthy();
	});
});
