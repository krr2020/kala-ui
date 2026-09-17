/**
 * Alert component tests: resolved-style pins for the styles extraction
 * (root/Title/Description builders) and the no-icon arm where fg
 * reaches text with no icon color derivation in play.
 */
import { render } from "@testing-library/react-native";
import { Alert } from "../alert";

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: { props: { style?: unknown } }): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry && typeof entry === "object") {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

const themes = require("../../themes").themes;

describe("Alert resolved styles", () => {
	it("subtle root carries the look() surface plus the layout table", async () => {
		const screen: Screen = await render(<Alert color="primary">msg</Alert>);
		const s = flatStyle(screen.getByTestId("k-alert"));
		expect(s.flexDirection).toBe("row");
		expect(s.alignItems).toBe("flex-start");
		expect(s.gap).toBe(10);
		expect(s.padding).toBe(12);
		expect(s.borderRadius).toBe(8);
		expect(s.backgroundColor).toBe(`${themes.light.primary}1A`);
		expect(s.borderWidth).toBe(0);
	});

	it("outline root swaps to a 1px tinted border on transparent", async () => {
		const screen: Screen = await render(
			<Alert variant="outline" color="warning">
				msg
			</Alert>,
		);
		const s = flatStyle(screen.getByTestId("k-alert"));
		expect(s.backgroundColor).toBe("transparent");
		expect(s.borderWidth).toBe(1);
		expect(s.borderColor).toBe(themes.light.warning);
	});

	it("Title/Description carry the resolved fg with their typography", async () => {
		const screen: Screen = await render(
			<Alert color="primary">
				<Alert.Title>Deployed</Alert.Title>
				<Alert.Description>All checks passed</Alert.Description>
			</Alert>,
		);
		const title = flatStyle(screen.getByTestId("k-alert-title"));
		expect(title.color).toBe(themes.light.primary);
		expect(title.fontSize).toBe(15);
		expect(title.fontWeight).toBe("600");
		const desc = flatStyle(screen.getByTestId("k-alert-description"));
		expect(desc.color).toBe(themes.light.primary);
		expect(desc.fontSize).toBe(14);
		expect(desc.fontWeight).toBe("400");
	});

	it("no-icon arm still hands fg to Title/Description", async () => {
		const screen: Screen = await render(
			<Alert color="destructive" showIcon={false}>
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>Retry the charge in the app</Alert.Description>
			</Alert>,
		);
		// icon-less root renders exactly one child view (the body)
		expect(screen.toJSON()?.children?.length).toBe(1);
		const title = flatStyle(screen.getByTestId("k-alert-title"));
		expect(title.color).toBe(themes.light.destructive);
	});
});
