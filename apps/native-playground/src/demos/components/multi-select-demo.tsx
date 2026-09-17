import { MultiSelect } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const TOPPINGS = [
	{ value: "sprinkles", label: "Sprinkles" },
	{ value: "fudge", label: "Fudge", group: "Sauces" },
	{ value: "caramel", label: "Caramel", group: "Sauces" },
];

export function MultiSelectDemo() {
	const [picked, setPicked] = useState<string[]>(["sprinkles"]);
	return (
		<View testID="k-demo-multi-select" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<MultiSelect
					placeholder="pick toppings"
					accessibilityLabel="toppings"
					options={TOPPINGS}
				/>
			</DemoBlock>
			<DemoBlock label="Grouped">
				<MultiSelect
					grouped
					value={picked}
					onValueChange={setPicked}
					placeholder="pick toppings"
					accessibilityLabel="grouped toppings"
					options={TOPPINGS}
				/>
				<Text style={demoStyles.current}>
					Picked: {picked.join(", ") || "none"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Orphan Values">
				{/* values outside the list keep their raw labels */}
				<MultiSelect
					value={["mint"]}
					onValueChange={() => undefined}
					accessibilityLabel="orphan toppings"
					options={TOPPINGS}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<MultiSelect
					placeholder="required"
					accessibilityLabel="error multi select"
					hasError
					options={TOPPINGS}
				/>
			</DemoBlock>
		</View>
	);
}
