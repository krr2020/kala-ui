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

const LONG_LIST = Array.from({ length: 25 }, (_, i) => ({
	value: `topping-${i}`,
	label: `Topping ${i}`,
	...(i % 4 === 0 ? { group: `Group ${i % 8}` } : {}),
}));

const LONG_LABELS = [
	{
		value: "gelato",
		label: "Artisanal gelato bar with seasonal rotating flavors",
	},
	{ value: "custard", label: "Slow-churned frozen custard made to order" },
];

export function MultiSelectDemo() {
	const [picked, setPicked] = useState<string[]>(["sprinkles"]);
	return (
		<View testID="k-demo-multi-select" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<MultiSelect
					placeholder="Pick toppings"
					accessibilityLabel="Toppings"
					options={TOPPINGS}
				/>
			</DemoBlock>
			<DemoBlock label="Grouped">
				<MultiSelect
					grouped
					value={picked}
					onValueChange={setPicked}
					placeholder="Pick toppings"
					accessibilityLabel="Grouped toppings"
					options={TOPPINGS}
				/>
				<Text style={demoStyles.current}>
					Picked: {picked.join(", ") || "none"}
				</Text>
			</DemoBlock>
			<DemoBlock label="Long List">
				<MultiSelect
					grouped
					placeholder="Pick toppings"
					accessibilityLabel="Long list toppings"
					options={LONG_LIST}
				/>
			</DemoBlock>
			<DemoBlock label="Orphan Values">
				{/* values outside the list keep their raw labels */}
				<MultiSelect
					value={["mint"]}
					onValueChange={() => undefined}
					accessibilityLabel="Orphan toppings"
					options={TOPPINGS}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<MultiSelect
					placeholder="Required"
					accessibilityLabel="Error multi select"
					hasError
					options={TOPPINGS}
				/>
			</DemoBlock>
			<DemoBlock label="Long Labels">
				<MultiSelect
					placeholder="Pick a dessert"
					accessibilityLabel="long dessert"
					options={LONG_LABELS}
				/>
			</DemoBlock>
		</View>
	);
}
