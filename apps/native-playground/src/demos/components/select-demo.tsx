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

export function SelectDemo() {
	const [fruit, setFruit] = useState<string | undefined>(undefined);
	return (
		<View testID="k-demo-select" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<Select
					placeholder="pick a fruit"
					accessibilityLabel="fruit"
					options={FRUITS}
				/>
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field label="Fruit" description="one per basket" required>
					<Select
						value={fruit}
						onValueChange={setFruit}
						placeholder="pick a fruit"
						options={FRUITS}
					/>
				</Field>
				<Text style={demoStyles.current}>Chosen: {fruit ?? "none"}</Text>
			</DemoBlock>
			<DemoBlock label="Long List">
				<Select
					placeholder="pick a timezone"
					accessibilityLabel="timezone"
					options={Array.from({ length: 12 }, (_, i) => ({
						value: `tz-${i}`,
						label: `Timezone ${i}`,
					}))}
				/>
			</DemoBlock>
			<DemoBlock label="States">
				<Select
					placeholder="required"
					accessibilityLabel="error select"
					hasError
					options={FRUITS}
				/>
				<Select
					placeholder="locked"
					accessibilityLabel="locked select"
					disabled
					options={FRUITS}
				/>
			</DemoBlock>
		</View>
	);
}
