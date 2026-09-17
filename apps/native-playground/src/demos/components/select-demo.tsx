import { Field, Select } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

const FRUITS = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry", disabled: true },
];

const GROUPED_FRUITS = [
	{ value: "solo", label: "Seasonal pick" },
	{ value: "apple", label: "Apple", group: "Tree fruits" },
	{ value: "pear", label: "Pear", group: "Tree fruits" },
	{ value: "strawberry", label: "Strawberry", group: "Berries" },
	{ value: "raspberry", label: "Raspberry", group: "Berries" },
];

const LONG_LIST = Array.from({ length: 30 }, (_, i) => ({
	value: `tz-${i}`,
	label: `Timezone ${i}`,
	...(i % 3 === 0 ? { group: `Region ${i % 6}` } : {}),
}));

export function SelectDemo() {
	const [fruit, setFruit] = useState<string | undefined>(undefined);
	return (
		<View testID="k-demo-select" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Select
					placeholder="Pick a fruit"
					accessibilityLabel="Fruit"
					options={FRUITS}
				/>
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field label="Fruit" description="One per basket" required>
					<Select
						value={fruit}
						onValueChange={setFruit}
						placeholder="Pick a fruit"
						options={FRUITS}
					/>
				</Field>
				<Text style={demoStyles.current}>Chosen: {fruit ?? "none"}</Text>
			</DemoBlock>
			<DemoBlock label="Grouped">
				<Select
					grouped
					placeholder="Pick a fruit"
					accessibilityLabel="Grouped fruit"
					options={GROUPED_FRUITS}
				/>
			</DemoBlock>
			<DemoBlock label="Long List">
				<Select
					grouped
					placeholder="Pick a timezone"
					accessibilityLabel="Timezone"
					options={LONG_LIST}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Select
					placeholder="Required"
					accessibilityLabel="Error select"
					hasError
					options={FRUITS}
				/>
				<Select
					placeholder="Valid"
					accessibilityLabel="Valid select"
					hasSuccess
					options={FRUITS}
				/>
				<Select
					placeholder="Locked"
					accessibilityLabel="Locked select"
					disabled
					options={FRUITS}
				/>
			</DemoBlock>
		</View>
	);
}
