import { render } from "@testing-library/react-native";
import { themes } from "../../themes";
import { PasswordStrengthIndicator } from "../password-strength-indicator";

type Screen = Awaited<ReturnType<typeof render>>;

function flatStyle(node: {
	props: { style?: unknown };
}): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	const walk = (entry: unknown): void => {
		if (Array.isArray(entry)) {
			for (const e of entry) walk(e);
		} else if (entry) {
			Object.assign(out, entry);
		}
	};
	walk(node.props.style ?? []);
	return out;
}

describe("PasswordStrengthIndicator", () => {
	it("renders nothing for an empty password", async () => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password="" />,
		);
		expect(screen.queryByTestId("k-password-strength-indicator")).toBeNull();
	});

	it("renders the header row and four segments for a non-empty password", async () => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password="longenough1!" />,
		);
		expect(screen.getByTestId("k-password-strength-indicator")).toBeTruthy();
		expect(screen.getByText("Password Strength")).toBeTruthy();
		expect(screen.getAllByTestId("k-password-strength-segment")).toHaveLength(
			4,
		);
	});

	it.each([
		["aaaaaaaa", "Weak"], // len 8 only → strength 1
		["aaaaaaaaaaaa", "Fair"], // len 12 → strength 2
		["Aaaaaaaaaaaa", "Good"], // len 12 + mixed case → 3
		["Aaaaaaaaaaaa1", "Strong"], // + digit → 4
	])("password %s announces %s", async (password, label) => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password={password} />,
		);
		expect(screen.getByText(label)).toBeTruthy();
	});

	it("fills segments up to the computed strength and no further", async () => {
		const weak: Screen = await render(
			<PasswordStrengthIndicator password="aaaaaaaa" />,
		);
		const weakBars = weak
			.getAllByTestId("k-password-strength-segment")
			.map((bar) => flatStyle(bar));
		expect(weakBars[0].backgroundColor).toBe(themes.light.destructive);
		expect(weakBars[1].backgroundColor).toBe(themes.light.muted);
		expect(weakBars[3].backgroundColor).toBe(themes.light.muted);

		const strong: Screen = await render(
			<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />,
		);
		const strongBars = strong
			.getAllByTestId("k-password-strength-segment")
			.map((bar) => flatStyle(bar));
		expect(strongBars[3].backgroundColor).toBe(themes.light.success);
	});

	it.each([
		["aaaaaaa", 0], // len 7: no length point yet
		["aaaaaaaa", 1], // len 8 boundary flips tier
		["aaaaaaaaaaaa", 2], // len 12 boundary flips tier
	])(
		"boundary %s → strength %d via accessibilityValue.now",
		async (password, strength) => {
			const screen: Screen = await render(
				<PasswordStrengthIndicator password={password} />,
			);
			const root = screen.getByTestId("k-password-strength-indicator");
			expect(root.props.accessibilityValue).toEqual({
				min: 0,
				max: 4,
				now: strength,
			});
		},
	);

	it("meter semantics: role + value + label on the root", async () => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!" />,
		);
		const root = screen.getByTestId("k-password-strength-indicator");
		expect(root.props.accessibilityRole).toBe("adjustable");
		expect(root.props.accessibilityLabel).toContain("Password strength");
		expect(root.props.accessibilityLabel).toContain("Strong");
	});

	it("strength caps at 4 regardless of extra criteria", async () => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password="Aaaaaaaaaaaa1!@#xyzXYZ" />,
		);
		const root = screen.getByTestId("k-password-strength-indicator");
		expect(root.props.accessibilityValue?.now).toBe(4);
		expect(screen.getByText("Strong")).toBeTruthy();
	});

	it("hint copy mentions the 8+ character floor", async () => {
		const screen: Screen = await render(
			<PasswordStrengthIndicator password="x1!" />,
		);
		expect(screen.getByText(/8\+/)).toBeTruthy();
	});
});
