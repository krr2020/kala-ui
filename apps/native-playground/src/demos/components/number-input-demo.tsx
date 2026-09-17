import { Field, NumberInput } from "@kala-ui/react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { DemoBlock } from "../demo-block";
import { demoStyles } from "../stylesheet";

export function NumberInputDemo() {
	const [qty, setQty] = useState(1);
	return (
		<View testID="k-demo-number-input" style={demoStyles.routeContent}>
			<DemoBlock label="Basic">
				<NumberInput
					defaultValue={1}
					min={0}
					max={10}
					accessibilityLabel="quantity"
				/>
				<NumberInput
					defaultValue={-2.5}
					step={0.5}
					accessibilityLabel="offset with decimals"
				/>
			</DemoBlock>
			<DemoBlock label="In A Field">
				<Field label="Tickets" description="max 6 per order">
					<NumberInput
						value={qty}
						onValueChange={(n) => setQty(n ?? 0)}
						min={1}
						max={6}
						accessibilityLabel="tickets"
					/>
				</Field>
				<Text style={demoStyles.current}>Tickets: {qty}</Text>
			</DemoBlock>
			<DemoBlock label="States">
				<NumberInput
					defaultValue={5}
					disabled
					accessibilityLabel="locked quantity"
				/>
			</DemoBlock>
		</View>
	);
}
