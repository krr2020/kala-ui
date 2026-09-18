import { render } from "@testing-library/react-native";
import { Spinner } from "../spinner";

describe("Spinner a11y surface", () => {
	it("root is one a11y element so the loading state announces", async () => {
		const screen = await render(<Spinner accessibilityLabel="syncing" />);
		const root = screen.getByTestId("k-spinner");
		expect(root.props.accessible).toBe(true);
		expect(root.props.accessibilityLabel).toBe("syncing");
	});

	it("default label announces without an explicit accessibilityLabel", async () => {
		const screen = await render(<Spinner />);
		const root = screen.getByTestId("k-spinner");
		expect(root.props.accessible).toBe(true);
		expect(root.props.accessibilityLabel).toBe("Loading...");
	});

	it("indeterminate spinner carries no synthetic role", async () => {
		// a fake progressbar/timer role would misannounce state the
		// component does not have
		const screen = await render(<Spinner />);
		expect(
			screen.getByTestId("k-spinner").props.accessibilityRole,
		).toBeUndefined();
	});
});
