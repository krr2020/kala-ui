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
			<DemoBlock label="Long List">
				<Select
					placeholder="Pick a timezone"
					accessibilityLabel="Timezone"
					options={Array.from({ length: 12 }, (_, i) => ({
						value: `tz-${i}`,
						label: `Timezone ${i}`,
					}))}
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
